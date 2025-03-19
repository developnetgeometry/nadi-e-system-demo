
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export type LookupItem = {
  id: number;
  name?: string;
  eng?: string;
  bm?: string;
  [key: string]: any;
};

type FieldDefinition = {
  name: string;
  label: string;
  required?: boolean;
};

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

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {fields.map((field) => (
                <TableHead key={field.name}>{field.label}</TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={fields.length + 1} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={fields.length + 1} className="text-center py-8">
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
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
                        onClick={() => handleOpenEditDialog(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleOpenDeleteDialog(item)}
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

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New {title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={`add-${field.name}`}>{field.label}</Label>
                <Input
                  id={`add-${field.name}`}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  required={field.required}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={`edit-${field.name}`}>{field.label}</Label>
                <Input
                  id={`edit-${field.name}`}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  required={field.required}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the {title.toLowerCase()} "
              {selectedItem && selectedItem[displayField]}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
