import FinanceDashboard from "../FinanceDashboard"


export const FinanceMonthlyStatement = () => {
    return (
        <FinanceDashboard
            isDashBoardPage={false}
            isExportEnabled={true}
            title="Monthly Financial Report"
            description="View and export financial statements by month."
        />
    )
}