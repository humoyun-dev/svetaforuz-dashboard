import { memo } from "react";
import { User, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { formatedPhoneNumber } from "@/lib/utils";

interface CustomerInfoCardProps {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export const CustomerInfoCard = memo(
  ({ firstName, lastName, phoneNumber }: CustomerInfoCardProps) => {
    const { t } = useTranslation();

    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-primary" />
            {t("customer.information")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {firstName} {lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("customer.role")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{formatedPhoneNumber(phoneNumber)}</p>
              <p className="text-sm text-muted-foreground">
                {t("customer.phone_label")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);

CustomerInfoCard.displayName = "CustomerInfoCard";
