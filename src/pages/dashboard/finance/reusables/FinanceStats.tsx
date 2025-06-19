import { StatsCard } from "@/components/dashboard/StatsCard"
import { ElementType } from "react"

interface StatsData {
    title: string,
    value: string,
    icon: ElementType<any>,
    description: string,
    iconBgColor: string,
    iconTextColor: string,
}

interface FinaceStatsProps {
    statsData: StatsData[]
}
export const FinaceStats = ({ statsData }: FinaceStatsProps) => {
    return (
        <section className="grid grid-cols-4 gap-3">
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
