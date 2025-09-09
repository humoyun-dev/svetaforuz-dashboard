import type React from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import OrderItemModal from "@/components/modals/order-item.modal";
import OrderSubmitModal from "@/components/modals/order-submit.modal";

interface Props {
  children: React.ReactNode;
  products: React.ReactNode;
}

const Layout = ({ children, products }: Props) => {
  return (
    <div className="h-screen flex flex-col">
      <Header actions={<Button variant="link" size="sm" asChild></Button>} />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] overflow-hidden">
        <div className="overflow-auto border-r">
          <div className="h-full p-4">{products}</div>
        </div>

        <div className="hidden lg:flex lg:flex-col shadow-lg overflow-auto">
          {children}
        </div>
      </div>

      <div className="lg:hidden border-t shadow-inner max-h-[40vh] overflow-auto">
        {children}
      </div>

      <OrderItemModal />
      <OrderSubmitModal />
    </div>
  );
};

export default Layout;
