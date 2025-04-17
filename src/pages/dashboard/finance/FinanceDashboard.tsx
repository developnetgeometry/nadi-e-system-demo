import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, CreditCard, ChartBar, Receipt, Wallet, FileText } from "lucide-react";
import { format } from "date-fns";

const FinanceDashboard = () => {
  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .order('date', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: budgets } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: invoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('due_date', { ascending: true })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold">Finance Management</h1>
          <p className="text-muted-foreground mt-2">
            Track financial metrics, budgets, and transactions
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transactions
                  ?.filter(t => t.type === 'income')
                  ?.reduce((sum, t) => sum + Number(t.amount), 0)
                  ?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transactions
                  ?.filter(t => t.type === 'expense')
                  ?.reduce((sum, t) => sum + Number(t.amount), 0)
                  ?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Budgets
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{budgets?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Invoices
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {invoices?.filter(i => i.status === 'sent' || i.status === 'overdue').length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Active Budgets</TabsTrigger>
            <TabsTrigger value="invoices">Pending Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <div className="grid gap-4">
              {transactions?.map((transaction) => (
                <Card key={transaction.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {transaction.description || 'Unnamed Transaction'}
                    </CardTitle>
                    <span className={`px-2 py-1 rounded text-xs ${
                      transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">
                        {Number(transaction.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="budgets" className="space-y-4">
            <div className="grid gap-4">
              {budgets?.map((budget) => (
                <Card key={budget.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{budget.name}</CardTitle>
                    <span className="text-sm text-muted-foreground">{budget.category}</span>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">
                        {Number(budget.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(budget.start_date), 'MMM dd')} - {format(new Date(budget.end_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <div className="grid gap-4">
              {invoices?.map((invoice) => (
                <Card key={invoice.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {invoice.client_name} - #{invoice.invoice_number}
                    </CardTitle>
                    <span className={`px-2 py-1 rounded text-xs ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">
                        {Number(invoice.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Due: {format(new Date(invoice.due_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FinanceDashboard;