import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useFinanceQueries } from "@/hooks/finance/use-finance-queries";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom"
import { Calendar, Check, CheckCheck, Delete, Edit, FileDown, Lock, ReceiptText, Send, StickyNote, Trash } from "lucide-react";
import { useUserOrgId } from "../utils/useUserOrgId";
import { Badge } from "@/components/ui/badge";
import { useCallback, useEffect, useState } from "react";
import { FinanceReportDetailContent } from "../reusables/FinanceReportDetailContent";
import { FinanceReport, FinanceReportItem } from "@/types/finance";
import { FinanceDailyReportAction } from "../reusables/FinanceDailyReportAction";
import { useFinanceMuation } from "@/hooks/finance/use-finance-mutation";
import { toast } from "@/hooks/use-toast";
import { FinanceItemReceipt } from "../reusables/FinanceItemReceipt";
import { exportToCSV } from "@/utils/export-utils";
import { exportToPdf } from "../utils/exportToPdf";
import { PosTransactionReceipt } from "../reusables/PosTransactionReceipt";

export interface CalculationSummary {
    totalIncome: string;
    totalExpense: string;
    profit: string;
    broughtForward: string;
    debit: string;
    credit: string;
    bankIn: string;
    pattyCashOnHand: string;
    totalBalance: string
}

export const FinanceReportDetail = () => {
    const {
        isSuperAdmin,
        isTpAdmin,
        isTpFinance,
        isTpOperations,
        isTpSite
    } = useUserOrgId();
    const {
        useFinanceReportItemByReportId,
        useSiteNameByReportId
    } = useFinanceQueries();
    const { reportId } = useParams();
    const [page, setPage] = useState(1);
    const perPage = 10;
    const { data: financeReport, isLoading: isLoadingFinanceReport, refetch: refetchFinanceReport } = useSiteNameByReportId(reportId);
    const { data: financeItem, isLoading: isLoadingFinanceItem, refetch: refetchFinanceItem } = useFinanceReportItemByReportId(reportId, page, perPage);
    const [bodyTableData, setBodyTableData] = useState<any[]>([]);

    useEffect(() => {
        let runningBalance = 0;
        const formattedToTableBodyData = financeItem?.map((report: FinanceReportItem, i) => {
            const date = new Date(report.created_at);
            const description = report.description
                ? report.description
                : report.debit_type
                    ? report.nd_finance_income_type.name
                    : report.nd_finance_expense_type.name;
            runningBalance += report.debit - report.credit;
            return {
                no: i + 1,
                date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
                description,
                debit: report.debit.toFixed(2),
                credit: report.credit.toFixed(2),
                balance: runningBalance.toFixed(2),
                receipt: (report?.nd_pos_transaction.length < 1) ? <FinanceItemReceipt
                    id={report.id}
                    siteName={financeReport?.nd_site_profile.sitename}
                    debit={report.debit}
                    credit={report.credit}
                    balance={runningBalance}
                    image={report.image_path}
                    doc={report.doc_path}
                    date={report.created_at}
                /> : <PosTransactionReceipt 
                    key={report.id}
                    memberId={report?.nd_pos_transaction[0]?.member_id}
                    posTransactionId={report?.nd_pos_transaction[0]?.id}
                    posTransactionData={report?.nd_pos_transaction}
                    siteName={financeReport?.nd_site_profile.sitename}
                />,
                action: (isTpSite && financeReport?.nd_finance_report_status?.status === "editing") && <FinanceDailyReportAction
                    financeReportItemId={report.id}
                    refetchFinanceItem={refetchFinanceItem}
                    refetchFinanceReport={refetchFinanceReport}
                    formDefaultValues={
                        {
                            type: report.debit > 0 ? "income" : "expense",
                            date: new Date(report.created_at),
                            amount: report.debit ? report.debit : report.credit,
                            description: report.description
                        }
                    }
                />
            };
        });
        setBodyTableData(formattedToTableBodyData || []);
    }, [financeItem, isTpSite, financeReport]);

    const headTable = [
        { key: "no", label: "No" },
        { key: "date", label: "Date" },
        { key: "description", label: "Description" },
        { key: "debit", label: "Debit" },
        { key: "credit", label: "Credit" },
        { key: "balance", label: "Balance" },
        { key: "receipt", label: "Receipt" },
        { key: "action", label: "Action" }
    ];

    const calculationSummary = useCallback((): CalculationSummary => {
        if (!financeReport || !financeItem) return {} as CalculationSummary;
        const totalIncome = financeReport.nd_finance_report_item.reduce((acc, item) => acc + item.debit, 0);
        const totalExpense = financeReport.nd_finance_report_item.reduce((acc, item) => acc + item.credit, 0);
        const profit = totalIncome - totalExpense;
        const broughtForward = (financeReport.balance_forward ? financeReport.balance_forward : 0);
        const debit = financeItem.reduce((acc, item) => acc + item.debit, 0);
        const credit = financeItem.reduce((acc, item) => acc + item.credit, 0);
        const bankIn = financeReport.nd_finance_report_item.reduce(
            (acc, item) => acc + (item.nd_finance_expense_type?.name === "Bank In" ? item.credit : 0),
            0
        );
        const pattyCashOnHand = broughtForward + debit;
        const totalBalance = (broughtForward + debit) - (credit + bankIn);
        return {
            totalIncome: totalIncome.toFixed(2),
            totalExpense: totalExpense.toFixed(2),
            profit: profit.toFixed(2),
            broughtForward: broughtForward.toFixed(2),
            debit: debit.toFixed(2),
            credit: credit.toFixed(2),
            bankIn: bankIn.toFixed(2),
            pattyCashOnHand: pattyCashOnHand.toFixed(2),
            totalBalance: totalBalance.toFixed(2)
        };
    }, [financeReport, financeItem])

    if (
        isLoadingFinanceReport
    ) {
        return <LoadingSpinner />
    }

    console.log("finance item", financeItem);

    return (
        <section className="space-y-6">
            <HeaderReportDetail
                title={financeReport.nd_site_profile.sitename}
                description={`Report for ${financeReport.month}/${financeReport.year}`}
                isTpFinance={isTpFinance}
                isTpSite={isTpSite}
                reportId={reportId}
                financeReport={financeReport}
                calculationSummary={calculationSummary}
                refetchFinanceItem={refetchFinanceItem}
                refetchFinanceReport={refetchFinanceReport}
                bodyTableData={bodyTableData}
                financeReportStatus={financeReport.nd_finance_report_status.status}
            />
            <FinanceReportDetailContent
                calculationSummary={() => calculationSummary()}
                refetchFinanceItem={refetchFinanceItem}
                refetchFinanceReport={refetchFinanceReport}
                contentResult={bodyTableData}
                headTable={headTable}
                page={page}
                financeReportId={reportId}
                financeReport={financeReport}
                setPage={setPage}
                isTpSite={isTpSite}
                isLoading={isLoadingFinanceItem}
            />
        </section>
    )
}

interface HeaderReportDetailProps {
    isDashBoardPage?: boolean
    isTpFinance?: boolean
    isTpSite?: boolean
    financeReportStatus?: string
    title: string
    description: string
    reportId: string
    financeReport?: FinanceReport
    calculationSummary: () => CalculationSummary
    refetchFinanceItem: () => void
    refetchFinanceReport: () => void
    bodyTableData: any[]
}

const HeaderReportDetail = ({
    isDashBoardPage = true,
    title,
    description,
    isTpFinance,
    isTpSite,
    financeReportStatus,
    reportId,
    financeReport,
    calculationSummary,
    refetchFinanceItem,
    refetchFinanceReport,
    bodyTableData
}: HeaderReportDetailProps) => {
    const [badgeClassName, setBadgeClassName] = useState("");
    const {
        useUpdateFinanceReportStatusMutation
    } = useFinanceMuation();
    const updateStatusAndMakeNewReport = useUpdateFinanceReportStatusMutation();

    useEffect(() => {
        switch (financeReportStatus) {
            case "submitted":
                setBadgeClassName("bg-yellow-100 text-yellow-600 border border-yellow-500 hover:bg-yellow-200");
                break;
            case "editing":
                setBadgeClassName("bg-blue-100 text-blue-500 border border-blue-500 hover:bg-blue-200");
                break;
            case "verified":
                setBadgeClassName("bg-green-100 text-green-500 border border-green-500 hover:bg-green-200");
                break;
            case "closed":
                setBadgeClassName("bg-gray-100 text-gray-500 border border-gray-500 hover:bg-gray-200");
                break;
            default:
                setBadgeClassName("");
        }
    }, [financeReportStatus])

    const handleSubmitReport = async () => {
        try {
            const { totalBalance } = calculationSummary();
            await updateStatusAndMakeNewReport.mutateAsync({ reportId, status: "submitted", balanceForward: Number(totalBalance) });

            toast({
                title: "Success",
                description: "Report submitted successfully",
                variant: "success",
            });
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Failed to submit report. Please try again.",
                variant: "destructive",
            })
        } finally {
            refetchFinanceReport();
            refetchFinanceItem();
        }
    }

    const hanldeVerifyReport = async () => {
        try {
            await updateStatusAndMakeNewReport.mutateAsync({ reportId, status: "verified" });
            toast({
                title: "Success",
                description: "Report verified successfully",
                variant: "success",
            });
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Failed to verify report. Please try again.",
                variant: "destructive",
            })
        } finally {
            refetchFinanceReport();
            refetchFinanceItem();
        }
    }

    const hanldeReturnReport = async () => {
        try {
            await updateStatusAndMakeNewReport.mutateAsync({ reportId, status: "editing" });
            toast({
                title: "Success",
                description: "Report returned successfully",
                variant: "success",
            });
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Failed to return report. Please try again.",
                variant: "destructive",
            })
        } finally {
            refetchFinanceReport();
            refetchFinanceItem();
        }
    }

    const handleCloseReport = async () => {
        try {
            await updateStatusAndMakeNewReport.mutateAsync({ reportId, status: "closed" });
            toast({
                title: "Success",
                description: "Report closed successfully",
                variant: "success",
            });
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Failed to close report. Please try again.",
                variant: "destructive",
            })
        } finally {
            refetchFinanceReport();
            refetchFinanceItem();
        }
    }

    const handleExportToCsv = async () => {
        const formattedTable = bodyTableData.map(item => {
            const { receipt, action, ...rest } = item;
            return rest;
        });
        try {
            exportToCSV(formattedTable, `Finance Report ${description.replace(/\s+/g, "_")}`);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to export to CSV. Please try again.",
                variant: "destructive",
            });
        }
    }

    const handleExportToPdf = async () => {
        const formattedTable = bodyTableData.map(item => {
            const { receipt, action, ...rest } = item;
            return rest;
        });
        try {
            exportToPdf({ data: formattedTable, title: `Finance Report ${description.replace(/\s+/g, "_")}` });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to export to PDF. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <section className="flex justify-between items-center">
            <div className="">
                <h1 className="text-4xl font-extrabold">{title}</h1>
                <p className="flex items-center gap-2 text-muted-foreground mt-2">
                    <Calendar size={18} />
                    {description}
                    <Badge className={`${badgeClassName} pt-1`}>{financeReportStatus}</Badge>
                </p>
            </div>
            {isDashBoardPage && (
                <div className="flex items-center gap-2">
                    <Button onClick={handleExportToCsv} className="bg-blue-100 text-blue-600 border border-blue-500 hover:bg-blue-200">
                        <StickyNote />
                        Export CSV
                    </Button>
                    <Button onClick={handleExportToPdf} className="bg-green-100 text-green-600 border border-green-500 hover:bg-green-200">
                        <FileDown />
                        Export PDF
                    </Button>
                    {(isTpFinance && financeReportStatus === "verified") && (
                        <Button onClick={handleCloseReport } className="bg-yellow-500 text-white border border-yellow-200 hover:bg-yellow-600">
                            <Lock />
                            Close Report
                        </Button>
                    )}
                    {(isTpFinance && financeReportStatus === "submitted") && (
                        <>
                            <Button onClick={hanldeVerifyReport} className="bg-green-500 text-white border border-green-200 hover:bg-green-600">
                                <Check />
                                Verify Report
                            </Button>
                            <Button onClick={hanldeReturnReport} className="bg-blue-500 text-white border border-blue-200 hover:bg-blue-600">
                                <Check />
                                Return Report
                            </Button>
                        </>
                    )}
                    {(isTpSite && financeReportStatus === "editing") && (
                        <Button disabled={financeReport.nd_finance_report_item.length < 1} onClick={handleSubmitReport} className="bg-yellow-500 text-white border border-yellow-200 hover:bg-yellow-600">
                            <Send />
                            Submit Report
                        </Button>
                    )}
                </div>
            )}
        </section>
    );
};
