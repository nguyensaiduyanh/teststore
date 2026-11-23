
"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/auth";


import { Sidebar, adminMenu } from "@/components/layout/Sidebar";
import {Header} from "@/components/layout/header";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({
                                        children
                                    }: Readonly<AdminLayoutProps>) {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    const isAdmin = user?.roles.includes("ADMIN") ?? false;

    // Chuyển người dùng chưa đăng nhập đến trang Login
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace("/login");
        }
    }, [loading, isAuthenticated, router]);

    // Chờ AuthContext khôi phục thông tin người dùng
    if (loading) {
        return (
            <div className="admin-loading">
                Đang kiểm tra quyền truy cập...
            </div>
        );
    }

    // Không hiển thị nội dung khi chưa đăng nhập
    if (!isAuthenticated) {
        return null;
    }

    // Từ chối người dùng không có quyền ADMIN
    if (!isAdmin) {
        return (
            <div className="admin-unauthorized">
                Bạn không có quyền truy cập trang quản trị.
            </div>
        );
    }

    // Hiển thị giao diện Admin
    return (
        <div className="admin-layout">
            <Header />

            <div className="admin-layout-body">
                <Sidebar items={adminMenu} />

                <main className="admin-main-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
