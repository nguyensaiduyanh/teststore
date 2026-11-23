
import type { ApiError } from "@/lib/types/api";

export interface ApiRequestOptions {
    headers?: HeadersInit;
    token?: boolean;
}

export class ApiRequestError extends Error {
    readonly status: number;
    readonly code?: string;
    readonly fields?: Record<string, string> | null;
    readonly apiError?: ApiError;

    constructor(status: number, message: string, apiError?: ApiError) {
        super(message);
        this.name = "ApiRequestError";
        this.status = status;
        this.code = apiError?.code;
        this.fields = apiError?.fields;
        this.apiError = apiError;
    }
}

function isApiError(data: unknown): data is ApiError {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    if (
        !("timestamp" in data) ||
        typeof data.timestamp !== "string"
    ) {
        return false;
    }

    if (
        !("status" in data) ||
        typeof data.status !== "number"
    ) {
        return false;
    }

    if (
        !("code" in data) ||
        typeof data.code !== "string"
    ) {
        return false;
    }

    if (
        !("message" in data) ||
        typeof data.message !== "string"
    ) {
        return false;
    }

    if (
        !("path" in data) ||
        typeof data.path !== "string"
    ) {
        return false;
    }

    if ("fields" in data && data.fields != null) {
        if (
            typeof data.fields !== "object" ||
            Array.isArray(data.fields)
        ) {
            return false;
        }

        if (
            !Object.values(data.fields).every(
                value => typeof value === "string"
            )
        ) {
            return false;
        }
    }

    return true;
}

export class ApiClient {
    private readonly baseUrl =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:18080";

    private accessToken: string | null = null;

    setAccessToken(accessToken: string | null): void {
        this.accessToken = accessToken;
    }

    getAccessToken(): string | null {
        return this.accessToken;
    }

    private createHeaders(options?: ApiRequestOptions): Headers {
        const headers = new Headers(options?.headers);

        if (
            options?.token !== false &&
            this.accessToken !== null
        ) {
            headers.set(
                "Authorization",
                `Bearer ${this.accessToken}`
            );
        }

        return headers;
    }

    private async handleError(response: Response): Promise<never> {
        const responseText = await response.text();

        let errorData: unknown = null;

        if (responseText) {
            try {
                errorData = JSON.parse(responseText);
            } catch {
                errorData = null;
            }
        }

        if (isApiError(errorData)) {
            throw new ApiRequestError(
                response.status,
                errorData.message,
                errorData
            );
        }

        throw new ApiRequestError(
            response.status,
            "Api request failed: " + response.status + " " + response.statusText
        );
    }

    private async request<T>(
        method: string,
        url: string,
        data?: unknown,
        options?: ApiRequestOptions
    ): Promise<T> {
        const headers = this.createHeaders(options);

        const hasBody = data !== undefined && data !== null;

        if (hasBody) {
            headers.set("Content-Type", "application/json");
        }

        const response = await fetch(
            this.baseUrl+url,
            {
                method,
                headers,
                ...(hasBody && {
                    body: JSON.stringify(data)
                })
            }
        );

        if (!response.ok) {
            return this.handleError(response);
        }

        if (
            response.status === 204 ||
            response.status === 205
        ) {
            return undefined as T;
        }

        const responseText = await response.text();

        if (!responseText) {
            return undefined as T;
        }

        try {
            return JSON.parse(responseText) as T;
        } catch {
            throw new Error("Invalid JSON response from API");
        }
    }

    get<T>(url: string): Promise<T> {
        return this.request<T>("GET", url);
    }

    post<T>(
        url: string,
        data: unknown,
        options?: ApiRequestOptions
    ): Promise<T> {
        return this.request<T>("POST", url, data, options);
    }

    put<T>(url: string, data: unknown): Promise<T> {
        return this.request<T>("PUT", url, data);
    }

    patch<T>(url: string, data?: unknown): Promise<T> {
        return this.request<T>("PATCH", url, data);
    }

    delete(url: string): Promise<void> {
        return this.request<void>("DELETE", url);
    }
}

const http = new ApiClient();

export function setToken(token: string | null): void {
    http.setAccessToken(token);
}

export function getToken(): string | null {
    return http.getAccessToken();
}

export default http;


