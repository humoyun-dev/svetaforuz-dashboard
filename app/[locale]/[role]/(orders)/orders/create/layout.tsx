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
    <div className="h-screen flex flex-col ">
      <Header actions={<Button variant="link" size="sm" asChild></Button>} />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto border-r">
          <div className="h-full p-4">{products}</div>
        </div>

        <div className="w-[400px] xl:w-[500px] hidden lg:flex lg:flex-col shadow-lg">
          {children}
        </div>
      </div>

      <OrderItemModal />
      <OrderSubmitModal />
    </div>
  );
};

export default Layout;
