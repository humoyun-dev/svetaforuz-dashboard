import React from "react";
import ImportProductModal from "@/components/modals/import-product.modal";
import CategoryCreateModal from "@/components/modals/category-create.modal";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ImportProductModal />
      <CategoryCreateModal />

      {children}
    </>
  );
};

export default Layout;
