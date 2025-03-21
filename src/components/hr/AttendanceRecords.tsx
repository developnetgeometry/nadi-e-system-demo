import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, MapPin, CheckCircle, XCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getAllStaffAttendanceByDate, recordAttendance, getSiteStaff } from "@/lib/attendance";
import useStaffID from "@/hooks/use-staff-id";
import { useUserMetadata } from "@/hooks/use-user-metadata";

type AttendanceRecordsProps = {
  siteId?: number;
};

const AttendanceRecords: React.FC<AttendanceRecordsProps> = ({ siteId }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [siteStaff, setSiteStaff] = useState<any[]>([]);
  const [remarks, setRemarks] = useState<Record<number, string>>({});
  const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);
  const { toast } = useToast();
  const { staffID } = useStaffID();
  const userMetadataString = useUserMetadata();
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  
  useEffect(() => {
    if (userMetadataString) {
      try {
        const metadata = JSON.parse(userMetadataString);
        if (metadata.organization_id) {
          setOrganizationId(metadata.organization_id);
          console.log("Organization ID from metadata:", metadata.organization_id);
        }
      } catch (err) {
        console.error("Error parsing user metadata:", err);
      }
    }
  }, [userMetadataString]);
  
  const fetchAttendance = async () => {
    if (!date) return;
    
    setLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const data = await getAllStaffAttendanceByDate(formattedDate, siteId, organizationId || undefined);
      setAttendanceData(data || []);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      toast({
        title: "Error",
        description: "Failed to load attendance data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSiteStaff = async () => {
    try {
      const data = await getSiteStaff(siteId, organizationId || undefined);
      setSiteStaff(data || []);
    } catch (error) {
      console.error("Error fetching site staff:", error);
      toast({
        title: "Error",
        description: "Failed to load staff data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (organizationId) {
      fetchAttendance();
      fetchSiteStaff();
    }
  }, [date, siteId, organizationId]);

  const navigateDate = (direction: 'prev' | 'next') => {
    if (!date) return;
    
    const newDate = new Date(date);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setDate(newDate);
  };

  const handleAttendanceToggle = (staffId: number, checked: boolean) => {
    if (checked) {
      setSelectedStaffIds(prev => [...prev, staffId]);
    } else {
      setSelectedStaffIds(prev => prev.filter(id => id !== staffId));
    }
  };

  const handleRemarkChange = (staffId: number, value: string) => {
    setRemarks(prev => ({
      ...prev,
      [staffId]: value
    }));
  };

  const markAttendance = async () => {
    if (selectedStaffIds.length === 0) {
      toast({
        title: "No staff selected",
        description: "Please select at least one staff member",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const formattedDate = format(date || new Date(), 'yyyy-MM-dd');
      const currentTime = new Date().toISOString();
      
      let position: { latitude?: number; longitude?: number; address?: string } = {};
      
      try {
        if (navigator.geolocation) {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => 
            navigator.geolocation.getCurrentPosition(resolve, reject)
          );
          
          position = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
        }
      } catch (err) {
        console.warn("Geolocation not available:", err);
      }
      
      for (const staffId of selectedStaffIds) {
        const remark = remarks[staffId] || '';
        const staffItem = siteStaff.find(s => s.staff_id === staffId);
        const staffSiteId = staffItem?.site_id || siteId;
        
        if (!staffSiteId) {
          console.error(`Site ID not found for staff ${staffId}`);
          continue;
        }
        
        await recordAttendance({
          staff_id: staffId,
          site_id: staffSiteId,
          attend_date: formattedDate,
          check_in: currentTime,
          remark: remark,
          status: true,
          ...position
        });
      }
      
      toast({
        title: "Success",
        description: `Attendance marked for ${selectedStaffIds.length} staff members`,
      });
      
      fetchAttendance();
      setSelectedStaffIds([]);
      setRemarks({});
      
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markCheckout = async (id: number) => {
    setLoading(true);
    try {
      const currentTime = new Date().toISOString();
      const attendanceRecord = attendanceData.find(record => record.id === id);
      
      if (!attendanceRecord) {
        throw new Error("Attendance record not found");
      }
      
      await recordAttendance({
        staff_id: attendanceRecord.staff_id,
        site_id: attendanceRecord.site_id,
        attend_date: attendanceRecord.attend_date,
        check_out: currentTime
      });
      
      toast({
        title: "Success",
        description: "Checkout recorded successfully",
      });
      
      fetchAttendance();
      
    } catch (error) {
      console.error("Error marking checkout:", error);
      toast({
        title: "Error",
        description: "Failed to record checkout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const staffWithNoAttendance = siteStaff.filter(staff => 
    !attendanceData.some(record => record.staff_id === staff.staff_id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Daily Attendance</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="mx-2 font-medium">
            {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
          </span>
          <Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Present</span>
                <span className="font-bold">{attendanceData.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Pending Checkout</span>
                <span className="font-bold">
                  {attendanceData.filter(record => record.check_in && !record.check_out).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Average Working Hours</span>
                <span className="font-bold">
                  {attendanceData.length > 0 
                    ? (attendanceData.reduce((sum, record) => sum + (record.total_working_hour || 0), 0) / attendanceData.length).toFixed(2)
                    : "0.00"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records ({format(date || new Date(), 'MMMM d, yyyy')})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {attendanceData.length > 0 ? (
                <div className="space-y-4">
                  {attendanceData.map((record) => (
                    <div key={record.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">{record.nd_staff_profile?.fullname}</h3>
                          <div className="text-sm text-muted-foreground mt-1">
                            Site: {record.nd_site_profile?.sitename || 'Unknown site'}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-green-600" />
                            <span className="text-sm">
                              In: {record.check_in ? format(new Date(record.check_in), 'h:mm a') : 'N/A'}
                            </span>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-red-600" />
                            <span className="text-sm">
                              Out: {record.check_out ? format(new Date(record.check_out), 'h:mm a') : 'Not checked out'}
                            </span>
                          </div>
                          
                          {record.check_in && !record.check_out && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => markCheckout(record.id)}
                            >
                              Check Out
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {record.remark && (
                        <div className="mt-2 text-sm italic border-t pt-2">
                          Note: {record.remark}
                        </div>
                      )}
                      
                      {record.total_working_hour > 0 && (
                        <div className="mt-2 text-xs bg-blue-50 text-blue-700 rounded-md p-1 inline-block">
                          Working hours: {record.total_working_hour.toFixed(2)}h
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No attendance records for this date
                </div>
              )}
              
              {staffWithNoAttendance.length > 0 && (
                <div className="border rounded-lg p-4 mt-6">
                  <h3 className="text-lg font-medium mb-4">Mark Attendance</h3>
                  
                  <div className="space-y-4">
                    {staffWithNoAttendance.map((staff) => (
                      <div key={staff.staff_id} className="flex items-start space-x-3 pb-3 border-b">
                        <Checkbox 
                          id={`staff-${staff.staff_id}`}
                          checked={selectedStaffIds.includes(staff.staff_id)}
                          onCheckedChange={(checked) => handleAttendanceToggle(staff.staff_id, checked === true)}
                        />
                        <div className="grid gap-1.5 w-full">
                          <Label htmlFor={`staff-${staff.staff_id}`}>
                            {staff.nd_staff_profile.fullname}
                          </Label>
                          <Textarea
                            placeholder="Add remarks (optional)"
                            className="resize-none h-16 max-w-lg"
                            disabled={!selectedStaffIds.includes(staff.staff_id)}
                            value={remarks[staff.staff_id] || ''}
                            onChange={(e) => handleRemarkChange(staff.staff_id, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      onClick={markAttendance}
                      disabled={selectedStaffIds.length === 0 || loading}
                    >
                      {loading ? 'Processing...' : 'Mark Attendance'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceRecords;
