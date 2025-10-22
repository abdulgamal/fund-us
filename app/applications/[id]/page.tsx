"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { authGet } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

interface LeadFunder {
  id: number;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  institution_name: string | null;
}

interface Bid {
  id: number;
  syndicate_id: number;
  user_id: number;
  amount: number;
  rate: number;
  term: string;
  status: string;
  status_reason: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface Group {
  id: number;
  syndicate_id: number;
  user_id: number;
  funder_id: number;
  status: string;
  status_reason: string;
  pledge_amount: number;
  created_at: string;
  updated_at: string;
}

interface Syndicate {
  id: number;
  name: string;
  description: string;
  status: string;
  created_by: number;
  updated_by: number;
  lead_funder: LeadFunder;
  loan_application_id: number;
  amount: number;
  rate: number;
  term: number;
  risk: string;
  funding_progress: number;
  created_at: string;
  updated_at: string;
  bids: Bid[];
  groups: Group[];
}

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
  syndicates: Syndicate[];
}

interface ApiResponse {
  success: boolean;
  loan_application: LoanApplication;
}

const statusIcons = {
  approved: <CheckCircle className="h-5 w-5 text-green-500" />,
  pending: <Clock className="h-5 w-5 text-yellow-500" />,
  rejected: <XCircle className="h-5 w-5 text-red-500" />,
  completed: <CheckCircle className="h-5 w-5 text-green-500" />,
  current: <AlertCircle className="h-5 w-5 text-blue-500" />,
  under_review: <Clock className="h-5 w-5 text-blue-500" />,
  funded: <CheckCircle className="h-5 w-5 text-green-500" />,
  active: <CheckCircle className="h-5 w-5 text-green-500" />,
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
    case "funded":
    case "active":
    case "accepted":
      return "bg-green-100 text-green-800";
    case "pending":
    case "under_review":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function ApplicationDetailsPage() {
  const params = useParams();
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await authGet(`/v1/loan-application/${params.id}`);
        const data: ApiResponse = await response.json();

        if (response.ok && data.success) {
          setApplication(data.loan_application);
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
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application details...</p>
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
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              Application {application.application_id}
            </h1>
            <p className="text-gray-600">
              Submitted on {formatDate(application.created_at)}
            </p>
          </div>
          <Badge className={`${getStatusColor(application.status)} text-sm font-medium`}>
            {application.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Syndicates Section */}
        {application.syndicates && application.syndicates.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Funding Syndicates</h2>
            <div className="space-y-6">
              {application.syndicates.map((syndicate) => (
                <div key={syndicate.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{syndicate.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{syndicate.description}</p>
                    </div>
                    <Badge className={`${getStatusColor(syndicate.status)} text-xs`}>
                      {syndicate.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">Amount</span>
                      </div>
                      <p className="font-semibold text-gray-900">{formatCurrency(syndicate.amount)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">Rate</span>
                      </div>
                      <p className="font-semibold text-gray-900">{syndicate.rate}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">Term</span>
                      </div>
                      <p className="font-semibold text-gray-900">{syndicate.term} months</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Funding Progress</span>
                      <span className="text-sm text-gray-600">{syndicate.funding_progress}%</span>
                    </div>
                    <Progress value={syndicate.funding_progress} className="h-2" />
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Lead Funder</h4>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-gray-500 mr-2" />
                      <div>
                        <p className="font-medium text-gray-900">{syndicate.lead_funder.name}</p>
                        <p className="text-sm text-gray-600">{syndicate.lead_funder.institution_name}</p>
                      </div>
                    </div>
                  </div>

                  {syndicate.bids && syndicate.bids.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Bids ({syndicate.bids.length})</h4>
                      <div className="space-y-2">
                        {syndicate.bids.map((bid) => (
                          <div key={bid.id} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                            <div>
                              <p className="font-medium text-gray-900">{formatCurrency(bid.amount)}</p>
                              <p className="text-sm text-gray-600">{bid.rate}% • {bid.term}</p>
                            </div>
                            <Badge className={`${getStatusColor(bid.status)} text-xs`}>
                              {bid.status.toUpperCase()}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Loan Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Purpose</span>
                <span className="font-medium">{application.loan_purpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Requested Amount</span>
                <span className="font-medium">{formatCurrency(application.loan_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Application Date</span>
                <span className="font-medium">{formatDate(application.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <Badge className={`${getStatusColor(application.status)} text-xs`}>
                  {application.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Business Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Business Name</span>
                <span className="font-medium">{application.business_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Business Type</span>
                <span className="font-medium">{application.business_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Industry</span>
                <span className="font-medium">{application.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Years in Business</span>
                <span className="font-medium">{application.years_in_business}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Revenue</span>
                <span className="font-medium">{formatCurrency(application.annual_revenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Credit Score</span>
                <span className="font-medium">{application.credit_score}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-3" />
                <div>
                  <p className="font-medium">{application.first_name} {application.last_name}</p>
                  <p className="text-sm text-gray-600">Primary Contact</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-500 mr-3" />
                <span className="text-gray-700">{application.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-500 mr-3" />
                <span className="text-gray-700">{application.phone}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-3" />
                <span className="text-gray-700">{application.business_address}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Business Registration</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Registration Number</span>
                <span className="font-medium">{application.registration_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax ID Number</span>
                <span className="font-medium">{application.tax_id_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bankruptcy History</span>
                <span className="font-medium">{application.has_bankruptcy ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
