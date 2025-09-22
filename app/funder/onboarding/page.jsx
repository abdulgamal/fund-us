"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FunderOnboardingPage() {
  const [currentTab, setCurrentTab] = useState("business-model");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState({
    // Business Model fields
    businessModel: [],
    captureFinancialPerformance: "",
    externalUnderwriting: "",
    loanProducts: "",
    sbaLender: "",
    startingCapital: "",
    capitalSources: "",
    externalPartners: "",

    // Lending Products fields
    amortizationMethods: [],
    otherAmortization: "",
    interestMethods: [],
    otherInterestMethod: "",
    interestRateSourcing: "",
    underwritingMethods: [],
    otherUnderwritingMethod: "",
    qualificationCriteria: "",
    collateralTypes: "",
    liabilities: "",

    // Customer Support fields
    serviceRegions: "",
    impactReporting: [],
    otherImpact: "",
    kycMethods: "",
    techAssistance: "",
    reportingMetrics: "",

    // Integration fields
    paymentMethods: [],
    otherPaymentMethod: "",
    metro2Reporting: [],
    otherMetro2Method: "",
    externalIntegration: "",
    externalSystems: "",
    systemsNames: "",

    // Operations fields
    accessControl: "",
    loanDocumentation: "",
    operationalProcesses: "",
    reportingNeeds: "",
    complianceRequirements: "",

    // Governance fields
    cybersecurityPolicy: "",
    regulatoryCompliance: "",
    systemUsers: [
      { name: "", email: "", department: "", title: "", accessLevel: "" },
    ],
  });

  const [completedTabs, setCompletedTabs] = useState({});
  const [showMobileTabs, setShowMobileTabs] = useState(false);

  const router = useRouter();

  const tabs = [
    { id: "business-model", label: "Business Model" },
    { id: "lending-products", label: "Lending Products" },
    { id: "customer-support", label: "Customer Support" },
    { id: "integration", label: "Integration" },
    { id: "operations", label: "Operations" },
    { id: "governance", label: "Governance" },
  ];

  const questions = {
    "business-model": [
      {
        id: "businessModel",
        type: "checkbox",
        label:
          "Are you a CDFI / nonprofit business loan fund, Credit Union / not-for-profit or Bank or for-profit entity? Choose all that apply.*",
        options: [
          { id: "cdfi", label: "CDFI / Nonprofit", value: "cdfi" },
          {
            id: "credit-union",
            label: "Credit Union / Not-for-profit",
            value: "credit-union",
          },
          {
            id: "for-profit",
            label: "Bank or other For-profit",
            value: "for-profit",
          },
        ],
      },
      {
        id: "captureFinancialPerformance",
        type: "radio",
        label:
          "Do you want to capture the financial performance of your borrowers in real-time?*",
        options: [
          { id: "capture-yes", label: "Yes", value: "yes" },
          { id: "capture-no", label: "No", value: "no" },
        ],
      },
      {
        id: "externalUnderwriting",
        type: "radio",
        label: "Do you do external underwriting?*",
        options: [
          { id: "underwriting-yes", label: "Yes", value: "yes" },
          { id: "underwriting-no", label: "No", value: "no" },
        ],
      },
      {
        id: "loanProducts",
        type: "textarea",
        label:
          "Describe the loan products or services you are offering? (e.g., microloans, business loans, credit lines)*",
        placeholder: "Describe your loan products and services...",
      },
      {
        id: "sbaLender",
        type: "radio",
        label: "Are you an SBA lender?*",
        options: [
          { id: "sba-yes", label: "Yes", value: "yes" },
          { id: "sba-no", label: "No", value: "no" },
        ],
      },
      {
        id: "startingCapital",
        type: "input",
        label:
          "Currently, how much lending capital do you want to start with in your treasury?*",
        placeholder: "Enter amount (e.g., $1,000,000)",
      },
      {
        id: "capitalSources",
        type: "textarea",
        label:
          "Provide the name of your funds (i.e. capital source names) you would like setup in the system?*",
        placeholder: "List your capital source names...",
      },
      {
        id: "externalPartners",
        type: "textarea",
        label: "Who are your external funding partners?*",
        placeholder: "List your external funding partners...",
      },
    ],
    "lending-products": [
      {
        id: "amortizationMethods",
        type: "checkbox",
        label: "Which amortization methods do you use? Choose all that apply.*",
        options: [
          {
            id: "fixed-payment",
            label: "Fixed Payment",
            value: "Fixed Payment",
          },
          {
            id: "interest-only",
            label: "Interest Only",
            value: "Interest Only",
          },
          { id: "balloon-loan", label: "Balloon Loan", value: "Balloon Loan" },
          {
            id: "negative-amortization",
            label: "Negative Amortization",
            value: "Negative Amortization",
          },
          {
            id: "straight-line",
            label: "Straight Line (Constant Principle)",
            value: "Straight Line (Constant Principle)",
          },
          {
            id: "step-up-step-down",
            label: "Step-Up Step-Down",
            value: "Step-Up Step-Down",
          },
          {
            id: "revolving-credit",
            label: "Revolving Credit (Non-Amortizing)",
            value: "Revolving Credit (Non-Amortizing)",
          },
          { id: "seasonal", label: "Seasonal", value: "Seasonal" },
        ],
        hasOther: true,
        otherId: "otherAmortization",
      },
      {
        id: "interestMethods",
        type: "checkbox",
        label: "Which method do you use to calculate interest?*",
        options: [
          {
            id: "simple-interest",
            label: "Simple Interest",
            value: "Simple Interest",
          },
          {
            id: "compound-interest",
            label: "Compound Interest",
            value: "Compound Interest",
          },
          {
            id: "flat-interest",
            label: "Flat Interest",
            value: "Flat Interest",
          },
          {
            id: "precomputed-interest",
            label: "Precomputed Interest",
            value: "Precomputed Interest",
          },
          {
            id: "declining-balance",
            label: "Declining Balance",
            value: "Declining Balance",
          },
          {
            id: "variable-interest",
            label: "Variable Interest",
            value: "Variable Interest",
          },
          {
            id: "fixed-interest",
            label: "Fixed Interest",
            value: "Fixed Interest",
          },
          { id: "apr", label: "APR", value: "APR" },
        ],
        hasOther: true,
        otherId: "otherInterestMethod",
      },
      {
        id: "interestRateSourcing",
        type: "textarea",
        label:
          "How do you determine or update your interest rates? (e.g., based on prime rates, internal policy)*",
        placeholder: "Describe how you determine and update interest rates...",
      },
      {
        id: "underwritingMethods",
        type: "checkbox",
        label:
          "Provide the various methods you would like to use for your underwriting process?*",
        options: [
          {
            id: "automated-rules",
            label: "Automated Rules",
            value: "Automated Rules",
          },
          { id: "manual", label: "Manual", value: "Manual" },
          {
            id: "score-based",
            label: "Score Based (e.g. FICO)",
            value: "Score Based (e.g. FICO)",
          },
          {
            id: "cashflow",
            label: "Cashflow (e.g. POS data)",
            value: "Cashflow (e.g. POS data)",
          },
          { id: "collateral", label: "Collateral", value: "Collateral" },
          {
            id: "behavioral",
            label: "Behavioral (e.g. Deposit patterns)",
            value: "Behavioral (e.g. Deposit patterns)",
          },
          {
            id: "income-based",
            label: "Income Based (e.g. Income stability)",
            value: "Income Based (e.g. Income stability)",
          },
        ],
        hasOther: true,
        otherId: "otherUnderwritingMethod",
      },
      {
        id: "qualificationCriteria",
        type: "textarea",
        label:
          "What are some other eligibility requirements you'd like to highlight?*",
        placeholder: "Describe additional eligibility requirements...",
      },
      {
        id: "collateralTypes",
        type: "textarea",
        label:
          "What types of collateral do you accept for loans? (e.g., property, equipment, guarantees)*",
        placeholder: "List the types of collateral you accept...",
      },
      {
        id: "liabilities",
        type: "textarea",
        label:
          "What current liabilities or outstanding debts does your organization have?*",
        placeholder:
          "Describe your organization's current liabilities and debts...",
      },
    ],
    "customer-support": [
      {
        id: "serviceRegions",
        type: "textarea",
        label:
          "What regions do you service? Provide regional locations and limitations.*",
        placeholder: "Describe the regions you service and any limitations...",
      },
      {
        id: "impactReporting",
        type: "checkbox",
        label:
          "What impact reporting do you want to focus on? Choose those that apply.*",
        options: [
          { id: "job-creation", label: "Job Creation", value: "Job Creation" },
          {
            id: "wealth-development",
            label: "Wealth Development",
            value: "Wealth Development",
          },
          { id: "stem-impact", label: "STEM Impact", value: "STEM Impact" },
          {
            id: "female-business-growth",
            label: "Female Business Growth",
            value: "Female Business Growth",
          },
          {
            id: "minority-business-self-sufficiency",
            label: "Minority Business Self-Sufficiency",
            value: "Minority Business Self-Sufficiency",
          },
          {
            id: "rural-agri-business-development",
            label: "Rural / Agri-Business Development",
            value: "Rural / Agri-Business Development",
          },
          {
            id: "environmental",
            label: "Environmental",
            value: "Environmental",
          },
          {
            id: "new-entrepreneurial-growth",
            label: "New Entrepreneurial Growth",
            value: "New Entrepreneurial Growth",
          },
        ],
        hasOther: true,
        otherId: "otherImpact",
      },
      {
        id: "kycMethods",
        type: "textarea",
        label:
          "What identity verification steps do you use? Provide all methods (e.g., ID checks, LexisNexis...etc)*",
        placeholder: "Describe your identity verification methods...",
      },
      {
        id: "techAssistance",
        type: "textarea",
        label:
          "What types of technical assistance or support services do you offer to customers?*",
        placeholder:
          "Describe your technical assistance and support services...",
      },
      {
        id: "reportingMetrics",
        type: "textarea",
        label:
          "What key reporting metrics and insights do you need from the system? (e.g., loan performance, portfolio at risk)*",
        placeholder: "Describe the reporting metrics and insights you need...",
      },
    ],
    integration: [
      {
        id: "paymentMethods",
        type: "checkbox",
        label:
          "What payment transfer methods do you use or plan to use? Choose all that apply.*",
        options: [
          { id: "ach", label: "ACH", value: "ACH" },
          {
            id: "wire-transfer",
            label: "Wire Transfer",
            value: "Wire Transfer",
          },
          { id: "mobile-money", label: "Mobile Money", value: "Mobile Money" },
          {
            id: "mail-in-check",
            label: "Mail in Check",
            value: "Mail in Check",
          },
        ],
        hasOther: true,
        otherId: "otherPaymentMethod",
      },
      {
        id: "metro2Reporting",
        type: "checkbox",
        label:
          "How do you currently do your Metro2 reporting? Choose all that apply.*",
        options: [
          { id: "integration", label: "Integration", value: "Integration" },
          { id: "uploads", label: "Uploads", value: "Uploads" },
        ],
        hasOther: true,
        otherId: "otherMetro2Method",
      },
      {
        id: "externalIntegration",
        type: "radio",
        label:
          "Will you need to integrate with any external systems, such as Accounting, CRM, HR...etc?*",
        options: [
          { id: "external-integration-yes", label: "Yes", value: "yes" },
          { id: "external-integration-no", label: "No", value: "no" },
        ],
      },
      {
        id: "externalSystems",
        type: "textarea",
        label:
          "Please specify which external systems you need to integrate with:",
        placeholder:
          "List the external systems you need to integrate with (e.g., QuickBooks, Salesforce, etc.)",
        condition: (formData) => formData.externalIntegration === "yes",
      },
      {
        id: "systemsNames",
        type: "textarea",
        label:
          "Provide the names of the systems that you will need integration with",
        placeholder: "List the names of the systems for integration",
      },
    ],
    operations: [
      {
        id: "accessControl",
        type: "textarea",
        label:
          "Who manages user access, permissions, and administrative control of your system?*",
        placeholder:
          "Describe who manages user access and permissions in your organization...",
      },
      {
        id: "loanDocumentation",
        type: "radio",
        label: "Do you have all your loan terms documented or templatized?*",
        options: [
          { id: "documentation-yes", label: "Yes", value: "yes" },
          { id: "documentation-no", label: "No", value: "no" },
        ],
      },
      {
        id: "operationalProcesses",
        type: "textarea",
        label:
          "Describe your current loan origination and servicing processes:*",
        placeholder:
          "Describe your current processes for loan origination, servicing, and management...",
      },
      {
        id: "reportingNeeds",
        type: "textarea",
        label:
          "What specific reports or dashboards do you need for daily operations?*",
        placeholder:
          "List the specific reports and dashboards you need for daily operations...",
      },
      {
        id: "complianceRequirements",
        type: "textarea",
        label:
          "What compliance requirements or regulations do you need to adhere to?*",
        placeholder: "List your compliance requirements and regulations...",
      },
    ],
    governance: [
      {
        id: "cybersecurityPolicy",
        type: "textarea",
        label:
          "Do you have cybersecurity policies in place? If so, please describe them.*",
        placeholder: "Describe your cybersecurity policies and procedures...",
      },
      {
        id: "regulatoryCompliance",
        type: "textarea",
        label:
          "Beyond IRS and Treasury (CDFI Fund), what other regulatory audits or compliance requirements do you need to highlight and follow?*",
        placeholder:
          "List additional regulatory audits and compliance requirements...",
      },
      {
        id: "systemUsers",
        type: "users",
        label:
          "Who will use the system (e.g., loan officers, admins, leadership), and what roles will they have?*",
        description:
          "Please provide their names, emails, department/team, role/title and access levels (admin, manager, user, read only).",
      },
    ],
  };

  const currentQuestions = questions[currentTab] || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const isLastQuestionInTab =
    currentQuestionIndex === currentQuestions.length - 1;
  const isTabCompleted = completedTabs[currentTab];
  const isLastTab = currentTab === tabs[tabs.length - 1].id;

  const progress =
    ((tabs.findIndex((tab) => tab.id === currentTab) + 1) / tabs.length) * 100;

  const handleNext = () => {
    if (isLastQuestionInTab) {
      // Mark this tab as completed
      setCompletedTabs((prev) => ({ ...prev, [currentTab]: true }));

      // Move to next tab
      const currentTabIndex = tabs.findIndex((tab) => tab.id === currentTab);
      if (currentTabIndex < tabs.length - 1) {
        setCurrentTab(tabs[currentTabIndex + 1].id);
        setCurrentQuestionIndex(0);
      }
    } else {
      // Move to next question in current tab
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (isTabCompleted) {
      // If we're viewing the completion screen, go back to the last question
      setCompletedTabs((prev) => ({ ...prev, [currentTab]: false }));
      setCurrentQuestionIndex(currentQuestions.length - 1);
    } else if (currentQuestionIndex > 0) {
      // Move to previous question in current tab
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // Move to previous tab
      const currentTabIndex = tabs.findIndex((tab) => tab.id === currentTab);
      if (currentTabIndex > 0) {
        const prevTab = tabs[currentTabIndex - 1].id;
        setCurrentTab(prevTab);
        // If the previous tab is completed, show completion screen, otherwise show last question
        if (completedTabs[prevTab]) {
          setCurrentQuestionIndex(questions[prevTab].length);
        } else {
          setCurrentQuestionIndex(questions[prevTab].length - 1);
        }
      }
    }
  };

  const handleUserChange = (index, field, value) => {
    const updatedUsers = [...(formData.systemUsers || [])];
    updatedUsers[index] = { ...updatedUsers[index], [field]: value };
    setFormData({ ...formData, systemUsers: updatedUsers });
  };

  const handleSubmit = () => {
    console.log("Funder onboarding submitted:", formData);
    router.push("/loans");
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case "checkbox":
        return (
          <div className="space-y-4">
            <Label className="text-base font-medium">
              {currentQuestion.label}
            </Label>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={formData[currentQuestion.id]?.includes(
                      option.value
                    )}
                    onCheckedChange={(checked) => {
                      const current = formData[currentQuestion.id] || [];
                      setFormData({
                        ...formData,
                        [currentQuestion.id]: checked
                          ? [...current, option.value]
                          : current.filter((item) => item !== option.value),
                      });
                    }}
                  />
                  <Label htmlFor={option.id} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            {currentQuestion.hasOther && (
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                  id="other"
                  checked={formData[currentQuestion.id]?.includes("other")}
                  onCheckedChange={(checked) => {
                    const current = formData[currentQuestion.id] || [];
                    setFormData({
                      ...formData,
                      [currentQuestion.id]: checked
                        ? [...current, "other"]
                        : current.filter((item) => item !== "other"),
                    });
                  }}
                />
                <Label htmlFor="other" className="cursor-pointer">
                  Other:
                </Label>
                {formData[currentQuestion.id]?.includes("other") && (
                  <Input
                    placeholder="Specify other"
                    className="ml-2 flex-1"
                    value={formData[currentQuestion.otherId] || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [currentQuestion.otherId]: e.target.value,
                      })
                    }
                  />
                )}
              </div>
            )}
          </div>
        );

      case "radio":
        return (
          <div className="space-y-4">
            <Label className="text-base font-medium">
              {currentQuestion.label}
            </Label>
            <RadioGroup
              value={formData[currentQuestion.id] || ""}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  [currentQuestion.id]: value,
                })
              }
              className="space-y-2"
            >
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.id} />
                  <Label htmlFor={option.id} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "input":
        return (
          <div className="space-y-4">
            <Label
              htmlFor={currentQuestion.id}
              className="text-base font-medium"
            >
              {currentQuestion.label}
            </Label>
            <Input
              id={currentQuestion.id}
              type="text"
              value={formData[currentQuestion.id] || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [currentQuestion.id]: e.target.value,
                })
              }
              placeholder={currentQuestion.placeholder}
              required
            />
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-4">
            <Label
              htmlFor={currentQuestion.id}
              className="text-base font-medium"
            >
              {currentQuestion.label}
            </Label>
            <textarea
              id={currentQuestion.id}
              rows={4}
              value={formData[currentQuestion.id] || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [currentQuestion.id]: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={currentQuestion.placeholder}
              required
            />
          </div>
        );

      case "users":
        return (
          <div className="space-y-4">
            <Label className="text-base font-medium">
              {currentQuestion.label}
            </Label>
            <p className="text-sm text-gray-600 mb-4">
              {currentQuestion.description}
            </p>

            {formData.systemUsers?.map((user, index) => (
              <div
                key={index}
                className="space-y-4 p-4 border border-gray-200 rounded-md"
              >
                {index > 0 && (
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">User {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updatedUsers = formData.systemUsers.filter(
                          (_, i) => i !== index
                        );
                        setFormData({
                          ...formData,
                          systemUsers: updatedUsers,
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <Input
                      value={user.name || ""}
                      onChange={(e) =>
                        handleUserChange(index, "name", e.target.value)
                      }
                      placeholder="Full name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <Input
                      type="email"
                      value={user.email || ""}
                      onChange={(e) =>
                        handleUserChange(index, "email", e.target.value)
                      }
                      placeholder="email@example.com"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Department/Team
                    </Label>
                    <Input
                      value={user.department || ""}
                      onChange={(e) =>
                        handleUserChange(index, "department", e.target.value)
                      }
                      placeholder="e.g., Lending, Administration"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Role/Title</Label>
                    <Input
                      value={user.title || ""}
                      onChange={(e) =>
                        handleUserChange(index, "title", e.target.value)
                      }
                      placeholder="e.g., Loan Officer, Admin"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Access Level</Label>
                  <select
                    value={user.accessLevel || ""}
                    onChange={(e) =>
                      handleUserChange(index, "accessLevel", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select access level</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
                    <option value="read-only">Read Only</option>
                  </select>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  ...formData,
                  systemUsers: [
                    ...formData.systemUsers,
                    {
                      name: "",
                      email: "",
                      department: "",
                      title: "",
                      accessLevel: "",
                    },
                  ],
                });
              }}
              className="mt-4"
            >
              + Add Another User
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const shouldShowQuestion = () => {
    if (!currentQuestion) return false;
    if (currentQuestion.condition) {
      return currentQuestion.condition(formData);
    }
    return true;
  };

  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);
    if (completedTabs[tabId]) {
      setCurrentQuestionIndex(questions[tabId].length);
    } else {
      setCurrentQuestionIndex(0);
    }
    setShowMobileTabs(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:px-4">
      <div className="container mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center sm:text-left">
            Complete Your Funder Profile
          </h1>

          <Progress value={progress} className="h-2 mb-6 sm:mb-8" />

          {/* Mobile Tabs Dropdown */}
          <div className="sm:hidden mb-4">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowMobileTabs(!showMobileTabs)}
            >
              <span>{tabs.find((tab) => tab.id === currentTab)?.label}</span>
              {showMobileTabs ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>

            {showMobileTabs && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                      currentTab === tab.id ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Tabs value={currentTab} className="w-full mb-6 sm:mb-8">
            {/* Desktop Tabs */}
            <TabsList className="hidden sm:grid w-full grid-cols-6">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className="text-xs xl:text-sm truncate"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={currentTab}>
              <div className="space-y-6 sm:space-y-8">
                <h2 className="text-lg sm:text-xl font-semibold text-center sm:text-left">
                  {tabs.find((tab) => tab.id === currentTab)?.label}
                </h2>

                {isTabCompleted ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="text-green-600 text-3xl sm:text-4xl mb-3 sm:mb-4">
                      ✓
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">
                      Section Complete!
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                      You've completed all questions in this section.
                    </p>
                  </div>
                ) : shouldShowQuestion() ? (
                  renderQuestion()
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <p className="text-gray-600">If You had answered Yes...</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between mt-6 sm:mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={
                currentTab === "business-model" &&
                currentQuestionIndex === 0 &&
                !isTabCompleted
              }
              className="sm:order-1"
            >
              Back
            </Button>

            <div className="sm:order-2 sm:text-center">
              {!isTabCompleted && (
                <div className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of{" "}
                  {currentQuestions.length}
                </div>
              )}
            </div>

            {isTabCompleted ? (
              isLastTab ? (
                <Button onClick={handleSubmit} className="sm:order-3">
                  Complete Onboarding
                </Button>
              ) : (
                <Button onClick={handleNext} className="sm:order-3">
                  Next:{" "}
                  {
                    tabs[tabs.findIndex((tab) => tab.id === currentTab) + 1]
                      ?.shortLabel
                  }
                </Button>
              )
            ) : (
              <Button onClick={handleNext} className="sm:order-3">
                {isLastQuestionInTab ? "Complete Section" : "Next"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
