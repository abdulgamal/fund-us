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

export default function FunderOnboardingPage() {
  const [currentTab, setCurrentTab] = useState("business-model");
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

  const router = useRouter();

  const tabs = [
    { id: "business-model", label: "Business Model" },
    { id: "lending-products", label: "Lending Products" },
    { id: "customer-support", label: "Customer Support" },
    { id: "integration", label: "Integration" },
    { id: "operations", label: "Operations" },
    { id: "governance", label: "Governance" },
  ];

  const progress =
    ((tabs.findIndex((tab) => tab.id === currentTab) + 1) / tabs.length) * 100;

  const handleNext = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1].id);
    }
  };

  const handleUserChange = (index, field, value) => {
    const updatedUsers = [...(formData.systemUsers || [])];
    updatedUsers[index] = { ...updatedUsers[index], [field]: value };
    setFormData({ ...formData, systemUsers: updatedUsers });
  };

  const handleSubmit = () => {
    console.log("Funder onboarding submitted:", formData);
    // Submit to backend
    router.push("/loans");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold mb-6">
            Complete Your Funder Profile
          </h1>

          <Progress value={progress} className="h-2 mb-8" />

          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className="w-full mb-8"
          >
            <TabsList className="grid w-full grid-cols-6">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="business-model">
              <div className="space-y-8">
                <h2 className="text-xl font-semibold">
                  Business Model & Strategy
                </h2>
                <p className="text-gray-600">
                  Understanding your overall direction, funding, and
                  partnerships.
                </p>

                {/* Strategic Objectives */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    Are you a CDFI / nonprofit business loan fund, Credit Union
                    / not-for-profit or Bank or for-profit entity? Choose all
                    that apply.*
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cdfi"
                        checked={formData.businessModel?.includes("cdfi")}
                        onCheckedChange={(checked) => {
                          const current = formData.businessModel || [];
                          setFormData({
                            ...formData,
                            businessModel: checked
                              ? [...current, "cdfi"]
                              : current.filter((item) => item !== "cdfi"),
                          });
                        }}
                      />
                      <Label htmlFor="cdfi" className="cursor-pointer">
                        CDFI / Nonprofit
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="credit-union"
                        checked={formData.businessModel?.includes(
                          "credit-union"
                        )}
                        onCheckedChange={(checked) => {
                          const current = formData.businessModel || [];
                          setFormData({
                            ...formData,
                            businessModel: checked
                              ? [...current, "credit-union"]
                              : current.filter(
                                  (item) => item !== "credit-union"
                                ),
                          });
                        }}
                      />
                      <Label htmlFor="credit-union" className="cursor-pointer">
                        Credit Union / Not-for-profit
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="for-profit"
                        checked={formData.businessModel?.includes("for-profit")}
                        onCheckedChange={(checked) => {
                          const current = formData.businessModel || [];
                          setFormData({
                            ...formData,
                            businessModel: checked
                              ? [...current, "for-profit"]
                              : current.filter((item) => item !== "for-profit"),
                          });
                        }}
                      />
                      <Label htmlFor="for-profit" className="cursor-pointer">
                        Bank or other For-profit
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Target Markets */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    Do you want to capture the financial performance of your
                    borrowers in real-time?*
                  </Label>
                  <RadioGroup
                    value={formData.captureFinancialPerformance}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        captureFinancialPerformance: value,
                      })
                    }
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="capture-yes" />
                      <Label htmlFor="capture-yes" className="cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="capture-no" />
                      <Label htmlFor="capture-no" className="cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* External Underwriting */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <Label className="text-base font-medium">
                    Do you do external underwriting?*
                  </Label>
                  <RadioGroup
                    value={formData.externalUnderwriting}
                    onValueChange={(value) =>
                      setFormData({ ...formData, externalUnderwriting: value })
                    }
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="underwriting-yes" />
                      <Label
                        htmlFor="underwriting-yes"
                        className="cursor-pointer"
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="underwriting-no" />
                      <Label
                        htmlFor="underwriting-no"
                        className="cursor-pointer"
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Loan Products Offered */}
                <div className="space-y-4">
                  <Label
                    htmlFor="loanProducts"
                    className="text-base font-medium"
                  >
                    Describe the loan products or services you are offering?
                    (e.g., microloans, business loans, credit lines)*
                  </Label>
                  <textarea
                    id="loanProducts"
                    rows={4}
                    value={formData.loanProducts || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, loanProducts: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe your loan products and services..."
                    required
                  />
                </div>

                {/* SBA Lender */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    Are you an SBA lender?*
                  </Label>
                  <RadioGroup
                    value={formData.sbaLender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, sbaLender: value })
                    }
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="sba-yes" />
                      <Label htmlFor="sba-yes" className="cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="sba-no" />
                      <Label htmlFor="sba-no" className="cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Starting Capital */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <Label
                    htmlFor="startingCapital"
                    className="text-base font-medium"
                  >
                    Currently, how much lending capital do you want to start
                    with in your treasury?*
                  </Label>
                  <Input
                    id="startingCapital"
                    type="text"
                    value={formData.startingCapital || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startingCapital: e.target.value,
                      })
                    }
                    placeholder="Enter amount (e.g., $1,000,000)"
                    required
                  />
                </div>

                {/* Capital Sources */}
                <div className="space-y-4">
                  <Label
                    htmlFor="capitalSources"
                    className="text-base font-medium"
                  >
                    Provide the name of your funds (i.e. capital source names)
                    you would like setup in the system?*
                  </Label>
                  <textarea
                    id="capitalSources"
                    rows={3}
                    value={formData.capitalSources || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capitalSources: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="List your capital source names..."
                    required
                  />
                </div>

                {/* External Stakeholders */}
                <div className="space-y-4">
                  <Label
                    htmlFor="externalPartners"
                    className="text-base font-medium"
                  >
                    Who are your external funding partners?*
                  </Label>
                  <textarea
                    id="externalPartners"
                    rows={3}
                    value={formData.externalPartners || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        externalPartners: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="List your external funding partners..."
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lending-products">
              <div className="space-y-8">
                <h2 className="text-xl font-semibold">
                  Lending Products & Risk Management
                </h2>
                <p className="text-gray-600">
                  Defining your financial products, underwriting, and risk
                  practices.
                </p>

                {/* Amortization Model */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    Which amortization methods do you use? Choose all that
                    apply.*
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Fixed Payment",
                      "Interest Only",
                      "Balloon Loan",
                      "Negative Amortization",
                      "Straight Line (Constant Principle)",
                      "Step-Up Step-Down",
                      "Revolving Credit (Non-Amortizing)",
                      "Seasonal",
                    ].map((method) => (
                      <div key={method} className="flex items-center space-x-2">
                        <Checkbox
                          id={method.toLowerCase().replace(/\s+/g, "-")}
                          checked={formData.amortizationMethods?.includes(
                            method
                          )}
                          onCheckedChange={(checked) => {
                            const current = formData.amortizationMethods || [];
                            setFormData({
                              ...formData,
                              amortizationMethods: checked
                                ? [...current, method]
                                : current.filter((item) => item !== method),
                            });
                          }}
                        />
                        <Label
                          htmlFor={method.toLowerCase().replace(/\s+/g, "-")}
                          className="cursor-pointer text-sm"
                        >
                          {method}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="other-amortization"
                      checked={formData.amortizationMethods?.includes("other")}
                      onCheckedChange={(checked) => {
                        const current = formData.amortizationMethods || [];
                        setFormData({
                          ...formData,
                          amortizationMethods: checked
                            ? [...current, "other"]
                            : current.filter((item) => item !== "other"),
                        });
                      }}
                    />
                    <Label
                      htmlFor="other-amortization"
                      className="cursor-pointer"
                    >
                      Other:
                    </Label>
                    {formData.amortizationMethods?.includes("other") && (
                      <Input
                        placeholder="Specify other amortization method"
                        className="ml-2 flex-1"
                        value={formData.otherAmortization || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            otherAmortization: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                </div>

                {/* Interest Calculations Model */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <Label className="text-base font-medium">
                    Which method do you use to calculate interest?*
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Simple Interest",
                      "Compound Interest",
                      "Flat Interest",
                      "Precomputed Interest",
                      "Declining Balance",
                      "Variable Interest",
                      "Fixed Interest",
                      "APR",
                    ].map((method) => (
                      <div key={method} className="flex items-center space-x-2">
                        <Checkbox
                          id={method.toLowerCase().replace(/\s+/g, "-")}
                          checked={formData.interestMethods?.includes(method)}
                          onCheckedChange={(checked) => {
                            const current = formData.interestMethods || [];
                            setFormData({
                              ...formData,
                              interestMethods: checked
                                ? [...current, method]
                                : current.filter((item) => item !== method),
                            });
                          }}
                        />
                        <Label
                          htmlFor={method.toLowerCase().replace(/\s+/g, "-")}
                          className="cursor-pointer text-sm"
                        >
                          {method}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="other-interest"
                      checked={formData.interestMethods?.includes("other")}
                      onCheckedChange={(checked) => {
                        const current = formData.interestMethods || [];
                        setFormData({
                          ...formData,
                          interestMethods: checked
                            ? [...current, "other"]
                            : current.filter((item) => item !== "other"),
                        });
                      }}
                    />
                    <Label htmlFor="other-interest" className="cursor-pointer">
                      Other:
                    </Label>
                    {formData.interestMethods?.includes("other") && (
                      <Input
                        placeholder="Specify other interest method"
                        className="ml-2 flex-1"
                        value={formData.otherInterestMethod || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            otherInterestMethod: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                </div>

                {/* Interest Rate Sourcing */}
                <div className="space-y-4">
                  <Label
                    htmlFor="interestRateSourcing"
                    className="text-base font-medium"
                  >
                    How do you determine or update your interest rates? (e.g.,
                    based on prime rates, internal policy)*
                  </Label>
                  <textarea
                    id="interestRateSourcing"
                    rows={3}
                    value={formData.interestRateSourcing || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        interestRateSourcing: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe how you determine and update interest rates..."
                    required
                  />
                </div>

                {/* Underwriting Method */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <Label className="text-base font-medium">
                    Provide the various methods you would like to use for your
                    underwriting process?*
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Automated Rules",
                      "Manual",
                      "Score Based (e.g. FICO)",
                      "Cashflow (e.g. POS data)",
                      "Collateral",
                      "Behavioral (e.g. Deposit patterns)",
                      "Income Based (e.g. Income stability)",
                    ].map((method) => (
                      <div key={method} className="flex items-center space-x-2">
                        <Checkbox
                          id={method.toLowerCase().replace(/\s+/g, "-")}
                          checked={formData.underwritingMethods?.includes(
                            method
                          )}
                          onCheckedChange={(checked) => {
                            const current = formData.underwritingMethods || [];
                            setFormData({
                              ...formData,
                              underwritingMethods: checked
                                ? [...current, method]
                                : current.filter((item) => item !== method),
                            });
                          }}
                        />
                        <Label
                          htmlFor={method.toLowerCase().replace(/\s+/g, "-")}
                          className="cursor-pointer text-sm"
                        >
                          {method}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="other-underwriting"
                      checked={formData.underwritingMethods?.includes("other")}
                      onCheckedChange={(checked) => {
                        const current = formData.underwritingMethods || [];
                        setFormData({
                          ...formData,
                          underwritingMethods: checked
                            ? [...current, "other"]
                            : current.filter((item) => item !== "other"),
                        });
                      }}
                    />
                    <Label
                      htmlFor="other-underwriting"
                      className="cursor-pointer"
                    >
                      Other:
                    </Label>
                    {formData.underwritingMethods?.includes("other") && (
                      <Input
                        placeholder="Specify other underwriting method"
                        className="ml-2 flex-1"
                        value={formData.otherUnderwritingMethod || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            otherUnderwritingMethod: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                </div>

                {/* Customer Qualification Criteria */}
                <div className="space-y-4">
                  <Label
                    htmlFor="qualificationCriteria"
                    className="text-base font-medium"
                  >
                    What are some other eligibility requirements you'd like to
                    highlight?*
                  </Label>
                  <textarea
                    id="qualificationCriteria"
                    rows={3}
                    value={formData.qualificationCriteria || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        qualificationCriteria: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe additional eligibility requirements..."
                    required
                  />
                </div>

                {/* Collateral Type */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <Label
                    htmlFor="collateralTypes"
                    className="text-base font-medium"
                  >
                    What types of collateral do you accept for loans? (e.g.,
                    property, equipment, guarantees)*
                  </Label>
                  <textarea
                    id="collateralTypes"
                    rows={3}
                    value={formData.collateralTypes || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        collateralTypes: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="List the types of collateral you accept..."
                    required
                  />
                </div>

                {/* Liabilities */}
                <div className="space-y-4">
                  <Label
                    htmlFor="liabilities"
                    className="text-base font-medium"
                  >
                    What current liabilities or outstanding debts does your
                    organization have?*
                  </Label>
                  <textarea
                    id="liabilities"
                    rows={3}
                    value={formData.liabilities || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, liabilities: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe your organization's current liabilities and debts..."
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="customer-support">
              <div className="space-y-8">
                <h2 className="text-xl font-semibold">
                  Customer Focus & Support Services
                </h2>
                <p className="text-gray-600">
                  Understanding who you serve and how you support them.
                </p>

                {/* Customer Profile */}
                <div className="space-y-4">
                  <Label htmlFor="regions" className="text-base font-medium">
                    What regions do you service? Provide regional locations and
                    limitations.*
                  </Label>
                  <textarea
                    id="regions"
                    rows={3}
                    value={formData.serviceRegions || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        serviceRegions: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe the regions you service and any limitations..."
                    required
                  />
                </div>

                {/* Customer Impact Reporting */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <Label className="text-base font-medium">
                    What impact reporting do you want to focus on? Choose those
                    that apply.*
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Job Creation",
                      "Wealth Development",
                      "STEM Impact",
                      "Female Business Growth",
                      "Minority Business Self-Sufficiency",
                      "Rural / Agri-Business Development",
                      "Environmental",
                      "New Entrepreneurial Growth",
                    ].map((impact) => (
                      <div key={impact} className="flex items-center space-x-2">
                        <Checkbox
                          id={impact.toLowerCase().replace(/\s+/g, "-")}
                          checked={formData.impactReporting?.includes(impact)}
                          onCheckedChange={(checked) => {
                            const current = formData.impactReporting || [];
                            setFormData({
                              ...formData,
                              impactReporting: checked
                                ? [...current, impact]
                                : current.filter((item) => item !== impact),
                            });
                          }}
                        />
                        <Label
                          htmlFor={impact.toLowerCase().replace(/\s+/g, "-")}
                          className="cursor-pointer text-sm"
                        >
                          {impact}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="other-impact"
                      checked={formData.impactReporting?.includes("other")}
                      onCheckedChange={(checked) => {
                        const current = formData.impactReporting || [];
                        setFormData({
                          ...formData,
                          impactReporting: checked
                            ? [...current, "other"]
                            : current.filter((item) => item !== "other"),
                        });
                      }}
                    />
                    <Label htmlFor="other-impact" className="cursor-pointer">
                      Other:
                    </Label>
                    {formData.impactReporting?.includes("other") && (
                      <Input
                        placeholder="Specify other impact reporting"
                        className="ml-2 flex-1"
                        value={formData.otherImpact || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            otherImpact: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                </div>

                {/* KYC (Know Your Customer) */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <Label htmlFor="kycMethods" className="text-base font-medium">
                    What identity verification steps do you use? Provide all
                    methods (e.g., ID checks, LexisNexis...etc)*
                  </Label>
                  <textarea
                    id="kycMethods"
                    rows={3}
                    value={formData.kycMethods || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, kycMethods: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe your identity verification methods..."
                    required
                  />
                </div>

                {/* Technical Assistance Services */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <Label
                    htmlFor="techAssistance"
                    className="text-base font-medium"
                  >
                    What types of technical assistance or support services do
                    you offer to customers?*
                  </Label>
                  <textarea
                    id="techAssistance"
                    rows={3}
                    value={formData.techAssistance || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        techAssistance: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe your technical assistance and support services..."
                    required
                  />
                </div>

                {/* Reporting & Insights */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <Label
                    htmlFor="reportingMetrics"
                    className="text-base font-medium"
                  >
                    What key reporting metrics and insights do you need from the
                    system? (e.g., loan performance, portfolio at risk)*
                  </Label>
                  <textarea
                    id="reportingMetrics"
                    rows={3}
                    value={formData.reportingMetrics || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reportingMetrics: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe the reporting metrics and insights you need..."
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integration">
              <div className="space-y-8">
                <h2 className="text-xl font-semibold">Key Integrations</h2>
                <p className="text-gray-600">
                  Determine integration information
                </p>

                {/* Payment & Transfer Methods */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    What payment transfer methods do you use or plan to use?
                    Choose all that apply.*
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "ACH",
                      "Wire Transfer",
                      "Mobile Money",
                      "Mail in Check",
                    ].map((method) => (
                      <div key={method} className="flex items-center space-x-2">
                        <Checkbox
                          id={`payment-${method
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          checked={formData.paymentMethods?.includes(method)}
                          onCheckedChange={(checked) => {
                            const current = formData.paymentMethods || [];
                            setFormData({
                              ...formData,
                              paymentMethods: checked
                                ? [...current, method]
                                : current.filter((item) => item !== method),
                            });
                          }}
                        />
                        <Label
                          htmlFor={`payment-${method
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="cursor-pointer text-sm"
                        >
                          {method}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="other-payment"
                      checked={formData.paymentMethods?.includes("other")}
                      onCheckedChange={(checked) => {
                        const current = formData.paymentMethods || [];
                        setFormData({
                          ...formData,
                          paymentMethods: checked
                            ? [...current, "other"]
                            : current.filter((item) => item !== "other"),
                        });
                      }}
                    />
                    <Label htmlFor="other-payment" className="cursor-pointer">
                      Other:
                    </Label>
                    {formData.paymentMethods?.includes("other") && (
                      <Input
                        placeholder="Specify other payment method"
                        className="ml-2 flex-1"
                        value={formData.otherPaymentMethod || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            otherPaymentMethod: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                </div>

                {/* Credit Performance - Metro2 Reporting */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <Label className="text-base font-medium">
                    How do you currently do your Metro2 reporting? Choose all
                    that apply.*
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Integration", "Uploads"].map((method) => (
                      <div key={method} className="flex items-center space-x-2">
                        <Checkbox
                          id={`metro2-${method
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          checked={formData.metro2Reporting?.includes(method)}
                          onCheckedChange={(checked) => {
                            const current = formData.metro2Reporting || [];
                            setFormData({
                              ...formData,
                              metro2Reporting: checked
                                ? [...current, method]
                                : current.filter((item) => item !== method),
                            });
                          }}
                        />
                        <Label
                          htmlFor={`metro2-${method
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="cursor-pointer text-sm"
                        >
                          {method}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="other-metro2"
                      checked={formData.metro2Reporting?.includes("other")}
                      onCheckedChange={(checked) => {
                        const current = formData.metro2Reporting || [];
                        setFormData({
                          ...formData,
                          metro2Reporting: checked
                            ? [...current, "other"]
                            : current.filter((item) => item !== "other"),
                        });
                      }}
                    />
                    <Label htmlFor="other-metro2" className="cursor-pointer">
                      Other:
                    </Label>
                    {formData.metro2Reporting?.includes("other") && (
                      <Input
                        placeholder="Specify other Metro2 reporting method"
                        className="ml-2 flex-1"
                        value={formData.otherMetro2Method || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            otherMetro2Method: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                </div>

                {/* External System Integration */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <Label className="text-base font-medium">
                    Will you need to integrate with any external systems, such
                    as Accounting, CRM, HR...etc?*
                  </Label>
                  <RadioGroup
                    value={formData.externalIntegration}
                    onValueChange={(value) =>
                      setFormData({ ...formData, externalIntegration: value })
                    }
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="yes"
                        id="external-integration-yes"
                      />
                      <Label
                        htmlFor="external-integration-yes"
                        className="cursor-pointer"
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="external-integration-no" />
                      <Label
                        htmlFor="external-integration-no"
                        className="cursor-pointer"
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>

                  {formData.externalIntegration === "yes" && (
                    <div className="mt-4">
                      <Label
                        htmlFor="externalSystems"
                        className="text-sm font-medium"
                      >
                        Please specify which external systems you need to
                        integrate with:
                      </Label>
                      <textarea
                        id="externalSystems"
                        rows={3}
                        value={formData.externalSystems || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            externalSystems: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500 mt-2"
                        placeholder="List the external systems you need to integrate with (e.g., QuickBooks, Salesforce, etc.)"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Label htmlFor="systemsNames" className="text-sm font-medium">
                    Provide the names of the systems that you will need
                    integration with
                  </Label>
                  <textarea
                    id="systemsNames"
                    rows={3}
                    value={formData.systemsNames || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        systemsNames: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500 mt-2"
                    placeholder="List the names of the systems for integration"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="operations">
              <div className="space-y-8">
                <h2 className="text-xl font-semibold">Operations & Systems</h2>
                <p className="text-gray-600">
                  Mapping your day-to-day systems and desired insights.
                </p>

                {/* Administration & Access Control */}
                <div className="space-y-4">
                  <Label
                    htmlFor="accessControl"
                    className="text-base font-medium"
                  >
                    Who manages user access, permissions, and administrative
                    control of your system?*
                  </Label>
                  <textarea
                    id="accessControl"
                    rows={3}
                    value={formData.accessControl || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accessControl: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe who manages user access and permissions in your organization..."
                    required
                  />
                </div>

                {/* Loan Documentation Terms */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <Label className="text-base font-medium">
                    Do you have all your loan terms documented or templatized?*
                  </Label>
                  <RadioGroup
                    value={formData.loanDocumentation}
                    onValueChange={(value) =>
                      setFormData({ ...formData, loanDocumentation: value })
                    }
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="documentation-yes" />
                      <Label
                        htmlFor="documentation-yes"
                        className="cursor-pointer"
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="documentation-no" />
                      <Label
                        htmlFor="documentation-no"
                        className="cursor-pointer"
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Additional Operational Questions */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <Label
                    htmlFor="operationalProcesses"
                    className="text-base font-medium"
                  >
                    Describe your current loan origination and servicing
                    processes:*
                  </Label>
                  <textarea
                    id="operationalProcesses"
                    rows={3}
                    value={formData.operationalProcesses || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        operationalProcesses: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe your current processes for loan origination, servicing, and management..."
                    required
                  />
                </div>

                {/* System Reporting Needs */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <Label
                    htmlFor="reportingNeeds"
                    className="text-base font-medium"
                  >
                    What specific reports or dashboards do you need for daily
                    operations?*
                  </Label>
                  <textarea
                    id="reportingNeeds"
                    rows={3}
                    value={formData.reportingNeeds || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reportingNeeds: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="List the specific reports and dashboards you need for daily operations..."
                    required
                  />
                </div>

                {/* Compliance Requirements */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <Label
                    htmlFor="complianceRequirements"
                    className="text-base font-medium"
                  >
                    What compliance requirements or regulations do you need to
                    adhere to?*
                  </Label>
                  <textarea
                    id="complianceRequirements"
                    rows={3}
                    value={formData.complianceRequirements || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        complianceRequirements: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="List your compliance requirements and regulations..."
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="governance">
              <div className="space-y-8">
                <h2 className="text-xl font-semibold">
                  Governance, Compliance & Team
                </h2>
                <p className="text-gray-600">
                  Ensuring regulatory alignment and proper user engagement.
                </p>

                {/* Cybersecurity Policy */}
                <div className="space-y-4">
                  <Label
                    htmlFor="cybersecurityPolicy"
                    className="text-base font-medium"
                  >
                    Do you have cybersecurity policies in place? If so, please
                    describe them.*
                  </Label>
                  <textarea
                    id="cybersecurityPolicy"
                    rows={3}
                    value={formData.cybersecurityPolicy || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cybersecurityPolicy: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe your cybersecurity policies and procedures..."
                    required
                  />
                </div>

                {/* Regulatory Audits & Compliance */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <Label
                    htmlFor="regulatoryCompliance"
                    className="text-base font-medium"
                  >
                    Beyond IRS and Treasury (CDFI Fund), what other regulatory
                    audits or compliance requirements do you need to highlight
                    and follow?*
                  </Label>
                  <textarea
                    id="regulatoryCompliance"
                    rows={3}
                    value={formData.regulatoryCompliance || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        regulatoryCompliance: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="List additional regulatory audits and compliance requirements..."
                    required
                  />
                </div>

                {/* System Users & Roles */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <Label className="text-base font-medium">
                    Who will use the system (e.g., loan officers, admins,
                    leadership), and what roles will they have?*
                  </Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Please provide their names, emails, department/team,
                    role/title and access levels (admin, manager, user, read
                    only).
                  </p>

                  {/* User 1 */}
                  <div className="space-y-4 p-4 border border-gray-200 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="user1-name"
                          className="text-sm font-medium"
                        >
                          Name
                        </Label>
                        <Input
                          id="user1-name"
                          value={formData.systemUsers?.[0]?.name || ""}
                          onChange={(e) =>
                            handleUserChange(0, "name", e.target.value)
                          }
                          placeholder="Full name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="user1-email"
                          className="text-sm font-medium"
                        >
                          Email
                        </Label>
                        <Input
                          id="user1-email"
                          type="email"
                          value={formData.systemUsers?.[0]?.email || ""}
                          onChange={(e) =>
                            handleUserChange(0, "email", e.target.value)
                          }
                          placeholder="email@example.com"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="user1-department"
                          className="text-sm font-medium"
                        >
                          Department/Team
                        </Label>
                        <Input
                          id="user1-department"
                          value={formData.systemUsers?.[0]?.department || ""}
                          onChange={(e) =>
                            handleUserChange(0, "department", e.target.value)
                          }
                          placeholder="e.g., Lending, Administration"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="user1-title"
                          className="text-sm font-medium"
                        >
                          Role/Title
                        </Label>
                        <Input
                          id="user1-title"
                          value={formData.systemUsers?.[0]?.title || ""}
                          onChange={(e) =>
                            handleUserChange(0, "title", e.target.value)
                          }
                          placeholder="e.g., Loan Officer, Admin"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="user1-access"
                        className="text-sm font-medium"
                      >
                        Access Level
                      </Label>
                      <select
                        id="user1-access"
                        value={formData.systemUsers?.[0]?.accessLevel || ""}
                        onChange={(e) =>
                          handleUserChange(0, "accessLevel", e.target.value)
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

                  {/* Add more users button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const currentUsers = formData.systemUsers || [];
                      setFormData({
                        ...formData,
                        systemUsers: [
                          ...currentUsers,
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

                  {/* Additional users */}
                  {formData.systemUsers?.slice(1).map((user, index) => (
                    <div
                      key={index + 1}
                      className="space-y-4 p-4 border border-gray-200 rounded-md mt-4"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">User {index + 2}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updatedUsers = formData.systemUsers.filter(
                              (_, i) => i !== index + 1
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor={`user${index + 2}-name`}
                            className="text-sm font-medium"
                          >
                            Name
                          </Label>
                          <Input
                            id={`user${index + 2}-name`}
                            value={user.name || ""}
                            onChange={(e) =>
                              handleUserChange(
                                index + 1,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="Full name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`user${index + 2}-email`}
                            className="text-sm font-medium"
                          >
                            Email
                          </Label>
                          <Input
                            id={`user${index + 2}-email`}
                            type="email"
                            value={user.email || ""}
                            onChange={(e) =>
                              handleUserChange(
                                index + 1,
                                "email",
                                e.target.value
                              )
                            }
                            placeholder="email@example.com"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor={`user${index + 2}-department`}
                            className="text-sm font-medium"
                          >
                            Department/Team
                          </Label>
                          <Input
                            id={`user${index + 2}-department`}
                            value={user.department || ""}
                            onChange={(e) =>
                              handleUserChange(
                                index + 1,
                                "department",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Lending, Administration"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`user${index + 2}-title`}
                            className="text-sm font-medium"
                          >
                            Role/Title
                          </Label>
                          <Input
                            id={`user${index + 2}-title`}
                            value={user.title || ""}
                            onChange={(e) =>
                              handleUserChange(
                                index + 1,
                                "title",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Loan Officer, Admin"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor={`user${index + 2}-access`}
                          className="text-sm font-medium"
                        >
                          Access Level
                        </Label>
                        <select
                          id={`user${index + 2}-access`}
                          value={user.accessLevel || ""}
                          onChange={(e) =>
                            handleUserChange(
                              index + 1,
                              "accessLevel",
                              e.target.value
                            )
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
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentTab === "business-model"}
            >
              Back
            </Button>
            {currentTab !== "governance" ? (
              <Button onClick={handleNext}>
                Next:{" "}
                {
                  tabs[tabs.findIndex((tab) => tab.id === currentTab) + 1]
                    ?.label
                }
              </Button>
            ) : (
              <Button onClick={handleSubmit}>Complete Onboarding</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
