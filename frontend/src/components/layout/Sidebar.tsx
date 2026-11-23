
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface MenuItem {
    label: string;
    href: string;
}

interface SidebarProps {
    items: MenuItem[];
}

export const adminMenu: MenuItem[] = [
    { label: "Dashboard", href: "/admin" },
    { label: "Quản lý sản phẩm", href: "/admin/products" },
    { label: "Quản lý kho", href: "/admin/inventory" },
    { label: "Quản lý đơn hàng", href: "/admin/orders" }
];

export function Sidebar({ items }: SidebarProps) {
    const pathname = usePathname();

    function renderMenu() {
        return items.map((item) => {
            const isActive = item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
                <Link
                    href={item.href}
                    key={item.href}
                    className={`sidebar-link ${isActive ? "active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                >
                    {item.label}
                </Link>
            );
        });
    }

    return (
        <aside className="sidebar">
            <nav className="sidebar-navigation">
                {renderMenu()}
            </nav>
        </aside>
    );
}
