import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTranslation } from "react-i18next";

interface TablePaginationProps {
  count: number;
  page: number;
  setPage: (page: number) => void;
  itemsPerPage?: number;
}

const TablePagination = ({
  count,
  page,
  setPage,
  itemsPerPage = 100,
}: TablePaginationProps) => {
  const totalPages = Math.ceil(count / itemsPerPage);
  const { t } = useTranslation();

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const getMiddlePages = (currentPage: number, totalPages: number) => {
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 2) {
      endPage = Math.min(3, totalPages - 1);
    } else if (currentPage >= totalPages - 1) {
      startPage = Math.max(totalPages - 2, 2);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const middlePages = getMiddlePages(page, totalPages);

  return (
    <Pagination>
      <PaginationContent className="flex my-2 items-center justify-end-safe w-full space-x-1">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className="px-3 h-8 py-1 border"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(page - 1);
            }}
            title={t("pagination.previous")}
          />
        </PaginationItem>

        {totalPages >= 1 && (
          <PaginationItem>
            <PaginationLink
              href={`?page=${page - 1}`}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(1);
              }}
              className={`px-3 h-8 w-8 py-1 border ${
                page === 1 ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              1
            </PaginationLink>
          </PaginationItem>
        )}

        {middlePages[0] > 2 && (
          <PaginationItem>
            <PaginationEllipsis className="px-3 h-8 w-8 py-1 rounded-lg border cursor-default" />
          </PaginationItem>
        )}

        {middlePages.map((item) => (
          <PaginationItem key={item}>
            <PaginationLink
              href={`?page=${item}`}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(item);
              }}
              className={`px-3 h-8 w-8 py-1 border ${
                page === item ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              {item}
            </PaginationLink>
          </PaginationItem>
        ))}

        {middlePages.length > 0 &&
          middlePages[middlePages.length - 1] < totalPages - 1 && (
            <PaginationItem>
              <PaginationEllipsis className="px-3 h-8 w-8 py-1 rounded-lg border cursor-default" />
            </PaginationItem>
          )}

        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(totalPages);
              }}
              className={`px-3 h-8 w-8 py-1 border ${
                page === totalPages ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            href={`?page=${page + 1}`}
            title={t("pagination.next")}
            className="px-3 py-1 h-8 border"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
