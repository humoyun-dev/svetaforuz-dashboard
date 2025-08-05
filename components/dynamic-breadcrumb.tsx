"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { startCase } from "lodash";
import Link from "next/link";

const LOCALES = ["uz", "ru", "en"];

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const locale = LOCALES.includes(segments[0]) ? segments[0] : null;
  const breadcrumbs = locale ? segments.slice(1) : segments;

  return (
    <Breadcrumb className={`xl:block hidden`}>
      <BreadcrumbList>
        {breadcrumbs.map((segment, index) => {
          const hrefSegments = locale
            ? [locale, ...breadcrumbs.slice(0, index + 1)]
            : breadcrumbs.slice(0, index + 1);

          const href = "/" + hrefSegments.join("/");
          const label = startCase(segment);
          const isLast = index === breadcrumbs.length - 1;

          return (
            <div className="flex items-center" key={href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
