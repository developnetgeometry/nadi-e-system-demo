import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SelectOne } from "@/components/ui/SelectOne";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog";

import { Inventory } from "@/types/inventory";
import { Transaction } from "@/types/transaction";
// import { Profile } from "@/types/auth";

import { User, Search, CreditCard, Trash2, Plus, QrCode, Banknote, Minus, Receipt, FileText, Printer } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import { useEffect, useState, useMemo } from "react";

const POSSales = () => {
  const [searchItem, setSearchItem] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [isPaymentAmountDialogOpen, setIsPaymentAmountDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [cashAmount, setCashAmount] = useState<number>();
  const [remarks, setRemarks] = useState<string>("");
  const [receipt, setReceipt] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<(string | number | null)>('cash');
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [printOptions, setPrintOptions] = useState({
    type: 'bw', // 'bw' or 'color'
    pricePerPage: 0.10,
    numberOfPages: 1,
    subtotal: 0.10
  });
  const [printingItem, setPrintingItem] = useState<Inventory | null>(null);
  const [editingCartItemIndex, setEditingCartItemIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const [cartItems, setCartItems] = useState<Array<{
    id: string | number;
    type_id: string | number;
    name: string;
    quantity: number;
    price: number;
    total: number;
    barcode: string | number;
    description?: string;
    isPrintingService?: boolean;
  }>>([]);

  const paymentMethodOption = [
    { id: 'cash', label: 'Cash' },
    { id: 'qr', label: 'QR' }
  ];

  // Fetch inventory data
  const { data: inventorys, isLoading: loadingInventorys } = useQuery({
    queryKey: ['inventorys', searchItem],
    queryFn: async () => {
      let query = supabase
        .from('nd_inventory')
        .select('*')

      if (searchItem) {
        query = query.or(`name.ilike.%${searchItem}%,description.ilike.%${searchItem}%,barcode.ilike.%${searchItem}%`)
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
    setSelectedPaymentMethod('cash');
    setRemarks("");
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
      // Check if it's a printing service
      if (inventory.name.toLowerCase().includes('printing')) {
        setPrintingItem(inventory);
        setIsPrintDialogOpen(true);
        return;
      }

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
          barcode: inventory.barcode,
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
      setSearchItem("");
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

  const handlePayment = () => {
    if(cartItems.length === 0) {
      toast({
        title: 'Please add items to the cart',
      });
      return;
    }
    setIsPaymentAmountDialogOpen(true);
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
        type: selectedPaymentMethod,
        transaction_date: new Date().toISOString(),
        created_by: userId,
        created_at: new Date().toISOString(),
        updated_by: null,
        updated_at: null,
        remarks: remarks || null,
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

      setReceipt({
        id: transactionId,
        date: transactionResult[0].transaction_date,
        items: cartItems,
        customer: selectedMember,
        paymentMethod: selectedPaymentMethod,
        remarks: remarks,
        subtotal: subtotal,
        tax: 0,
        total: total,
        paymentAmount: cashAmount,
        balance: cashAmount - total
      });

      toast({
        title: "Payment completed succesfully",
        variant: "success",
      });

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

  const formatReceiptDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handlePrintOptionsChange = (field: string, value: any) => {
    setPrintOptions(prev => {
      const updated = { ...prev, [field]: value };
      
      // Calculate subtotal
      if (field === 'type' || field === 'pricePerPage' || field === 'numberOfPages') {
        const price = field === 'type' ? 
          (value === 'color' ? 0.10 : 0.10) :
          (field === 'pricePerPage' ? value : prev.pricePerPage);
        
        const pages = field === 'numberOfPages' ? value : prev.numberOfPages;
        updated.subtotal = parseFloat((price * pages).toFixed(2));
        
        if (field === 'type') {
          updated.pricePerPage = value === 'color' ? 0.10 : 0.10;
        }
      }
      
      return updated;
    });
  };

  const addPrintingToCart = () => {
    if (printingItem) {
      const description = `${printOptions.type === 'bw' ? 'B&W' : 'Color'} - RM${printOptions.pricePerPage.toFixed(2)}/page × ${printOptions.numberOfPages} pages`;
      
      const newItem = {
        id: printingItem.id,
        type_id: printingItem.type_id,
        barcode: printingItem.barcode,
        name: printingItem.name,
        description: description,
        quantity: 1,
        price: printOptions.subtotal,
        total: printOptions.subtotal,
        isPrintingService: true
      };
      
      if (editingCartItemIndex !== null && editingCartItemIndex >= 0) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[editingCartItemIndex] = newItem;
        setCartItems(updatedCartItems);
        
        toast({
          title: `${printingItem.name} updated successfully`,
          variant: "success",
        });
        
        setEditingCartItemIndex(null);
      } 
      // If adding a new item
      else {
        setCartItems([...cartItems, newItem]);
        
        toast({
          title: `${printingItem.name} added successfully`,
          variant: "success",
        });
      }
      
      setIsPrintDialogOpen(false);
      setPrintingItem(null);
      setSearchItem("");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if(!isPaymentAmountDialogOpen) {
      setCashAmount(null);
    }
  }, [isPaymentAmountDialogOpen]);

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">POS Management</h1>
          <p className="text-muted-foreground">Manage point of sale transactions</p>
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
                        <div className="flex flex-col justify-end space-y-2">
                          <div className="space-x-2">
                            <Button variant="secondary" className="w-8 h-8 text-[14px] p-0 inline-flex hover:bg-[#5147dd] hover:text-white border"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-5 w-5" />
                            </Button>
                            <span>{item.quantity}</span>
                            <Button variant="secondary" className="w-8 h-8 text-[14px] p-0 inline-flex hover:bg-[#5147dd] hover:text-white border"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= getInventoryStock(item.id)}
                            >
                              <Plus className="h-5 w-5" />
                            </Button>
                          </div>
                          <div>
                            {item.isPrintingService && item.description && (
                              <Button variant="secondary" className="text-xs py-0 px-2 inline-flex hover:bg-[#5147dd] hover:text-white border"
                                onClick={() => {
                                  // Find the index of this item in the cart
                                  const itemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
                                  if (itemIndex !== -1) {
                                    setEditingCartItemIndex(itemIndex);
                                    
                                    const description = item.description || '';
                                    const isBW = description.includes('B&W');
                                    const priceMatch = description.match(/RM([\d.]+)\/page/);
                                    const pagesMatch = description.match(/(\d+) pages/);
                                    
                                    setPrintOptions({
                                      type: isBW ? 'bw' : 'color',
                                      pricePerPage: priceMatch ? parseFloat(priceMatch[1]) : 0.10,
                                      numberOfPages: pagesMatch ? parseInt(pagesMatch[1]) : 1,
                                      subtotal: item.price
                                    });
                                    
                                    setPrintingItem({
                                      id: item.id,
                                      type_id: item.type_id,
                                      name: item.name,
                                      barcode: item.barcode,
                                      price: item.price,
                                      quantity: item.quantity,
                                    } as Inventory);
                                    
                                    setIsPrintDialogOpen(true);
                                  }
                                }}
                              >
                                <Printer className="h-5 w-5" /> {item.description}
                              </Button>
                            )}
                          </div>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Customer dropdown */}
              {searchTerm && membersData?.data && membersData.data.length > 0 && (
                <div className="max-h-40 overflow-y-auto border rounded-md bg-background">
                  {membersData.data.map((member) => (
                    <div
                      key={member.id}
                      className="p-2 hover:bg-accent cursor-pointer border-b last:border-b-0"
                      onClick={() => {
                        setSelectedMember(member);
                        setSearchTerm("");
                      }}
                    >
                      <div className="font-medium text-sm">{member.fullname || 'No name'}</div>
                      <div className="text-xs text-muted-foreground">{member.email || 'No email'}</div>
                      <div className="text-xs text-muted-foreground">{member.identity_no || 'No ID'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium mb-1">Customer</h3>
                  {selectedMember ? (
                    <div>
                      <p className="text-sm font-medium">{selectedMember.fullname || 'No name'}</p>
                      <p className="text-xs text-muted-foreground">{selectedMember.email || 'No email'}</p>
                      <p className="text-xs text-muted-foreground">{selectedMember.identity_no || 'No ID'}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No customer selected</p>
                  )}
                </div>
                {selectedMember && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedMember(null)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Items</span>
                <span className="font-medium">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-medium border-t pt-2 mt-4">
                <span>Total</span>
                <span>RM {total.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label htmlFor="" className="block text-sm font-medium mb-1">Remarks</label>
              <textarea name="" id="remarks" placeholder="Add any notes about this sale" 
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background 
                placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
                focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-20"
              ></textarea>
            </div>

            <div className="pt-4 border-t">
              <p className="font-medium mb-2">Payment Method</p>
              <SelectOne
                options={paymentMethodOption}
                value={selectedPaymentMethod}
                onChange={setSelectedPaymentMethod}
                placeholder="Select payment method"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button onClick={handlePayment}><CreditCard className="h-5 w-5"/> Payment</Button>
            <Button onClick={() => setIsReceiptDialogOpen(true)} disabled={!receipt}><Receipt className="h-5 w-5" /> Receipt</Button>
          </div>
        </Card>

        {/* Payment Dialog */}
        <Dialog open={isPaymentAmountDialogOpen} onOpenChange={setIsPaymentAmountDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 py-2">
              <div className="space-y-2">
                <Label htmlFor="cashAmount">Payment Amount:</Label>
                <Input 
                  id="cashAmount" 
                  type="number" 
                  placeholder="Enter payment amount" 
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={cashAmount}
                  onChange={(e) => {
                    const amount = parseFloat(e.target.value);
                    setCashAmount(amount);
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm">Total Amount:</p>
                  <p className="text-sm font-semibold">RM {total.toFixed(2)}</p>
                </div>
                {!cashAmount ? (
                  <div></div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Balance:</p>
                    <p className={`text-sm font-semibold ${
                      cashAmount && (cashAmount - total) < 0 
                        ? 'text-danger' 
                        : 'text-success'
                    }`}>
                      RM { cashAmount ? (cashAmount - total).toFixed(2) : 0}
                      </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsPaymentAmountDialogOpen(false)}
              >
                Back
              </Button>
              <Button 
                variant="default"
                onClick={() => {
                  setIsPaymentAmountDialogOpen(false);
                  handlePaySales();
                }}
                disabled={cashAmount < total || !cashAmount}
              >
                Confirm Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Receipt Dialog */}
        <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center gap-2"><FileText className="h-5 w-5"/> Receipt</DialogTitle>
            </DialogHeader>
            {receipt && (
              <div className="space-y-4 py-4">
                {/* Receipt Header */}
                <div className="text-center border-b pb-4">
                  <h3 className="font-bold text-lg">NADI 2.0 POS</h3>
                  <p className="text-sm text-muted-foreground">Kuala Lumpur, Malaysia</p>
                </div>

                {/* Customer Info */}
                {receipt.customer && (
                  <div className="border-b pb-2 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Receipt No:</p>
                      <p className="text-sm">{receipt.id}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Date:</p>
                      <p className="text-sm">{formatReceiptDate(receipt.date)}</p>
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Items:</p>
                  {receipt.items.map((item, index) => (
                    <div key={index} className="flex flex-col gap-3 pb-2">
                      <div className="grid grid-cols-8">
                        <div className="flex col-span-5 gap-2">
                          <img src="/200x200.svg" alt="" className="w-12 h-12 object-cover rounded" />
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            {item.isPrintingService && item.description && (
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-right">{item.quantity}x</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-right">RM {item.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 border-t pt-4 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>RM {receipt.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (0%):</span>
                    <span>RM {receipt.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total:</span>
                    <span>RM {receipt.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-2 border-t pt-4 text-sm">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="capitalize">{receipt.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Amount:</span>
                    <span>RM {receipt.paymentAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Balance:</span>
                    <span className="text-success">RM {receipt.balance.toFixed(2)}</span>
                  </div>
                </div>

                {/* Remarks */}
                {receipt.remarks && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium">Remarks:</p>
                    <p className="text-sm text-muted-foreground">{receipt.remarks}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="text-center text-sm border-t pt-4">
                  <p>Thank you for your purchase!</p>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="secondary"
                className="border print:hidden"
                onClick={handlePrint}
              >
                <Printer className="h-5 w-5"/>
                Print
              </Button>
              <Button 
                variant="default" 
                onClick={() => setIsReceiptDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Printing Options Dialog */}
        <Dialog open={isPrintDialogOpen} onOpenChange={(open) => {
          setIsPrintDialogOpen(open);
          if (!open) {
            setEditingCartItemIndex(null);
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Printing Options</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label className="text-sm font-medium">Print Type</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="bw"
                      checked={printOptions.type === 'bw'}
                      onChange={() => handlePrintOptionsChange('type', 'bw')}
                      className="h-4 w-4 rounded-full"
                    />
                    <Label htmlFor="bw">Black & White</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="color"
                      checked={printOptions.type === 'color'}
                      onChange={() => handlePrintOptionsChange('type', 'color')}
                      className="h-4 w-4 rounded-full"
                    />
                    <Label htmlFor="color">Color</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="pricePerPage">Price Per Page (RM)</Label>
                <Input
                  id="pricePerPage"
                  type="number"
                  step="0.01"
                  value={printOptions.pricePerPage}
                  onChange={(e) => handlePrintOptionsChange('pricePerPage', parseFloat(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="mb-2 block">Number of Pages</Label>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handlePrintOptionsChange('numberOfPages', Math.max(1, printOptions.numberOfPages - 1))}
                    disabled={printOptions.numberOfPages <= 1}
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    className="text-center"
                    value={printOptions.numberOfPages}
                    onChange={(e) => handlePrintOptionsChange('numberOfPages', parseInt(e.target.value) || 1)}
                  />
                  <Button 
                    size="sm" 
                    onClick={() => handlePrintOptionsChange('numberOfPages', printOptions.numberOfPages + 1)}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t font-medium">
                <span>Subtotal:</span>
                <span>RM{printOptions.subtotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsPrintDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={addPrintingToCart}>
                Save Options
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

export default POSSales;