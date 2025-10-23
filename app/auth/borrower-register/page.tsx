"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiPost, apiGet, login } from "@/lib/api";
import { toast } from "sonner";

interface BusinessType {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export default function BorrowerRegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessType: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [loadingBusinessTypes, setLoadingBusinessTypes] = useState(false);
  const [businessTypesError, setBusinessTypesError] = useState("");

  const router = useRouter();

  // Fetch business types on component mount
  useEffect(() => {
    const fetchBusinessTypes = async () => {
      setLoadingBusinessTypes(true);
      setBusinessTypesError("");
      try {
        const response = await apiGet("/business-types");
        const data = await response.json();
        
        if (response.ok) {
          // Handle the response format from backend
          if (data.status === "success" && data.data && Array.isArray(data.data)) {
            setBusinessTypes(data.data);
          } else if (Array.isArray(data)) {
            // Fallback for direct array response
            setBusinessTypes(data);
          } else {
            console.warn("Unexpected business types data format:", data);
            setBusinessTypesError("Failed to load business types. Please try again later.");
          }
        } else {
          console.error("Failed to fetch business types. Status:", response.status);
          setBusinessTypesError(`Failed to load business types (Error: ${response.status})`);
        }
      } catch (error) {
        console.error("Error fetching business types:", error);
        setBusinessTypesError("Unable to connect to the server. Please check your connection.");
      } finally {
        setLoadingBusinessTypes(false);
      }
    };

    fetchBusinessTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setIsLoading(true);

    try {
      // Prepare data according to API format
      const registrationData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        userType: "borrower",
        businessName: formData.businessName,
        businessType: formData.businessType,
      };

      const response = await apiPost("/register", registrationData);
      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (data.errors) {
          setErrors(data.errors);
          // Show the main validation message
          setGeneralError(data.message || "Validation failed. Please check the form for errors.");
          toast.error("Validation Failed", {
            description: data.message || "Please check the form for errors and try again.",
          });
        } else {
          setGeneralError(data.message || "Registration failed. Please try again.");
          toast.error("Registration Failed", {
            description: data.message || "Registration failed. Please try again.",
          });
        }
        setIsLoading(false);
        return;
      }

      // Success - store token and user data
      if (data.status === "success" && data.data) {
        login(data.data.access_token, data.data.user);
        
        toast.success("Registration Successful!", {
          description: `Welcome, ${data.data.user.name}! Redirecting...`,
          duration: 3000,
        });
        
        // Wait a bit before redirecting to show the toast
        setTimeout(() => {
          router.push("/submit-loan");
        }, 1000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setGeneralError("An unexpected error occurred. Please try again.");
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Borrower Account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Join our lending marketplace as a borrower
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* General Error Message */}
            {generalError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm font-medium">{generalError}</p>
              </div>
            )}

            {/* User Type Selection */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Account Type:</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border-2 rounded-lg p-4 bg-indigo-50 border-indigo-600 text-indigo-700">
                  <div className="flex items-center">
                    <Checkbox
                      checked={true}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">Borrower</p>
                      <p className="text-sm mt-1">Submit loan requests</p>
                    </div>
                  </div>
                </div>

                <Link href="/auth/funder-register" className="block">
                  <div className="border-2 rounded-lg p-4 border-gray-300 bg-white text-gray-700 hover:border-gray-400 transition-all cursor-pointer">
                    <div className="flex items-center">
                      <Checkbox
                        checked={false}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium">Funder</p>
                        <p className="text-sm mt-1">Invest in loans</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Borrower Information */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium">Borrower Information</h3>
              <p className="text-sm text-gray-600 mt-1">
                Tell us about your business to submit loan requests
              </p>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name*</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 ${errors.firstName ? 'border-red-500' : ''}`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName[0]}</p>
                )}
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
                  className={`mt-1 ${errors.lastName ? 'border-red-500' : ''}`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName[0]}</p>
                )}
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
                className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
              )}
            </div>

            {/* Business Details */}
            <div className="space-y-4 bg-green-50 p-6 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900">Business Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name*</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    type="text"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                    className={`mt-1 ${errors.businessName ? 'border-red-500' : ''}`}
                  />
                  {errors.businessName && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessName[0]}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    disabled={loadingBusinessTypes || !!businessTypesError}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${errors.businessType || businessTypesError ? 'border-red-500' : ''}`}
                  >
                    <option value="">
                      {loadingBusinessTypes ? "Loading..." : businessTypesError ? "Unable to load" : "Select business type"}
                    </option>
                    {businessTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  {businessTypesError && (
                    <p className="text-red-500 text-sm mt-1">{businessTypesError}</p>
                  )}
                  {errors.businessType && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessType[0]}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Password*</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
                )}
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
                  className={`mt-1 ${errors.password_confirmation ? 'border-red-500' : ''}`}
                />
                {errors.password_confirmation && (
                  <p className="text-red-500 text-sm mt-1">{errors.password_confirmation[0]}</p>
                )}
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
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-base font-medium"
              >
                {isLoading ? "Creating Account..." : "Create Borrower Account"}
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
    </div>
  );
}
