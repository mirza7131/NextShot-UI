export interface Employee {
  name: string;
  role: string;
  totalWorkingHours: number;
  absentHours: number;
  wagePerHour: number;
  total: number; // Calculated as (totalWorkingHours - absentHours) * wagePerHour
}