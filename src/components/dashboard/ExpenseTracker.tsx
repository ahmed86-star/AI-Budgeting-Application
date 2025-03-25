import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Calendar, DollarSign, Tag, Clock } from "lucide-react";

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  notes?: string;
}

interface ExpenseTrackerProps {
  expenses?: Expense[];
  onAddExpense?: (expense: Omit<Expense, "id">) => void;
  categories?: string[];
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  expenses = [],
  onAddExpense = () => {},
  categories = [
    "Housing",
    "Transportation",
    "Food",
    "Utilities",
    "Entertainment",
    "Savings",
    "Other",
  ],
}) => {
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    date: "",
    notes: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setNewExpense((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.category || !newExpense.amount || !newExpense.date) return;

    onAddExpense({
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date,
      notes: newExpense.notes,
    });

    // Reset form
    setNewExpense({
      category: "",
      amount: "",
      date: "",
      notes: "",
    });
  };

  return (
    <Card className="w-full max-w-md bg-card shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Expense Tracker
        </CardTitle>
        <CardDescription>
          Track your expenses and monitor your budget
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={newExpense.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="0.00"
                className="pl-9"
                value={newExpense.amount}
                onChange={handleInputChange}
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="date"
                name="date"
                type="date"
                className="pl-9"
                value={newExpense.date}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              name="notes"
              placeholder="Add notes about this expense"
              value={newExpense.notes}
              onChange={handleInputChange}
            />
          </div>

          <Button type="submit" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
          </Button>
        </form>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Clock className="h-4 w-4" /> Recent Expenses
          </h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{expense.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {expense.notes}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      ${expense.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {expense.date}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent expenses
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseTracker;
