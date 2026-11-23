
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/auth";

export function Header() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);

    function handleLogout() {
        logout();
        setIsOpen(false);
        router.replace("/login");
    }

    return (
        <header className="header">
            {/* Navigation */}
            <nav className="header-navigation">
                <Link href="/" className="header-brand">
                    Store
                </Link>
            </nav>

            {/* User Menu */}
            {user && (
                <nav className="user-menu">
                    <button
                        type="button"
                        className="user-menu-trigger"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                    >
                        <span className="user-avatar">
                            {user.fullName.charAt(0).toUpperCase()}
                        </span>

                        <span className="user-name">
                            {user.fullName}
                        </span>
                    </button>

                    {/* Dropdown */}
                    {isOpen && (
                        <div className="user-menu-dropdown">
                            <button
                                type="button"
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </nav>
            )}
        </header>
    );
}
