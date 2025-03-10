
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Bell, Info, X } from "lucide-react";

export const OverlaysExamples = () => {
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const showNotification = () => {
    setNotificationVisible(true);
    setTimeout(() => setNotificationVisible(false), 3000);
  };

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <div className="grid gap-8">
      {/* Modal Dialogs */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Modal Dialogs</h3>
        <div className="flex flex-wrap gap-4">
          {/* Basic Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>
                  This is a basic dialog that provides contextual information to the user.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>Dialog content goes here. You can put any content in this area.</p>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Alert Dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Item</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notifications</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" onClick={showNotification}>
            <Bell className="mr-2 h-4 w-4" />
            Show Notification
          </Button>
          
          <Button variant="outline" onClick={showToast}>
            <Info className="mr-2 h-4 w-4" />
            Show Toast
          </Button>
        </div>
        
        {/* Notification */}
        {notificationVisible && (
          <div className="fixed top-4 right-4 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg border p-4 animate-in slide-in-from-right">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <h4 className="font-medium text-sm">New Notification</h4>
                  <p className="text-xs text-muted-foreground">You have a new message</p>
                </div>
              </div>
              <button onClick={() => setNotificationVisible(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* Toast */}
        {toastVisible && (
          <div className="fixed bottom-4 right-4 animate-in slide-in-from-bottom">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border p-4 max-w-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Success!</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your changes have been saved successfully.
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button 
                      onClick={() => setToastVisible(false)}
                      className="inline-flex rounded-md p-1.5 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const overlaysCode = `{/* Modal Dialog */}
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        This is a basic dialog for the user.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      <p>Dialog content goes here.</p>
    </div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Save Changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

{/* Alert Dialog */}
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Item</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

{/* Notification */}
<div className="fixed top-4 right-4 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg border p-4 animate-in slide-in-from-right">
  <div className="flex justify-between items-start">
    <div className="flex items-center">
      <Bell className="h-5 w-5 text-blue-500 mr-2" />
      <div>
        <h4 className="font-medium text-sm">New Notification</h4>
        <p className="text-xs text-muted-foreground">You have a new message</p>
      </div>
    </div>
    <button className="text-muted-foreground hover:text-foreground">
      <X className="h-4 w-4" />
    </button>
  </div>
</div>`;
