"use client";

import { useMemo } from "react";
import Modal from "@/components/modals/index";
import { useImportStore } from "@/hooks/use-import-product";
import type { StockEntryFormType } from "@/types/systems.type";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Currency, ListProductType } from "@/types/products.type";
import PriceInput from "@/components/ui/price-input";
import { SearchableCombobox } from "@/components/combobox/search.combobox";
import { useStore } from "@/stores/store.store";
import { Button } from "@/components/ui/button";
import { useCrud } from "@/hooks/use-crud";
import { normalizeNumber } from "@/lib/utils";
import { notify } from "@/lib/toast";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

const ImportProductModal = () => {
  const { t } = useTranslation();
  const {
    setOpen,
    open,
    data,
    setData,
    disabled = false,
    setDisabled,
  } = useImportStore();
  const { selectedShop } = useStore();

  function handleChangeInput<K extends keyof StockEntryFormType>(
    key: K,
    value: StockEntryFormType[K],
  ) {
    console.log(value);

    setData({
      ...data,
      [key]: value,
    });
  }

  const categorySearchEndpoint = useMemo(
    () => (q: string) =>
      `${selectedShop?.id}/search/product/?q=${encodeURIComponent(q)}`,
    [selectedShop?.id],
  );

  async function submitForm() {
    const payload = {
      ...data,
      unit_price: normalizeNumber(data.unit_price),
      count: normalizeNumber(data.count),
    };

    try {
      const { status } = await useCrud.create({
        url: `${selectedShop?.id}/system/product-entries/`,
        data: payload,
      });

      if (status === 201) {
        notify.success(t("toast.success_import"));
        setOpen(false);
        setData({
          count: "",
          unit_price: "",
          currency: "USD",
          is_warehouse: false,
          product: 0,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  function handleCancel() {
    setOpen(false);
    setData({
      count: "",
      unit_price: "",
      currency: "USD",
      is_warehouse: false,
      product: 0,
    });
    setDisabled(false);
  }

  return (
    <Modal
      className="md:p-6 overflow-hidden px-1 py-4 w-full max-h-full sm:max-w-[100%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%] 2xl:max-w-[30%] 3xl:max-w-[25%]"
      open={open}
      title={t("modal.title")}
      setOpen={handleCancel}
      footer={<Button onClick={submitForm}>{t("modal.actions.import")}</Button>}
    >
      <>
        <SearchableCombobox<ListProductType>
          endpoint={categorySearchEndpoint}
          value={data.product}
          setValue={(value) => handleChangeInput("product", Number(value))}
          className="w-full"
          title={t("product.place_holders.category")}
          mapData={(item) => ({
            label: item.name,
            value: item.id.toString(),
          })}
        />
        <div className={`flex items-center justify-between`}>
          <div className="w-[100px]">
            <Label htmlFor={`currency`} className="text-sm font-medium">
              {t("form.currency")}
            </Label>
            <Select
              name="currency"
              value={data.currency}
              onValueChange={(e: Currency) => handleChangeInput("currency", e)}
            >
              <SelectTrigger className="mt-2 w-fit">
                <SelectValue placeholder={t("form.select_currency")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">{t("currency.USD")}</SelectItem>
                <SelectItem value="UZS">{t("currency.UZS")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className={`w-full`}>
            <Label className={`text-sm font-medium`} htmlFor={`unit_price`}>
              {t("form.price")}
            </Label>
            <PriceInput
              name={"unit_price"}
              value={data.unit_price}
              className={`form-input mt-2`}
              onValueChange={(value) =>
                handleChangeInput("unit_price", String(value))
              }
            />
          </div>
        </div>
        <div className={`flex items-center gap-x-2 justify-between`}>
          <div className={``}>
            <Label className={`text-sm font-medium`} htmlFor={`is_warehouse`}>
              {t("form.warehouse")}
            </Label>
            <Switch
              name="is_werehaouse"
              className={`form-input mt-4`}
              checked={data.is_warehouse}
              onCheckedChange={(e) => handleChangeInput("is_warehouse", e)}
            />
          </div>
          <div className={`w-full`}>
            <Label className={`text-sm font-medium`} htmlFor={`count`}>
              {t("form.count")}
            </Label>
            <PriceInput
              name={"count"}
              value={data.count}
              allowDecimals={false}
              className={`form-input mt-2`}
              onValueChange={(value) =>
                handleChangeInput("count", String(value))
              }
            />
          </div>
        </div>
      </>
    </Modal>
  );
};

export default ImportProductModal;
