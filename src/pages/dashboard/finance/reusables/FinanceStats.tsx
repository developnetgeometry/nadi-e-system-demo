import { StatsCard } from "@/components/dashboard/StatsCard"
import { cn } from "@/lib/utils"
import { ElementType } from "react"

interface StatsData {
    title: string,
    value: string,
    icon: ElementType<any>,
    description: string,
    iconBgColor: string,
    iconTextColor: string
}

interface FinaceStatsProps {
    statsData: StatsData[]
    className?: string
}
export const FinaceStats = ({ statsData, className }: FinaceStatsProps) => {
    return (
        <section className={cn("grid grid-cols-4 gap-3", className)}>
            { statsData.map((stat) => (
                <StatsCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    description={stat.description}
                    iconBgColor={stat.iconBgColor}
                    iconTextColor={stat.iconTextColor}
                />
            ))}
        </section>
    )
}
