import { Suspense } from "react";
// import { TokenHandler } from "@/components/token-handler";

export default function AuthBotPage() {
  return (
    <div className="min-h-screen bg-background w-full flex items-center justify-center">
      {/*<LoadingSkeleton />*/}
      <Suspense fallback={null}>{/*<TokenHandler />*/}</Suspense>
    </div>
  );
}
