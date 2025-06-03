
import { useState, useEffect, useRef } from 'react';
import { AttendanceSchedulerService } from '@/services/attendance-scheduler-service';

interface SchedulerConfig {
  enabled: boolean;
  timezone: string;
  hour: number;
  minute: number;
}

interface SchedulerStats {
  lastRun: string | null;
  nextRun: string | null;
  runCount: number;
  isRunning: boolean;
  errors: string[];
}

export const useAttendanceScheduler = (config: SchedulerConfig = {
  enabled: false,
  timezone: 'Asia/Kuala_Lumpur', // GMT+8
  hour: 0, // 00:00
  minute: 0
}) => {
  const [stats, setStats] = useState<SchedulerStats>({
    lastRun: null,
    nextRun: null,
    runCount: 0,
    isRunning: false,
    errors: []
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialized = useRef(false);

  const calculateNextRun = (): Date => {
    const now = new Date();
    
    // Create a date object for the target time in the specified timezone
    const targetTime = new Date();
    targetTime.setHours(config.hour, config.minute, 0, 0);
    
    // Convert to the target timezone
    const nowInTimezone = new Date(now.toLocaleString("en-US", { timeZone: config.timezone }));
    const targetInTimezone = new Date(targetTime.toLocaleString("en-US", { timeZone: config.timezone }));
    
    // If target time has already passed today, schedule for tomorrow
    if (nowInTimezone >= targetInTimezone) {
      targetTime.setDate(targetTime.getDate() + 1);
    }
    
    // Calculate the actual UTC time for the target
    const timezoneOffset = targetTime.getTimezoneOffset() * 60000;
    const targetTimezoneOffset = new Date(targetTime.toLocaleString("en-US", { timeZone: config.timezone })).getTimezoneOffset() * 60000;
    const adjustment = timezoneOffset - targetTimezoneOffset;
    
    return new Date(targetTime.getTime() + adjustment);
  };

  const runScheduler = async () => {
    setStats(prev => ({ ...prev, isRunning: true }));
    
    try {
      console.log(`Running attendance scheduler at ${new Date().toLocaleString("en-US", { timeZone: config.timezone })} (${config.timezone})`);
      
      // Use the edge function for better reliability
      const result = await AttendanceSchedulerService.triggerAttendanceTracking();
      
      const now = new Date().toISOString();
      const nextRunTime = calculateNextRun().toISOString();
      
      setStats(prev => ({
        ...prev,
        lastRun: now,
        nextRun: nextRunTime,
        runCount: prev.runCount + 1,
        isRunning: false
      }));
      
      console.log('Attendance scheduler completed successfully');
      console.log(`Next run scheduled for: ${new Date(nextRunTime).toLocaleString("en-US", { timeZone: config.timezone })} (${config.timezone})`);
      console.log('Function result:', result);
    } catch (error) {
      console.error('Attendance scheduler error:', error);
      
      setStats(prev => ({
        ...prev,
        isRunning: false,
        errors: [...prev.errors.slice(-9), error.message || 'Unknown error']
      }));
    }
  };

  const scheduleNextRun = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (config.enabled) {
      const nextRun = calculateNextRun();
      const now = new Date();
      const timeUntilNextRun = nextRun.getTime() - now.getTime();
      
      console.log(`Scheduling next attendance tracking for: ${nextRun.toLocaleString("en-US", { timeZone: config.timezone })} (${config.timezone})`);
      console.log(`Time until next run: ${Math.round(timeUntilNextRun / 1000 / 60)} minutes`);
      
      // Update next run time in stats
      setStats(prev => ({ ...prev, nextRun: nextRun.toISOString() }));
      
      // Schedule the next run
      timeoutRef.current = setTimeout(() => {
        runScheduler().then(() => {
          // After running, schedule the next run (24 hours later)
          scheduleNextRun();
        });
      }, timeUntilNextRun);
    }
  };

  const startScheduler = () => {
    if (config.enabled) {
      console.log(`Starting daily attendance scheduler (${config.hour.toString().padStart(2, '0')}:${config.minute.toString().padStart(2, '0')} ${config.timezone})`);
      scheduleNextRun();
    }
    
    isInitialized.current = true;
  };

  const stopScheduler = () => {
    if (timeoutRef.current) {
      console.log('Stopping attendance scheduler');
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setStats(prev => ({ ...prev, nextRun: null }));
    }
  };

  const manualRun = async () => {
    await runScheduler();
    // After manual run, reschedule the next automatic run
    if (config.enabled) {
      scheduleNextRun();
    }
  };

  const clearErrors = () => {
    setStats(prev => ({ ...prev, errors: [] }));
  };

  // Start/stop scheduler based on config
  useEffect(() => {
    if (config.enabled) {
      startScheduler();
    } else {
      stopScheduler();
    }

    return () => {
      stopScheduler();
    };
  }, [config.enabled, config.timezone, config.hour, config.minute]);

  return {
    stats,
    startScheduler,
    stopScheduler,
    manualRun,
    clearErrors,
    isEnabled: config.enabled,
    nextRunLocalTime: stats.nextRun 
      ? new Date(stats.nextRun).toLocaleString("en-US", { timeZone: config.timezone })
      : null
  };
};
