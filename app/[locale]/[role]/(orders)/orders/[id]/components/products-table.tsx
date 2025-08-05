import { memo } from "react"
import Image from "next/image"
import { Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTranslation } from "react-i18next"
import type { DetailOrderType } from "@/types/orders.type"

interface ProductsTableProps {
  items: DetailOrderType["items"]
  totalAmount: number
  exchangeRate: number
  currencyFormat: (number: string | number, exchange?: number) => string | undefined
}

export const ProductsTable = memo(({ items, totalAmount, exchangeRate, currencyFormat }: ProductsTableProps) => {
  const { t } = useTranslation()

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Package className="w-5 h-5 text-primary" />
          {t("order.products")}
          <Badge variant="secondary" className="ml-auto">
            {items.length} {t("order.items_count")}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16 pl-6">{t("product.table.image")}</TableHead>
                <TableHead className="min-w-[200px]">{t("product.table.product")}</TableHead>
                <TableHead className="text-right">{t("product.table.enter_price")}</TableHead>
                <TableHead className="text-center">{t("product.table.quantity_short")}</TableHead>
                <TableHead className="text-right">{t("product.table.unit_price")}</TableHead>
                <TableHead className="text-right pr-6">{t("product.table.total")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={item.product.images[0]?.thumbnail || "/placeholder.svg?height=48&width=48"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium leading-tight">{item.product.name}</p>
                      {item.product.sku && (
                        <p className="text-xs text-muted-foreground font-mono">
                          {t("product.sku")}: {item.product.sku}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {currencyFormat(item.product.enter_price, item.product.exchange_rate)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono">
                      {item.quantity} {item.product.count_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {currencyFormat(item.price, Number(item.exchange_rate))}
                  </TableCell>
                  <TableCell className="text-right font-semibold font-mono pr-6">
                    {currencyFormat(item.quantity * Number(item.price), Number(item.exchange_rate))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="border-t bg-muted/20 p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">{t("order.total_amount")}:</span>
            <span className="text-xl font-bold font-mono">{currencyFormat(totalAmount, exchangeRate)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

ProductsTable.displayName = "ProductsTable"
