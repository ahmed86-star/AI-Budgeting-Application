import React from "react";
import { Button } from "../ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  PlusCircle,
  Menu,
  DollarSign,
  BarChart3,
  User,
  LogOut,
  Bell,
} from "lucide-react";

interface HeaderProps {
  onAddIncome?: () => void;
  onAddExpense?: () => void;
  toggleTheme?: () => void;
  theme?: "light" | "dark";
}

const Header = ({
  onAddIncome = () => {},
  onAddExpense = () => {},
  toggleTheme = () => {},
  theme = "light",
}: HeaderProps) => {
  return (
    <header className="w-full h-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-2">
        <DollarSign className="h-8 w-8 text-white" />
        <h1 className="text-2xl font-bold text-white">BudgetAI</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex space-x-2">
          <Button
            onClick={onAddIncome}
            variant="secondary"
            className="flex items-center space-x-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Income</span>
          </Button>

          <Button
            onClick={onAddExpense}
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 flex items-center space-x-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Expense</span>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="p-2 text-white hover:bg-white/10 rounded-full"
        >
          {theme === "light" ? (
            <MoonIcon className="h-5 w-5" />
          ) : (
            <SunIcon className="h-5 w-5" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="p-2 text-white hover:bg-white/10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => (window.location.href = "/reports")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Reports</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => (window.location.href = "/alerts")}
              >
                <Bell className="mr-2 h-4 w-4" />
                <span>Budget Alerts</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
