"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  ArrowLeft,
  Save,
  AlertCircle,
} from "lucide-react";
import { authGet, authPost } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

interface LoanApplication {
  id: number;
  application_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  ssn: string;
  business_name: string;
  business_type: string;
  registration_number: string;
  tax_id_number: string;
  business_address: string;
  years_in_business: number;
  industry: string;
  annual_revenue: number;
  credit_score: number;
  has_bankruptcy: number;
  loan_amount: number;
  loan_purpose: string;
  business_license: string | null;
  financial_statements: string | null;
  tax_returns: string | null;
  bank_statements: string | null;
  proof_of_business_ownership: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_id: number | null;
  syndicate: any[] | null;
}

interface ApiResponse {
  success: boolean;
  loan_application: LoanApplication;
}

export default function EditApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    business_name: "",
    business_type: "",
    registration_number: "",
    tax_id_number: "",
    business_address: "",
    years_in_business: 0,
    industry: "",
    annual_revenue: 0,
    credit_score: 0,
    has_bankruptcy: 0,
    loan_amount: 0,
    loan_purpose: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await authGet(`/v1/loan-application/${params.id}`);
        const data: ApiResponse = await response.json();

        if (response.ok && data.success) {
          const app = data.loan_application;
          
          // Check if syndicate is not null AND has lead funder - if so, redirect back
          const hasLeadFunder = app.syndicate && app.syndicate.length > 0 && 
                                app.syndicate.some(syndicate => syndicate.lead_funder);
          if (hasLeadFunder) {
            toast.error("Cannot Edit Application", {
              description: "This application has a lead funder and cannot be edited.",
            });
            router.push(`/applications/${params.id}`);
            return;
          }

          setApplication(app);
          setFormData({
            first_name: app.first_name,
            last_name: app.last_name,
            email: app.email,
            phone: app.phone,
            business_name: app.business_name,
            business_type: app.business_type,
            registration_number: app.registration_number,
            tax_id_number: app.tax_id_number,
            business_address: app.business_address,
            years_in_business: app.years_in_business,
            industry: app.industry,
            annual_revenue: app.annual_revenue,
            credit_score: app.credit_score,
            has_bankruptcy: app.has_bankruptcy,
            loan_amount: app.loan_amount,
            loan_purpose: app.loan_purpose,
          });
        } else {
          toast.error("Failed to load application", {
            description: "Please try refreshing the page.",
          });
        }
      } catch (error) {
        console.error("Error fetching application:", error);
        toast.error("Error", {
          description: "Failed to load application details.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchApplication();
    }
  }, [params.id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setIsSaving(true);

    try {
      const response = await authPost(`/v1/loan-application/${params.id}/update`, formData);
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Application Updated!", {
          description: "Your application has been updated successfully.",
          duration: 3000,
        });
        
        // Redirect back to application details
        router.push(`/applications/${params.id}`);
      } else {
        if (data.errors) {
          setErrors(data.errors);
          setGeneralError(data.message || "Validation failed. Please check the form for errors.");
          toast.error("Validation Failed", {
            description: data.message || "Please check the form for errors and try again.",
          });
        } else {
          setGeneralError(data.message || "Failed to update application. Please try again.");
          toast.error("Update Failed", {
            description: data.message || "Failed to update application. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Error updating application:", error);
      setGeneralError("An unexpected error occurred. Please try again.");
      toast.error("Error", {
        description: "An unexpected error occurred while updating the application.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Not Found</h2>
          <p className="text-gray-600 mb-6">The application you're looking for doesn't exist.</p>
          <Link href="/borrower/dashboard">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/applications/${params.id}`}>
              <Button variant="outline" size="sm" className="border-gray-300">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Edit Application {application.application_id}
              </h1>
              <p className="text-gray-600 mt-1">
                Update your loan application details
              </p>
            </div>
          </div>
        </div>

        {/* General Error Message */}
        {generalError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm font-medium">{generalError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <FileText className="h-6 w-6 text-indigo-600 mr-3" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="first_name">First Name*</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 ${errors.first_name ? 'border-red-500' : ''}`}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name[0]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="last_name">Last Name*</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 ${errors.last_name ? 'border-red-500' : ''}`}
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.last_name[0]}</p>
                )}
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
              <div>
                <Label htmlFor="phone">Phone Number*</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <FileText className="h-6 w-6 text-purple-600 mr-3" />
              Business Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="business_name">Business Name*</Label>
                <Input
                  id="business_name"
                  name="business_name"
                  type="text"
                  value={formData.business_name}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 ${errors.business_name ? 'border-red-500' : ''}`}
                />
                {errors.business_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.business_name[0]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="business_type">Business Type*</Label>
                <Input
                  id="business_type"
                  name="business_type"
                  type="text"
                  value={formData.business_type}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 ${errors.business_type ? 'border-red-500' : ''}`}
                />
                {errors.business_type && (
                  <p className="text-red-500 text-sm mt-1">{errors.business_type[0]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="industry">Industry*</Label>
                <Input
                  id="industry"
                  name="industry"
                  type="text"
                  value={formData.industry}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 ${errors.industry ? 'border-red-500' : ''}`}
                />
                {errors.industry && (
                  <p className="text-red-500 text-sm mt-1">{errors.industry[0]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="years_in_business">Years in Business*</Label>
                <Input
                  id="years_in_business"
                  name="years_in_business"
                  type="number"
                  min="0"
                  value={formData.years_in_business}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 ${errors.years_in_business ? 'border-red-500' : ''}`}
                />
                {errors.years_in_business && (
                  <p className="text-red-500 text-sm mt-1">{errors.years_in_business[0]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="annual_revenue">Annual Revenue*</Label>
                <Input
                  id="annual_revenue"
                  name="annual_revenue"
                  type="number"
                  min="0"
                  value={formData.annual_revenue}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 ${errors.annual_revenue ? 'border-red-500' : ''}`}
                />
                {errors.annual_revenue && (
                  <p className="text-red-500 text-sm mt-1">{errors.annual_revenue[0]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="credit_score">Credit Score*</Label>
                <Input
                  id="credit_score"
                  name="credit_score"
                  type="number"
                  min="300"
                  max="850"
                  value={formData.credit_score}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 ${errors.credit_score ? 'border-red-500' : ''}`}
                />
                {errors.credit_score && (
                  <p className="text-red-500 text-sm mt-1">{errors.credit_score[0]}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="business_address">Business Address*</Label>
                <Textarea
                  id="business_address"
                  name="business_address"
                  value={formData.business_address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className={`mt-1 ${errors.business_address ? 'border-red-500' : ''}`}
                />
                {errors.business_address && (
                  <p className="text-red-500 text-sm mt-1">{errors.business_address[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Registration Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <FileText className="h-6 w-6 text-green-600 mr-3" />
              Registration Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="registration_number">Registration Number*</Label>
                <Input
                  id="registration_number"
                  name="registration_number"
                  type="text"
                  value={formData.registration_number}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 ${errors.registration_number ? 'border-red-500' : ''}`}
                />
                {errors.registration_number && (
                  <p className="text-red-500 text-sm mt-1">{errors.registration_number[0]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="tax_id_number">Tax ID Number*</Label>
                <Input
                  id="tax_id_number"
                  name="tax_id_number"
                  type="text"
                  value={formData.tax_id_number}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 ${errors.tax_id_number ? 'border-red-500' : ''}`}
                />
                {errors.tax_id_number && (
                  <p className="text-red-500 text-sm mt-1">{errors.tax_id_number[0]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="has_bankruptcy">Bankruptcy History*</Label>
                <select
                  id="has_bankruptcy"
                  name="has_bankruptcy"
                  value={formData.has_bankruptcy}
                  onChange={handleInputChange}
                  required
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.has_bankruptcy ? 'border-red-500' : ''}`}
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
                {errors.has_bankruptcy && (
                  <p className="text-red-500 text-sm mt-1">{errors.has_bankruptcy[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Loan Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <FileText className="h-6 w-6 text-blue-600 mr-3" />
              Loan Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="loan_amount">Loan Amount*</Label>
                <Input
                  id="loan_amount"
                  name="loan_amount"
                  type="number"
                  min="0"
                  value={formData.loan_amount}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 ${errors.loan_amount ? 'border-red-500' : ''}`}
                />
                {errors.loan_amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.loan_amount[0]}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="loan_purpose">Loan Purpose*</Label>
                <Textarea
                  id="loan_purpose"
                  name="loan_purpose"
                  value={formData.loan_purpose}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className={`mt-1 ${errors.loan_purpose ? 'border-red-500' : ''}`}
                />
                {errors.loan_purpose && (
                  <p className="text-red-500 text-sm mt-1">{errors.loan_purpose[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Link href={`/applications/${params.id}`}>
              <Button variant="outline" className="border-gray-300">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
