import { memo } from "react";
import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

interface PaymentInfoCardProps {
  paymentType: string;
  currency: string;
  totalPrice: string | number;
  paidAmount: string | number;
  changeGiven: boolean;
  changeAmount: string | number;
  exchangeRate: number;
  currencyFormat: (
    number: string | number,
    exchange?: number,
  ) => string | undefined;
}

export const PaymentInfoCard = memo(
  ({
    paymentType,
    currency,
    totalPrice,
    paidAmount,
    changeGiven,
    changeAmount,
    exchangeRate,
    currencyFormat,
  }: PaymentInfoCardProps) => {
    const { t } = useTranslation();

    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="w-5 h-5 text-primary" />
            {t("payment.details")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("payment.type")}
              </p>
              <Badge variant="outline" className="mt-1">
                {t(`submit.${paymentType}_payment`)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("currency.currency")}
              </p>
              <p className="font-medium">{currency}</p>
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {t("payment.total_price")}
              </span>
              <span className="font-semibold font-mono">
                {currencyFormat(totalPrice, exchangeRate)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {t("payment.paid_amount")}
              </span>
              <span className="font-semibold font-mono text-green-600">
                {currencyFormat(paidAmount, exchangeRate)}
              </span>
            </div>
            {changeGiven && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {t("payment.change_given")}
                </span>
                <span className="font-semibold font-mono">
                  {currencyFormat(changeAmount, exchangeRate)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);

PaymentInfoCard.displayName = "PaymentInfoCard";
