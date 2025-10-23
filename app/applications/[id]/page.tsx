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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Application {application.application_id}
            </h1>
            <p className="text-gray-600 mt-2">
              Submitted on {formatDate(application.created_at)}
            </p>
          </div>
          <Badge className={`${getStatusColor(application.status)} text-sm font-medium px-4 py-2`}>
            {application.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Syndicates Section */}
        {application.syndicates && application.syndicates.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <Building className="h-6 w-6 text-indigo-600 mr-3" />
              Funding Syndicates
            </h2>
            <div className="space-y-6">
              {application.syndicates.map((syndicate) => (
                <div key={syndicate.id} className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-white to-gray-50 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{syndicate.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{syndicate.description}</p>
                    </div>
                    <Badge className={`${getStatusColor(syndicate.status)} text-xs`}>
                      {syndicate.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center mb-2">
                        <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-700">Amount</span>
                      </div>
                      <p className="font-bold text-lg text-green-800">{formatCurrency(syndicate.amount)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-700">Rate</span>
                      </div>
                      <p className="font-bold text-lg text-blue-800">{syndicate.rate}%</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center mb-2">
                        <Clock className="h-5 w-5 text-purple-600 mr-2" />
                        <span className="text-sm font-medium text-purple-700">Term</span>
                      </div>
                      <p className="font-bold text-lg text-purple-800">{syndicate.term} months</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">Funding Progress</span>
                      <span className="text-sm font-bold text-indigo-600">{syndicate.funding_progress}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${syndicate.funding_progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <User className="h-4 w-4 text-indigo-600 mr-2" />
                      Lead Funder
                    </h4>
                    <div className="flex items-center bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-3 border border-indigo-200">
                      <Building className="h-5 w-5 text-indigo-600 mr-3" />
                      <div>
                        <p className="font-semibold text-gray-900">{syndicate.lead_funder.name}</p>
                        <p className="text-sm text-indigo-600">{syndicate.lead_funder.institution_name}</p>
                      </div>
                    </div>
                  </div>

                  {syndicate.bids && syndicate.bids.length > 0 && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <DollarSign className="h-4 w-4 text-green-600 mr-2" />
                        Bids ({syndicate.bids.length})
                      </h4>
                      <div className="space-y-3">
                        {syndicate.bids.map((bid) => (
                          <div key={bid.id} className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow">
                            <div>
                              <p className="font-semibold text-gray-900">{formatCurrency(bid.amount)}</p>
                              <p className="text-sm text-gray-600">{bid.rate}% • {bid.term}</p>
                            </div>
                            <Badge className={`${getStatusColor(bid.status)} text-xs px-3 py-1`}>
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
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <FileText className="h-6 w-6 text-blue-600 mr-3" />
              Loan Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Loan Purpose</span>
                <span className="font-semibold text-gray-900">{application.loan_purpose}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Requested Amount</span>
                <span className="font-bold text-lg text-green-600">{formatCurrency(application.loan_amount)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Application Date</span>
                <span className="font-semibold text-gray-900">{formatDate(application.created_at)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">Status</span>
                <Badge className={`${getStatusColor(application.status)} text-xs px-3 py-1`}>
                  {application.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <Building className="h-6 w-6 text-purple-600 mr-3" />
              Business Information
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Business Name</span>
                <span className="font-semibold text-gray-900">{application.business_name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Business Type</span>
                <span className="font-semibold text-gray-900">{application.business_type}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Industry</span>
                <span className="font-semibold text-gray-900">{application.industry}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Years in Business</span>
                <span className="font-bold text-lg text-blue-600">{application.years_in_business}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Annual Revenue</span>
                <span className="font-bold text-lg text-green-600">{formatCurrency(application.annual_revenue)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">Credit Score</span>
                <span className="font-bold text-lg text-purple-600">{application.credit_score}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <User className="h-6 w-6 text-indigo-600 mr-3" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
                <User className="h-5 w-5 text-indigo-600 mr-3" />
                <div>
                  <p className="font-semibold text-gray-900">{application.first_name} {application.last_name}</p>
                  <p className="text-sm text-indigo-600">Primary Contact</p>
                </div>
              </div>
              <div className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <Mail className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium text-gray-700">{application.email}</span>
              </div>
              <div className="flex items-center bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                <Phone className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium text-gray-700">{application.phone}</span>
              </div>
              <div className="flex items-center bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
                <MapPin className="h-5 w-5 text-purple-600 mr-3" />
                <span className="font-medium text-gray-700">{application.business_address}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <FileText className="h-6 w-6 text-orange-600 mr-3" />
              Business Registration
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Registration Number</span>
                <span className="font-semibold text-gray-900">{application.registration_number}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Tax ID Number</span>
                <span className="font-semibold text-gray-900">{application.tax_id_number}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Bankruptcy History</span>
                <Badge className={`${application.has_bankruptcy ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} text-xs px-3 py-1`}>
                  {application.has_bankruptcy ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
