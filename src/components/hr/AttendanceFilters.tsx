
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterIcon, X, Search, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FilterOption {
  id: string | number;
  name: string;
}

interface AttendanceFiltersProps {
  siteFilter: string;
  setSiteFilter: (value: string) => void;
  tpFilter: string;
  setTpFilter: (value: string) => void;
  duspFilter: string;
  setDuspFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  sites: FilterOption[];
  tpOptions: FilterOption[];
  duspOptions: FilterOption[];
  onApplyFilters: () => void;
  onClearFilters: () => void;
  loading?: boolean;
}

export const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  siteFilter,
  setSiteFilter,
  tpFilter,
  setTpFilter,
  duspFilter,
  setDuspFilter,
  statusFilter,
  setStatusFilter,
  sites,
  tpOptions,
  duspOptions,
  onApplyFilters,
  onClearFilters,
  loading = false
}) => {
  const hasActiveFilters = siteFilter && siteFilter !== 'all' || 
                          tpFilter && tpFilter !== 'all' || 
                          duspFilter && duspFilter !== 'all' || 
                          statusFilter && statusFilter !== 'all';

  const statusOptions = [
    { id: 'all', name: 'All Status' },
    { id: 'present', name: 'Present' },
    { id: 'absent', name: 'Absent' },
    { id: 'checked_in', name: 'Checked In Only' }
  ];

  return (
    <Card className="shadow-sm border-gray-200 bg-gradient-to-r from-gray-50 to-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FilterIcon className="h-5 w-5 text-blue-600" />
          Filter Attendance Records
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Site</label>
            <Select value={siteFilter || 'all'} onValueChange={setSiteFilter}>
              <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={String(site.id)}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">TP (Technology Partner)</label>
            <Select value={tpFilter || 'all'} onValueChange={setTpFilter}>
              <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select TP" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All TP</SelectItem>
                {tpOptions.map((tp) => (
                  <SelectItem key={tp.id} value={String(tp.id)}>
                    {tp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">DUSP</label>
            <Select value={duspFilter || 'all'} onValueChange={setDuspFilter}>
              <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select DUSP" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All DUSP</SelectItem>
                {duspOptions.map((dusp) => (
                  <SelectItem key={dusp.id} value={String(dusp.id)}>
                    {dusp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Attendance Status</label>
            <Select value={statusFilter || 'all'} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Active Filters:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {siteFilter && siteFilter !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200">
                  Site: {sites.find(s => String(s.id) === siteFilter)?.name}
                  <button 
                    onClick={() => setSiteFilter('all')} 
                    className="ml-1 hover:bg-blue-300 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {tpFilter && tpFilter !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200">
                  TP: {tpOptions.find(t => String(t.id) === tpFilter)?.name}
                  <button 
                    onClick={() => setTpFilter('all')} 
                    className="ml-1 hover:bg-green-300 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {duspFilter && duspFilter !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-purple-100 text-purple-800 hover:bg-purple-200">
                  DUSP: {duspOptions.find(d => String(d.id) === duspFilter)?.name}
                  <button 
                    onClick={() => setDuspFilter('all')} 
                    className="ml-1 hover:bg-purple-300 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {statusFilter && statusFilter !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-orange-100 text-orange-800 hover:bg-orange-200">
                  Status: {statusOptions.find(s => s.id === statusFilter)?.name}
                  <button 
                    onClick={() => setStatusFilter('all')} 
                    className="ml-1 hover:bg-orange-300 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {hasActiveFilters ? 'Filters applied to results' : 'No filters applied'}
          </div>
          
          <div className="flex gap-3">
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={onClearFilters} 
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4" />
                Clear All
              </Button>
            )}
            <Button 
              onClick={onApplyFilters} 
              disabled={loading} 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Search className="h-4 w-4" />
              {loading ? 'Applying...' : 'Apply Filters'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
