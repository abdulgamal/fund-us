"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { authGet, authPost, useAuthStore } from "@/lib/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface LoanApplication {
  id: number;
  application_id: string;
  business_name: string;
  loan_amount: number;
  loan_purpose: string;
  industry: string;
  syndicate: {
    id: number;
    name: string;
    amount: number;
    rate: number | null;
    term: number | null;
    risk: string | null;
    funding_progress: number | null;
    lead_funder: {
      id: number;
      name: string;
      institution_name: string | null;
    } | null;
    bids: SyndicateBid[];
  } | null;
}

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
    email: string;
    first_name: string;
    last_name: string;
    user_type: string;
    institution_name: string | null;
    investor_type_id: number | null;
    business_name: string | null;
    business_type_id: number | null;
  };
  syndicate: {
    id: number;
    name: string;
    description: string;
    status: string;
    loan_application_id: number;
    amount: number;
    rate: number;
    term: number;
    risk: string;
    funding_progress: number;
  };
}

export default function CommitPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const applicationId = searchParams.get("application_id");
  const syndicateId = searchParams.get("syndicate_id");
  const user = useAuthStore((state) => state.user);

  const [loanApplication, setLoanApplication] = useState<LoanApplication | null>(null);
  const [syndicateBids, setSyndicateBids] = useState<SyndicateBid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBids, setIsLoadingBids] = useState(true);
  const [commitmentAmount, setCommitmentAmount] = useState("");
  const [fundingType, setFundingType] = useState("syndicate");
  const [notes, setNotes] = useState("");
  const [bidRate, setBidRate] = useState("");
  const [bidTerm, setBidTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLoanApplication();
    // Always try to fetch syndicate bids using the loan application ID
    fetchSyndicateBids();
  }, [id]);

  const fetchLoanApplication = async () => {
    setIsLoading(true);
    try {
      const response = await authGet(`/v1/loan-application/${id}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setLoanApplication(data.loan_application);
        // Extract bids from the syndicate object
        if (data.loan_application.syndicate && data.loan_application.syndicate.bids) {
          setSyndicateBids(data.loan_application.syndicate.bids);
        }
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

  const fetchSyndicateBids = async () => {
    setIsLoadingBids(true);
    try {
      // The bids are now included in the loan application response
      // We'll extract them from the syndicate object when the loan application is fetched
      setIsLoadingBids(false);
    } catch (error) {
      console.error("Error fetching syndicate bids:", error);
      setIsLoadingBids(false);
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

  const getRemainingAmount = () => {
    if (!loanApplication || !loanApplication.syndicate) {
      return loanApplication?.loan_amount || 0;
    }
    const syndicate = loanApplication.syndicate;
    if (syndicate.funding_progress === null) {
      return syndicate.amount;
    }
    return syndicate.amount * (1 - syndicate.funding_progress / 100);
  };

  const shouldShowBidInputs = () => {
    if (!loanApplication || !loanApplication.syndicate) return false;
    const syndicate = loanApplication.syndicate;
    // Show inputs if: no lead funder AND (no bids OR all bids are pending)
    const hasNoLeadFunder = !syndicate.lead_funder;
    const hasNoBids = syndicate.bids.length === 0;
    const allBidsPending = syndicate.bids.length > 0 && syndicate.bids.every(bid => bid.status.toLowerCase() === 'pending');
    return hasNoLeadFunder && (hasNoBids || allBidsPending);
  };

  const handleSubmit = async () => {
    if (!commitmentAmount || parseFloat(commitmentAmount) <= 0) {
      toast.error("Invalid Amount", {
        description: "Please enter a valid commitment amount.",
      });
      return;
    }

    // Validate rate and term if they're required
    if (shouldShowBidInputs()) {
      if (!bidRate || parseFloat(bidRate) <= 0) {
        toast.error("Invalid Rate", {
          description: "Please enter a valid interest rate.",
        });
        return;
      }
      if (!bidTerm || parseFloat(bidTerm) <= 0) {
        toast.error("Invalid Term", {
          description: "Please enter a valid loan term in months.",
        });
        return;
      }
    }

    if (!user) {
      toast.error("Authentication Required", {
        description: "Please log in to submit a commitment.",
      });
      return;
    }

    if (!loanApplication) {
      toast.error("Loan Application Not Found", {
        description: "Unable to load loan application details.",
      });
      return;
    }

    const activeSyndicate = loanApplication.syndicate || null;

    if (!activeSyndicate) {
      toast.error("Syndicate Required", {
        description: "Please select a valid syndicate to commit to.",
      });
      return;
    }

    // Use the syndicate ID from the active syndicate
    const syndicateIdToUse = syndicateId || activeSyndicate.id;

    setIsSubmitting(true);
    try {
      // Use user's rate and term if they provided them, otherwise use syndicate values or defaults
      const rateToUse = shouldShowBidInputs() && bidRate 
        ? parseFloat(bidRate) 
        : (activeSyndicate.rate || 0);
      const termToUse = shouldShowBidInputs() && bidTerm 
        ? `${bidTerm} months`
        : (activeSyndicate.term ? `${activeSyndicate.term} months` : '24 months');

      const payload = {
        syndicate_id: syndicateIdToUse,
        amount: parseFloat(commitmentAmount),
        rate: rateToUse,
        term: termToUse,
        notes: notes || "",
      };

      const response = await authPost(`/v1/syndicate-bids/submit`, payload);
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Syndicate Join Request Submitted!", {
          description: data.message || "Your request to join the syndicate has been submitted successfully.",
          duration: 3000,
        });
        
        // Log the successful response for debugging
        console.log("Syndicate join request successful:", data);
        
        // Refresh the commits list
        fetchSyndicateBids();
        
        // Clear form
        setCommitmentAmount("");
        setNotes("");
        
        setTimeout(() => {
          router.push("/funder/commitments");
        }, 1500);
      } else {
        throw new Error(data.message || "Failed to submit syndicate join request");
      }
    } catch (error) {
      console.error("Error submitting syndicate join request:", error);
      toast.error("Submission Failed", {
        description: error instanceof Error ? error.message : "Failed to submit your syndicate join request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!loanApplication) {
    return null;
  }

  const activeSyndicate = loanApplication.syndicate || null;
  const remainingAmount = getRemainingAmount();

  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            {activeSyndicate ? "Join Syndicate" : "Be the First to Fund"}
          </h1>
          <p className="text-gray-600">
            {loanApplication.business_name} - {loanApplication.industry}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Loan Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label>Business Name</Label>
              <p className="font-medium">{loanApplication.business_name}</p>
            </div>
            <div>
              <Label>Industry</Label>
              <p className="font-medium">{loanApplication.industry}</p>
            </div>
            <div>
              <Label>Total Loan Amount</Label>
              <p className="font-medium">{formatCurrency(loanApplication.loan_amount)}</p>
            </div>
            <div>
              <Label>Remaining for Funding</Label>
              <p className="font-medium text-indigo-600">{formatCurrency(remainingAmount)}</p>
            </div>
            {activeSyndicate && (
              <>
                <div>
                  <Label>Interest Rate</Label>
                  <p className="font-medium">{activeSyndicate.rate ? `${activeSyndicate.rate}%` : 'TBD'}</p>
                </div>
                <div>
                  <Label>Term</Label>
                  <p className="font-medium">{activeSyndicate.term ? `${activeSyndicate.term} months` : 'TBD'}</p>
                </div>
                <div>
                  <Label>Syndicate Name</Label>
                  <p className="font-medium">{activeSyndicate.name}</p>
                </div>
                <div>
                  <Label>Lead Funder</Label>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {activeSyndicate.lead_funder 
                        ? (activeSyndicate.lead_funder.institution_name || activeSyndicate.lead_funder.name)
                        : 'No lead funder yet'}
                    </p>
                    {activeSyndicate.lead_funder && (
                      <Link href={`/auth/public-profile/${activeSyndicate.lead_funder.id}`}>
                        <Button variant="link" size="sm" className="h-auto p-0">
                          View Profile
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div>
            <Label>Loan Purpose</Label>
            <p className="text-sm text-gray-700 mt-1">{loanApplication.loan_purpose}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Join Syndicate</h2>

          <div className="space-y-6">
            <div>
              <Label htmlFor="commitmentAmount">Pledge Amount (USD)</Label>
              <Input
                id="commitmentAmount"
                type="number"
                placeholder="Enter amount"
                value={commitmentAmount}
                onChange={(e) => setCommitmentAmount(e.target.value)}
                min={10000}
                max={remainingAmount}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-2">
                Maximum available: {formatCurrency(remainingAmount)}
              </p>
            </div>

            <div>
              <Label>Funding Type</Label>
              <RadioGroup value={fundingType} onValueChange={(value) => {
                setFundingType(value);
                if (value === "full") {
                  setCommitmentAmount(remainingAmount.toString());
                }
              }} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="syndicate" id="syndicate" />
                  <Label htmlFor="syndicate">
                    {activeSyndicate ? "Join Existing Syndicate" : "Create New Syndicate"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full">Fund Entire Remaining Amount ({formatCurrency(remainingAmount)})</Label>
                </div>
              </RadioGroup>
            </div>

            {shouldShowBidInputs() && (
              <>
                <div>
                  <Label htmlFor="bidRate">Interest Rate (%) *</Label>
                  <Input
                    id="bidRate"
                    type="number"
                    placeholder="e.g., 8.5"
                    value={bidRate}
                    onChange={(e) => setBidRate(e.target.value)}
                    step="0.1"
                    min="0"
                    max="100"
                    className="mt-1"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter your proposed interest rate for this loan
                  </p>
                </div>

                <div>
                  <Label htmlFor="bidTerm">Loan Term (Months) *</Label>
                  <Input
                    id="bidTerm"
                    type="number"
                    placeholder="e.g., 24"
                    value={bidTerm}
                    onChange={(e) => setBidTerm(e.target.value)}
                    min="1"
                    max="120"
                    className="mt-1"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the loan term in months (e.g., 24 for 2 years)
                  </p>
                </div>
              </>
            )}

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Add any special instructions or conditions"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Review & Submit</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Pledge Amount</span>
              <span className="font-medium text-indigo-600 text-lg">
                {commitmentAmount ? formatCurrency(parseFloat(commitmentAmount)) : "$0.00"}
              </span>
            </div>
            {activeSyndicate && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Rate</span>
                  <span className="font-medium">
                    {shouldShowBidInputs() && bidRate 
                      ? `${bidRate}%` 
                      : (activeSyndicate.rate ? `${activeSyndicate.rate}%` : 'TBD')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Term</span>
                  <span className="font-medium">
                    {shouldShowBidInputs() && bidTerm 
                      ? `${bidTerm} months` 
                      : (activeSyndicate.term ? `${activeSyndicate.term} months` : 'TBD')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk Level</span>
                  <span className="font-medium capitalize">{activeSyndicate.risk || 'TBD'}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="border-gray-300"
              onClick={() => router.push(`/loans/${id}`)}
            >
              Back to Details
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 flex-1"
              onClick={handleSubmit}
              disabled={
                isSubmitting || 
                !commitmentAmount || 
                parseFloat(commitmentAmount) <= 0 ||
                (shouldShowBidInputs() && (!bidRate || !bidTerm))
              }
            >
              {isSubmitting ? "Submitting..." : "Join Syndicate"}
            </Button>
          </div>
        </div>

        {/* All Commits Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">All Commits</h2>
          
          {isLoadingBids ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : syndicateBids.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No commits yet. Be the first to commit!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {syndicateBids.map((bid) => (
                <div
                  key={bid.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {bid.user?.institution_name || bid.user?.name || `User ${bid.user_id}`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {bid.user ? `${bid.user.first_name} ${bid.user.last_name}` : `User ID: ${bid.user_id}`}
                      </p>
                    </div>
                    <Badge className={getStatusBadgeColor(bid.status)}>
                      {bid.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <Label className="text-xs text-gray-500">Amount</Label>
                      <p className="font-medium text-indigo-600">
                        {formatCurrency(bid.amount)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Rate</Label>
                      <p className="font-medium">{bid.rate}%</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Term</Label>
                      <p className="font-medium">{bid.term}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Date</Label>
                      <p className="font-medium">{formatDate(bid.created_at)}</p>
                    </div>
                  </div>

                  {bid.notes && (
                    <div className="pt-3 border-t border-gray-100">
                      <Label className="text-xs text-gray-500">Notes</Label>
                      <p className="text-sm text-gray-700 mt-1">{bid.notes}</p>
                    </div>
                  )}

                  {bid.status_reason && (
                    <div className="pt-3 border-t border-gray-100 mt-3">
                      <Label className="text-xs text-gray-500">Status Reason</Label>
                      <p className="text-sm text-gray-700 mt-1">{bid.status_reason}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
