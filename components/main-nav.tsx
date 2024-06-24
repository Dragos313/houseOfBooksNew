"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {

  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: 'Overview',
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: 'Billboards',
      active: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: 'Categories',
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/languages`,
      label: 'Languages',
      active: pathname === `/${params.storeId}/languages`,
    },
    {
      href: `/${params.storeId}/publishingHouses`,
      label: 'Publishers',
      active: pathname === `/${params.storeId}/publishingHouses`,
    },
    {
      href: `/${params.storeId}/writers`,
      label: 'Writer',
      active: pathname === `/${params.storeId}/writers`,
    },
    {
      href: `/${params.storeId}/books`,
      label: 'Book',
      active: pathname === `/${params.storeId}/books`,
    },
    {
      href: `/${params.storeId}/authors`,
      label: 'Author',
      active: pathname === `/${params.storeId}/authors`,
    },
    {
      href: `/${params.storeId}/editions`,
      label: 'Edition',
      active: pathname === `/${params.storeId}/editions`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: 'Orders',
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: 'Settings',
      active: pathname === `/${params.storeId}/settings`,
    },
  ]

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
      </Link>
      ))}
    </nav>
  )
};
