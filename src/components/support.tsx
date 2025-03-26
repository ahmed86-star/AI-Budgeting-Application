import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  MoonIcon,
  SunIcon,
  MessageCircle,
  Mail,
  Bug,
  HelpCircle,
} from "lucide-react";

const Support = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeTab, setActiveTab] = useState("faq");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "billing3932@gmail.com",
    subject: "",
    message: "",
  });

  useEffect(() => {
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log("Form submitted:", formData);
    setFormSubmitted(true);
    // Reset form after submission
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: "",
        email: "billing3932@gmail.com",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <div
      className={`min-h-screen ${theme === "light" ? "bg-gradient-to-br from-blue-50 to-purple-100" : "bg-gradient-to-br from-gray-900 to-purple-950"}`}
      style={{
        backgroundImage:
          theme === "light"
            ? "radial-gradient(circle at top right, rgba(179, 214, 255, 0.3), transparent), linear-gradient(to bottom right, rgba(230, 230, 250, 0.8), rgba(216, 180, 254, 0.3))"
            : "radial-gradient(circle at top right, rgba(76, 29, 149, 0.3), transparent), linear-gradient(to bottom right, rgba(17, 24, 39, 0.9), rgba(88, 28, 135, 0.8))",
      }}
    >
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              BudgetAI
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <div className="flex items-center justify-center">
                  <span className="text-lg mr-1">🌙</span>
                  <MoonIcon className="h-4 w-4" />
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="text-lg mr-1">☀️</span>
                  <SunIcon className="h-4 w-4" />
                </div>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/")}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 flex items-center justify-center gap-3">
            <span className="text-3xl">🛟</span> Help & Support{" "}
            <span className="text-3xl">💬</span>
          </h1>

          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="faq" onClick={() => setActiveTab("faq")}>
                <span className="text-lg mr-1">❓</span>
                <HelpCircle className="h-4 w-4 mr-1" />
                FAQ
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                onClick={() => setActiveTab("contact")}
              >
                <span className="text-lg mr-1">📧</span>
                <MessageCircle className="h-4 w-4 mr-1" />
                Contact Us
              </TabsTrigger>
              <TabsTrigger value="bug" onClick={() => setActiveTab("bug")}>
                <span className="text-lg mr-1">🐞</span>
                <Bug className="h-4 w-4 mr-1" />
                Report a Bug
              </TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">🤔</span> Frequently Asked
                    Questions
                  </CardTitle>
                  <CardDescription>
                    Find answers to common questions about using BudgetAI.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🧠</span> How does the AI
                          suggest budget allocations?
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        Our AI analyzes common financial best practices and
                        standard budget allocation models like the 50/30/20
                        rule. It creates personalized recommendations based on
                        your income level, spending patterns, and financial
                        goals.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        <span className="flex items-center gap-2">
                          <span className="text-lg">📊</span> How do I track my
                          expenses?
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        You can add expenses by clicking the "Add Expense"
                        button in the header. Select a category, enter the
                        amount, date, and optional notes. Your expenses will be
                        tracked and categorized automatically, updating your
                        budget remaining in real-time.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🔒</span> Is my financial
                          data secure?
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        Yes! BudgetAI stores all your financial data locally in
                        your browser using localStorage. Your data never leaves
                        your device and is not sent to any servers. You can
                        clear all data at any time using the "Reset All Data"
                        button.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger>
                        <span className="flex items-center gap-2">
                          <span className="text-lg">⚙️</span> Can I customize my
                          budget categories?
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        Yes, you can customize your budget allocations by
                        clicking the "Customize Allocations" button in the
                        Budget Allocation section. Use the sliders to adjust the
                        percentage for each category, then click "Save
                        Allocations" when you're done.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger>
                        <span className="flex items-center gap-2">
                          <span className="text-lg">📤</span> How do I export my
                          financial data?
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        You can export your financial data by using the Export
                        section. Choose between CSV or PDF formats, select your
                        preferred time period (monthly, quarterly, or yearly),
                        and click the Export button to download your financial
                        report.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">📞</span> Contact Support
                  </CardTitle>
                  <CardDescription>
                    Have a question or need assistance? Send us a message and
                    we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {formSubmitted ? (
                    <div className="bg-green-100 dark:bg-green-900 p-4 rounded-md text-green-800 dark:text-green-200">
                      <p className="font-medium">Message sent successfully!</p>
                      <p className="text-sm mt-1">
                        We'll get back to you as soon as possible.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        <span className="text-lg mr-1">📨</span>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bug">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">🔍</span> Report a Bug
                  </CardTitle>
                  <CardDescription>
                    Found an issue with BudgetAI? Let us know so we can fix it.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {formSubmitted ? (
                    <div className="bg-green-100 dark:bg-green-900 p-4 rounded-md text-green-800 dark:text-green-200">
                      <p className="font-medium">
                        Bug report submitted successfully!
                      </p>
                      <p className="text-sm mt-1">
                        Thank you for helping us improve BudgetAI.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Bug Title</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="Brief description of the issue"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Bug Description</Label>
                        <Textarea
                          id="message"
                          name="message"
                          rows={5}
                          placeholder="Please describe what happened, what you expected to happen, and steps to reproduce the issue."
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        <span className="text-lg mr-1">🐛</span>
                        <Bug className="h-4 w-4 mr-2" />
                        Submit Bug Report
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-purple-900 py-6 border-t fixed bottom-0 w-full backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
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

export default Support;
