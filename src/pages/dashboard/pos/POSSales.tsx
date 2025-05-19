import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog";

import { Inventory } from "@/types/inventory";
import { Transaction } from "@/types/transaction";
// import { Profile } from "@/types/auth";

import { Check, ChevronsUpDown, User, Search, CreditCard, Trash2, Plus, Clock, ShoppingCart, Box, QrCode, Banknote, Minus } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import { useEffect, useState, useMemo } from "react";

const POSSales = () => {
  const [searchItem, setSearchItem] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false);
  const [isResetConfirmDialogOpen, setIsResetConfirmDialogOpen] = useState(false);
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [isShowCashPayment, setIsShowCashPayment] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [cashAmount, setCashAmount] = useState<number>();
  const { toast } = useToast();

  const [cartItems, setCartItems] = useState<Array<{
    id: string | number;
    type_id: string | number;
    name: string;
    quantity: number;
    price: number;
    total: number;
    barcode: string | number;
  }>>([]);

  // Fetch inventory data
  const { data: inventorys, isLoading: loadingInventorys } = useQuery({
    queryKey: ['inventorys', searchItem],
    queryFn: async () => {
      let query = supabase
        .from('nd_inventory')
        .select('*')

      if (searchItem) {
        query = query.or(`name.ilike.%${searchItem}%,description.ilike.%${searchItem}%`)
      }

      query = query.order('created_at', { ascending: false });
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching inventories:", error);
        throw error;
      }
      return data;
    },
  });

  // Fetch members data
  const { data: membersData, isLoading: loadingMembersData } = useQuery({
    queryKey: ["members", searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("nd_member_profile")
        .select("*", { count: 'exact' })
        // .eq('user_type', 'member')

      if (searchTerm) {
        query = query.or(`fullname.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,identity_no.ilike.%${searchTerm}%`)
      }

      query = query.order('created_at', { ascending: false });
      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching members:", error);
        throw error;
      }
      return { data: data, count: count || 0 };
    },
  });

  const resetSale = () => {
    setCartItems([]);
    setSelectedMember(null);
    setSearchTerm("");
  };

  const handleSearchChange = (value: string) => {
    setSearchItem(value || "");
  };

  const getInventoryStock = (itemId: string | number) => {
    const inventoryItem = inventorys?.find(inv => inv.id === itemId);
    return inventoryItem ? inventoryItem.quantity : 0;
  }

  const updateCartItemQuantity = (itemId: string | number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const inventoryItem = inventorys?.find(inv => inv.id === itemId);
    if(!inventoryItem) return;

    if(newQuantity > inventoryItem.quantity) {
      toast({
        title: "Quantity limit exceeded",
        description: `Only ${inventoryItem.quantity} items available in stock.`,
        variant: "destructive",
      });
      return;
    }

    const updatedItems = cartItems.map(item => {
      if(item.id === itemId) {
        return {
          ...item,
          quantity: newQuantity,
          total: newQuantity * item.price
        };
      }
      return item;
    });

    setCartItems(updatedItems);
  }

  const addToCart = (inventory: Inventory) => {
    if (inventory) {
      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(item => item.id === inventory.id);
      
      if (existingItemIndex >= 0) {
        // Calculate how many more items can be added based on what's already in cart
        const currentQtyInCart = cartItems[existingItemIndex].quantity;
        const availableQtyToAdd = inventory.quantity - currentQtyInCart;
        
        // If there's not enough quantity available, show an error
        if (availableQtyToAdd < itemQuantity) {
          toast({
            title: `Fail to add ${inventory.name}`,
            description: `${inventory.name} quantity has reached max.`,
            variant: "destructive",
          });
          return;
        }

        // Update quantity if item already exists
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity += itemQuantity;
        updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
        setCartItems(updatedItems);

        toast({
          title: `${inventory.name} updated successfully`,
          description: `${inventory.name} has been updated in the cart.`,
          variant: "success",
        });
      } else {
        // Add new item to cart
        const newItem = {
          id: inventory.id,
          type_id: inventory.type_id,
          barcode: '-',
          name: inventory.name,
          quantity: itemQuantity,
          price: inventory.price,
          total: itemQuantity * inventory.price
        };
        setCartItems([...cartItems, newItem]);

        toast({
          title: `${inventory.name} added successfully`,
          description: `${inventory.name} has been added in the cart.`,
          variant: "success",
        });
      }
    }
  };

  const handleRemoveCartItem = (itemId: string | number, itemName: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));

    toast({
      title: `${itemName} removed successfully`,
      description: `${itemName} has been removed in the cart.`,
      variant: "success",
    });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateTotal = (subtotal: number) => {
    return subtotal;
  };

  const subtotal = useMemo(() => {
    return calculateSubtotal();
  }, [cartItems]);

  const total = useMemo(() => {
    return calculateTotal(subtotal);
  }, [subtotal, 0]);

  const handlePaymentQR = () => {
    setIsPayDialogOpen(false);
    handlePaySales();
  }

  const handlePaymentCash = () => {
    setIsShowCashPayment(true);
  }

  const handlePaySales = async () => {
    try {
      let userId = null;
      try {
        const storedUserMetadata = localStorage.getItem('user_metadata');
        if (storedUserMetadata) {
          const userData = JSON.parse(storedUserMetadata);
          userId = userData.group_profile?.user_id || null;
        }
      } catch (error) {
        console.error("Error retrieving user data from localStorage:", error);
      }

      const transactionData = {
        member_id: selectedMember?.id || null,
        type: isShowCashPayment ? 'cash' : 'qr',
        transaction_date: new Date().toISOString(),
        created_by: userId,
        created_at: new Date().toISOString(),
        updated_by: null,
        updated_at: null
      }

      const { data: transactionResult, error: insertTransactionError } = await supabase
        .from("nd_pos_transaction")
        .insert([transactionData])
        .select(); // To select the data to get the ID

      if (insertTransactionError) {
        throw insertTransactionError;
      }

      // Get the transaction ID
      const transactionId = transactionResult?.[0]?.id;

      if (!transactionId) {
        throw new Error("Failed to get transaction ID");
      }

      for (const item of cartItems) {
        const transactionItemData = {
          transaction_id: transactionId,
          quantity: item.quantity,
          price_per_unit: item.price,
          total_price: item.total,
          item_id: item.id,
          created_by: userId,
          created_at: new Date().toISOString(),
          updated_by: null,
          updated_at: null
        };

        const { error: insertTransactionItemError } = await supabase
          .from("nd_pos_transaction_item")
          .insert([transactionItemData]);

        if (insertTransactionItemError) {
          throw insertTransactionItemError;
        }

        const { data: inventoryData, error: getInventoryError } = await supabase
          .from("nd_inventory")
          .select("quantity")
          .eq("id", item.id)
          .single();

        if (getInventoryError) {
          throw getInventoryError;
        }

        const currentQuantity = inventoryData.quantity;
        const newQuantity = currentQuantity - item.quantity;

        if (newQuantity < 0) {
          throw new Error(`Not enough inventory for ${item.name}. Available: ${currentQuantity}`);
        }

        // Update the inventory
        const { error: updateInventoryError } = await supabase
          .from("nd_inventory")
          .update({ 
            quantity: newQuantity,
            updated_by: userId,
            updated_at: new Date().toISOString()
          })
          .eq("id", item.id);

        if (updateInventoryError) {
          throw updateInventoryError;
        }

        console.log(`Updated inventory for item ${item.id}: ${currentQuantity} → ${newQuantity}`);
      }

      setIsReceiptDialogOpen(true);
      resetSale();
    } catch (error) {
      console.error("Error processing payment:", error);

      toast({
        title: "Payment failed",
        description: "There was an error processing your payment.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if(isPayDialogOpen) {
      setIsShowCashPayment(false);
      setCashAmount(0);
    }
  }, [isPayDialogOpen]);

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            POS Management
          </h1>
          <p className="text-muted-foreground">
            Manage point of sale transactions
          </p>
        </div>
      </div>

      <div className="flex w-full space-x-6 mt-6">
        
        <div className="w-8/12 space-y-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter item name or scan barcode"
              value={searchItem}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {searchItem.length > 0 && (
            <Card className="p-4 rounded-lg shadow grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {inventorys && inventorys.length > 0 ? (
                  inventorys.map((inventory) => (
                  <Card key={inventory.id} className="hover:cursor-pointer border hover:border-[#5147dd]" onClick={() => addToCart(inventory)}>
                    <img src="/200x200.svg" alt="" className="w-full h-32 object-cover" />
                    <div className="p-2">
                      <p className="font-medium text-sm truncate">{inventory.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-semibold">RM{inventory.price}</span>
                        <Button onClick={(e) => {
                          e.stopPropagation();
                          addToCart(inventory);
                        }}>
                          +
                        </Button>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{inventory.type_id == 1 ? 'Physical' : 'Digital'}</span>
                        <span>Stock: {inventory.quantity}</span>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No items found matching "{searchItem}"
                </div>
              )}
            </Card>
          )}

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Qty.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                      No items in cart
                    </TableCell>
                  </TableRow>
                ) : (
                  cartItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          <img src="/200x200.svg" alt="" className="w-12 h-12 object-cover rounded-md" />
                          <div className="space-y-1">
                            <div className="font-medium">
                              {item.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Category: {item.type_id == 1 ? 'Physical' : 'Digital'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Barcode: {item.barcode ? item.barcode : '-'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Stock: {getInventoryStock(item.id)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">RM{item.price}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="secondary" className="w-8 h-8 text-[14px] p-0 inline-flex hover:bg-[#5147dd] hover:text-white"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-5 w-5" />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button variant="secondary" className="w-8 h-8 text-[14px] p-0 inline-flex hover:bg-[#5147dd] hover:text-white"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= getInventoryStock(item.id)}
                          >
                            <Plus className="h-5 w-5" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">RM{item.total}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleRemoveCartItem(item.id, item.name)}
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
          </Card>
        </div>

        <Card className="w-4/12 p-6 rounded-lg shadow flex flex-col">

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="" className="text-sm font-medium">Find Customer</label>
              <div className="relative flex-1">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, email or phone"
                  value={searchItem}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="border p-3 rounded-lg">
              <h3 className="text-sm font-medium mb-1">
                Customer
              </h3>
              <p className="text-sm text-muted-foreground">
                No customer selected
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Items</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between items-center text-lg font-medium border-t pt-2 mt-4">
                <span>Total</span>
                <span>RM 0.00</span>
              </div>
            </div>

            <div>
              <label htmlFor="" className="block text-sm font-medium mb-1">Remarks</label>
              <textarea name="" id="remarks" placeholder="Add any notes about this sale" className="flex min-h-[80px] w-full rounded-md 
                border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none 
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-20"
              ></textarea>
            </div>

            <div className="pt-4 border-t">
              <p className="font-medium mb-2">Payment Method</p>
              
            </div>

          </div>

          {/* <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedMember
                  ? `${selectedMember.full_name || ''} - ${selectedMember.email || ''}`
                  : "Select member..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command shouldFilter={false} className="w-full">
                <CommandInput 
                  placeholder="Search members..." 
                  value={searchTerm}
                  onValueChange={handleSearchChange}
                  className="h-9"
                />
                <CommandList className="max-h-64 overflow-auto">
                  {loadingMembersData ? (
                    <div className="py-6 text-center text-sm">Loading members...</div>
                  ) : (membersData?.data || []).length === 0 ? (
                    <CommandEmpty>No members found.</CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {(membersData?.data || []).map((member) => (
                        <CommandItem
                          key={member.id}
                          value={member.id?.toString()}
                          onSelect={() => {
                            setSelectedMember(member);
                            setSearchTerm(member.full_name || "");
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedMember?.id === member.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div>
                            <div className="font-medium">{member.fullname || 'No name'}</div>
                            <div className="text-xs text-muted-foreground">
                              {member.email || 'No email'} {member.identity_no ? `(${member.identity_no})` : ''}
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover> */}

          {/* <div className="mt-auto flex flex-col gap-2">
            <span className="flex justify-between items-center">              
              <p className="text-md">Subtotal:</p>
              <p className="text-md">RM {subtotal.toFixed(2)}</p>
            </span>
            <span className="flex justify-between items-center">              
              <p className="text-md font-semibold">Total:</p>
              <p className="text-md font-semibold">RM {total.toFixed(2)}</p>
            </span>
            <Button 
              className="mt-1 font-bold"
              onClick={() => setIsPayDialogOpen(true)}
              disabled={cartItems.length === 0}
            >
              <CreditCard className="h-5 w-5" /> Pay Now
            </Button>
          </div> */}
        </Card>

        {/* Reset Confirmation Dialog */}
        <Dialog open={isResetConfirmDialogOpen} onOpenChange={setIsResetConfirmDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Start New Sale?</DialogTitle>
              <DialogDescription>
                This will clear the current cart and customer selection. Are you sure you want to proceed?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsResetConfirmDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="default"
                onClick={() => {
                  resetSale();
                  setIsResetConfirmDialogOpen(false);
                }}
              >
                Start New Sale
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Pay Dialog */}
        <Dialog open={isPayDialogOpen} onOpenChange={setIsPayDialogOpen}>
          {isShowCashPayment 
          ? (
            <DialogContent className="sm:max-w-md">
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="cashAmount">Payment Amount:</Label>
                  <Input 
                    id="cashAmount" 
                    type="number" 
                    placeholder="Enter amount" 
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={cashAmount}
                    onChange={(e) => {
                      const amount = parseFloat(e.target.value);
                      setCashAmount(amount);
                    }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-md">Total Amount:</Label>
                  <p className="text-md font-bold">RM {total.toFixed(2)}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Label className="text-md">Balance:</Label>
                  <p className="text-md font-bold">RM { cashAmount ? (cashAmount - total).toFixed(2) : 0}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsShowCashPayment(false)}
                >
                  Back
                </Button>
                <Button 
                  variant="default"
                  onClick={() => {
                    setIsPayDialogOpen(false);
                    handlePaySales();
                  }}
                  disabled={cashAmount < total || !cashAmount}
                >
                  Confirm Payment
                </Button>
              </div>
            </DialogContent>
          ) : (
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Payment Method</DialogTitle>
                <DialogDescription>
                  Choose your payment method.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center gap-4 my-4">
                <Button 
                  className="flex flex-col w-fit h-fit items-center justify-center py-5 px-9 gap-4"
                  variant="outline" 
                  onClick={() => handlePaymentQR()}
                >
                  <QrCode className="!h-12 !w-12" /> QR
                </Button>
                <Button 
                  className="flex flex-col w-fit h-fit items-center justify-center py-5 px-9 gap-4"
                  variant="outline"
                  onClick={() => handlePaymentCash()}
                >
                  <Banknote className="!h-12 !w-12" /> Cash
                </Button>
              </div>
            </DialogContent>
          )}
        </Dialog>

        {/* Receipt Dialog */}
        <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Payment successful!</DialogTitle>
              <DialogDescription>
                Your transaction has been completed.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center gap-4 my-4">
              <Button 
                className="flex flex-col w-fit h-fit items-center justify-center py-5 px-9 gap-4"
                variant="default" 
                onClick={() => setIsReceiptDialogOpen(false)}
              >
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

export default POSSales;