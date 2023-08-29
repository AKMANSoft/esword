import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import VersesTable from "@/components/dashboard/tables/verses.table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"



export default async function Page() {
  return (
    <div>
      <Card className="min-h-[600px]">
        <CardHeader className="border-b-8 border-silver-light py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="font-bold text-2xl">
              All Verses
            </CardTitle>
            <Link href="/dashboard/verses/add" className={buttonVariants({ variant: "default" })}>
              Add New
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-3 py-5 md:p-5">
          <VersesTable />
        </CardContent>
      </Card>
    </div>
  )
}