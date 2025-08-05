import React from "react";
import { CirclesWithBar, MagnifyingGlass } from "react-loader-spinner";
import { cn } from "@/lib/utils";

export const Loading = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        `h-screen w-full bg-background flex flex-col items-center justify-center`,
        className,
      )}
    >
      <CirclesWithBar height="100" width="100" color="#60a5fa" visible={true} />
    </div>
  );
};

export const SearchLoading = () => {
  return (
    <>
      <MagnifyingGlass visible={true} height="80" width="80" />
    </>
  );
};
