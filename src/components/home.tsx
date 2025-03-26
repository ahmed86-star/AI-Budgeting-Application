import React, { useState, useEffect } from "react";
import Header from "./dashboard/Header";
import FinancialOverview from "./dashboard/FinancialOverview";
import IncomeSection from "./dashboard/IncomeSection";
import BudgetAllocation, {
  BudgetCategory as BudgetCategoryType,
} from "./dashboard/BudgetAllocation";
import ExpenseTracker from "./dashboard/ExpenseTracker";
import SpendingCharts from "./dashboard/SpendingCharts";
import BudgetAlerts, {
  BudgetAlert,
  AlertThresholds,
} from "./dashboard/BudgetAlerts";
import FinancialTips from "./dashboard/FinancialTips";
import ExportOptions from "./dashboard/ExportOptions";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon, RefreshCw, HelpCircle } from "lucide-react";

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  notes?: string;
}

interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
}

const Home = () => {
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load saved data if it exists
  useEffect(() => {
    const savedIncome = localStorage.getItem("userIncome");
    const savedExpenses = localStorage.getItem("userExpenses");

    if (savedIncome) {
      setIncome(parseFloat(savedIncome));
    }

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);
  const [showAddIncome, setShowAddIncome] = useState<boolean>(false);
  const [showAddExpense, setShowAddExpense] = useState<boolean>(false);

  // Function to handle adding income
  const handleAddIncome = () => {
    setShowAddIncome(true);
    // Add your income adding logic here
    console.log("Add income clicked");
  };

  // Function to handle adding expense
  const handleAddExpense = (newExpense?: Omit<Expense, "id">) => {
    if (newExpense) {
      const expenseWithId = {
        ...newExpense,
        id: `expense-${Date.now()}`,
      };
      const updatedExpenses = [expenseWithId, ...expenses];
      setExpenses(updatedExpenses);
      localStorage.setItem("userExpenses", JSON.stringify(updatedExpenses));
      setShowAddExpense(false);

      // Update the spent amount for the corresponding budget category
      const categoryIndex = budgetCategories.findIndex(
        (cat) => cat.name === newExpense.category,
      );

      if (categoryIndex !== -1) {
        const updatedCategories = [...budgetCategories];
        updatedCategories[categoryIndex].spent += newExpense.amount;
        setBudgetCategories(updatedCategories);
        // Create a serializable version without any potential circular references
        const serializableCategories = updatedCategories.map((cat) => ({
          name: cat.name,
          allocated: cat.allocated,
          spent: cat.spent,
        }));

        localStorage.setItem(
          "userBudgetCategories",
          JSON.stringify(serializableCategories),
        );
      }
    } else {
      setShowAddExpense(true);
      console.log("Add expense clicked");
    }
  };
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [alertThresholds, setAlertThresholds] = useState<AlertThresholds>({
    warning: 85,
    danger: 100,
    savingsGoalEnabled: true,
    savingsNotifications: true,
  });
  const [savingsGoal, setSavingsGoal] = useState<number>(0);
  const [savingsProgress, setSavingsProgress] = useState<number>(0);

  // Load savings data if it exists
  useEffect(() => {
    const savedGoal = localStorage.getItem("userSavingsGoal");
    const savedProgress = localStorage.getItem("userSavingsProgress");

    if (savedGoal) {
      setSavingsGoal(parseFloat(savedGoal));
    }

    if (savedProgress) {
      setSavingsProgress(parseFloat(savedProgress));
    }
  }, []);

  // Budget categories with allocations and spending
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(
    [],
  );

  // Initialize or load saved budget categories
  useEffect(() => {
    const savedCategories = localStorage.getItem("userBudgetCategories");

    if (savedCategories) {
      setBudgetCategories(JSON.parse(savedCategories));
    } else {
      // Default empty categories with zero values
      const defaultCategories = [
        { name: "Housing", allocated: 0, spent: 0 },
        { name: "Food", allocated: 0, spent: 0 },
        { name: "Transportation", allocated: 0, spent: 0 },
        { name: "Entertainment", allocated: 0, spent: 0 },
        { name: "Utilities", allocated: 0, spent: 0 },
        { name: "Healthcare", allocated: 0, spent: 0 },
      ];
      setBudgetCategories(defaultCategories);
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    }

    // Load saved alert thresholds from localStorage
    const savedThresholds = localStorage.getItem("alertThresholds");
    if (savedThresholds) {
      try {
        setAlertThresholds(JSON.parse(savedThresholds));
      } catch (e) {
        console.error("Failed to parse saved alert thresholds", e);
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem("theme", newTheme);
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  // Calculate remaining budget
  const remainingBudget = income - totalExpenses;

  // Handle income update
  const handleIncomeUpdate = (newIncome: number) => {
    setIncome(newIncome);
    localStorage.setItem("userIncome", newIncome.toString());

    // Update budget categories with new income value
    if (budgetCategories.length > 0) {
      const updatedCategories = budgetCategories.map((category) => ({
        ...category,
        allocated: Math.round(
          newIncome * (category.allocated / (income || 1)) || 0,
        ),
      }));
      setBudgetCategories(updatedCategories);
      localStorage.setItem(
        "userBudgetCategories",
        JSON.stringify(updatedCategories),
      );
    }
  };

  // Handle dismissing an alert
  const handleDismissAlert = (id: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, dismissed: true } : alert,
      ),
    );
  };

  // Handle updating alert thresholds
  const handleUpdateThresholds = (newThresholds: AlertThresholds) => {
    setAlertThresholds(newThresholds);
    localStorage.setItem("alertThresholds", JSON.stringify(newThresholds));
  };

  // Handle saving budget allocations
  const handleSaveBudget = (categories: BudgetCategoryType[]) => {
    // Validate input categories
    if (!categories || categories.length === 0) {
      console.error("No budget categories provided to handleSaveBudget");
      return;
    }

    console.log("Saving budget categories", categories);

    // Convert the budget categories from BudgetAllocation to the format used in Home
    const updatedBudgetCategories = categories.map((category) => ({
      name: category.name,
      allocated: Math.round((income * category.percentage) / 100),
      spent:
        budgetCategories.find(
          (cat) => cat.name.toLowerCase() === category.name.toLowerCase(),
        )?.spent || 0,
    }));

    // Update state
    setBudgetCategories(updatedBudgetCategories);

    // Save to localStorage - ensure we're not saving React nodes
    const serializableBudgetCategories = updatedBudgetCategories.map((cat) => ({
      name: cat.name,
      allocated: cat.allocated,
      spent: cat.spent,
    }));

    localStorage.setItem(
      "userBudgetCategories",
      JSON.stringify(serializableBudgetCategories),
    );

    // Update the UI to reflect changes immediately
    setTimeout(() => {
      // Force a re-render by updating a state value
      setIncome((prev) => {
        // Save the same value but trigger re-render
        localStorage.setItem("userIncome", prev.toString());
        return prev;
      });
    }, 100);

    console.log(
      "Budget categories saved successfully",
      updatedBudgetCategories,
    );
  };

  // Handle reset of all data
  const handleReset = () => {
    // Clear all localStorage items
    localStorage.removeItem("userIncome");
    localStorage.removeItem("userExpenses");
    localStorage.removeItem("userBudgetCategories");
    localStorage.removeItem("userSavingsGoal");
    localStorage.removeItem("userSavingsProgress");
    localStorage.removeItem("alertThresholds");

    // Reset all state values
    setIncome(0);
    setExpenses([]);
    setSavingsGoal(0);
    setSavingsProgress(0);
    setAlertThresholds({
      warning: 85,
      danger: 100,
      savingsGoalEnabled: true,
      savingsNotifications: true,
    });

    // Reset budget categories to default empty values
    const defaultCategories = [
      { name: "Housing", allocated: 0, spent: 0 },
      { name: "Food", allocated: 0, spent: 0 },
      { name: "Transportation", allocated: 0, spent: 0 },
      { name: "Entertainment", allocated: 0, spent: 0 },
      { name: "Utilities", allocated: 0, spent: 0 },
      { name: "Healthcare", allocated: 0, spent: 0 },
    ];
    setBudgetCategories(defaultCategories);
  };

  return (
    <div
      className={`min-h-screen ${theme === "light" ? "bg-gradient-to-br from-blue-50 to-purple-100" : "bg-gradient-to-br from-gray-900 to-purple-950"}`}
    >
      <Header
        onAddIncome={handleAddIncome}
        onAddExpense={() => handleAddExpense()}
        toggleTheme={toggleTheme}
        theme={theme}
      />

      <div className="container mx-auto px-4 pt-2 flex justify-end gap-2">
        <Button
          onClick={() => (window.location.href = "/support")}
          variant="outline"
          size="sm"
          className={`${theme === "light" ? "bg-white hover:bg-gray-100" : "bg-gray-800 hover:bg-gray-700"} flex items-center gap-1`}
        >
          <HelpCircle className="h-4 w-4" />
          Help & Support
        </Button>
        <Button
          onClick={() => {
            if (
              confirm(
                "Are you sure you want to reset all data? This will clear all your income, expenses, and budget settings.",
              )
            ) {
              handleReset();
              alert("All data has been reset successfully!");
            }
          }}
          variant="outline"
          size="sm"
          className={`${theme === "light" ? "bg-white hover:bg-gray-100" : "bg-gray-800 hover:bg-gray-700"} flex items-center gap-1`}
        >
          <RefreshCw className="h-4 w-4" />
          Reset All Data
        </Button>
      </div>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Financial Overview Section */}
        <FinancialOverview
          totalIncome={income}
          totalExpenses={totalExpenses}
          remainingBudget={remainingBudget}
          savingsGoal={savingsGoal}
          savingsProgress={savingsProgress}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <IncomeSection
              onIncomeUpdate={handleIncomeUpdate}
              initialIncome={income}
            />
          </div>

          {/* Middle and Right Columns */}
          <div className="lg:col-span-2 space-y-6">
            <BudgetAllocation
              income={income}
              onSaveBudget={handleSaveBudget}
              savingsGoal={savingsGoal}
              savingsProgress={savingsProgress}
              onSavingsUpdate={(goal, progress) => {
                setSavingsGoal(goal);
                setSavingsProgress(progress);
                localStorage.setItem("userSavingsGoal", goal.toString());
                localStorage.setItem(
                  "userSavingsProgress",
                  progress.toString(),
                );
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ExpenseTracker
                expenses={expenses}
                onAddExpense={handleAddExpense}
              />
              <div className="md:col-span-1">
                <SpendingCharts />
              </div>
            </div>

            <div className="mt-6">
              <BudgetAlerts
                alerts={alerts}
                onDismissAlert={handleDismissAlert}
                onUpdateThresholds={handleUpdateThresholds}
                thresholds={alertThresholds}
                budgetCategories={budgetCategories}
                savingsGoal={savingsGoal}
                savingsProgress={savingsProgress}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <FinancialTips
                income={income}
                expenses={expenses.map((exp) => exp.amount)}
              />
              <ExportOptions
                expenses={expenses}
                income={income}
                budgetCategories={budgetCategories}
              />
            </div>
          </div>
        </div>
      </main>

      <div className="py-10"></div>
      <footer className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-purple-900 py-6 border-t fixed bottom-0 w-full">
        <div className="container mx-auto px-4 text-center">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-medium text-sm md:text-base">
            © 2025 BudgetAI - AI-Powered Budget Management Dashboard |
            <a
              href="https://github.com/ahmed86-star"
              className="hover:text-blue-500 transition-colors duration-300 font-semibold"
            >
              GitHub
            </a>{" "}
            |
            <a
              href="https://ahmed-dev1.com/"
              className="hover:text-purple-500 transition-colors duration-300 font-semibold"
            >
              Website
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
