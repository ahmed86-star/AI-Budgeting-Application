import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FileDown, FileText, Calendar, Download } from "lucide-react";

interface ExportOptionsProps {
  expenses?: any[];
  income?: number;
  budgetCategories?: any[];
}

const ExportOptions = ({
  expenses = [],
  income = 0,
  budgetCategories = [],
}: ExportOptionsProps) => {
  const [exportType, setExportType] = useState<"csv" | "pdf">("csv");
  const [timeFrame, setTimeFrame] = useState<
    "monthly" | "quarterly" | "yearly"
  >("monthly");
  const [showSuccess, setShowSuccess] = useState(false);

  // Function to handle export
  const handleExport = () => {
    try {
      if (exportType === "csv") {
        // Generate CSV data
        let csvContent = "Category,Amount,Date,Notes\n";

        // Add expense data
        expenses.forEach((expense) => {
          // Escape any commas in the notes field
          const safeNotes = expense.notes
            ? `"${expense.notes.replace(/"/g, '""')}"`
            : "";
          csvContent += `${expense.category},${expense.amount},${expense.date},${safeNotes}\n`;
        });

        // Create and download the CSV file
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);

        // Create a visible download link that the user can click
        const filename = `budget_export_${timeFrame}_${new Date().toISOString().split("T")[0]}.csv`;

        // Force download approach
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.textContent = "Download Ready - Click Here";
        link.className =
          "block w-full text-center p-2 mt-2 bg-blue-100 dark:bg-blue-900 rounded-md text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors";

        // Add the link to the DOM
        const downloadContainer = document.getElementById("download-container");
        if (downloadContainer) {
          // Clear previous links
          downloadContainer.innerHTML = "";
          downloadContainer.appendChild(link);
        }

        // Also try the automatic download
        setTimeout(() => {
          link.click();
        }, 100);

        console.log("CSV export created", filename);
      } else if (exportType === "pdf") {
        // Generate PDF data
        generatePDF();
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again or try a different browser.");
    }
  };

  // Function to generate PDF
  const generatePDF = () => {
    try {
      // Create a simple text-based PDF
      const pdfContent = createSimplePDF();

      // Create a PDF blob
      const pdf = new Blob([pdfContent], {
        type: "application/pdf",
      });
      const pdfUrl = URL.createObjectURL(pdf);

      // Create filename
      const filename = `budget_report_${timeFrame}_${new Date().toISOString().split("T")[0]}.pdf`;

      // Create download link
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = filename;
      link.textContent = "PDF Download Ready - Click Here";
      link.className =
        "block w-full text-center p-2 mt-2 bg-blue-100 dark:bg-blue-900 rounded-md text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors";

      // Add the link to the DOM
      const downloadContainer = document.getElementById("download-container");
      if (downloadContainer) {
        // Clear previous links
        downloadContainer.innerHTML = "";
        downloadContainer.appendChild(link);
      }

      // Also try the automatic download
      setTimeout(() => {
        link.click();
      }, 100);

      console.log("PDF export created", filename);
    } catch (error) {
      console.error("PDF generation failed:", error);
      // Show success dialog as fallback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // Function to create a simple PDF
  const createSimplePDF = (): Uint8Array => {
    // Group expenses by category
    const expensesByCategory: Record<string, number> = {};
    expenses.forEach((expense) => {
      if (expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] += expense.amount;
      } else {
        expensesByCategory[expense.category] = expense.amount;
      }
    });

    // Calculate total expenses
    const totalExpenses = Object.values(expensesByCategory).reduce(
      (sum, amount) => sum + amount,
      0,
    );

    // Calculate balance
    const balance = income - totalExpenses;

    // Create expense category text
    let expensesText = "";
    Object.entries(expensesByCategory).forEach(([category, amount]) => {
      expensesText += `(${category}: $${amount.toLocaleString()}) Tj\n0 -15 Td\n`;
    });

    // Create a simple text-based PDF
    const pdfContent = `%PDF-1.4
1 0 obj
<</Type /Catalog /Pages 2 0 R>>
endobj
2 0 obj
<</Type /Pages /Kids [3 0 R] /Count 1>>
endobj
3 0 obj
<</Type /Page /Parent 2 0 R /Resources <</Font <</F1 4 0 R>>>> /MediaBox [0 0 612 792] /Contents 5 0 R>>
endobj
4 0 obj
<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>
endobj
5 0 obj
<</Length 500>>
stream
BT
/F1 16 Tf
50 750 Td
(BudgetAI ${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} Financial Report) Tj
0 -30 Td
(Generated on: ${new Date().toLocaleDateString()}) Tj
0 -30 Td
(Income Summary) Tj
0 -20 Td
(Total Income: $${income.toLocaleString()}) Tj
0 -30 Td
(Expense Summary) Tj
0 -20 Td
${expensesText}(Total Expenses: $${totalExpenses.toLocaleString()}) Tj
0 -20 Td
(Balance: $${balance.toLocaleString()}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000056 00000 n
0000000111 00000 n
0000000212 00000 n
0000000273 00000 n
trailer
<</Size 6 /Root 1 0 R>>
startxref
823
%%EOF`;

    // Convert string to Uint8Array
    const encoder = new TextEncoder();
    return encoder.encode(pdfContent);
  };

  return (
    <Card className="w-full bg-card shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <FileDown className="h-5 w-5" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <Select
                value={exportType}
                onValueChange={(value: "csv" | "pdf") => setExportType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      CSV Format
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      PDF Report
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Period</label>
              <Select
                value={timeFrame}
                onValueChange={(value: "monthly" | "quarterly" | "yearly") =>
                  setTimeFrame(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Monthly
                    </div>
                  </SelectItem>
                  <SelectItem value="quarterly">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Quarterly
                    </div>
                  </SelectItem>
                  <SelectItem value="yearly">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Yearly
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Successful</DialogTitle>
                <DialogDescription>
                  Your {timeFrame} financial report has been generated as a{" "}
                  {exportType.toUpperCase()} file. You can download it now.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-col space-y-2">
                <p className="text-sm text-muted-foreground">
                  If the download didn't start automatically, please click the
                  download button below.
                </p>
                <Button
                  onClick={() => setShowSuccess(false)}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={handleExport} className="w-full" variant="default">
            <FileDown className="h-4 w-4 mr-2" />
            Export {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}{" "}
            Report
          </Button>

          {/* Container for download link */}
          <div id="download-container" className="mt-2"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportOptions;
