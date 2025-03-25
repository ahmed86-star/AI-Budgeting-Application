import React, { useState, useEffect } from "react";
import { PlusCircle, DollarSign, History } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface IncomeEntry {
  amount: number;
  date: string;
  source?: string;
}

interface IncomeSectionProps {
  onIncomeUpdate?: (amount: number) => void;
  initialIncome?: number;
  incomeHistory?: IncomeEntry[];
}

const IncomeSection = ({
  onIncomeUpdate = () => {},
  initialIncome = 0,
  incomeHistory = [],
}: IncomeSectionProps) => {
  const [income, setIncome] = useState<number>(initialIncome);
  const [history, setHistory] = useState<IncomeEntry[]>(incomeHistory);

  // Load income history if available
  useEffect(() => {
    const savedHistory = localStorage.getItem("incomeHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      amount: "",
      source: "",
    },
  });

  const onSubmit = (values: { amount: string; source: string }) => {
    const newAmount = parseFloat(values.amount);
    if (isNaN(newAmount) || newAmount <= 0) return;

    const newEntry: IncomeEntry = {
      amount: newAmount,
      date: new Date().toISOString().split("T")[0],
      source: values.source || "Income",
    };

    const updatedHistory = [newEntry, ...history];
    const updatedIncome = income + newAmount;

    setHistory(updatedHistory);
    setIncome(updatedIncome);
    onIncomeUpdate(updatedIncome);

    // Save to localStorage
    localStorage.setItem("incomeHistory", JSON.stringify(updatedHistory));
    form.reset();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card className="w-full h-full bg-card shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold text-gray-800">
          <DollarSign className="mr-2 h-5 w-5 text-green-500" />
          Monthly Income
        </CardTitle>
        <CardDescription>
          Enter your income sources to get AI budget recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Current Monthly Income
              </p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(income)}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center"
            >
              <History className="mr-1 h-4 w-4" />
              {showHistory ? "Hide History" : "Show History"}
            </Button>
          </div>

          {showHistory && (
            <div className="mt-4 border rounded-md p-3 bg-gray-50 max-h-40 overflow-y-auto">
              <p className="text-sm font-medium mb-2">Income History</p>
              {history.length > 0 ? (
                <ul className="space-y-2">
                  {history.map((entry, index) => (
                    <li
                      key={index}
                      className="text-sm flex justify-between items-center py-1 border-b border-gray-100 last:border-0"
                    >
                      <span className="font-medium">{entry.source}</span>
                      <div className="flex items-center">
                        <span className="text-green-600 font-medium">
                          {formatCurrency(entry.amount)}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {entry.date}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No income history available
                </p>
              )}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Salary, Freelance, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Income
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-xs text-gray-500">
          Income data is used to generate personalized budget recommendations
        </p>
      </CardFooter>
    </Card>
  );
};

export default IncomeSection;
