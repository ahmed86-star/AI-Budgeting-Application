import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Lightbulb, TrendingUp, DollarSign, PiggyBank } from "lucide-react";

interface FinancialTip {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FinancialTipsProps {
  tips?: FinancialTip[];
  income?: number;
  expenses?: number[];
}

const FinancialTips = ({
  tips,
  income = 0,
  expenses = [],
}: FinancialTipsProps) => {
  // Generate default tips if none provided
  const defaultTips: FinancialTip[] = [
    {
      id: "tip1",
      title: "50/30/20 Rule",
      description:
        "Consider allocating 50% of income to needs, 30% to wants, and 20% to savings for financial stability.",
      icon: <PiggyBank className="h-5 w-5" />,
    },
    {
      id: "tip2",
      title: "Emergency Fund",
      description:
        "Aim to save 3-6 months of expenses in an emergency fund for unexpected financial challenges.",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      id: "tip3",
      title: "Expense Tracking",
      description:
        "Track all expenses for a month to identify spending patterns and potential areas to cut back.",
      icon: <TrendingUp className="h-5 w-5" />,
    },
  ];

  // Calculate total expenses
  const totalExpenses = Array.isArray(expenses)
    ? expenses.reduce(
        (sum, expense) => sum + (typeof expense === "number" ? expense : 0),
        0,
      )
    : 0;

  // Generate personalized tips based on user's financial data
  const generatePersonalizedTips = (): FinancialTip[] => {
    const personalizedTips: FinancialTip[] = [];

    // If spending more than 90% of income
    if (income > 0 && totalExpenses > income * 0.9) {
      personalizedTips.push({
        id: "personal1",
        title: "Spending Alert",
        description: `You're currently spending ${Math.round((totalExpenses / income) * 100)}% of your income. Consider reviewing non-essential expenses to increase savings.`,
        icon: <Lightbulb className="h-5 w-5" />,
      });
    }

    // If saving more than 20% of income
    if (income > 0 && totalExpenses < income * 0.8) {
      personalizedTips.push({
        id: "personal2",
        title: "Great Saving Habits",
        description: `You're saving ${Math.round(((income - totalExpenses) / income) * 100)}% of your income. Consider investing some of your savings for long-term growth.`,
        icon: <TrendingUp className="h-5 w-5" />,
      });
    }

    // If income is very low or not set
    if (income < 1000 && income > 0) {
      personalizedTips.push({
        id: "personal3",
        title: "Income Growth",
        description:
          "Consider exploring additional income sources or skills development to increase your earning potential.",
        icon: <DollarSign className="h-5 w-5" />,
      });
    }

    return personalizedTips.length > 0 ? personalizedTips : defaultTips;
  };

  const displayTips = tips || generatePersonalizedTips();

  return (
    <Card className="w-full bg-card shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Smart Financial Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayTips.map((tip) => (
            <div
              key={tip.id}
              className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  {tip.icon}
                </div>
                <div>
                  <h3 className="font-medium text-base">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tip.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialTips;
