import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useCurrencyStore } from "@/stores/currency.store";

const CurrencyToggle = ({ className }: { className?: string }) => {
  const { currency, setCurrency } = useCurrencyStore();

  function handleCurrencyChange(value: "USD" | "UZS") {
    setCurrency(value);
  }

  const { t } = useTranslation();

  return (
    <Select
      defaultValue={currency}
      onValueChange={handleCurrencyChange}
      name="currency"
    >
      <SelectTrigger size={"sm"} className={cn(className, `w-fit text-sm`)}>
        <SelectValue placeholder={t("titles.currency")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="USD">USD</SelectItem>
        <SelectItem value="UZS">UZS</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default CurrencyToggle;
