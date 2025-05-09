import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showSuperAdminColumns?: boolean;
}

export function TableSkeleton({ 
  rows = 5, 
  columns = 7,
  showSuperAdminColumns = false
}: TableSkeletonProps) {
  const totalColumns = showSuperAdminColumns ? columns + 1 : columns;
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Skeleton className="h-4 w-4" />
          </TableHead>
          <TableHead className="w-[60px]">No.</TableHead>
          <TableHead>
            <div className="flex items-center">
              <Skeleton className="h-4 w-16" />
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center">
              <Skeleton className="h-4 w-16" />
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center">
              <Skeleton className="h-4 w-16" />
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center">
              <Skeleton className="h-4 w-16" />
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center">
              <Skeleton className="h-4 w-16" />
            </div>
          </TableHead>
          {showSuperAdminColumns && (
            <TableHead>
              <div className="flex items-center">
                <Skeleton className="h-4 w-16" />
              </div>
            </TableHead>
          )}
          <TableHead>
            <Skeleton className="h-4 w-16" />
          </TableHead>
          <TableHead>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array(rows)
          .fill(0)
          .map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-6" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-40" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              {showSuperAdminColumns && (
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
              )}
              <TableCell>
                <Skeleton className="h-6 w-24 rounded-full" />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}