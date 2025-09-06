"use client";
import { formatCurrencyPure } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Package,
  Edit2,
} from "lucide-react";
import { useCurrencyStore } from "@/stores/currency.store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import { useDebtStore } from "@/stores/debt.store";
import { TransactionDocumentProductForm } from "@/types/transaction.type";

const Page = () => {
  const {
    debtItems,
    removeDebtItem,
    updateDebtItem,
    setIndex,
    setAddMode,
    setDebtItem,
    setSubmitMode,
    resetDebt,
  } = useDebtStore();
  const { currency, usd } = useCurrencyStore();
  const { t } = useTranslation();

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const item = debtItems[index];
    if (item) {
      updateDebtItem(index, { ...item, quantity: newQuantity.toString() });
    }
  };

  const handleRemoveItem = (index: number) => {
    removeDebtItem(index);
  };

  const handleEdit = (index: number) => {
    setIndex(index);
    setAddMode(true);
    setDebtItem(debtItems[index]);
  };

  const total = debtItems.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.quantity);
  }, 0);

  const income = debtItems.reduce((sum, item) => {
    return (
      sum +
      (Number(item.price) - Number(item.product_data.enter_price)) *
        Number(item.quantity)
    );
  }, 0);

  if (debtItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 sm:p-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
            <h2 className="text-sm sm:text-base font-semibold">
              {t("cart.title")}
            </h2>
          </div>
          <Badge
            variant="secondary"
            className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1"
          >
            {debtItems.length}{" "}
            {t(debtItems.length === 1 ? "cart.item" : "cart.items")}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-auto p-2 sm:p-3">
        <div className="space-y-1.5 sm:space-y-2">
          {debtItems.map((item, index) => (
            <DebtItemCard
              key={`${item.product}-${index}`}
              item={item}
              index={index}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-2 sm:p-3">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">{t("cart.income")}</span>
            <span className="font-medium">
              {formatCurrencyPure({
                currency: "USD",
                number: income,
                appCurrency: currency,
                rate: usd,
              })}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm sm:text-base font-bold">
            <span>{t("cart.total")}</span>
            <span>
              {formatCurrencyPure({
                currency: "USD",
                number: total,
                appCurrency: currency,
                rate: usd,
              })}
            </span>
          </div>
          <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3">
            <Button
              onClick={() => {
                setAddMode(false);
                setSubmitMode(true);
              }}
              className="flex-1 text-xs sm:text-sm"
              size="sm"
            >
              {t("cart.proceedToCheckout")}
            </Button>
            <Button
              onClick={resetDebt}
              variant="outline"
              size="sm"
              className="px-2 sm:px-3 bg-transparent text-xs sm:text-sm"
            >
              {t("cart.empty.button")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

interface DebtItemCardProps {
  item: TransactionDocumentProductForm;
  index: number;
  onQuantityChange: (index: number, newQuantity: number) => void;
  onRemove: (index: number) => void;
  isLoading?: boolean;
  onEdit: (index: number) => void;
}

const DebtItemCard = ({
  item,
  index,
  onQuantityChange,
  onRemove,
  onEdit,
  isLoading = false,
}: DebtItemCardProps) => {
  const { currency, usd } = useCurrencyStore();
  const product = item.product_data;
  const totalPrice = Number(item.price) * Number(item.quantity);
  const quantity = Number(item.quantity);
  const { t } = useTranslation();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    onQuantityChange(index, newQuantity);
  };

  const handleRemove = () => {
    onRemove(index);
  };

  const handleEdit = () => {
    onEdit(index);
  };

  return (
    <Card className="group relative p-2 transition-all hover:shadow-md">
      <CardContent className="p-2">
        <div className="flex gap-4">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg ">
            <img
              src={
                product.images[0]?.image ||
                "/placeholder.svg?height=64&width=64&query=product" ||
                "/placeholder.svg"
              }
              alt={product.name}
              className="h-full w-full object-cover transition-transform"
            />
            {!product.in_stock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 capitalize truncate text-sm">
                  {product.name}
                </h3>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-primary   transition-opacity"
                onClick={handleEdit}
                disabled={isLoading}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-red-600   transition-opacity"
                onClick={handleRemove}
                disabled={isLoading}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">
                  {t("quantity.label")}:
                </span>
                <div className="flex items-center rounded-md border ">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-r-none "
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || isLoading}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <div className="flex h-6 w-8 items-center justify-center border-x   text-xs font-medium">
                    {quantity}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-l-none "
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={isLoading}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500">
                  {formatCurrencyPure({
                    currency: item.currency,
                    number: Number(item.price),
                    appCurrency: currency,
                    rate: usd,
                  })}{" "}
                  {t("product.each")}
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {formatCurrencyPure({
                    currency: item.currency,
                    number: totalPrice,
                    appCurrency: currency,
                    rate: usd,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center  rounded-lg">
            <div className="h-4 w-4 animate-spin rounded-full border-2  border-t-blue-600" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const EmptyCart = () => {
  const { t } = useTranslation();
  const { resetDebt } = useDebtStore();

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-24 h-24  rounded-full flex items-center justify-center mb-4">
        <Package className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {t("cart.empty.title")}{" "}
      </h3>
      <p className="text-gray-500 mb-6 max-w-sm">
        {t("cart.empty.description")}
      </p>
      <Button onClick={resetDebt} variant="outline">
        {t("cart.empty.button")}
      </Button>
    </div>
  );
};
