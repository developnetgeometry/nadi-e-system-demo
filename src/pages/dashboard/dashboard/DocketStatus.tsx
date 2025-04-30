
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/dashboard/PageContainer";
import { PageHeader } from "@/components/ui/dashboard/PageHeader";
import StatusCard from "@/components/ui/dashboard/StatusCard";
import { Calendar, CheckCircle, Clock, FileText, AlertTriangle } from "lucide-react";

export default function DocketStatus() {
    return (
        <DashboardLayout>
            {/* <PageContainer> */}
                <PageHeader
                    title="Docket Status"
                    description="Overview of current work order dockets and their statuses"
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatusCard
                        title="Open Dockets"
                        count={42}
                        color="blue"
                        icon={<FileText size={18} />}
                    />
                    <StatusCard
                        title="In Progress"
                        count={28}
                        color="yellow"
                        icon={<Clock size={18} />}
                    />
                    <StatusCard
                        title="Completed"
                        count={156}
                        color="green"
                        icon={<CheckCircle size={18} />}
                    />
                    <StatusCard
                        title="Overdue"
                        count={7}
                        color="red"
                        icon={<AlertTriangle size={18} />}
                    />
                </div>

                <div className="mt-6">
                    <Card className="p-5">
                        <h3 className="text-lg font-medium mb-4">Recent Docket Activity</h3>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-start border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                    <div className="flex-shrink-0 mr-3 p-1.5 bg-blue-50 rounded-full">
                                        <FileText size={18} className="text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Docket #{1000 + i}</p>
                                        <p className="text-sm text-slate-500">
                                            Status updated to {i % 2 === 0 ? "In Progress" : "Completed"}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {i} hour{i !== 1 ? "s" : ""} ago
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            {/* </PageContainer> */}
        </DashboardLayout>
    );
}
