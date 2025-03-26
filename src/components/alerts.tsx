import React from "react";
import BudgetAlerts from "./dashboard/BudgetAlerts";
import Header from "./dashboard/Header";

const Alerts = () => {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div
      className={`min-h-screen ${theme === "light" ? "bg-gradient-to-br from-blue-50 to-purple-100" : "bg-gradient-to-br from-gray-900 to-purple-950"}`}
    >
      <Header toggleTheme={toggleTheme} theme={theme} />

      <main className="container mx-auto px-4 py-12 space-y-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Budget Alerts
        </h1>
        <div className="max-w-4xl mx-auto p-8 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-xl border border-muted/10 backdrop-blur-sm">
          <BudgetAlerts />
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

export default Alerts;
