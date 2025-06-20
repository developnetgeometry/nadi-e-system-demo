import { PaginationTableServer } from "@/components/site/component/PaginationTableServer"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { FinanceReportItem } from "@/types/finance"
import { Plus } from "lucide-react"
import React from "react"
import { FinanceReportItemDialogForm } from "./FinanceReportItemDialogForm"
import { CalculationSummary } from "../pages/FinanceReportDetail"

interface FinanceReportDetailContentProps {
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    contentResult: FinanceReportItem[]
    isLoading: boolean
    financeReportId: string
    refetchFinanceItem: () => void
    refetchFinanceReport: () => void
    headTable: any[]
    calculationSummary: () => CalculationSummary
}
export const FinanceReportDetailContent = ({
    page,
    setPage,
    contentResult,
    financeReportId,
    isLoading,
    headTable,
    refetchFinanceItem,
    calculationSummary,
    refetchFinanceReport
}: FinanceReportDetailContentProps) => {
    return (
        <section className="flex gap-4">
            <Card className="p-4 flex-grow w-[70%] h-fit">
                <div className="flex justify-between items-center bg-purple-500 p-4 rounded-md">
                    <h1 className="text-3xl font-bold text-white">General Ledger</h1>
                    <FinanceReportItemDialogForm 
                        financeReportId={financeReportId}
                        refetchFinanceItem={refetchFinanceItem}
                        refetchFinanceReport={refetchFinanceReport}
                    />
                </div>
                <PaginationTableServer
                    page={page}
                    setPage={setPage}
                    contentResult={contentResult}
                    isLoading={isLoading}
                    headTable={headTable}
                    totalPages={6}
                />
            </Card>
            <Card className="space-y-5 p-4 flex-grow">
                <h1 className="text-3xl font-bold text-white bg-purple-500 p-4 rounded-md">Financial Summary</h1>
                <Card className="p-4 bg-green-100 space-y-2">
                    <h1 className="text-lg font-bold">Income and Expenses</h1>
                    <div className="space-y-2">
                        <div>
                            <div className="flex items-center justify-between">
                                <h1>Total Income</h1>
                                <p>RM {calculationSummary().totalIncome}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <h1>Total Expenses</h1>
                                <p>RM {calculationSummary().totalExpense}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                            <h1 className="font-semibold">Profit</h1>
                            <p>RM {calculationSummary().profit}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gray-100 space-y-2">
                    <h1 className="text-lg font-bold">Cash Flow</h1>
                    <div>
                        <div>
                            <div className="flex items-center justify-between">
                                <h1>Brought Forward</h1>
                                <p>RM {calculationSummary().broughtForward}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <h1>Debit</h1>
                                <p>RM {calculationSummary().debit}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <h1>Credit</h1>
                                <p>RM {calculationSummary().credit}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <h1>Bank In</h1>
                                <p>RM {calculationSummary().bankIn}</p>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-green-100 space-y-2">
                    <h1 className="text-lg font-bold">Final Balance</h1>
                    <div className="space-y-2">
                        <div>
                            <div className="flex items-center justify-between">
                                <h1>Patty Cash On Hand</h1>
                                <p>RM {calculationSummary().pattyCashOnHand}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                            <h1 className="font-semibold">Balance</h1>
                            <p>RM {calculationSummary().totalBalance}</p>
                        </div>
                    </div>
                </Card>
            </Card>
        </section>
    )
}