"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { authGet, authPost, useAuthStore } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

interface SyndicateBid {
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
  user?: {
    id: number;
    name: string;
  };
}

interface SyndicateGroup {
  id: number;
  syndicate_id: number;
  funder_id: number;
  status: string;
  status_reason: string;
  pledge_amount: number;
  created_at: string;
  updated_at: string;
  funder?: {
    id: number;
    name: string;
  };
}

interface Syndicate {
  id: number;
  name: string;
  description: string;
  status: string;
  created_by: number;
  updated_by: number;
  lead_funder: number;
  loan_application_id: number;
  amount: number;
  rate: number;
  term: number;
  risk: string;
  funding_progress: number;
  created_at: string;
  updated_at: string;
  bids: SyndicateBid[];
  groups: SyndicateGroup[];
  loan_application?: {
    id: number;
    application_id: string;
  };
}

export default function SyndicateDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [syndicate, setSyndicate] = useState<Syndicate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syndicateId = params.id as string;

  // Check if logged-in user is the lead funder or creator
  const isLeadFunder = user && syndicate && user.id === syndicate.lead_funder;
  const isCreator = user && syndicate && user.id === syndicate.created_by;
  const hasNoLeadFunder = syndicate && !syndicate.lead_funder;

  useEffect(() => {
    if (syndicateId) {
      fetchSyndicateDetails();
    }
  }, [syndicateId]);

  const fetchSyndicateDetails = async () => {
    setIsLoading(true);
    try {
      const response = await authGet(`/v1/syndicate/${syndicateId}`);
      const data = await response.json();

      if (response.ok && data) {
        setSyndicate(data);
      } else {
        toast.error("Failed to load syndicate details", {
          description: "Please try again later.",
        });
        router.push("/loans");
      }
    } catch (error) {
      console.error("Error fetching syndicate details:", error);
      toast.error("Error", {
        description: "Failed to load syndicate details.",
      });
      router.push("/loans");
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200";
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

  const calculateTotalPledged = () => {
    if (!syndicate) return 0;
    return syndicate.groups.reduce((sum, group) => sum + group.pledge_amount, 0);
  };

  const calculateRemainingAmount = () => {
    if (!syndicate) return 0;
    return syndicate.amount - calculateTotalPledged();
  };

  const getVisibleParticipants = () => {
    if (!syndicate) return [];
    // Lead funder sees all participants
    if (isLeadFunder) {
      return syndicate.groups;
    }
    // Non-lead funders only see approved participants
    return syndicate.groups.filter(group => group.status.toLowerCase() === 'approved');
  };

  const handleApproveCommit = async (commitId: number) => {
    if (!syndicate) return;
    
    try {
      const response = await authPost(`/v1/syndicates/${syndicate.id}/approve-commit/${commitId}`, {});
      const data = await response.json();

      if (response.ok) {
        toast.success("Commit approved successfully");
        // Refresh the syndicate data
        fetchSyndicateDetails();
      } else {
        toast.error("Failed to approve commit", {
          description: data.message || "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error approving commit:", error);
      toast.error("Error", {
        description: "Failed to approve commit.",
      });
    }
  };

  const handleRejectCommit = async (commitId: number) => {
    if (!syndicate) return;
    
    try {
      const response = await authPost(`/v1/syndicates/${syndicate.id}/reject-commit/${commitId}`, {});
      const data = await response.json();

      if (response.ok) {
        toast.success("Commit rejected successfully");
        // Refresh the syndicate data
        fetchSyndicateDetails();
      } else {
        toast.error("Failed to reject commit", {
          description: data.message || "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error rejecting commit:", error);
      toast.error("Error", {
        description: "Failed to reject commit.",
      });
    }
  };

  const handleMakeLead = async (bidId: number) => {
    if (!syndicate) return;
    
    // Show confirmation dialog
    const confirmed = window.confirm(
      "This action will make this bidder the lead funder of this syndicate and reject all other bids. Do you want to continue?"
    );
    
    if (!confirmed) return;
    
    try {
      const response = await authPost(`/v1/syndicate-bids/accept/${bidId}`, {});
      const data = await response.json();

      if (response.ok) {
        toast.success("Bid accepted as lead funder successfully");
        // Refresh the syndicate data
        fetchSyndicateDetails();
      } else {
        toast.error("Failed to accept bid as lead funder", {
          description: data.message || "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error accepting bid as lead funder:", error);
      toast.error("Error", {
        description: "Failed to accept bid as lead funder.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!syndicate) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center py-20 text-red-600">
        <p className="text-lg mb-4">Syndicate not found</p>
        <Button onClick={() => router.push("/loans")}>Back to Opportunities</Button>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{syndicate.name}</h1>
            <p className="text-gray-600 mt-2">{syndicate.description}</p>
          </div>
          <div className="flex gap-3">
            <Badge className={getRiskBadgeColor(syndicate.risk)}>
              {syndicate.risk ? `${syndicate.risk.toUpperCase()} RISK` : 'N/A RISK'}
            </Badge>
            <Badge className={getStatusBadgeColor(syndicate.status)}>
              {syndicate.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* User Role Indicator */}
        {(isLeadFunder || isCreator) && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-600 text-white">
                {isLeadFunder && isCreator ? "Lead Funder & Creator" : isLeadFunder ? "Lead Funder" : "Creator"}
              </Badge>
              <span className="text-sm text-indigo-800 font-medium">
                You {isLeadFunder && isCreator ? "are the lead funder and creator" : isLeadFunder ? "are the lead funder" : "created this syndicate"} of this syndicate.
              </span>
            </div>
          </div>
        )}

        {/* Syndicate Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Syndicate Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <Label className="text-sm text-gray-500">Total Amount</Label>
              <p className="text-2xl font-bold text-indigo-600">{formatCurrency(syndicate.amount)}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">Interest Rate</Label>
              <p className="text-2xl font-bold text-gray-900">{syndicate.rate}%</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">Term</Label>
              <p className="text-2xl font-bold text-gray-900">{syndicate.term} months</p>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            {syndicate.lead_funder && (
              <Link href={`/auth/public-profile/${syndicate.lead_funder}`}>
                <Button variant="outline" className="gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Lead Funder Profile
                </Button>
              </Link>
            )}
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Funding Progress</span>
              <span className="font-medium">{syndicate.funding_progress}%</span>
            </div>
            <Progress value={syndicate.funding_progress} className="h-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <Label className="text-sm text-gray-500">Total Pledged</Label>
              <p className="text-xl font-bold text-green-600">{formatCurrency(calculateTotalPledged())}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <Label className="text-sm text-gray-500">Remaining Amount</Label>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(calculateRemainingAmount())}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Label className="text-sm text-gray-500">Active Participants</Label>
              <p className="text-xl font-bold text-gray-900">{syndicate.groups.length}</p>
            </div>
          </div>
        </div>

        {/* Syndicate Groups */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Syndicate Participants</h2>
          
          {getVisibleParticipants().length > 0 ? (
            <div className="space-y-4">
              {getVisibleParticipants().map((group) => (
                <div
                  key={group.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {group.funder?.name || `Funder ID: ${group.funder_id}`}
                        </h3>
                        <Link href={`/auth/public-profile/${group.funder_id}`}>
                          <Button variant="link" size="sm" className="h-auto p-0">
                            View Profile
                          </Button>
                        </Link>
                      </div>
                      <p className="text-sm text-gray-600"> 
                        Pledge Amount: {formatCurrency(group.pledge_amount)}
                      </p>
                    </div>
                    <Badge className={getStatusBadgeColor(group.status)}>
                      {group.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <Label className="text-xs text-gray-500">Status Reason</Label>
                      <p className="text-sm font-medium">{group.status_reason}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Joined</Label>
                      <p className="text-sm font-medium">{formatDate(group.created_at)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Last Updated</Label>
                      <p className="text-sm font-medium">{formatDate(group.updated_at)}</p>
                    </div>
                  </div>

                  {/* Show approve/reject buttons only for lead funder and pending status */}
                  {isLeadFunder && group.status.toLowerCase() === 'pending' && (
                    <div className="flex gap-3 pt-3 border-t border-gray-200">
                      <Button 
                        onClick={() => handleApproveCommit(group.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button 
                        onClick={() => handleRejectCommit(group.id)}
                        variant="destructive"
                        className="flex-1"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No participants yet.</p>
          )}
        </div>

        {/* Syndicate Bids - Only visible to creator */}
        {isCreator && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Recent Bids</h2>
            
            {syndicate.bids.length > 0 ? (
              <div className="space-y-4">
                {syndicate.bids.map((bid) => (
                  <div
                    key={bid.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {bid.user?.name || `User ID: ${bid.user_id}`}
                          </h3>
                          <Link href={`/auth/public-profile/${bid.user_id}`}>
                            <Button variant="link" size="sm" className="h-auto p-0">
                              View Profile
                            </Button>
                          </Link>
                        </div>
                        <p className="text-sm text-gray-600">
                          Amount: {formatCurrency(bid.amount)} • Rate: {bid.rate}% • Term: {bid.term}
                        </p>
                      </div>
                      <Badge className={getStatusBadgeColor(bid.status)}>
                        {bid.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    {bid.notes && (
                      <div className="mb-3">
                        <Label className="text-xs text-gray-500">Notes</Label>
                        <p className="text-sm text-gray-700">{bid.notes}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">Submitted</Label>
                        <p className="text-sm font-medium">{formatDate(bid.created_at)}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Last Updated</Label>
                        <p className="text-sm font-medium">{formatDate(bid.updated_at)}</p>
                      </div>
                    </div>

                    {/* Show "Make Lead" button for creator when there's no lead funder */}
                    {isCreator && hasNoLeadFunder && bid.status.toLowerCase() !== 'rejected' && (
                      <div className="pt-3 border-t border-gray-200">
                        <Button 
                          onClick={() => handleMakeLead(bid.id)}
                          className="w-full bg-indigo-600 hover:bg-indigo-700"
                        >
                          Make Lead
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No bids yet.</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {syndicate.loan_application && (
            <Link href={`/loans/${syndicate.loan_application.application_id}`}>
              <Button variant="outline" className="w-full sm:w-auto">
                View Loan Application
              </Button>
            </Link>
          )}
          <Link href="/loans">
            <Button variant="outline" className="w-full sm:w-auto">
              Back to Opportunities
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
