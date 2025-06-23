import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Printer, ReceiptText } from "lucide-react";

interface FinanceItemReceiptProps {
  id: string;
  siteName: string;
  debit: number;
  credit: number;
  balance: number;
  image: string;
  date: string;
}

export const FinanceItemReceipt: React.FC<FinanceItemReceiptProps> = ({
  id,
  siteName,
  debit,
  credit,
  balance,
  image,
  date,
}) => {
  
  const handlePrint = () => {
    window.print();
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-white text-blue-700 border border-blue-700 hover:bg-blue-200"><ReceiptText /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Receipt</DialogTitle>
        </DialogHeader>
        <div style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
          <img src={image} alt="Receipt Image" style={{ width: "100%" }} />
          <p>----------------------------------- </p>
          <p>Site Name: {siteName}</p>
          <p>Date: {format(new Date(date), "dd/MM/yyyy")}</p>
          <p>ID: {id}</p>
          <p>----------------------------------- </p>
          <p>Debit: ${debit.toFixed(2)}</p>
          <p>Credit: ${credit.toFixed(2)}</p>
          <p>Balance: ${balance.toFixed(2)}</p>
          <p>----------------------------------- </p>
          <p>Thank you for your business!</p>
        </div>
        <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4"/>Print</Button>
      </DialogContent>
    </Dialog>
  );
};


