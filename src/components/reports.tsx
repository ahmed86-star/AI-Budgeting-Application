import React from "react";
import ReportsPage from "./dashboard/ReportsPage";

const Reports = () => {
  return (
    <>
      <ReportsPage />
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
    </>
  );
};

export default Reports;
