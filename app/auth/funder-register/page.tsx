"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [isFunder, setIsFunder] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "borrower", // default to borrower
  });

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic based on userType
    console.log("Registering as:", isFunder ? "funder" : "borrower", formData);
    if (isFunder) {
      router.push("/funder/onboarding");
    } else {
      router.push("/submit-loan");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardClick = (funder: boolean) => {
    setIsFunder(funder);
  };

  const handleCheckboxChange = (checked: boolean | string) => {
    // Convert string to boolean if needed (shadcn/ui returns 'on' for checked)
    const isChecked = checked === "on" ? true : Boolean(checked);
    setIsFunder(isChecked);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our lending marketplace
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* User Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">I want to join as:</Label>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  !isFunder
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
                onClick={() => handleCardClick(false)}
              >
                <div
                  className="flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={!isFunder}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(!checked)
                    }
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium">Borrower</p>
                    <p className="text-sm mt-1">Submit loan requests</p>
                  </div>
                </div>
              </div>

              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  isFunder
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
                onClick={() => handleCardClick(true)}
              >
                <div
                  className="flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={isFunder}
                    onCheckedChange={handleCheckboxChange}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium">Funder</p>
                    <p className="text-sm mt-1">Invest in loans</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Form Title based on selection */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium">
              {isFunder ? "Funder Information" : "Borrower Information"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {isFunder
                ? "Complete your funder profile to start investing"
                : "Tell us about your business to submit loan requests"}
            </p>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name*</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name*</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address*</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>

          {/* Funder-specific Fields */}
          {isFunder && (
            <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900">Funder Details</h4>
              <div>
                <Label htmlFor="institution">Institution Name</Label>
                <Input
                  id="institution"
                  name="institution"
                  type="text"
                  placeholder="e.g., ABC Investment Fund"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="investorType">Investor Type</Label>
                <select
                  id="investorType"
                  name="investorType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select investor type</option>
                  <option value="individual">Individual Investor</option>
                  <option value="institutional">Institutional Investor</option>
                  <option value="bank">Bank</option>
                  <option value="credit-union">Credit Union</option>
                  <option value="fund">Investment Fund</option>
                </select>
              </div>
            </div>
          )}

          {/* Borrower-specific Fields */}
          {!isFunder && (
            <div className="space-y-4 bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900">Business Details</h4>
              <div>
                <Label htmlFor="businessName">Business Name*</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <select
                  id="businessType"
                  name="businessType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select business type</option>
                  <option value="sole-proprietorship">
                    Sole Proprietorship
                  </option>
                  <option value="partnership">Partnership</option>
                  <option value="llc">LLC</option>
                  <option value="corporation">Corporation</option>
                </select>
              </div>
            </div>
          )}

          {/* Password Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">Password*</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password*</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Privacy Policy
              </Link>
            </Label>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Create {isFunder ? "Funder" : "Borrower"} Account
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
