# HR Salary Chart System

This folder contains the chart generation system for HR Salary reports in the NADI e-system.

## Architecture

The chart system is designed with a modular approach to improve maintainability:

### Components

1. **Chart Components** - Pure chart rendering components using Recharts
   - `StaffDistributionChart`
   - `SalaryByPositionChart`
   - `VacancyDistributionChart`

2. **Chart Image Components** - Wrappers that convert charts to base64 images
   - `StaffDistributionChartImage`
   - `SalaryByPositionChartImage`
   - `VacancyDistributionChartImage`

3. **Chart Service** - Business logic for chart generation
   - `prepareSalaryData` - Processes raw staff data for salary charts
   - `createCharts` - Factory function to create chart components

4. **ChartGenerator** - Orchestration component that manages chart generation flow

### Utilities

- **Hooks**
  - `useChartImageGenerator` - Converts charts to base64 images
  - `usePieChartLabel` - Creates custom labels for pie charts

- **Data Utilities**
  - `colorUtils.ts` - Chart colors and utilities

## Usage

```tsx
// To generate all HR charts
import ChartGenerator from '../pages/hrsalary/graphs';

// Usage in a component
<ChartGenerator
  employeeDistribution={employeeDistribution}
  vacancies={vacancies}
  staff={staff}
  onChartsReady={(charts) => {
    console.log(charts.staffDistributionChart); // base64 string
    console.log(charts.salaryChart); // base64 string
    console.log(charts.vacancyChart); // base64 string
  }}
/>

// To use individual charts directly
import { 
  StaffDistributionChart,
  SalaryByPositionChart,
  VacancyDistributionChart 
} from '../pages/hrsalary/graphs';

// For chart customization
import { getDefaultColor, DEFAULT_COLORS } from '../pages/hrsalary/graphs';
```

## Data Flow

```
HRSalaryReportDownloadButton
        │
        ▼
   ChartGenerator ─────► ChartService
        │                    │
        │                    ▼
        │           ┌─────────────────┐
        │           │                 │
        ▼           ▼                 ▼
  StaffDistChart  SalaryChart   VacancyChart
        │           │                 │
        │           │                 │
        ▼           ▼                 ▼
     base64      base64            base64
     image       image             image
        │           │                 │
        └───────────┴─────────────────┘
                    │
                    ▼
            HRSalaryReportPDF
```
