"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

export interface TableAction<T> {
  label: string;
  onClick: (row: T) => void;
  variant?: "default" | "destructive";
  isDisabled?: (row: T) => boolean;
}

interface GenericTableProps<T> {
  data: T[];
  edit?: boolean;
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  url?: string;
  rowAction?: (row: T) => void;
}

export function GenericTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  loading = false,
  emptyMessage = "No data available",
  className = "",
  url,
  edit = true,
  rowAction,
}: GenericTableProps<T>) {
  const router = useRouter();

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  const renderCell = (column: TableColumn<T>, row: T) => {
    const value = getNestedValue(row, column.key as string);
    return column.render ? column.render(value, row) : value;
  };

  const handleRowClick = (row: T) => {
    if (url) {
      const path = `${url}${row.id}${edit ? "/edit" : ""}`;
      router.push(path);
    }

    if (rowAction) {
      rowAction(row);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className={`rounded-md border ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key as string}
                className={column.className}
              >
                {column.label}
              </TableHead>
            ))}
            {actions && actions.length > 0 && (
              <TableHead className="lg:w-[50px]" />
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center py-8 text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                onClick={() => handleRowClick(row)}
                className={url || rowAction ? "cursor-pointer" : ""}
                key={index}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key as string}
                    className={column.className}
                  >
                    {renderCell(column, row)}
                  </TableCell>
                ))}
                {actions && actions.length > 0 && (
                  <TableCell>
                    {actions.length > 1 ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <circle cx="12" cy="5" r="2" />
                              <circle cx="12" cy="12" r="2" />
                              <circle cx="12" cy="19" r="2" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions.map((action, actionIndex) => (
                            <DropdownMenuItem
                              key={actionIndex}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row);
                              }}
                              disabled={action.isDisabled?.(row)}
                              className={
                                action.variant === "destructive"
                                  ? "text-destructive"
                                  : ""
                              }
                            >
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button
                        variant="secondary"
                        disabled={actions[0].isDisabled?.(row)}
                        onClick={(e) => {
                          e.stopPropagation();
                          actions[0].onClick(row);
                        }}
                      >
                        {actions[0].label}
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
