"use client";

import { useState, useEffect } from "react";
import { authGet } from "@/lib/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LoanApplication {
  id: number;
  application_id: string;
  first_name: string;
  last_name: string;
  business_name: string;
  business_type: string;
  industry: string;
  annual_revenue: number;
  credit_score: number;
  loan_amount: number;
  loan_purpose: string;
  status: string;
  created_at: string;
  years_in_business: number;
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
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchLoanApplications(currentPage);
  }, [currentPage]);

  const fetchLoanApplications = async (page: number) => {
    // Use different loading state for initial load vs page change
    if (loanApplications.length === 0) {
      setIsLoading(true);
    } else {
      setIsPageChanging(true);
    }
    
    // Scroll to top when changing pages
    if (page !== 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    try {
      const response = await authGet(`/v1/loan-applications?page=${page}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setLoanApplications(data.loan_applications.data);
        setPagination({
          current_page: data.loan_applications.current_page,
          last_page: data.loan_applications.last_page,
          per_page: data.loan_applications.per_page,
          total: data.loan_applications.total,
          from: data.loan_applications.from,
          to: data.loan_applications.to,
        });
      } else {
        toast.error("Failed to load loan applications", {
          description: "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error fetching loan applications:", error);
      toast.error("Error", {
        description: "Failed to load loan applications.",
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

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Loan Applications</h1>
            <p className="text-gray-600">
              {pagination ? `${pagination.total} ${pagination.total === 1 ? 'application' : 'applications'} found` : "Loading..."}
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
        ) : loanApplications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500 text-lg mb-4">No loan applications found</p>
            <Link href="/submit-loan">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Submit Your First Application
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isPageChanging ? 'opacity-50' : 'opacity-100'}`}>
              {loanApplications.map((loan) => (
                <div
                  key={loan.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {loan.business_name}
                      </h3>
                      <p className="text-sm text-gray-600">{loan.industry}</p>
                    </div>
                    <Badge className={getStatusColor(loan.status)}>
                      {formatStatus(loan.status)}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Application ID:</span>
                      <span className="font-medium text-gray-900">
                        {loan.application_id.substring(0, 12)}...
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Loan Amount:</span>
                      <span className="font-bold text-indigo-600">
                        {formatCurrency(loan.loan_amount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Annual Revenue:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(loan.annual_revenue)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Credit Score:</span>
                      <span className="font-medium text-gray-900">
                        {loan.credit_score}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Years in Business:</span>
                      <span className="font-medium text-gray-900">
                        {loan.years_in_business}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Purpose:</p>
                    <p className="text-sm text-gray-900 line-clamp-2">
                      {loan.loan_purpose}
                    </p>
                  </div>

                  <div className="mt-4">
                    <Link href={`/loans/${loan.application_id}`}>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
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
                  Showing {pagination.from} to {pagination.to} of {pagination.total} results
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
