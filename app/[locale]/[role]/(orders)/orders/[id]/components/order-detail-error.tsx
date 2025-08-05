"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "react-i18next"
import Header from "@/components/header"

interface OrderDetailErrorProps {
  onBackClick: () => void
}

export const OrderDetailError = ({ onBackClick }: OrderDetailErrorProps) => {
  const { t } = useTranslation()

  return (
    <>
      <Header />
      <div className="p-6">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold text-destructive mb-2">{t("order.not_found")}</h3>
            <p className="text-muted-foreground text-center mb-4">{t("order.error.not_found_description")}</p>
            <Button onClick={onBackClick} variant="outline">
              {t("order.back_to_orders")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
