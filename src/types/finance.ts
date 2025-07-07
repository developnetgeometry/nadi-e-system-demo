import { SiteProfile } from "./site";
export interface FinanceReport {
    id?: string,
    site_id: number,
    status_id: number,
    created_at: string,
    year: string,
    month: string,
    balance_forward?: number,
    nd_site_profile?: SiteProfile
    nd_finance_report_status?: FinanceReportStatus
    nd_finance_report_item?: FinanceReportItem[]
}

export interface FinanceReportItem {
    id?: string,
    description?: string,
    debit?: number,
    credit?: number,
    balance?: number,
    image_path?: string,
    doc_path?: string,
    created_at: string,
    finance_report_id?: string,
    debit_type: string,
    credit_type: string,
    nd_finance_report?: FinanceReport,
    nd_finance_income_type?:FinanceReportIncomeType,
    nd_finance_expense_type?:FinanceReportExpenseType,
    nd_pos_transaction?: PosTransaction[]
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

export interface PosTransaction {
    id: string;
    member_id: number
    type: string;
    transaction_date: string;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    remarks: string;
    finance_item_id: string;
    nd_pos_transaction_item?: PosTransactionItem[]
    nd_member_profile?: MemberProfile
}

interface MemberProfile {
    id: number;
    fullname: string;
}

export interface PosTransactionItem {
    id: string;
    transaction_id: string;
    quantity: number;
    price_per_unit: number;
    total_price: number;
    item_id?: string;
    created_at?: string;
    updated_at?: string;
    created_by: string;
    updated_by: string;
    service_id?: string;
}