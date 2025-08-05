import { memo } from "react"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatedDate } from "@/lib/utils"
import { useTranslation } from "react-i18next"

interface OrderStatusCardProps {
  createdAt: string
  isDeleted: boolean
  deletedAt?: string | null
}

export const OrderStatusCard = memo(({ createdAt, isDeleted, deletedAt }: OrderStatusCardProps) => {
  const { t } = useTranslation()

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5 text-primary" />
          {t("order.status.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">{t("order.status.created")}</p>
            <p className="font-medium">{formatedDate(createdAt)}</p>
          </div>
          {isDeleted && deletedAt && (
            <div>
              <p className="text-sm text-muted-foreground">{t("order.status.deleted")}</p>
              <p className="font-medium text-destructive">{formatedDate(deletedAt)}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">{t("order.status.label")}</p>
            <Badge variant={isDeleted ? "destructive" : "default"} className="mt-1">
              {isDeleted ? t("order.status.deleted") : t("order.status.active")}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

OrderStatusCard.displayName = "OrderStatusCard"
