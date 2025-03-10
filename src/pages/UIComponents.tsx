
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Search, Check, ChevronsUpDown, Loader2, Copy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(160).optional(),
  notifications: z.boolean().default(false),
  accountType: z.enum(["personal", "business", "education"], {
    required_error: "Please select an account type.",
  }),
  preferredContact: z.enum(["email", "phone", "post"], {
    required_error: "Please select a preferred contact method.",
  }),
});

type CodeSnippet = {
  title: string;
  component: React.ReactNode;
  code: string;
  description: string;
};

const UIComponents = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      notifications: false,
      accountType: "personal",
      preferredContact: "email",
    },
  });

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    alert("Form submitted! Check console for values.");
  };

  const codeSnippets: CodeSnippet[] = [
    {
      title: "Button",
      description: "Various button styles for different actions",
      component: (
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button>
            <ArrowRight className="mr-2 h-4 w-4" /> With Icon
          </Button>
        </div>
      ),
      code: `<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button disabled>Disabled</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button>
  <ArrowRight className="mr-2 h-4 w-4" /> With Icon
</Button>`,
    },
    {
      title: "Input",
      description: "Text input fields for user data entry",
      component: (
        <div className="grid w-full gap-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Email" />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" placeholder="Password" />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="disabled">Disabled</Label>
            <Input disabled id="disabled" placeholder="Disabled" />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="with-icon">With Icon</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="with-icon"
                placeholder="Search..."
                className="pl-8"
              />
            </div>
          </div>
        </div>
      ),
      code: `<div className="grid w-full items-center gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
</div>

<div className="relative">
  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
  <Input id="with-icon" placeholder="Search..." className="pl-8" />
</div>`,
    },
    {
      title: "Select",
      description: "Dropdown selection menus for choosing options",
      component: (
        <div className="grid w-full gap-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="framework">Framework</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="vue">Vue</SelectItem>
                <SelectItem value="angular">Angular</SelectItem>
                <SelectItem value="svelte">Svelte</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="disabled-select">Disabled</Label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select a value" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Option 1</SelectItem>
                <SelectItem value="2">Option 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
      code: `<Label htmlFor="framework">Framework</Label>
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a framework" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="react">React</SelectItem>
    <SelectItem value="vue">Vue</SelectItem>
    <SelectItem value="angular">Angular</SelectItem>
    <SelectItem value="svelte">Svelte</SelectItem>
  </SelectContent>
</Select>`,
    },
    {
      title: "Textarea",
      description: "Multi-line text input for longer content",
      component: (
        <div className="grid w-full gap-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here."
              className="min-h-[100px]"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="disabled-textarea">Disabled</Label>
            <Textarea
              id="disabled-textarea"
              placeholder="Disabled textarea"
              disabled
            />
          </div>
        </div>
      ),
      code: `<div className="grid w-full items-center gap-1.5">
  <Label htmlFor="message">Message</Label>
  <Textarea
    id="message"
    placeholder="Type your message here."
    className="min-h-[100px]"
  />
</div>`,
    },
    {
      title: "Checkbox",
      description: "Checkboxes for multiple selections and toggles",
      component: (
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled" disabled />
            <Label htmlFor="disabled" className="text-muted-foreground">
              Disabled
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="checked-disabled" disabled defaultChecked />
            <Label htmlFor="checked-disabled" className="text-muted-foreground">
              Disabled checked
            </Label>
          </div>
        </div>
      ),
      code: `<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>`,
    },
    {
      title: "Switch",
      description: "Toggle switches for binary options",
      component: (
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">Airplane Mode</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="disabled" disabled />
            <Label htmlFor="disabled" className="text-muted-foreground">
              Disabled
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="checked-disabled" disabled defaultChecked />
            <Label
              htmlFor="checked-disabled"
              className="text-muted-foreground"
            >
              Disabled checked
            </Label>
          </div>
        </div>
      ),
      code: `<div className="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>`,
    },
    {
      title: "Form with Validation",
      description: "Complete form with validation using React Hook Form and Zod",
      component: (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full max-w-md"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your full name here.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Max 160 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Notifications
                    </FormLabel>
                    <FormDescription>
                      Receive emails about account activity.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit Form
            </Button>
          </form>
        </Form>
      ),
      code: `const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  bio: z.string().max(160).optional(),
  notifications: z.boolean().default(false),
  accountType: z.enum(["personal", "business", "education"], {
    required_error: "Please select an account type.",
  }),
});

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: "",
    email: "",
    bio: "",
    notifications: false,
    accountType: "personal",
  },
});

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Your name" {...field} />
          </FormControl>
          <FormDescription>Enter your full name here.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    
    {/* More form fields... */}
    
    <Button type="submit">Submit Form</Button>
  </form>
</Form>`,
    },
    {
      title: "Card",
      description: "Card components for content organization",
      component: (
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>
        </div>
      ),
      code: `<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>`,
    },
    {
      title: "Input Groups",
      description: "Grouped input fields for related information",
      component: (
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-1">
              <Label htmlFor="firstname">First name</Label>
              <Input id="firstname" placeholder="First name" />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="lastname">Last name</Label>
              <Input id="lastname" placeholder="Last name" />
            </div>
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input placeholder="Search..." />
            <Button type="submit">Search</Button>
          </div>
        </div>
      ),
      code: `<div className="grid grid-cols-2 gap-2">
  <div className="grid gap-1">
    <Label htmlFor="firstname">First name</Label>
    <Input id="firstname" placeholder="First name" />
  </div>
  <div className="grid gap-1">
    <Label htmlFor="lastname">Last name</Label>
    <Input id="lastname" placeholder="Last name" />
  </div>
</div>

<div className="flex w-full max-w-sm items-center space-x-2">
  <Input placeholder="Search..." />
  <Button type="submit">Search</Button>
</div>`,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-10 space-y-2">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Link>
            </Button>
          </div>
          <h1 className="text-4xl font-bold">UI Components Showcase</h1>
          <p className="text-muted-foreground">
            A collection of reusable UI components for quick reference and usage
          </p>
        </div>

        <div className="grid gap-8">
          {codeSnippets.map((snippet, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{snippet.title}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(snippet.code, index)}
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="h-4 w-4 mr-1" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" /> Copy Code
                      </>
                    )}
                  </Button>
                </div>
                <CardDescription>{snippet.description}</CardDescription>
              </CardHeader>
              <CardContent className="border-t border-b p-6 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-center">
                  {snippet.component}
                </div>
              </CardContent>
              <CardContent className="p-6 pt-4">
                <pre className="overflow-x-auto rounded-lg bg-black p-4 text-sm text-white">
                  <code>{snippet.code}</code>
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UIComponents;
