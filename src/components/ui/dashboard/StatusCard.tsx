import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}

export default function StatusCard({ title, count, color, icon }: StatusCardProps) {
  return (
    <div className={cn(
      "rounded-lg p-4 flex flex-col h-full shadow-sm border",
      color === "blue" && "bg-blue-50 border-blue-200",
      color === "green" && "bg-green-50 border-green-200",
      color === "yellow" && "bg-amber-50 border-amber-200",
      color === "red" && "bg-red-50 border-red-200",
      color === "purple" && "bg-purple-50 border-purple-200",
      color === "gray" && "bg-gray-50 border-gray-200",
    )}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm text-gray-600">{title}</h3>
        <div className={cn(
          "p-2 rounded-full",
          color === "blue" && "bg-blue-100 text-blue-600",
          color === "green" && "bg-green-100 text-green-600",
          color === "yellow" && "bg-amber-100 text-amber-600",
          color === "red" && "bg-red-100 text-red-600",
          color === "purple" && "bg-purple-100 text-purple-600",
          color === "gray" && "bg-gray-100 text-gray-600",
        )}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold mt-2">
        {count}
      </p>
    </div>
  );
}