import React from "react";
export default function KPICard({ title, value, icon, colorClass, trend, trendUp, isPercentage, isTimer, isScore, showProgressRing, progressValue }: {
  title: string; value: number | string; icon?: unknown; colorClass?: string; trend?: string; trendUp?: boolean; isPercentage?: boolean; isTimer?: boolean; isScore?: boolean; showProgressRing?: boolean; progressValue?: number;
}) {
  return <div>{title}: {value}{isPercentage ? '%' : ''}</div>;
}
