import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Scale, 
  Ruler, 
  Activity, 
  Droplets, 
  AlertTriangle,
  FileText
} from 'lucide-react';

interface HealthData {
  weight?: number;
  height?: number;
  diastolic?: number;
  blood_sugar?: number;
  bmi?: number;
  systolic?: number;
  pulse?: number;
  cholestrol?: number;
  allergy?: string;
  allergy_detail?: string;
  health_cond?: string;
  health_detail?: string;
}

interface HealthPageProps {
  healthData?: HealthData;
}

const HealthPage: React.FC<HealthPageProps> = ({ healthData }) => {
  const formatValue = (value: number | undefined, unit: string) => {
    return value ? `${value} ${unit}` : 'Not specified';
  };

  const getBMIStatus = (bmi: number | undefined) => {
    if (!bmi) return { text: 'Not calculated', color: 'secondary' };
    if (bmi < 18.5) return { text: 'Underweight', color: 'destructive' };
    if (bmi < 25) return { text: 'Normal', color: 'default' };
    if (bmi < 30) return { text: 'Overweight', color: 'secondary' };
    return { text: 'Obese', color: 'destructive' };
  };

  const getBloodPressureStatus = (systolic?: number, diastolic?: number) => {
    if (!systolic || !diastolic) return { text: 'Not measured', color: 'secondary' };
    if (systolic < 120 && diastolic < 80) return { text: 'Normal', color: 'default' };
    if (systolic < 130 && diastolic < 80) return { text: 'Elevated', color: 'secondary' };
    if (systolic < 140 || diastolic < 90) return { text: 'High Stage 1', color: 'destructive' };
    return { text: 'High Stage 2', color: 'destructive' };
  };

  const bmiStatus = getBMIStatus(healthData?.bmi);
  const bpStatus = getBloodPressureStatus(healthData?.systolic, healthData?.diastolic);

  return (
    <div className="space-y-6">
      {/* Vital Signs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Vital Signs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Weight</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                {formatValue(healthData?.weight, 'kg')}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Height</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                {formatValue(healthData?.height, 'cm')}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Pulse</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                {formatValue(healthData?.pulse, 'bpm')}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">BMI</span>
                <Badge variant={bmiStatus.color as any}>{bmiStatus.text}</Badge>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                {formatValue(healthData?.bmi, '')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blood Pressure & Lab Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            Blood Pressure & Lab Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Blood Pressure</span>
              <Badge variant={bpStatus.color as any}>{bpStatus.text}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {healthData?.systolic && healthData?.diastolic 
                ? `${healthData.systolic}/${healthData.diastolic} mmHg`
                : 'Not measured'
              }
            </p>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-sm font-medium">Blood Sugar</span>
              <p className="text-sm text-muted-foreground">
                {formatValue(healthData?.blood_sugar, 'mg/dL')}
              </p>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm font-medium">Cholesterol</span>
              <p className="text-sm text-muted-foreground">
                {formatValue(healthData?.cholestrol, 'mg/dL')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allergies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Allergies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <span className="text-sm font-medium">Allergy Type</span>
            <p className="text-sm text-muted-foreground">
              {healthData?.allergy || 'No allergies specified'}
            </p>
          </div>
          
          {healthData?.allergy_detail && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Allergy Details</span>
              <p className="text-sm text-muted-foreground">
                {healthData.allergy_detail}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Health Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <span className="text-sm font-medium">Condition</span>
            <p className="text-sm text-muted-foreground">
              {healthData?.health_cond || 'No health conditions specified'}
            </p>
          </div>
          
          {healthData?.health_detail && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Condition Details</span>
              <p className="text-sm text-muted-foreground">
                {healthData.health_detail}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthPage;