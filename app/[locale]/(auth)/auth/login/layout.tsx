"use client";

interface LayoutProps {
  children: React.ReactNode;
  choose: React.ReactNode;
}

export default function Layout({ children, choose }: LayoutProps) {
  return (
    <div className="grid h-screen w-full md:grid-cols-3 grid-cols-1 sm:p-0 p-3">
      <div className="md:bg-secondary/70 w-full md:backdrop-blur-sm md:border-r flex items-center justify-center">
        {choose}
      </div>

      <div className="flex items-center justify-center col-span-2">
        {children}
      </div>
    </div>
  );
}
