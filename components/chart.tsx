"use client"

import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  apy: {
    label: "APY %",
    color: "#ec4899", // Pink-500
  },
} satisfies ChartConfig

export function CryptoChart({ analytics }: { analytics: any }) {
  // Transform the LI.FI analytics object into a timeline for the chart
  const chartData = [
    { time: "30D Ago", apy: analytics?.apy30d || 0 },
    { time: "7D Ago", apy: analytics?.apy7d || 0 },
    { time: "1D Ago", apy: analytics?.apy1d || 0 },
    { time: "Current", apy: analytics?.apy?.total || 0 },
  ]

  return (
    <div className="w-full h-[350px] mt-8">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            
            <YAxis 
               domain={['auto', 'auto']} 
               hide 
            />
            
            <ChartTooltip
              cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
              content={<ChartTooltipContent hideLabel />}
            />
            
            <Line
              dataKey="apy"
              type="monotone" // Monotone makes the line curve smoothly between points
              stroke="var(--color-apy)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#ec4899" }}
              activeDot={{ r: 6, fill: "#ec4899", stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}