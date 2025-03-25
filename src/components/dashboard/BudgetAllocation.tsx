import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Slider } from "../ui/slider";
import { Home, Car, Utensils, Lightbulb, PiggyBank, Music } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

interface BudgetAllocationProps {
  income?: number;
  onSaveBudget?: (categories: BudgetCategory[]) => void;
}

const BudgetAllocation = ({
  income = 5000,
  onSaveBudget = () => {},
}: BudgetAllocationProps) => {
  const defaultCategories: BudgetCategory[] = [
    {
      id: "housing",
      name: "Housing",
      percentage: 30,
      icon: <Home className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      id: "transportation",
      name: "Transportation",
      percentage: 15,
      icon: <Car className="h-5 w-5" />,
      color: "bg-green-500",
    },
    {
      id: "food",
      name: "Food",
      percentage: 15,
      icon: <Utensils className="h-5 w-5" />,
      color: "bg-yellow-500",
    },
    {
      id: "utilities",
      name: "Utilities",
      percentage: 10,
      icon: <Lightbulb className="h-5 w-5" />,
      color: "bg-purple-500",
    },
    {
      id: "savings",
      name: "Savings",
      percentage: 20,
      icon: <PiggyBank className="h-5 w-5" />,
      color: "bg-red-500",
    },
    {
      id: "entertainment",
      name: "Entertainment",
      percentage: 10,
      icon: <Music className="h-5 w-5" />,
      color: "bg-orange-500",
    },
  ];

  const [categories, setCategories] =
    useState<BudgetCategory[]>(defaultCategories);
  const [isEditing, setIsEditing] = useState(false);
  const [totalPercentage, setTotalPercentage] = useState(100);

  const handleSliderChange = (id: string, value: number[]) => {
    const newValue = value[0];
    const updatedCategories = categories.map((category) => {
      if (category.id === id) {
        return { ...category, percentage: newValue };
      }
      return category;
    });

    setCategories(updatedCategories);

    // Calculate new total percentage
    const newTotal = updatedCategories.reduce(
      (sum, cat) => sum + cat.percentage,
      0,
    );
    setTotalPercentage(newTotal);
  };

  const handleAcceptRecommendations = () => {
    setCategories(defaultCategories);
    setTotalPercentage(100);
    setIsEditing(false);
    onSaveBudget(defaultCategories);
  };

  const handleSaveCustomAllocations = () => {
    setIsEditing(false);
    onSaveBudget(categories);
  };

  return (
    <Card className="w-full bg-card shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">Budget Allocation</CardTitle>
        <CardDescription>
          AI-recommended budget breakdown based on your monthly income of $
          {income.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Total Allocation</span>
            <span
              className={cn(
                "text-sm font-bold",
                totalPercentage !== 100 ? "text-red-500" : "text-green-500",
              )}
            >
              {totalPercentage}%
            </span>
          </div>
          <Progress value={totalPercentage} className="h-2" />
          {totalPercentage !== 100 && (
            <p className="text-xs text-red-500 mt-1">
              {totalPercentage > 100 ? "Over-allocated" : "Under-allocated"} by{" "}
              {Math.abs(totalPercentage - 100)}%
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="overflow-hidden border-t-4"
              style={{ borderTopColor: category.color.replace("bg-", "") }}
            >
              <CardHeader className="pb-2 pt-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-2 rounded-full", category.color)}>
                      {category.icon}
                    </div>
                    <h3 className="font-medium">{category.name}</h3>
                  </div>
                  <div className="text-lg font-bold">
                    {category.percentage}%
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  $
                  {Math.round(
                    (income * category.percentage) / 100,
                  ).toLocaleString()}
                </div>
                {isEditing && (
                  <Slider
                    defaultValue={[category.percentage]}
                    max={100}
                    step={1}
                    value={[category.percentage]}
                    onValueChange={(value) =>
                      handleSliderChange(category.id, value)
                    }
                    className="mt-2"
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={() => handleAcceptRecommendations()}
            >
              Reset to Recommendations
            </Button>
            <Button
              onClick={handleSaveCustomAllocations}
              disabled={totalPercentage !== 100}
            >
              Save Allocations
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Customize Allocations
            </Button>
            <Button onClick={handleAcceptRecommendations}>
              Accept Recommendations
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default BudgetAllocation;
