"use client";

import { useState, useEffect } from "react";
import { DollarSign, Users, TrendingUp, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { authGet } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

interface Commitment {
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
    amount: number;
    rate: number;
    term: number;
    risk: string | null;
    funding_progress: number;
    loan_application_id: number;
    lead_funder: {
      id: number;
      name: string;
      institution_name: string | null;
    } | null;
  };
}

interface SyndicatedDeal {
  id: number;
  name: string;
  description: string;
  status: string;
  amount: number;
  rate: number;
  term: number;
  risk: string;
  funding_progress: number;
  lead_funder: number;
  loan_application_id: number;
  loan_application: {
    id: number;
    application_id: string;
    business_name: string;
    industry: string;
    loan_amount: number;
    loan_purpose: string;
    status: string;
  };
}

interface LoanOpportunity {
  id: number;
  application_id: string;
  business_name: string;
  industry: string;
  loan_amount: number;
  loan_purpose: string;
  annual_revenue: number;
  credit_score: number;
  status: string;
  syndicates: {
    id: number;
    name: string;
    amount: number;
    rate: number;
    term: number;
    risk: string;
    funding_progress: number;
  }[];
}

interface FunderPortalData {
  active_commitments: Commitment[];
  syndicated_deals: SyndicatedDeal[];
  recommended_loan_opportunities: LoanOpportunity[];
}

export default function FunderDashboard() {
  const [portalData, setPortalData] = useState<FunderPortalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPortalData();
  }, []);

  const fetchPortalData = async () => {
    setIsLoading(true);
    try {
      // Fetch current commitments from the syndicates endpoint
      const commitmentsResponse = await authGet("/v1/syndicates/funder");
      const commitmentsData = await commitmentsResponse.json();

      // Fetch syndicates that the user leads
      const leadSyndicatesResponse = await authGet("/v1/syndicates/lead-funder");
      const leadSyndicatesData = await leadSyndicatesResponse.json();

      if (commitmentsResponse.ok && commitmentsData.success) {
        // Get the latest 3 commitments - handle both paginated and non-paginated responses
        const commitmentsArray = commitmentsData.syndicates.data || commitmentsData.syndicates;
        const latestCommitments = Array.isArray(commitmentsArray) ? commitmentsArray.slice(0, 3) : [];
        
        // Get syndicates that the user leads
        const leadSyndicates = leadSyndicatesResponse.ok && leadSyndicatesData.success ? leadSyndicatesData.syndicates.data : [];
        
        setPortalData({
          active_commitments: latestCommitments || [],
          syndicated_deals: leadSyndicates || [],
          recommended_loan_opportunities: [], // Keep empty for now since we're focusing on commitments
        });
      } else {
        toast.error("Failed to load commitments data", {
          description: "Please try refreshing the page.",
        });
      }
    } catch (error) {
      console.error("Error fetching commitments data:", error);
      toast.error("Error", {
        description: "Failed to load commitments data.",
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

  const getRiskColor = (risk: string | null | undefined) => {
    if (!risk) return "bg-gray-100 text-gray-800 border-gray-200";
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "funded":
        return "bg-green-100 text-green-800 border-green-200";
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const calculateTotalCommitments = () => {
    if (!portalData) return 0;
    return portalData.active_commitments.reduce((sum, c) => sum + c.pledge_amount, 0);
  };

  const calculateAvgYield = () => {
    if (!portalData || portalData.active_commitments.length === 0) return 0;
    const totalRate = portalData.active_commitments.reduce((sum, c) => sum + c.syndicate.rate, 0);
    return (totalRate / portalData.active_commitments.length).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const stats = [
    {
      name: "Active Commitments",
      value: formatCurrency(calculateTotalCommitments()),
      icon: <DollarSign className="h-6 w-6" />,
      count: portalData?.active_commitments.length || 0,
    },
    {
      name: "Syndicated Deals",
      value: portalData?.syndicated_deals.length.toString() || "0",
      icon: <Users className="h-6 w-6" />,
      count: portalData?.syndicated_deals.length || 0,
    },
    {
      name: "Avg. Yield",
      value: `${calculateAvgYield()}%`,
      icon: <TrendingUp className="h-6 w-6" />,
      count: 0,
    },
    {
      name: "Opportunities",
      value: portalData?.recommended_loan_opportunities.length.toString() || "0",
      icon: <FileText className="h-6 w-6" />,
      count: portalData?.recommended_loan_opportunities.length || 0,
    },
  ];

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Funding Partner Dashboard</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recommended Opportunities */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">
              Recommended Loan Opportunities
            </h2>
            <Link href="/loans">
              <Button
                variant="ghost"
                className="text-indigo-600 hover:text-indigo-800"
              >
                View All Opportunities
              </Button>
            </Link>
          </div>

          {portalData && portalData.recommended_loan_opportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portalData.recommended_loan_opportunities.map((opportunity) => (
                <div key={opportunity.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h3 className="font-medium mb-2">{opportunity.business_name}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {opportunity.industry} • {formatCurrency(opportunity.loan_amount)}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-medium">{formatCurrency(opportunity.annual_revenue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Credit Score:</span>
                      <span className="font-medium">{opportunity.credit_score}</span>
                    </div>
                    {opportunity.syndicates.length > 0 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Rate:</span>
                          <span className="font-medium">{opportunity.syndicates[0].rate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Term:</span>
                          <span className="font-medium">{opportunity.syndicates[0].term} months</span>
                        </div>
                        <Badge className={getRiskColor(opportunity.syndicates[0].risk)}>
                          {opportunity.syndicates[0].risk ? `${opportunity.syndicates[0].risk.toUpperCase()} RISK` : 'N/A RISK'}
                        </Badge>
                      </>
                    )}
                  </div>
                  <Link href={`/loans/${opportunity.id}`}>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recommended opportunities at this time.</p>
          )}
        </div>

        {/* Your Commitments Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Your Current Commitments</h2>
            <Link href="/funder/commitments">
              <Button
                variant="ghost"
                className="text-indigo-600 hover:text-indigo-800"
              >
                View All Commitments
              </Button>
            </Link>
          </div>

          {portalData && portalData.active_commitments.length > 0 ? (
            <div className="space-y-4">
              {portalData.active_commitments.map((commitment) => (
                <div
                  key={commitment.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{commitment.syndicate.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-600">
                          Lead Funder: {commitment.syndicate.lead_funder 
                            ? (commitment.syndicate.lead_funder.institution_name || commitment.syndicate.lead_funder.name)
                            : 'No lead funder yet'}
                        </p>
                        {commitment.syndicate.lead_funder && (
                          <Link href={`/auth/public-profile/${commitment.syndicate.lead_funder.id}`}>
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                              View Profile
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                    <Badge className={getRiskColor(commitment.syndicate.risk)}>
                      {commitment.syndicate.risk ? `${commitment.syndicate.risk.toUpperCase()} RISK` : 'N/A RISK'}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-700 mb-4">{commitment.syndicate.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Your Pledge</p>
                      <p className="font-bold text-indigo-600">{formatCurrency(commitment.pledge_amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-semibold">{formatCurrency(commitment.syndicate.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Interest Rate</p>
                      <p className="font-semibold">{commitment.syndicate.rate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Term</p>
                      <p className="font-semibold">{commitment.syndicate.term} months</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Funding Progress</span>
                      <span className="font-medium">{commitment.syndicate.funding_progress}%</span>
                    </div>
                    <Progress value={commitment.syndicate.funding_progress} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Status Reason</p>
                      <p className="text-sm font-medium">{commitment.status_reason}</p>
                    </div>
                    <Link href={`/syndicate/${commitment.syndicate.id}`}>
                      <Button variant="outline" size="sm">
                        View Syndicate
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">You have no active commitments.</p>
          )}
        </div>

        {/* Syndicated Deals Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold"> Syndicates You Lead </h2>
          </div>

          {portalData && portalData.syndicated_deals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portalData.syndicated_deals.map((deal) => (
                <div
                  key={deal.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold">{deal.name}</h3>
                    <Badge className={getRiskColor(deal.loan_application.status)}>
                      {deal.loan_application.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{deal.loan_application.business_name}</p>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">{deal.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold">{formatCurrency(deal.amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rate:</span>
                      <span className="font-semibold">{deal.rate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Term:</span>
                      <span className="font-semibold">{deal.term} months</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={deal.funding_progress} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1 text-center">{deal.funding_progress}% Funded</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link href={`/syndicate/${deal.id}`}>
                      <Button variant="outline" className="w-full" size="sm">
                        View Syndicate
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No syndicated deals available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
