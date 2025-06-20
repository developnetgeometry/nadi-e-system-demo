import { SiteProfile } from "./site";

export interface FinanceReport {
    id: string,
    site_id: number,
    status_id: number,
    income: number,
    expense: number,
    created_at: string,
    year: string,
    month: string,
    nd_site_profile?: SiteProfile
    nd_finance_report_status?: FinanceReportStatus
}

export interface FinanceReportItem {
    id: string,
    description: string,
    debit: number,
    credit: number,
    balance: number,
    image_path?: string,
    created_at: string,
    finance_report_id: string,
    debit_type: string,
    credit_type: string,
    nd_finance_report?: FinanceReport,
    nd_finance_income_type?:FinanceReportIncomeType,
    nd_finance_expense_type?:FinanceReportExpenseType 
}

export interface FinanceReportStatus {
    id: number,
    status: string
}

export interface FinanceReportIncomeType {
    id: number,
    name: string
}

export interface FinanceReportExpenseType {
    id: number,
    name: string
}