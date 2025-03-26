import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Bell,
  Settings,
  Percent,
  DollarSign,
  Target,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { Slider } from "../ui/slider";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";

export interface BudgetAlert {
  id: string;
  type: "warning" | "danger" | "info" | "success";
  title: string;
  description: string;
  date: string;
  category?: string;
  dismissed?: boolean;
}

export interface AlertThresholds {
  warning: number; // percentage of budget (e.g. 85%)
  danger: number; // percentage of budget (e.g. 100%)
  savingsGoalEnabled: boolean;
  savingsNotifications: boolean;
}

interface BudgetAlertsProps {
  alerts?: BudgetAlert[];
  onDismissAlert?: (id: string) => void;
  onUpdateThresholds?: (thresholds: AlertThresholds) => void;
  thresholds?: AlertThresholds;
  budgetCategories?: { name: string; allocated: number; spent: number }[];
  savingsGoal?: number;
  savingsProgress?: number;
}

const BudgetAlerts = ({
  alerts = [],
  onDismissAlert,
  onUpdateThresholds,
  thresholds = {
    warning: 85,
    danger: 100,
    savingsGoalEnabled: true,
    savingsNotifications: true,
  },
  budgetCategories = [],
  savingsGoal = 1000,
  savingsProgress = 750,
}: BudgetAlertsProps) => {
  const [localThresholds, setLocalThresholds] =
    useState<AlertThresholds>(thresholds);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Generate alerts based on budget categories and thresholds
  const generateCategoryAlerts = (): BudgetAlert[] => {
    const categoryAlerts: BudgetAlert[] = [];

    budgetCategories.forEach((category) => {
      const percentUsed = (category.spent / category.allocated) * 100;

      if (percentUsed >= thresholds.danger) {
        categoryAlerts.push({
          id: `auto-danger-${category.name}-${Date.now()}`,
          type: "danger",
          title: `${category.name} Budget Exceeded`,
          description: `You've spent ${percentUsed.toFixed(0)}% of your ${category.name.toLowerCase()} budget.`,
          date: new Date().toLocaleDateString(),
          category: category.name,
        });
      } else if (percentUsed >= thresholds.warning) {
        categoryAlerts.push({
          id: `auto-warning-${category.name}-${Date.now()}`,
          type: "warning",
          title: `${category.name} Budget Alert`,
          description: `You've used ${percentUsed.toFixed(0)}% of your ${category.name.toLowerCase()} budget.`,
          date: new Date().toLocaleDateString(),
          category: category.name,
        });
      }
    });

    return categoryAlerts;
  };

  // Generate savings goal alert
  const generateSavingsAlert = (): BudgetAlert | null => {
    if (!thresholds.savingsGoalEnabled || !thresholds.savingsNotifications)
      return null;

    const percentComplete = (savingsProgress / savingsGoal) * 100;

    if (percentComplete >= 100) {
      return {
        id: `auto-savings-complete-${Date.now()}`,
        type: "success",
        title: "Savings Goal Achieved!",
        description: `Congratulations! You've reached your savings goal of ${savingsGoal.toFixed(0)}.`,
        date: new Date().toLocaleDateString(),
      };
    } else if (percentComplete >= 75) {
      return {
        id: `auto-savings-progress-${Date.now()}`,
        type: "info",
        title: "Savings Goal Progress",
        description: `You're ${percentComplete.toFixed(0)}% of the way to your savings goal of ${savingsGoal.toFixed(0)}.`,
        date: new Date().toLocaleDateString(),
      };
    }

    return null;
  };

  // Default alerts if none are provided
  const defaultAlerts: BudgetAlert[] = [
    {
      id: "1",
      type: "danger",
      title: "Food Budget Exceeded",
      description: "You've spent 110% of your food budget this month.",
      date: new Date().toLocaleDateString(),
      category: "Food",
    },
    {
      id: "2",
      type: "warning",
      title: "Entertainment Budget Alert",
      description: "You've used 85% of your entertainment budget.",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      category: "Entertainment",
    },
    {
      id: "3",
      type: "info",
      title: "Savings Goal Progress",
      description: "You're on track to meet your savings goal this month!",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    },
    {
      id: "4",
      type: "success",
      title: "Transportation Budget Under Control",
      description:
        "Great job! You've only used 60% of your transportation budget.",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      category: "Transportation",
    },
  ];

  // Combine all alerts
  const generatedAlerts = [...generateCategoryAlerts()];
  const savingsAlert = generateSavingsAlert();
  if (savingsAlert) generatedAlerts.push(savingsAlert);

  // Use provided alerts, generated alerts, or default alerts
  const displayAlerts =
    alerts.length > 0
      ? alerts
      : generatedAlerts.length > 0
        ? generatedAlerts
        : defaultAlerts;

  // Filter out dismissed alerts
  const filteredAlerts = displayAlerts.filter((alert) => !alert.dismissed);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "danger":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "success":
        return <Target className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "danger":
        return "destructive";
      case "warning":
        return "default";
      case "info":
        return "default";
      case "success":
        return "default";
      default:
        return "default";
    }
  };

  const getAlertBorderColor = (type: string) => {
    switch (type) {
      case "danger":
        return "border-red-500";
      case "warning":
        return "border-amber-500";
      case "info":
        return "border-blue-500";
      case "success":
        return "border-green-500";
      default:
        return "border-blue-500";
    }
  };

  const getAlertBackground = (type: string) => {
    switch (type) {
      case "danger":
        return "bg-red-50 dark:bg-red-950/30";
      case "warning":
        return "bg-amber-50 dark:bg-amber-950/30";
      case "info":
        return "bg-blue-50 dark:bg-blue-950/30";
      case "success":
        return "bg-green-50 dark:bg-green-950/30";
      default:
        return "";
    }
  };

  const handleDismissAlert = (id: string) => {
    if (onDismissAlert) {
      onDismissAlert(id);
    }
  };

  const handleSaveThresholds = () => {
    if (onUpdateThresholds) {
      onUpdateThresholds(localThresholds);
    }
    setIsSettingsOpen(false);
  };

  return (
    <Card className="w-full h-full bg-card shadow-lg border border-muted/20">
      <CardHeader className="pb-4 flex flex-row items-center justify-between sticky top-0 bg-card z-10">
        <CardTitle className="text-xl font-bold flex items-center gap-3">
          <Bell className="h-6 w-6 text-primary" />
          Budget Alerts
        </CardTitle>
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alert Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="flex items-center justify-between">
                  Warning Threshold
                  <span className="text-amber-500 flex items-center gap-1">
                    <Percent className="h-3 w-3" /> {localThresholds.warning}%
                  </span>
                </Label>
                <Slider
                  value={[localThresholds.warning]}
                  min={50}
                  max={99}
                  step={1}
                  onValueChange={(value) =>
                    setLocalThresholds({
                      ...localThresholds,
                      warning: value[0],
                    })
                  }
                  className="amber"
                />
                <p className="text-xs text-muted-foreground">
                  Alert when category spending reaches this percentage of budget
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center justify-between">
                  Danger Threshold
                  <span className="text-red-500 flex items-center gap-1">
                    <Percent className="h-3 w-3" /> {localThresholds.danger}%
                  </span>
                </Label>
                <Slider
                  value={[localThresholds.danger]}
                  min={80}
                  max={120}
                  step={1}
                  onValueChange={(value) =>
                    setLocalThresholds({ ...localThresholds, danger: value[0] })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Alert when category spending exceeds this percentage of budget
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <Label htmlFor="savings-goal-enabled">
                    Savings Goal Tracking
                  </Label>
                  <Switch
                    id="savings-goal-enabled"
                    checked={localThresholds.savingsGoalEnabled}
                    onCheckedChange={(checked) =>
                      setLocalThresholds({
                        ...localThresholds,
                        savingsGoalEnabled: checked,
                      })
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Track progress toward your savings goals
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="savings-notifications">
                    Savings Notifications
                  </Label>
                  <Switch
                    id="savings-notifications"
                    checked={localThresholds.savingsNotifications}
                    onCheckedChange={(checked) =>
                      setLocalThresholds({
                        ...localThresholds,
                        savingsNotifications: checked,
                      })
                    }
                    disabled={!localThresholds.savingsGoalEnabled}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Receive alerts about your savings progress
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveThresholds}>Save Settings</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-6 max-h-[500px] overflow-y-auto p-6 pt-2">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <Alert
              key={alert.id}
              variant={getAlertVariant(alert.type)}
              className={`${getAlertBorderColor(alert.type)} ${getAlertBackground(alert.type)} border-l-4 shadow-sm transition-all hover:shadow-md group relative mb-5 p-5 rounded-md`}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">{getAlertIcon(alert.type)}</div>
                <div className="flex-1">
                  <AlertTitle className="font-medium flex items-center gap-2">
                    {alert.title}
                    {alert.category && (
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
                        {alert.category}
                      </span>
                    )}
                  </AlertTitle>
                  <AlertDescription className="text-sm mt-1">
                    {alert.description}
                  </AlertDescription>
                  <p className="text-xs text-muted-foreground mt-2">
                    {alert.date}
                  </p>
                </div>
                {onDismissAlert && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => handleDismissAlert(alert.id)}
                  >
                    <span className="sr-only">Dismiss</span>
                    <span aria-hidden="true">&times;</span>
                  </Button>
                )}
              </div>
            </Alert>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-20" />
            <p>No budget alerts at this time</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 pb-4 px-6 border-t border-muted/10 mt-2">
        <p className="text-xs text-muted-foreground w-full text-center">
          Alerts are generated based on your spending patterns and budget
          thresholds
        </p>
      </CardFooter>
    </Card>
  );
};

export default BudgetAlerts;
