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
import { Button } from "./ui/button";
import { MoonIcon, SunIcon, RefreshCw } from "lucide-react";

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
        localStorage.setItem(
          "userBudgetCategories",
          JSON.stringify(updatedCategories),
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

    // Save to localStorage
    localStorage.setItem(
      "userBudgetCategories",
      JSON.stringify(updatedBudgetCategories),
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

      <div className="container mx-auto px-4 pt-2 flex justify-end">
        <Button
          onClick={handleReset}
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

          {/* Middle and Right Columns */}
          <div className="lg:col-span-2 space-y-6">
            <BudgetAllocation income={income} onSaveBudget={handleSaveBudget} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ExpenseTracker
                expenses={expenses}
                onAddExpense={handleAddExpense}
              />
              <div className="md:col-span-1">
                <SpendingCharts />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-purple-900 py-4 border-t mt-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-medium text-sm md:text-base">
            © 2025 BudgetAI - AI-Powered Budget Management Dashboard |{" "}
            <a
              href="https://github.com/ahmed86-star"
              className="hover:text-blue-500 transition-colors duration-300 font-semibold"
            >
              GitHub
            </a>{" "}
            |{" "}
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
