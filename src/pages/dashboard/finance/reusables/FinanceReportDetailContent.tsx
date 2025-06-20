import { PaginationTableServer } from "@/components/site/component/PaginationTableServer"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { FinanceReportItem } from "@/types/finance"
import { Plus } from "lucide-react"
import React from "react"

interface FinanceReportDetailContentProps {
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    contentResult: FinanceReportItem[]
    isLoading: boolean
    headTable: any[]
}
export const FinanceReportDetailContent = ({
    page,
    setPage,
    contentResult,
    isLoading,
    headTable
}: FinanceReportDetailContentProps) => {
    return (
        <section className="flex gap-4">
            <Card className="p-4 flex-grow h-fit">
                <div className="flex justify-between items-center bg-purple-500 p-4 rounded-md">
                    <h1 className="text-3xl font-bold text-white">General Ledger</h1>
                    <Button className="bg-green-500 text-white hover:bg-green-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Transaction
                    </Button>
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
                    <div>
                        <div>
                            <div className="flex items-center justify-between">
                                <h1>Total Income</h1>
                                <p>RM 0</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <h1>Total Expenses</h1>
                                <p>RM 0</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <h1>Profit</h1>
                            <p>RM 0</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gray-100 space-y-2">
                    <h1 className="text-lg font-bold">Cash Flow</h1>
                    <div>
                        <div>
                            <div className="flex items-center justify-between">
                                <h1>Brought Forward</h1>
                                <p>RM 0</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <h1>Debit</h1>
                                <p>RM 0</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <h1>Credit</h1>
                                <p>RM 0</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <h1>Bank In</h1>
                                <p>RM 0</p>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-green-100 space-y-2">
                    <h1 className="text-lg font-bold">Final Balance</h1>
                    <div>
                        <div>
                            <div className="flex items-center justify-between">
                                <h1>Total Income</h1>
                                <p>RM 0</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <h1>Total Expenses</h1>
                                <p>RM 0</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <h1>Profit</h1>
                            <p>RM 0</p>
                        </div>
                    </div>
                </Card>
            </Card>
        </section>
    )
}