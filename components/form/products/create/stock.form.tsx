"use client";

import { type UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus, X, Package, Trash2, Edit2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type {
  ProductFormData,
  ProductEditData,
  CommonForm,
} from "@/lib/validation";
import { CURRENCIES } from "@/lib/constants";
import { Switch } from "@/components/ui/switch";
import PriceInput from "@/components/ui/price-input";
import { useStore } from "@/stores/store.store";
import { useCrud } from "@/hooks/use-crud";
import { useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { StockEntryFormData } from "@/types/products.type";
import { Label } from "@/components/ui/label";
import { notify } from "@/lib/toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductStockSectionProps {
  form?: UseFormReturn<ProductFormData>;
  productId?: string;
  editForm?: UseFormReturn<ProductEditData>;
  isEdit?: boolean;
}

export default function ProductStockSection({
  form,
  productId,
  editForm,
  isEdit = false,
}: ProductStockSectionProps) {
  const activeForm = (form ?? editForm) as CommonForm;

  const {
    fields: stockFields,
    append: appendStock,
    remove: removeStock,
  } = useFieldArray({
    control: activeForm.control,
    name: "stock",
  });

  const handleAddStock = () => {
    appendStock({
      quantity: "",
      unit_price: "",
      currency: "USD",
      is_warehouse: false,
    });
  };

  const handleRemoveStock = (index: number) => {
    if (stockFields.length > 1) {
      removeStock(index);
    }
  };

  const handleCurrencyChange = (index: number, selectedCurrency: string) => {
    activeForm.setValue(
      `stock.${index}.currency`,
      selectedCurrency as "USD" | "UZS",
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Tracking</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track different batches of inventory with their purchase costs.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {productId ? (
            <APIStockForm isEdit={isEdit} productID={productId} />
          ) : (
            <>
              {stockFields.map((field, index) => (
                <div key={field.id} className="rounded-lg border p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">
                        Stock Entry {index + 1}
                      </h3>
                    </div>
                    {stockFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveStock(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-6 gap-4">
                    <FormField
                      control={activeForm.control}
                      name={`stock.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className={`col-span-2`}>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <PriceInput
                              allowDecimals={false}
                              value={field.value}
                              onValueChange={(value, name, values) => {
                                activeForm.setValue(
                                  `stock.${index}.quantity`,
                                  String(value),
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={activeForm.control}
                      name={`stock.${index}.unit_price`}
                      render={({ field }) => (
                        <FormItem className={`col-span-2`}>
                          <FormLabel>Cost per Unit</FormLabel>
                          <FormControl>
                            <PriceInput
                              value={field.value}
                              onValueChange={(value, name, values) => {
                                activeForm.setValue(
                                  `stock.${index}.unit_price`,
                                  String(value),
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={activeForm.control}
                      name={`stock.${index}.currency`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              handleCurrencyChange(index, value)
                            }
                            defaultValue={field.value || "USD"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CURRENCIES.map((curr) => (
                                <SelectItem key={curr.value} value={curr.value}>
                                  {curr.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={activeForm.control}
                      name={`stock.${index}.is_warehouse`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Is Warehouse</FormLabel>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(e) => field.onChange(e)}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddStock}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Stock Entry
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const APIStockForm = ({
  productID,
  isEdit,
}: {
  productID: string;
  isEdit?: boolean;
}) => {
  const { selectedShop } = useStore();
  const { create } = useCrud;
  const [loading, setLoading] = useState(false);
  const [mockData, setMockData] = useState<
    {
      quantity: string;
      unit_price: string;
      currency: "USD" | "UZS";
      is_warehouse: boolean;
    }[]
  >([]);

  const {
    safeData: stocks = [],
    isLoading,
    refetch,
  } = useFetch<StockEntryFormData[]>(
    selectedShop?.id
      ? `${selectedShop.id}/products/products/${productID}/stock/`
      : null,
  );

  const handleAddRow = () => {
    setMockData([
      ...mockData,
      {
        quantity: "",
        unit_price: "",
        currency: "USD",
        is_warehouse: false,
      },
    ]);
  };

  const handleCreate = async (index: number) => {
    const data = mockData[index];
    if (!data.quantity || !data.unit_price) return;

    setLoading(true);
    try {
      const { status } = await create({
        url: `${selectedShop?.id}/products/products/${productID}/stock-add/`,
        data: data,
      });
      if (status == 201) {
        notify.success("Stock added successfully");
        refetch();
        const updated = [...mockData];
        updated.splice(index, 1);
        setMockData(updated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMockChange = (
    index: number,
    field: "quantity" | "unit_price" | "currency" | "is_warehouse",
    value: string | boolean,
  ) => {
    const updated = [...mockData];
    // @ts-ignore
    updated[index][field] = value;
    setMockData(updated);
  };

  const handleMockDelete = (index: number) => {
    const updated = [...mockData];
    updated.splice(index, 1);
    setMockData(updated);
  };

  if (isLoading || loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="grid grid-cols-2 gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {stocks.length > 0 &&
        stocks.map((stock, index) => (
          <StockCardAPI
            isEdit={isEdit}
            refetch={refetch}
            key={index}
            stock={stock}
            index={index}
          />
        ))}

      {mockData.map((item, index) => (
        <div key={index} className="rounded-lg border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Stock Entry {index + 1}</h3>
            </div>
            <div className={`flex items-center gap-1`}>
              <Button
                onClick={() => handleCreate(index)}
                type="button"
                size="sm"
                variant="secondary"
              >
                Submit
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleMockDelete(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
          <div className={`grid grid-cols-6 gap-4`}>
            <div className={`col-span-2`}>
              <Label htmlFor={"quantity"} className="mb-2">
                Quantity
              </Label>
              <PriceInput
                allowDecimals={false}
                value={item.quantity}
                name="quantity"
                onValueChange={(value, name, values) => {
                  handleMockChange(index, "quantity", String(value));
                }}
                disabled={loading}
              />
            </div>
            <div className={`col-span-2`}>
              <Label htmlFor={"unit_price"} className="mb-2">
                Cost Per Unit
              </Label>
              <PriceInput
                value={item.unit_price}
                name="unit_price"
                onValueChange={(value, name, values) => {
                  handleMockChange(index, "unit_price", String(value));
                }}
                disabled={loading}
              />
            </div>
            <div>
              <Label className={`mb-2`} htmlFor={`currency`}>
                Currency
              </Label>
              <Select
                disabled={loading}
                name={`currency`}
                onValueChange={(value: "USD" | "UZS") =>
                  handleMockChange(index, "currency", String(value))
                }
                defaultValue={item.currency || "USD"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CURRENCIES.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className={`mb-3`} htmlFor={`is_warehouse`}>
                Is Warehouse
              </Label>
              <Switch
                name="is_warehouse"
                className={``}
                checked={item.is_warehouse}
                onCheckedChange={(e) =>
                  handleMockChange(index, "is_warehouse", e)
                }
                disabled={loading}
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        onClick={handleAddRow}
        type="button"
        variant="outline"
        className="w-full"
        disabled={!isEdit}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Stock Entry
      </Button>
    </>
  );
};

const StockCardAPI = ({
  stock,
  index,
  refetch,
  isEdit,
}: {
  stock: StockEntryFormData;
  index: number;
  refetch: () => void;
  isEdit?: boolean;
}) => {
  const { update, delete: remove } = useCrud;
  const { selectedShop } = useStore();

  const [data, setData] = useState<StockEntryFormData>({
    id: stock.id,
    quantity: String(Number(stock.quantity)),
    unit_price: String(Number(stock.unit_price)),
    currency: stock.currency,
    exchange_rate: stock.exchange_rate,
    is_warehouse: stock.is_warehouse,
  });

  const handleUpdate = async () => {
    const payload = {
      ...data,
      quantity: Number(data.quantity.replace(/\s/g, "").replace(",", ".")),
      unit_price: Number(data.unit_price.replace(/\s/g, "").replace(",", ".")),
      currency: data.currency,
      exchange_rate: data.exchange_rate,
      is_warehouse: data.is_warehouse,
    };

    try {
      const { status } = await update({
        url: `${selectedShop?.id}/products/stock/${stock.id}/`,
        data: payload,
      });

      if (status === 200) {
        notify.info("Stock updated", { duration: 2000 });
        refetch();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    try {
      const { status } = await remove(
        `${selectedShop?.id}/products/stock/${stock.id}/`,
      );

      if (status === 204) {
        notify.info("Stock deleted", { duration: 2000 });
        refetch();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Stock Entry {index + 1}</h3>
          </div>
          <div className={`flex items-center gap-1`}>
            {isEdit && (
              <>
                <Button
                  onClick={handleUpdate}
                  type="button"
                  size="sm"
                  variant="secondary"
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </>
            )}
          </div>
        </div>
        <div className={`grid grid-cols-6 gap-4`}>
          <div className={`col-span-2`}>
            <Label htmlFor={"quantity"} className="mb-2">
              Quantity
            </Label>
            <PriceInput
              allowDecimals={false}
              value={data.quantity}
              name="quantity"
              onValueChange={(value, name, values) => {
                setData({ ...data, quantity: String(value) });
              }}
              disabled={!isEdit}
            />
          </div>
          <div className={`col-span-2`}>
            <Label htmlFor={"unit_price"} className="mb-2">
              Cost Per Unit
            </Label>
            <PriceInput
              value={data.unit_price}
              name="unit_price"
              onValueChange={(value, name, values) => {
                setData({ ...data, unit_price: String(value) });
              }}
              disabled={!isEdit}
            />
          </div>
          <div>
            <Label className={`mb-2`} htmlFor={`currency`}>
              Currency
            </Label>
            <Select
              disabled={!isEdit}
              name={`currency`}
              onValueChange={(value: "USD" | "UZS") =>
                setData({ ...data, currency: value })
              }
              defaultValue={data.currency || "USD"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {CURRENCIES.map((curr) => (
                  <SelectItem key={curr.value} value={curr.value}>
                    {curr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className={`mb-3`} htmlFor={`is_warehouse`}>
              Is Warehouse
            </Label>
            <Switch
              name="is_warehouse"
              className={``}
              checked={data.is_warehouse}
              onCheckedChange={(e) => setData({ ...data, is_warehouse: e })}
              disabled={!isEdit}
            />
          </div>
        </div>
      </div>
    </>
  );
};
