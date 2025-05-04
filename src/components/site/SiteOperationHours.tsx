import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TimeInput from "@/components/ui/TimePicker";
import { supabase } from "@/lib/supabase";

interface OperationTime {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  id?: number;
}

interface SiteOperationHoursProps {
  siteId?: string | null;
  onOperationTimesChange?: (operationTimes: OperationTime[]) => void;
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const DEFAULT_OPEN_TIME = "08:00";
const DEFAULT_CLOSE_TIME = "18:00";

export const SiteOperationHours = ({ siteId, onOperationTimesChange }: SiteOperationHoursProps) => {
  const [operationTimes, setOperationTimes] = useState<OperationTime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize with default operation hours for all days of the week
  useEffect(() => {
    const initializeOperationTimes = async () => {
      setIsLoading(true);
      
      if (siteId) {
        // If we're editing an existing site, fetch its operation times
        try {
          const { data, error } = await supabase
            .from('nd_site_operation')
            .select('*')
            .eq('site_id', siteId);
            
          if (error) throw error;
          
          if (data && data.length > 0) {
            // Map the database data to our OperationTime format
            const mappedData: OperationTime[] = data.map(item => ({
              id: item.id,
              day: item.days_of_week,
              openTime: item.open_time ? item.open_time.substring(0, 5) : DEFAULT_OPEN_TIME,
              closeTime: item.close_time ? item.close_time.substring(0, 5) : DEFAULT_CLOSE_TIME,
              isClosed: item.is_closed || false
            }));
            
            // Fill in any missing days
            const existingDays = mappedData.map(item => item.day);
            const missingDays = DAYS_OF_WEEK.filter(day => !existingDays.includes(day));
            
            const defaultEntries = missingDays.map(day => ({
              day,
              openTime: DEFAULT_OPEN_TIME,
              closeTime: DEFAULT_CLOSE_TIME,
              isClosed: false // Default to OPEN (not closed) for any missing days
            }));
            
            setOperationTimes([...mappedData, ...defaultEntries].sort((a, b) => 
              DAYS_OF_WEEK.indexOf(a.day) - DAYS_OF_WEEK.indexOf(b.day)
            ));
          } else {
            // No existing operation times, create defaults for all days
            createDefaultOperationTimes();
          }
        } catch (error) {
          console.error("Error fetching operation times:", error);
          createDefaultOperationTimes();
        }
      } else {
        // New site, create defaults
        createDefaultOperationTimes();
      }
      
      setIsLoading(false);
    };
    
    initializeOperationTimes();
  }, [siteId]);
  
  // Notify parent of changes
  useEffect(() => {
    if (onOperationTimesChange) {
      onOperationTimesChange(operationTimes);
    }
  }, [operationTimes, onOperationTimesChange]);
  
  const createDefaultOperationTimes = () => {
    const defaultTimes: OperationTime[] = DAYS_OF_WEEK.map(day => ({
      day,
      openTime: DEFAULT_OPEN_TIME,
      closeTime: DEFAULT_CLOSE_TIME,
      isClosed: false // Default all days to OPEN (not closed)
    }));
    
    setOperationTimes(defaultTimes);
  };
  
  const handleOpenTimeChange = (day: string, time: string) => {
    setOperationTimes(prev => 
      prev.map(item => 
        item.day === day ? { ...item, openTime: time } : item
      )
    );
  };
  
  const handleCloseTimeChange = (day: string, time: string) => {
    setOperationTimes(prev => 
      prev.map(item => 
        item.day === day ? { ...item, closeTime: time } : item
      )
    );
  };
  
  const handleOpenToggle = (day: string, isOpen: boolean) => {
    setOperationTimes(prev => 
      prev.map(item => 
        item.day === day ? { ...item, isClosed: !isOpen } : item
      )
    );
  };
  
  if (isLoading) {
    return <div>Loading operation hours...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operation Hours</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          {operationTimes.map((item) => (
            <div key={item.day} className="flex flex-col space-y-2 p-3 border rounded-md">
              <div className="font-medium">{item.day}</div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor={`open-switch-${item.day}`} className="text-sm">Open</Label>
                <Switch
                  id={`open-switch-${item.day}`}
                  checked={!item.isClosed} // Invert the logic - Switch ON means NOT closed
                  onCheckedChange={(isOpen) => handleOpenToggle(item.day, isOpen)}
                />
              </div>
              
              {!item.isClosed && (
                <>
                  <div className="space-y-1">
                    <Label htmlFor={`open-${item.day}`} className="text-sm">Open Time</Label>
                    <TimeInput
                      id={`open-${item.day}`}
                      value={item.openTime}
                      onChange={(value) => handleOpenTimeChange(item.day, value)}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`close-${item.day}`} className="text-sm">Close Time</Label>
                    <TimeInput
                      id={`close-${item.day}`}
                      value={item.closeTime}
                      onChange={(value) => handleCloseTimeChange(item.day, value)}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteOperationHours;