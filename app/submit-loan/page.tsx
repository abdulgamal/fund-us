"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FormDocuments {
  license: File | null;
  statements: File | null;
  taxReturns: File | null;
  bankStatements: File | null;
  ownershipProof: File | null;
}

interface FormData {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    ssn: string;
  };
  business: {
    name: string;
    type: string;
    registrationNumber: string;
    taxId: string;
    address: string;
    yearsInBusiness: string;
    industry: string;
  };
  criteria: {
    annualRevenue: string;
    creditScore: string;
    hasBankruptcy: boolean;
    loanAmount: string;
    loanPurpose: string;
  };
  documents: FormDocuments;
}

export default function LoanSubmissionPage() {
  const [currentTab, setCurrentTab] = useState("personal");
  const [formData, setFormData] = useState<FormData>({
    personal: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      ssn: "",
    },
    business: {
      name: "",
      type: "",
      registrationNumber: "",
      taxId: "",
      address: "",
      yearsInBusiness: "",
      industry: "",
    },
    criteria: {
      annualRevenue: "",
      creditScore: "",
      hasBankruptcy: false,
      loanAmount: "",
      loanPurpose: "",
    },
    documents: {
      license: null,
      statements: null,
      taxReturns: null,
      bankStatements: null,
      ownershipProof: null,
    },
  });

  const tabs = [
    { id: "personal", label: "Personal" },
    { id: "business", label: "Business" },
    { id: "criteria", label: "Criteria" },
    { id: "documents", label: "Documents" },
  ];

  const businessTypes = [
    "Sole Proprietorship",
    "Partnership",
    "LLC",
    "Corporation",
    "Nonprofit",
  ];

  const industries = [
    "Agriculture",
    "Retail",
    "Manufacturing",
    "Services",
    "Technology",
    "Construction",
  ];

  const loanPurposes = [
    "Working Capital",
    "Equipment Purchase",
    "Inventory",
    "Expansion",
    "Debt Refinancing",
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

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Add form submission logic here
    alert("Loan application submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold mb-6">
            Submit Your Loan Application
          </h1>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>
                Step {tabs.findIndex((tab) => tab.id === currentTab) + 1} of{" "}
                {tabs.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Tabs Navigation */}
          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className="w-full mb-8"
          >
            <TabsList className="grid w-full grid-cols-4">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Form Sections */}
            <div className="space-y-8">
              {/* Personal Information */}
              <TabsContent value="personal">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name*</Label>
                      <Input
                        id="firstName"
                        value={formData.personal.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              firstName: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name*</Label>
                      <Input
                        id="lastName"
                        value={formData.personal.lastName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              lastName: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email*</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.personal.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              email: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number*</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.personal.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              phone: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="ssn">
                        Social Security Number (Last 4)*
                      </Label>
                      <Input
                        id="ssn"
                        type="text"
                        maxLength={4}
                        value={formData.personal.ssn}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              ssn: e.target.value.replace(/\D/g, ""),
                            },
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Business Information */}
              <TabsContent value="business">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">
                    Business Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="businessName">Business Name*</Label>
                      <Input
                        id="businessName"
                        value={formData.business.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            business: {
                              ...formData.business,
                              name: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessType">Business Type*</Label>
                      <select
                        id="businessType"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.business.type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            business: {
                              ...formData.business,
                              type: e.target.value,
                            },
                          })
                        }
                        required
                      >
                        <option value="">Select business type</option>
                        {businessTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="registrationNumber">
                        Registration Number*
                      </Label>
                      <Input
                        id="registrationNumber"
                        value={formData.business.registrationNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            business: {
                              ...formData.business,
                              registrationNumber: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="taxId">Tax ID (EIN)*</Label>
                      <Input
                        id="taxId"
                        value={formData.business.taxId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            business: {
                              ...formData.business,
                              taxId: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Business Address*</Label>
                      <Input
                        id="address"
                        value={formData.business.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            business: {
                              ...formData.business,
                              address: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="yearsInBusiness">
                        Years in Business*
                      </Label>
                      <Input
                        id="yearsInBusiness"
                        type="number"
                        min="0"
                        value={formData.business.yearsInBusiness}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            business: {
                              ...formData.business,
                              yearsInBusiness: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry*</Label>
                      <select
                        id="industry"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.business.industry}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            business: {
                              ...formData.business,
                              industry: e.target.value,
                            },
                          })
                        }
                        required
                      >
                        <option value="">Select industry</option>
                        {industries.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Minimum Criteria */}
              <TabsContent value="criteria">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Loan Criteria</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="annualRevenue">Annual Revenue ($)*</Label>
                      <Input
                        id="annualRevenue"
                        type="number"
                        min="0"
                        value={formData.criteria.annualRevenue}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            criteria: {
                              ...formData.criteria,
                              annualRevenue: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="creditScore">Credit Score*</Label>
                      <Input
                        id="creditScore"
                        type="number"
                        min="300"
                        max="850"
                        value={formData.criteria.creditScore}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            criteria: {
                              ...formData.criteria,
                              creditScore: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasBankruptcy"
                        checked={formData.criteria.hasBankruptcy}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            criteria: {
                              ...formData.criteria,
                              hasBankruptcy: Boolean(checked),
                            },
                          })
                        }
                      />
                      <Label htmlFor="hasBankruptcy">
                        Has bankruptcy in last 7 years
                      </Label>
                    </div>
                    <div>
                      <Label htmlFor="loanAmount">
                        Loan Amount Requested ($)*
                      </Label>
                      <Input
                        id="loanAmount"
                        type="number"
                        min="10000"
                        value={formData.criteria.loanAmount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            criteria: {
                              ...formData.criteria,
                              loanAmount: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Loan Purpose*</Label>
                      <RadioGroup
                        value={formData.criteria.loanPurpose}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            criteria: {
                              ...formData.criteria,
                              loanPurpose: value,
                            },
                          })
                        }
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
                        required
                      >
                        {loanPurposes.map((purpose) => (
                          <div
                            key={purpose}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem value={purpose} id={purpose} />
                            <Label htmlFor={purpose}>{purpose}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Required Documents */}
              <TabsContent value="documents">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Required Documents</h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Business License*</Label>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            documents: {
                              ...formData.documents,
                              license: e.target.files?.[0] || null,
                            },
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Financial Statements (Last 2 Years)*</Label>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            documents: {
                              ...formData.documents,
                              statements: e.target.files?.[0] || null,
                            },
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Tax Returns (Last 2 Years)*</Label>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            documents: {
                              ...formData.documents,
                              taxReturns: e.target.files?.[0] || null,
                            },
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Bank Statements (Last 6 Months)*</Label>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            documents: {
                              ...formData.documents,
                              bankStatements: e.target.files?.[0] || null,
                            },
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Proof of Business Ownership*</Label>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            documents: {
                              ...formData.documents,
                              ownershipProof: e.target.files?.[0] || null,
                            },
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentTab === "personal"}
            >
              Back
            </Button>

            {currentTab !== "documents" ? (
              <Button onClick={handleNext}>
                Next:{" "}
                {tabs[tabs.findIndex((tab) => tab.id === currentTab) + 1].label}
              </Button>
            ) : (
              <Button onClick={handleSubmit}>Submit Application</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
