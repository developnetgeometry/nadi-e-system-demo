import { HeaderDashBoard } from "../FinanceDashboard"
import { FinanceYearlyContent } from "../reusables/FinanceYearlyContent"


export const FinanceYearlyReport = () => {
    return (
        <section className="space-y-7">
            <HeaderDashBoard 
                title="Yearly Financial Report"
                description="View and export yearly financial summaries by site." 
                isDashBoardPage={false}
            />
            <FinanceYearlyContent />
        </section>
    )
}