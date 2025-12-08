"use client"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment, useMemo } from "react"

export function SiteHeader() {

  const pathname = usePathname()

  const path = useMemo(() => {
    return pathname.split("/").slice(1)
  }, [pathname])

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {path.map((section, idx) => {

              const title = section.charAt(0).toUpperCase() + section.slice(1)

              if (idx == path.length - 1) {
                return (
                  <BreadcrumbItem key={section}>
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  </BreadcrumbItem>
                )
              }

              return (
                <Fragment key={section}>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={"/" + path.slice(0, idx + 1).join('/')}>{title}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </Fragment >
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
