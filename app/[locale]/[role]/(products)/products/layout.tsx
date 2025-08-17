import React from "react";
import ImportProductModal from "@/components/modals/import-product.modal";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ImportProductModal />

      {children}
    </>
  );
};

export default Layout;
