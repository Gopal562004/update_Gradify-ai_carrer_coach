"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { TrendingUp } from "lucide-react";

export default function PerformanceChart({ assessments }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (assessments) {
      const formattedData = assessments.map((assessment) => ({
        date: format(new Date(assessment.createdAt), "MMM dd"),
        score: assessment.quizScore,
        fullDate: format(new Date(assessment.createdAt), "MMM dd, yyyy"),
      }));
      setChartData(formattedData);
    }
  }, [assessments]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-gray-900">
            {payload[0].payload.fullDate}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Score:{" "}
            <span className="font-semibold text-blue-600">
              {payload[0].value}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Performance Trend
            </CardTitle>
            <CardDescription className="text-gray-600">
              Track your quiz scores and improvement over time
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f3f4f6"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  fill: "#1d4ed8",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        {chartData.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="font-medium text-gray-900">Latest:</span>
              <span>{chartData[chartData.length - 1]?.score}%</span>
            </div>
            {chartData.length > 1 && (
              <>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-900">Highest:</span>
                  <span>{Math.max(...chartData.map((d) => d.score))}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-900">Average:</span>
                  <span>
                    {Math.round(
                      chartData.reduce((a, b) => a + b.score, 0) /
                        chartData.length
                    )}
                    %
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
