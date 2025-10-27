"use client";

import { useState, useEffect } from "react";
import { authGet, useAuthStore } from "@/lib/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SyndicateGroup {
  id: number;
  syndicate_id: number;
  funder_id: number;
  status: string;
  status_reason: string;
  pledge_amount: number;
  created_at: string;
  updated_at: string;
  syndicate: {
    id: number;
    name: string;
    description: string;
    status: string;
    created_by: number;
    updated_by: number;
    lead_funder: {
      id: number;
      name: string;
      email: string;
      institution_name: string | null;
      user_type: string;
    };
    loan_application_id: number;
    amount: number;
    rate: number;
    term: number;
    risk: string;
    funding_progress: number;
    created_at: string;
    updated_at: string;
  };
}

export default function CommitmentsPage() {
  const [syndicates, setSyndicates] = useState<SyndicateGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchSyndicates();
  }, []);

  const fetchSyndicates = async () => {
    setIsLoading(true);
    try {
      const response = await authGet("/v1/syndicates/funder");
      const data = await response.json();

      if (response.ok && data.success) {
        // Handle both paginated and non-paginated responses
        const syndicatesArray = data.syndicates.data || data.syndicates;
        setSyndicates(Array.isArray(syndicatesArray) ? syndicatesArray : []);
      } else {
        toast.error("Failed to load commitments", {
          description: "Unable to fetch your syndicate commitments.",
        });
      }
    } catch (error) {
      console.error("Error fetching syndicates:", error);
      toast.error("Error", {
        description: "Failed to load commitments. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRiskBadgeColor = (risk: string | null | undefined) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Your Syndicate Commitments</h1>
          <p className="text-gray-600">
            View and manage your syndicate participation and funding commitments.
          </p>
        </div>

        {syndicates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Commitments Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't joined any syndicates yet. Start by exploring available opportunities.
            </p>
            <Button onClick={() => window.location.href = '/loans'}>
              Browse Loan Opportunities
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {syndicates.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link href={`/syndicate/${group.syndicate.id}`}>
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer">
                          {group.syndicate.name}
                        </h3>
                      </Link>
                      <Badge className={getStatusBadgeColor(group.status)}>
                        {group.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{group.syndicate.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Lead Funder:</span>{" "}
                        {group.syndicate.lead_funder 
                          ? (
                            <>
                              {group.syndicate.lead_funder.institution_name || group.syndicate.lead_funder.name}
                              <Link href={`/auth/public-profile/${group.syndicate.lead_funder.id}`}>
                                <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                  View Profile
                                </Button>
                              </Link>
                            </>
                          )
                          : 'No lead funder yet'}
                      </div>
                      <div>
                        <span className="font-medium">Joined:</span> {formatDate(group.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">
                      {formatCurrency(group.pledge_amount)}
                    </div>
                    <div className="text-sm text-gray-600">Your Pledge</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Total Syndicate Amount</div>
                    <div className="font-semibold">{formatCurrency(group.syndicate.amount)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Interest Rate</div>
                    <div className="font-semibold">{group.syndicate.rate}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Term</div>
                    <div className="font-semibold">{group.syndicate.term} months</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Risk Level</div>
                    <Badge className={getRiskBadgeColor(group.syndicate.risk)}>
                      {group.syndicate.risk ? group.syndicate.risk.toUpperCase() : 'N/A'}
                    </Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Funding Progress</span>
                    <span className="text-sm font-medium text-gray-700">
                      {group.syndicate.funding_progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${group.syndicate.funding_progress}%` }}
                    ></div>
                  </div>
                </div>

                {group.status_reason && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500 mb-1">Status Reason</div>
                    <div className="text-sm text-gray-700">{group.status_reason}</div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <Link href={`/syndicate/${group.syndicate.id}`}>
                    <Button className="w-full">
                      View Syndicate
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}