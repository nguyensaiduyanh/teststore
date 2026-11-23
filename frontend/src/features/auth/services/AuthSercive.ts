
import type { AuthResult, RegisterRequest } from "@/lib/types/api";
import type { CurrentUser } from "@/lib/types/models";
import http from "@/lib/http/client";

export class AuthService {

    async login(
        email: string,
        password: string
    ): Promise<AuthResult> {
        const result = await http.post<AuthResult>(
            "/api/auth/login",
            { email, password },
            { token: false }
        );

        http.setAccessToken(result.accessToken);

        return result;
    }

    async register(data: RegisterRequest): Promise<AuthResult> {
        const result = await http.post<AuthResult>(
            "/api/auth/register",
            data,
            { token: false }
        );

        http.setAccessToken(result.accessToken);

        return result;
    }

    logout(): void {
        http.setAccessToken(null);
    }

    getCurrentUser(): Promise<CurrentUser> {
        return http.get<CurrentUser>("/api/users/me");
    }
}

const authService = new AuthService();

export default authService;
