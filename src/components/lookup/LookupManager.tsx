
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LookupTable } from "./manager/LookupTable";
import { AddDialog } from "./manager/AddDialog";
import { EditDialog } from "./manager/EditDialog";
import { DeleteDialog } from "./manager/DeleteDialog";
import { LookupItem } from "./types";
import { FieldDefinition } from "./manager/types";

interface LookupManagerProps {
  title: string;
  items: LookupItem[];
  isLoading: boolean;
  fields: FieldDefinition[];
  onAdd: (data: any) => Promise<void>;
  onUpdate: (id: number, data: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  displayField?: string;
}

export const LookupManager = ({
  title,
  items,
  isLoading,
  fields,
  onAdd,
  onUpdate,
  onDelete,
  displayField = "name",
}: LookupManagerProps) => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LookupItem | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({});
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (item: LookupItem) => {
    setSelectedItem(item);
    const initialData: Record<string, string> = {};
    fields.forEach(field => {
      initialData[field.name] = item[field.name] || '';
    });
    setFormData(initialData);
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (item: LookupItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    try {
      await onAdd(formData);
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Item added successfully",
      });
    } catch (error) {
      console.error("Error adding item:", error);
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    try {
      await onUpdate(selectedItem.id, formData);
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await onDelete(selectedItem.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button onClick={handleOpenAddDialog}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      <LookupTable
        items={items}
        isLoading={isLoading}
        fields={fields}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
      />

      <AddDialog
        title={title}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        fields={fields}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleAdd}
      />

      <EditDialog
        title={title}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        fields={fields}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleUpdate}
      />

      <DeleteDialog
        title={title}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedItem={selectedItem}
        displayField={displayField}
        onDelete={handleDelete}
      />
    </div>
  );
};
