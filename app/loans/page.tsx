"use client";

import { useState, useEffect } from "react";
import { apiGet, useAuthStore } from "@/lib/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LeadFunder {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  user_type: string;
  institution_name: string | null;
  investor_type_id: number | null;
  business_name: string | null;
  business_type_id: number | null;
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
  loan_application: LoanApplication;
  groups: Group[];
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export default function LoansPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [syndicates, setSyndicates] = useState<Syndicate[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchSyndicates(currentPage);
  }, [currentPage]);

  const fetchSyndicates = async (page: number) => {
    // Use different loading state for initial load vs page change
    if (syndicates.length === 0) {
      setIsLoading(true);
    } else {
      setIsPageChanging(true);
    }
    
    // Scroll to top when changing pages
    if (page !== 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    try {
      const response = await apiGet(`/v1/public-syndicates?page=${page}`);
      const data = await response.json();

      if (response.ok && data.status === "success") {
        setSyndicates(data.data.data);
        setPagination({
          current_page: data.data.current_page,
          last_page: data.data.last_page,
          per_page: data.data.per_page,
          total: data.data.total,
          from: data.data.from,
          to: data.data.to,
        });
      } else {
        toast.error("Failed to load syndicates", {
          description: "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error fetching syndicates:", error);
      toast.error("Error", {
        description: "Failed to load syndicates.",
      });
    } finally {
      setIsLoading(false);
      setIsPageChanging(false);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && pagination && page <= pagination.last_page) {
      setCurrentPage(page);
    }
  };

  const generatePageNumbers = () => {
    if (!pagination) return [];
    
    const pages: (number | string)[] = [];
    const totalPages = pagination.last_page;
    const current = pagination.current_page;
    
    // Always show first page
    pages.push(1);
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show subset with ellipsis
      if (current <= 3) {
        // Near start
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (current >= totalPages - 2) {
        // Near end
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
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

  const getRiskColor = (risk: string | null | undefined) => {
    if (!risk) return "bg-gray-100 text-gray-800 border-gray-200";
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleViewDetails = (applicationId: string) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/loans/${applicationId}&message=You need to login first`);
      return;
    }
    router.push(`/loans/${applicationId}`);
  };

  const handleJoinSyndicate = (applicationId: string, syndicateId: number) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/loans/${applicationId}/commit?syndicate_id=${syndicateId}&message=You need to login first`);
      return;
    }
    router.push(`/loans/${applicationId}/commit?syndicate_id=${syndicateId}`);
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Investment Opportunities</h1>
            <p className="text-gray-600">
              {pagination && syndicates ? 
                `${syndicates.length} syndicated ${syndicates.length === 1 ? 'opportunity' : 'opportunities'} available` 
                : "Loading..."}
            </p>
          </div>
          <Link href="/submit-loan">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Submit New Application
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : syndicates.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500 text-lg mb-4">No funding opportunities available</p>
            <p className="text-gray-400 text-sm mb-6">Check back later for new syndicated loan opportunities</p>
            <Link href="/submit-loan">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Submit a Loan Application
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isPageChanging ? 'opacity-50' : 'opacity-100'}`}>
              {syndicates.map((syndicate) => (
                <div
                  key={syndicate.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {syndicate.loan_application.business_name}
                      </h3>
                      <p className="text-sm text-gray-600">{syndicate.loan_application.industry}</p>
                    </div>
                    <Badge className={getStatusColor(syndicate.loan_application.status)}>
                      {formatStatus(syndicate.loan_application.status)}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Application ID:</span>
                      <span className="font-medium text-gray-900">
                        {syndicate.loan_application.application_id.substring(0, 12)}...
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Loan Amount:</span>
                      <span className="font-bold text-indigo-600">
                        {formatCurrency(syndicate.loan_application.loan_amount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Annual Revenue:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(syndicate.loan_application.annual_revenue)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Credit Score:</span>
                      <span className="font-medium text-gray-900">
                        {syndicate.loan_application.credit_score}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Years in Business:</span>
                      <span className="font-medium text-gray-900">
                        {syndicate.loan_application.years_in_business}
                      </span>
                    </div>
                  </div>

                  {/* Syndicate Information */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-semibold text-gray-700">
                        {syndicate.name}
                      </p>
                      <Badge className={getRiskColor(syndicate.risk)}>
                        {syndicate.risk ? syndicate.risk.toUpperCase() : 'N/A'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div>
                        <span className="text-gray-600">Rate:</span>
                        <span className="font-semibold ml-1">{syndicate.rate}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Term:</span>
                        <span className="font-semibold ml-1">{syndicate.term} mo</span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Funding Progress</span>
                        <span className="font-semibold">{syndicate.funding_progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${syndicate.funding_progress}%` }}
                        ></div>
                      </div>
                    </div>
                    {syndicate.lead_funder ? (
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-600">
                          Led by: <span className="font-medium">{syndicate.lead_funder.institution_name || syndicate.lead_funder.name}</span>
                        </p>
                        <Link href={`/auth/public-profile/${syndicate.lead_funder.id}`}>
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <p className="text-xs text-green-600 font-medium">
                        🚀 Be the first to lead this syndicate!
                      </p>
                    )}
                  </div>

                  <div className="mt-auto pt-4 space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleViewDetails(syndicate.loan_application.application_id)}
                    >
                      View Details
                    </Button>
                    
                    {/* Funding Buttons */}
                    {syndicate.lead_funder ? (
                      <Button 
                        className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => handleJoinSyndicate(syndicate.loan_application.application_id, syndicate.id)}
                      >
                        Join Syndicate
                      </Button>
                    ) : (
                      <Button 
                        className="w-full mt-3 bg-green-600 hover:bg-green-700"
                        onClick={() => handleJoinSyndicate(syndicate.loan_application.application_id, syndicate.id)}
                      >
                        Be the First to Fund
                      </Button>
                    )}
                  </div>
                </div>
          ))}
        </div>

            {/* Enhanced Pagination */}
            {pagination && pagination.last_page > 1 && (
              <div className="mt-8">
                <div className="flex justify-center items-center gap-1">
                  {/* Previous Button */}
                  <Button
                    variant="outline"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1 || isPageChanging}
                    className="px-3"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </Button>

                  {/* Page Numbers */}
                  {generatePageNumbers().map((page, index) => {
                    if (page === '...') {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-3 py-2 text-gray-500"
                        >
                          ...
                        </span>
                      );
                    }
                    
                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={isActive ? "default" : "outline"}
                        onClick={() => goToPage(pageNum)}
                        disabled={isPageChanging}
                        className={`px-4 ${
                          isActive
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : ""
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  {/* Next Button */}
                  <Button
                    variant="outline"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === pagination.last_page || isPageChanging}
                    className="px-3"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Button>
                </div>

                {/* Page Info */}
                <div className="text-center mt-4 text-sm text-gray-600">
                  Showing {syndicates.length} syndicated opportunities on this page
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
