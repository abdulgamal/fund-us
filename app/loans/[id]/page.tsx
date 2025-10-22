"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authGet } from "@/lib/api";
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
}

export default function LoanDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [loanApplication, setLoanApplication] = useState<LoanApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLoanApplication();
  }, [id]);

  const fetchLoanApplication = async () => {
    setIsLoading(true);
    try {
      const response = await authGet(`/v1/loan-application/${id}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setLoanApplication(data.loan_application);
      } else {
        toast.error("Failed to load loan application", {
          description: "The loan application could not be found.",
        });
        router.push("/loans");
      }
    } catch (error) {
      console.error("Error fetching loan application:", error);
      toast.error("Error", {
        description: "Failed to load loan application details.",
      });
      router.push("/loans");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "under_review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDocuments = () => {
    if (!loanApplication) return [];
    const docs = [];
    if (loanApplication.business_license) docs.push({ name: "Business License", file: loanApplication.business_license });
    if (loanApplication.financial_statements) docs.push({ name: "Financial Statements", file: loanApplication.financial_statements });
    if (loanApplication.tax_returns) docs.push({ name: "Tax Returns", file: loanApplication.tax_returns });
    if (loanApplication.bank_statements) docs.push({ name: "Bank Statements", file: loanApplication.bank_statements });
    if (loanApplication.proof_of_business_ownership) docs.push({ name: "Proof of Business Ownership", file: loanApplication.proof_of_business_ownership });
    return docs;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!loanApplication) {
    return (
      <div className="min-h-screen flex justify-center items-center py-20">
        <p className="text-gray-500">Loan application not found.</p>
      </div>
    );
  }

  const documents = getDocuments();

  return (
    <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
          <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{loanApplication.business_name}</h1>
                <Badge className={getStatusColor(loanApplication.status)}>
                  {formatStatus(loanApplication.status)}
                </Badge>
              </div>
              <p className="text-gray-600 text-lg">{loanApplication.industry}</p>
              <p className="text-sm text-gray-500 mt-1">
                Application ID: {loanApplication.application_id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Loan Amount</p>
              <p className="text-2xl font-bold text-indigo-600">
                {formatCurrency(loanApplication.loan_amount)}
            </p>
          </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Business Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Business Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Business Name:</span>
                <span className="font-medium">{loanApplication.business_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Business Type:</span>
                <span className="font-medium">{loanApplication.business_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Industry:</span>
                <span className="font-medium">{loanApplication.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Years in Business:</span>
                <span className="font-medium">{loanApplication.years_in_business}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Registration Number:</span>
                <span className="font-medium">{loanApplication.registration_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax ID:</span>
                <span className="font-medium">{loanApplication.tax_id_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                <span className="font-medium text-right">{loanApplication.business_address}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{loanApplication.first_name} {loanApplication.last_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{loanApplication.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{loanApplication.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SSN (Last 4):</span>
                <span className="font-medium">****{loanApplication.ssn}</span>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Financial Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Revenue:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(loanApplication.annual_revenue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Credit Score:</span>
                <span className="font-medium">{loanApplication.credit_score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Has Bankruptcy:</span>
                <span className={`font-medium ${loanApplication.has_bankruptcy ? 'text-red-600' : 'text-green-600'}`}>
                  {loanApplication.has_bankruptcy ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Loan Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Amount:</span>
                <span className="font-bold text-indigo-600">
                  {formatCurrency(loanApplication.loan_amount)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Loan Purpose:</span>
                <p className="font-medium mt-1">{loanApplication.loan_purpose}</p>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Applied On:</span>
                <span className="font-medium">{formatDate(loanApplication.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">{formatDate(loanApplication.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        {documents.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Uploaded Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-8 h-8 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.file}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Link href="/loans">
            <Button variant="outline">Back to Loans</Button>
          </Link>
          <Link href={`/loans/${loanApplication.application_id}/commit?application_id=${loanApplication.application_id}`}>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Commits
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
