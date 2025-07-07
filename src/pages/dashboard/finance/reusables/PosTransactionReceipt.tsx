import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useFinanceQueries } from "@/hooks/finance/use-finance-queries";
import { PosTransaction } from "@/types/finance";
import { FileText, Printer, ReceiptText } from "lucide-react";
import { timeStampToDateStringFormat } from "../utils/timeStampToDateStringFormat";
import { formatInvoiceId } from "../utils/formatInvoice";

interface PosTransactionReceiptProps {
    posTransactionData: PosTransaction[];
    posTransactionId: string;
    memberId: number;
    siteName: string;
}
export const PosTransactionReceipt = ({
    posTransactionId,
    memberId,
    posTransactionData,
    siteName
}: PosTransactionReceiptProps) => {

    const {
        usePosTransactionItemByTransactionId,
        useMemberProfileById
    } = useFinanceQueries();
    const { data: posTransactionItem, isLoading: posTransactionItemLoading } = usePosTransactionItemByTransactionId(posTransactionId);
    const { data: memberProfile, isLoading: memberProfileLoading } = useMemberProfileById(memberId);
    if (
        posTransactionItemLoading ||
        memberProfileLoading
    ) {
        return <LoadingSpinner />
    }

    const handlePrint = () => {
        window.print();
    };

    console.log("posTransactionItem", posTransactionItem);
    console.log("memberProfile", memberProfile);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-white text-blue-700 border border-blue-700 hover:bg-blue-200"><ReceiptText /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-center gap-2">
                        <FileText className="h-5 w-5" /> Receipt
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="text-center border-b pb-4">
                        <h3 className="font-bold text-lg">NADI 2.0 POS</h3>
                        <p className="text-sm text-muted-foreground">Kuala Lumpur, Malaysia</p>
                    </div>

                    <div className="border-b pb-2 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Receipt No:</p>
                            <p className="text-sm">{formatInvoiceId(posTransactionData[0]?.created_at)}</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Date:</p>
                            <p className="text-sm">
                                {timeStampToDateStringFormat(posTransactionData[0]?.created_at)}
                            </p>
                        </div>

                        {memberProfile && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Customer:</p>
                                <p className="text-sm">{memberProfile.fullname}</p>
                            </div>
                        )}

                        {siteName && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Site:</p>
                                <p className="text-sm">{siteName}</p>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Handled By:</p>
                            <p className="text-sm">{siteName}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm font-medium">Items:</p>
                        {posTransactionItem?.map((item, index) => (
                            <div key={index} className="flex flex-col gap-3 pb-2">
                                <div className="grid grid-cols-8">
                                    <div className="flex col-span-5 gap-2">
                                        <img
                                            src={item.inventory[0]?.nd_inventory_attachment[0]?.file_path || "/200x200.svg"}
                                            alt={item.inventory[0]?.name || 'Item'}
                                            className="w-12 h-12 object-cover rounded"
                                            onError={(e) => {
                                                e.currentTarget.src = "/200x200.svg";
                                            }}
                                        />
                                        <div>
                                            <p className="font-medium text-sm">{item.inventory[0]?.name || 'Unknown item'}</p>
                                            {item.inventory[0]?.description && (
                                                <p className="text-xs text-muted-foreground">{item.inventory[0].description}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                Unit Price: RM{item.price_per_unit?.toFixed(2) || '0.00'}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-right">{item.quantity}x</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-right">RM {item.total_price?.toFixed(2) || '0.00'}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 border-t pt-4 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>RM {posTransactionItem.reduce((total, item) => total + item.total_price, 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax (0%):</span>
                            <span>RM 0.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2">
                            <span>Total:</span>
                            <span>RM {posTransactionItem.reduce((total, item) => total + item.total_price, 0).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="space-y-2 border-t pt-4 text-sm">
                        <div className="flex justify-between">
                            <span>Payment Method:</span>
                            <span className="capitalize">{posTransactionData[0]?.type || 'Cash'}</span>
                        </div>
                    </div>

                    {posTransactionData[0]?.remarks && (
                        <div className="border-t pt-4">
                            <p className="text-sm font-medium">Remarks:</p>
                            <p className="text-sm text-muted-foreground">{posTransactionData[0]?.remarks}</p>
                        </div>
                    )}

                    <div className="text-center text-sm border-t pt-4">
                        <p>Thank you for your purchase!</p>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        variant="secondary"
                        className="border print:hidden"
                        onClick={handlePrint}
                    >
                        <Printer className="h-5 w-5" />
                        Print
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}