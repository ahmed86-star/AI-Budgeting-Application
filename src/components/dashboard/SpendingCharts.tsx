import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { cn } from "../../lib/utils";

interface ChartData {
  category: string;
  amount: number;
  color: string;
}

interface TrendData {
  month: string;
  housing: number;
  transportation: number;
  food: number;
  utilities: number;
  entertainment: number;
  savings: number;
}

interface SpendingChartsProps {
  categoryData?: ChartData[];
  trendData?: TrendData[];
}

const SpendingCharts = ({
  categoryData = [
    { category: "Housing", amount: 1200, color: "bg-blue-500" },
    { category: "Transportation", amount: 400, color: "bg-green-500" },
    { category: "Food", amount: 600, color: "bg-yellow-500" },
    { category: "Utilities", amount: 300, color: "bg-purple-500" },
    { category: "Entertainment", amount: 200, color: "bg-pink-500" },
    { category: "Savings", amount: 800, color: "bg-indigo-500" },
  ],
  trendData = [
    {
      month: "Jan",
      housing: 1150,
      transportation: 380,
      food: 550,
      utilities: 290,
      entertainment: 180,
      savings: 750,
    },
    {
      month: "Feb",
      housing: 1150,
      transportation: 400,
      food: 580,
      utilities: 300,
      entertainment: 220,
      savings: 780,
    },
    {
      month: "Mar",
      housing: 1200,
      transportation: 390,
      food: 600,
      utilities: 310,
      entertainment: 190,
      savings: 800,
    },
    {
      month: "Apr",
      housing: 1200,
      transportation: 410,
      food: 590,
      utilities: 300,
      entertainment: 210,
      savings: 790,
    },
    {
      month: "May",
      housing: 1200,
      transportation: 400,
      food: 600,
      utilities: 300,
      entertainment: 200,
      savings: 800,
    },
  ],
}: SpendingChartsProps) => {
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [chartType, setChartType] = useState("pie");
  const [showDashboardGraph, setShowDashboardGraph] = useState(true);

  // Generate random data for dashboard graph
  const [dashboardData, setDashboardData] = useState<
    { date: string; income: number; expenses: number }[]
  >([]);

  useEffect(() => {
    // Generate last 12 months of data
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonth = new Date().getMonth();

    const data = [];
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth - 11 + i) % 12;
      const monthName = months[monthIndex < 0 ? monthIndex + 12 : monthIndex];
      data.push({
        date: monthName,
        income: 4000 + Math.floor(Math.random() * 2000),
        expenses: 2000 + Math.floor(Math.random() * 2000),
      });
    }

    setDashboardData(data);
  }, []);

  // Calculate total for pie chart percentages
  const total = categoryData.reduce((sum, item) => sum + item.amount, 0);

  // Render pie chart
  const renderPieChart = () => {
    return (
      <div className="relative h-64 w-64 mx-auto mt-4">
        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
          ${total.toLocaleString()}
          <br />
          Total
        </div>
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          {categoryData.map((item, index) => {
            // Calculate the percentage and angles for the pie segments
            const percentage = (item.amount / total) * 100;
            const previousPercentages = categoryData
              .slice(0, index)
              .reduce(
                (sum, prevItem) => sum + (prevItem.amount / total) * 100,
                0,
              );

            const startAngle = (previousPercentages / 100) * 360;
            const endAngle = ((previousPercentages + percentage) / 100) * 360;

            // Convert angles to coordinates on the circle
            const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
            const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
            const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
            const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

            // Determine if the arc should be drawn as a large arc
            const largeArcFlag = percentage > 50 ? 1 : 0;

            return (
              <path
                key={item.category}
                d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                className={item.color}
                stroke="white"
                strokeWidth="0.5"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  // Render bar chart
  const renderBarChart = () => {
    const maxAmount = Math.max(...categoryData.map((item) => item.amount));

    return (
      <div className="mt-6 space-y-2">
        {categoryData.map((item) => (
          <div key={item.category} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>{item.category}</span>
              <span>${item.amount.toLocaleString()}</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full`}
                style={{ width: `${(item.amount / maxAmount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render line chart for trends
  const renderTrendChart = () => {
    const categories = [
      "housing",
      "transportation",
      "food",
      "utilities",
      "entertainment",
      "savings",
    ];
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];

    // Find the maximum value for scaling
    const allValues = trendData.flatMap((month) =>
      categories.map((cat) => month[cat as keyof Omit<TrendData, "month">]),
    );
    const maxValue = Math.max(...allValues);

    // Chart dimensions
    const chartHeight = 200;
    const chartWidth = 500;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = chartWidth - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;

    return (
      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[500px] h-[250px] relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 py-5">
            <span>${maxValue.toLocaleString()}</span>
            <span>${(maxValue / 2).toLocaleString()}</span>
            <span>$0</span>
          </div>

          {/* Chart area */}
          <div className="absolute left-10 right-0 top-0 bottom-0">
            {/* Horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-5 pointer-events-none">
              <div className="border-t border-gray-200 w-full"></div>
              <div className="border-t border-gray-200 w-full"></div>
              <div className="border-t border-gray-200 w-full"></div>
            </div>

            {/* X-axis labels */}
            <div className="absolute left-0 right-0 bottom-0 flex justify-between text-xs text-gray-500">
              {trendData.map((data) => (
                <span key={data.month} className="px-2">
                  {data.month}
                </span>
              ))}
            </div>

            {/* Legend */}
            <div className="absolute top-0 right-0 flex flex-wrap gap-2 text-xs">
              {categories.map((category, index) => (
                <div key={category} className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${colors[index]} mr-1`}
                  ></div>
                  <span className="capitalize">{category}</span>
                </div>
              ))}
            </div>

            {/* Chart content - simplified representation */}
            <div className="absolute inset-0 pt-5 pb-6">
              {categories.map((category, catIndex) => (
                <svg
                  key={category}
                  className="absolute inset-0"
                  preserveAspectRatio="none"
                >
                  <polyline
                    points={trendData
                      .map((data, i) => {
                        const x = (i / (trendData.length - 1)) * 100;
                        const value = data[
                          category as keyof Omit<TrendData, "month">
                        ] as number;
                        const y = 100 - (value / maxValue) * 100;
                        return `${x},${y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke={colors[catIndex].replace("bg-", "stroke-")}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    className="transform scale-x-100 scale-y-100"
                  />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render dashboard graph
  const renderDashboardGraph = () => {
    const maxValue = Math.max(
      ...dashboardData.flatMap((item) => [item.income, item.expenses]),
    );

    return (
      <div className="mt-6 relative h-64">
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 py-5">
          <span>${maxValue.toLocaleString()}</span>
          <span>${(maxValue / 2).toLocaleString()}</span>
          <span>$0</span>
        </div>

        <div className="absolute left-10 right-0 top-0 bottom-0">
          {/* Horizontal grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-5 pointer-events-none">
            <div className="border-t border-gray-200 w-full"></div>
            <div className="border-t border-gray-200 w-full"></div>
            <div className="border-t border-gray-200 w-full"></div>
          </div>

          {/* Chart content */}
          <div className="absolute inset-0 pt-5 pb-6 flex items-end">
            {dashboardData.map((item, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center h-full justify-end"
              >
                {/* Income bar */}
                <div
                  className="w-3 bg-blue-500 rounded-t-sm mx-0.5"
                  style={{ height: `${(item.income / maxValue) * 100}%` }}
                ></div>

                {/* Expenses bar */}
                <div
                  className="w-3 bg-red-500 rounded-t-sm mx-0.5 mt-1"
                  style={{ height: `${(item.expenses / maxValue) * 100}%` }}
                ></div>

                {/* Month label */}
                <span className="text-xs mt-1">{item.date}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="absolute top-0 right-0 flex gap-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 mr-1"></div>
              <span>Income</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 mr-1"></div>
              <span>Expenses</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full bg-card shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl font-bold">Spending Charts</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>

            <Tabs
              value={chartType}
              onValueChange={setChartType}
              className="w-[200px]"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pie">Pie</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
                <TabsTrigger value="trend">Trend</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showDashboardGraph && (
          <div className="mb-6 border-b pb-6">
            <h3 className="text-sm font-medium mb-2">
              Income vs Expenses (Last 12 Months)
            </h3>
            {renderDashboardGraph()}
          </div>
        )}

        {chartType === "pie" && renderPieChart()}
        {chartType === "bar" && renderBarChart()}
        {chartType === "trend" && renderTrendChart()}

        {/* Category legend for pie chart */}
        {chartType === "pie" && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categoryData.map((item) => (
              <div key={item.category} className="flex items-center">
                <div className={cn("w-3 h-3 rounded-full mr-2", item.color)} />
                <span className="text-sm">
                  {item.category} ({((item.amount / total) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingCharts;
