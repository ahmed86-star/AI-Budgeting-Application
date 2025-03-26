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
  savingsGoal?: number;
  savingsProgress?: number;
  onSavingsUpdate?: (goal: number, progress: number) => void;
}

const BudgetAllocation = ({
  income = 0,
  onSaveBudget = () => {},
  savingsGoal = 0,
  savingsProgress = 0,
  onSavingsUpdate = () => {},
}: BudgetAllocationProps) => {
  // Ensure income is a valid number
  const validIncome =
    typeof income === "number" && !isNaN(income) && income > 0 ? income : 0;
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
    // Ensure we're passing the complete budget data to the parent component
    onSaveBudget(defaultCategories);

    // Update savings based on the savings category
    const savingsCategory = defaultCategories.find(
      (cat) => cat.id === "savings",
    );
    if (savingsCategory && income > 0) {
      const newSavingsGoal = Math.round(
        (income * savingsCategory.percentage) / 100,
      );
      // If we have a savings goal, update it and the progress proportionally
      if (savingsGoal > 0) {
        const progressRatio = savingsProgress / savingsGoal;
        const newProgress = Math.round(progressRatio * newSavingsGoal);
        onSavingsUpdate(newSavingsGoal, newProgress);
      } else {
        // If no previous goal, set progress to 0
        onSavingsUpdate(newSavingsGoal, 0);
      }
    }

    console.log("Accepted recommendations", defaultCategories);
  };

  const handleSaveCustomAllocations = () => {
    setIsEditing(false);
    // Only save if the total percentage is exactly 100%
    if (totalPercentage === 100) {
      // Convert categories to the format expected by the parent component
      const formattedCategories = categories.map((cat) => ({
        ...cat,
        // Ensure percentage is a number
        percentage:
          typeof cat.percentage === "number"
            ? cat.percentage
            : parseInt(cat.percentage as any, 10) || 0,
      }));

      // Save to parent component state
      onSaveBudget(formattedCategories);

      // Save to localStorage for persistence
      // Create a serializable version of the categories without React nodes
      const serializableCategories = formattedCategories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        percentage: cat.percentage,
        color: cat.color,
        // Exclude the icon React node which causes circular reference
      }));
      localStorage.setItem(
        "userBudgetCategories",
        JSON.stringify(serializableCategories),
      );
      console.log("Saved custom allocations", formattedCategories);

      // Update savings based on the savings category
      const savingsCategory = formattedCategories.find(
        (cat) => cat.id === "savings",
      );
      if (savingsCategory && income > 0) {
        const newSavingsGoal = Math.round(
          (income * savingsCategory.percentage) / 100,
        );
        // If we have a savings goal, update it and the progress proportionally
        if (savingsGoal > 0) {
          const progressRatio = savingsProgress / savingsGoal;
          const newProgress = Math.round(progressRatio * newSavingsGoal);
          onSavingsUpdate(newSavingsGoal, newProgress);
        } else {
          // If no previous goal, set progress to 0
          onSavingsUpdate(newSavingsGoal, 0);
        }
      }

      // Show a temporary success message
      const successMessage = document.createElement("div");
      successMessage.className =
        "fixed top-4 right-4 bg-green-500 text-white p-3 rounded-md shadow-lg z-50";
      successMessage.textContent = "Budget allocations saved successfully!";
      document.body.appendChild(successMessage);

      // Remove the message after 3 seconds
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);
    } else {
      // Show error message if total is not 100%
      const errorMessage = document.createElement("div");
      errorMessage.className =
        "fixed top-4 right-4 bg-red-500 text-white p-3 rounded-md shadow-lg z-50";
      errorMessage.textContent = `Total allocation must be 100%. Current: ${totalPercentage}%`;
      document.body.appendChild(errorMessage);

      // Remove the error message after 3 seconds
      setTimeout(() => {
        document.body.removeChild(errorMessage);
      }, 3000);
    }
  };

  return (
    <Card className="w-full bg-card shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">Budget Allocation</CardTitle>
        <CardDescription>
          {validIncome > 0
            ? `AI-recommended budget breakdown based on your monthly income of $${validIncome.toLocaleString()}`
            : "Please enter your income to see personalized budget recommendations"}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="overflow-hidden border-t-4 text-sm sm:text-base"
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
                  {validIncome > 0
                    ? `$${Math.round((validIncome * category.percentage) / 100).toLocaleString()}`
                    : "$0"}
                </div>
                {isEditing && (
                  <>
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full text-xs"
                      onClick={() => {
                        const amount = prompt(
                          `Enter amount for ${category.name}:`,
                        );
                        if (
                          amount &&
                          !isNaN(Number(amount)) &&
                          validIncome > 0
                        ) {
                          const newPercentage = Math.round(
                            (Number(amount) / validIncome) * 100,
                          );
                          handleSliderChange(category.id, [newPercentage]);
                        } else if (validIncome <= 0) {
                          alert(
                            "Please enter your income first before setting category amounts.",
                          );
                        }
                      }}
                    >
                      Enter Amount
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-between w-full">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => handleAcceptRecommendations()}
                className="w-full sm:w-auto text-sm"
              >
                Reset to Recommendations
              </Button>
              <Button
                onClick={handleSaveCustomAllocations}
                disabled={totalPercentage !== 100}
                className="w-full sm:w-auto text-sm bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:hover:bg-gray-400"
              >
                Save Allocations
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto text-sm"
              >
                Customize Allocations
              </Button>
              <Button
                onClick={handleAcceptRecommendations}
                className="w-full sm:w-auto text-sm bg-green-600 hover:bg-green-700"
              >
                Accept Recommendations
              </Button>
            </>
          )}
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="w-full mt-2"
          onClick={() => {
            if (
              confirm(
                "Are you sure you want to reset all budget data? This cannot be undone.",
              )
            ) {
              // Reset categories to default
              setCategories(defaultCategories);
              setTotalPercentage(100);
              setIsEditing(false);
              onSaveBudget(defaultCategories);

              // Clear all localStorage items related to budget
              localStorage.removeItem("userBudgetCategories");
              localStorage.removeItem("userExpenses");
              localStorage.removeItem("userSavingsGoal");
              localStorage.removeItem("userSavingsProgress");

              // Also clear any error messages that might be displayed
              const errorMessages = document.querySelectorAll(
                ".fixed.top-4.right-4",
              );
              errorMessages.forEach((el) => el.parentNode?.removeChild(el));

              alert("Budget data has been reset successfully.");
            }
          }}
        >
          Reset All Budget Data
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BudgetAllocation;
