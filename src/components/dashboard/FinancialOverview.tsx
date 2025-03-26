import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  DollarSign,
  PiggyBank,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialOverviewProps {
  totalIncome?: number;
  totalExpenses?: number;
  remainingBudget?: number;
  savingsGoal?: number;
  savingsProgress?: number;
}

const FinancialOverview = ({
  totalIncome = 5000,
  totalExpenses = 2750,
  remainingBudget = 2250,
  savingsGoal = 1000,
  savingsProgress = 750,
}: FinancialOverviewProps) => {
  // Calculate savings percentage
  const savingsPercentage =
    savingsGoal <= 0
      ? 0
      : Math.min(Math.round((savingsProgress / savingsGoal) * 100), 100);

  // Calculate budget utilization percentage
  const budgetUtilizationPercentage =
    totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;

  return (
    <div className="w-full bg-card rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Financial Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Income Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
              <ArrowUpCircle className="h-4 w-4 mr-2 text-blue-500" />
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              ${totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600 mt-1">Monthly income</p>
          </CardContent>
        </Card>

        {/* Expenses Card */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 flex items-center">
              <ArrowDownCircle className="h-4 w-4 mr-2 text-red-500" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              ${totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-red-600 mt-1">
              {totalIncome > 0
                ? `${budgetUtilizationPercentage}% of income spent`
                : "0% of income spent"}
            </p>
          </CardContent>
        </Card>

        {/* Remaining Budget Card */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-500" />
              Remaining Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              ${remainingBudget.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 mt-1">
              {totalIncome > 0
                ? `${100 - budgetUtilizationPercentage}% of income remaining`
                : "0% of income remaining"}
            </p>
          </CardContent>
        </Card>

        {/* Savings Progress Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center">
              <PiggyBank className="h-4 w-4 mr-2 text-purple-500" />
              Savings Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-purple-700">
                ${savingsProgress.toLocaleString()}
              </span>
              <span className="text-sm text-purple-700">
                ${savingsGoal.toLocaleString()}
              </span>
            </div>
            <Progress
              value={savingsPercentage}
              className="h-2 bg-purple-200"
              indicatorClassName={cn(
                "bg-purple-600",
                savingsPercentage >= 100 ? "bg-green-600" : "",
              )}
            />
            <p className="text-xs text-purple-600 mt-1">
              {savingsPercentage}% of monthly goal
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialOverview;
