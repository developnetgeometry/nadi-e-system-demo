import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useFinanceQueries } from "@/hooks/finance/use-finance-queries";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom"
import { Calendar, Check, CheckCheck, FileDown, Send, StickyNote } from "lucide-react";
import { useUserOrgId } from "../utils/useUserOrgId";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { FinanceReportDetailContent } from "../reusables/FinanceReportDetailContent";
import { FinanceReportItem } from "@/types/finance";

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
    const { data: financeReport, isLoading: isLoadingFinanceReport } = useSiteNameByReportId(reportId);
    const { data: financeItem, isLoading: isLoadingFinanceItem } = useFinanceReportItemByReportId(reportId, page, perPage);
    const [bodyTableData, setBodyTableData] = useState<any[]>([]);

    useEffect(() => {
        const formattedToTableBodyData = financeItem?.map((report: FinanceReportItem, i) => {
            const date = new Date(report.created_at);
            const description = report.description;
            return {
                no: i + 1,
                date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
                description,
                debit: report.debit,
                credit: report.credit,
                balance: report.balance,
                receipt: <Button>See Receipt</Button>,
                action: `reports/${report.id}`,
            };
        });
        setBodyTableData(formattedToTableBodyData || []);
    }, [financeItem]);

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

    if (
        isLoadingFinanceReport
    ) {
        return <LoadingSpinner />
    }

    return (
        <section className="space-y-6">
            <HeaderReportDetail
                title={financeReport.nd_site_profile.sitename}
                description={`Report for ${financeReport.month}/${financeReport.year}`}
                isTpFinance={isTpFinance}
                isTpSite={isTpSite}
                financeReportStatus={financeReport.nd_finance_report_status.status}
            />
            <FinanceReportDetailContent
                contentResult={bodyTableData}
                headTable={headTable}
                page={page}
                setPage={setPage}
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
}

const HeaderReportDetail = ({
    isDashBoardPage = true,
    title,
    description,
    isTpFinance,
    isTpSite,
    financeReportStatus
}: HeaderReportDetailProps) => {
    const [badgeClassName, setBadgeClassName] = useState("");

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
                    <Button className="bg-blue-100 text-blue-600 border border-blue-500 hover:bg-blue-200">
                        <StickyNote />
                        Export To CSV
                    </Button>
                    <Button className="bg-green-100 text-green-600 border border-green-500 hover:bg-green-200">
                        <FileDown />
                        Export PDF
                    </Button>
                    {(isTpFinance && financeReportStatus === "submitted") && (
                        <Button className="bg-green-500 text-white border border-green-200 hover:bg-green-600">
                            <Check />
                            Verify Report
                        </Button>
                    )}
                    {(isTpSite && financeReportStatus === "editing") && (
                        <Button className="bg-yellow-500 text-white border border-yellow-200 hover:bg-yellow-600">
                            <Send />
                            Submit Report
                        </Button>
                    )}
                </div>
            )}
        </section>
    );
};