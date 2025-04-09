
import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LookupItem } from "../types";
import { FieldDefinition } from "./types";
import { TableRowNumber } from "@/components/ui/TableRowNumber";

interface LookupTableProps {
  items: LookupItem[];
  isLoading: boolean;
  fields: FieldDefinition[];
  onEdit: (item: LookupItem) => void;
  onDelete: (item: LookupItem) => void;
}

export const LookupTable = ({
  items,
  isLoading,
  fields,
  onEdit,
  onDelete,
}: LookupTableProps) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] text-center">No.</TableHead>
            {fields.map((field) => (
              <TableHead key={field.name}>{field.label}</TableHead>
            ))}
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={fields.length + 2} className="text-center py-8">
                Loading...
              </TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={fields.length + 2} className="text-center py-8">
                No items found
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow key={item.id}>
                <TableRowNumber index={index} />
                {fields.map((field) => (
                  <TableCell key={`${item.id}-${field.name}`}>
                    {item[field.name] || "-"}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
