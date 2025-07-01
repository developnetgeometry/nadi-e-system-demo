import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Download, Eye, FileIcon, Image, Printer, Receipt, ReceiptText } from "lucide-react";

interface FinanceItemReceiptProps {
  id: string;
  siteName: string;
  debit: number;
  credit: number;
  balance: number;
  image: string;
  date: string;
  doc: string;
}

export const FinanceItemReceipt: React.FC<FinanceItemReceiptProps> = ({
  id,
  siteName,
  debit,
  credit,
  balance,
  image,
  doc,
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
      <DialogContent className="max-w-md max-h-screen space-y-4 overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-1"><Receipt className="h-5 w-5" />Receipt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4" style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
          <h1 className="text-2xl font-bold text-center">NADI</h1>
          <hr className="border-gray-400" />
          <p className="flex items-center justify-between">Site Name: <p>{siteName}</p></p>
          <p className="flex items-center justify-between">Date: <p>{format(new Date(date), "dd/MM/yyyy")}</p></p>
          <p className="flex items-center justify-between">ID: <p>{id}</p></p>
          <hr className="border-gray-300" />
          <p className="flex items-center justify-between">Debit: <p>{`RM ${debit.toFixed(2)}`}</p></p>
          <p className="flex items-center justify-between">Credit: <p>{`RM ${credit.toFixed(2)}`}</p></p>
          <p className="flex items-center justify-between">Balance: <p>{`RM ${balance.toFixed(2)}`}</p></p>
          <hr className="border-gray-300" />
          <p className="flex items-center justify-between">
            Image
            {image ? (
              <a href={image} className="p-2 rounded-md w-fit border border-gray-300 bg-white hover:bg-white text-black flex items-center gap-2" target="_blank">
                <Image className="h-4 w-4 text-green-400" />
                {`Image`}
                <Eye className="text-gray-400 h-4 w-4" />
              </a>
            ) : (
              <p>-</p>
            ) }
          </p>
          <p className="flex items-center justify-between">
            Document
            {doc ? (
              <a href={doc} className="p-2 rounded-md w-fit border border-gray-300 bg-white hover:bg-white text-black flex items-center gap-2" target="_blank">
                <FileIcon className="h-4 w-4 text-green-400" />
                {`Document`}
                <Eye className="text-gray-400 h-4 w-4" />
              </a>
            ) : (
              <p>-</p>
            ) }
          </p>
          <hr className="border-gray-300" />
          <p className="text-center">Thank you for your business!</p>
        </div>
        <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" />Print</Button>
      </DialogContent>
    </Dialog>
  );
};


