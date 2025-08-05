import { memo } from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface FinancialSummaryCardProps {
  totalProfit: string | number;
  unreturnedIncome: string | number;
  exchangeRate: string | number;
  currencyFormat: (
    number: string | number,
    exchange?: number,
  ) => string | undefined;
}

export const FinancialSummaryCard = memo(
  ({
    totalProfit,
    unreturnedIncome,
    exchangeRate,
    currencyFormat,
  }: FinancialSummaryCardProps) => {
    const { t } = useTranslation();

    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
            {t("finance.summary")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {t("finance.total_profit")}
              </span>
              <span className="font-semibold font-mono text-green-600">
                {currencyFormat(totalProfit, Number(exchangeRate))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {t("finance.unreturned_income")}
              </span>
              <span className="font-semibold font-mono">
                {currencyFormat(unreturnedIncome, Number(exchangeRate))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {t("currency.exchange_rate")}
              </span>
              <span className="font-mono">
                {new Intl.NumberFormat("uz-UZ").format(Number(exchangeRate))}{" "}
                soʻm
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);

FinancialSummaryCard.displayName = "FinancialSummaryCard";
