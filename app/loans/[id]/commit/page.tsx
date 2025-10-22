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

interface LoanApplication {
  id: number;
  application_id: string;
  business_name: string;
  loan_amount: number;
  loan_purpose: string;
  industry: string;
  syndicates: {
    id: number;
    name: string;
    amount: number;
    rate: number;
    term: number;
    risk: string;
    funding_progress: number;
    lead_funder: {
      name: string;
      institution_name: string | null;
    };
  }[];
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
  user: {
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
      const response = await authGet(`/v1/syndicate-bids/loan-application/${id}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setSyndicateBids(data.syndicate_bids || []);
      } else {
        console.error("Failed to load syndicate bids", {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });
        // Don't show error toast, just log it - commits section can still work without this
      }
    } catch (error) {
      console.error("Error fetching syndicate bids:", error);
      // Don't show error toast, just log it
    } finally {
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
    if (!loanApplication || !loanApplication.syndicates || loanApplication.syndicates.length === 0) {
      return loanApplication?.loan_amount || 0;
    }
    const syndicate = loanApplication.syndicates[0];
    return syndicate.amount * (1 - syndicate.funding_progress / 100);
  };

  const handleSubmit = async () => {
    if (!commitmentAmount || parseFloat(commitmentAmount) <= 0) {
      toast.error("Invalid Amount", {
        description: "Please enter a valid commitment amount.",
      });
      return;
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

    const activeSyndicate = loanApplication.syndicates && loanApplication.syndicates.length > 0 
      ? loanApplication.syndicates[0] 
      : null;

    if (!activeSyndicate || !syndicateId) {
      toast.error("Syndicate Required", {
        description: "Please select a valid syndicate to commit to.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        syndicate_id: parseInt(syndicateId),
        user_id: user.id,
        amount: parseFloat(commitmentAmount),
        rate: activeSyndicate.rate,
        term: `${activeSyndicate.term} months`,
        status: "pending",
        notes: notes || "",
      };

      const response = await authPost("/v1/syndicate-bids/submit", payload);
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Commitment Submitted!", {
          description: data.message || "Your funding commitment has been submitted successfully.",
          duration: 3000,
        });
        
        // Refresh the commits list
        fetchSyndicateBids();
        
        // Clear form
        setCommitmentAmount("");
        setNotes("");
        
        setTimeout(() => {
          router.push("/funder/commitments");
        }, 1500);
      } else {
        throw new Error(data.message || "Failed to submit commitment");
      }
    } catch (error) {
      console.error("Error submitting commitment:", error);
      toast.error("Submission Failed", {
        description: error instanceof Error ? error.message : "Failed to submit your commitment. Please try again.",
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

  const activeSyndicate = loanApplication.syndicates && loanApplication.syndicates.length > 0 
    ? loanApplication.syndicates[0] 
    : null;
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
                  <p className="font-medium">{activeSyndicate.rate}%</p>
                </div>
                <div>
                  <Label>Term</Label>
                  <p className="font-medium">{activeSyndicate.term} months</p>
                </div>
                <div>
                  <Label>Syndicate Name</Label>
                  <p className="font-medium">{activeSyndicate.name}</p>
                </div>
                <div>
                  <Label>Lead Funder</Label>
                  <p className="font-medium">
                    {activeSyndicate.lead_funder.institution_name || activeSyndicate.lead_funder.name}
                  </p>
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
          <h2 className="text-lg font-semibold mb-4">Funding Commitment</h2>

          <div className="space-y-6">
            <div>
              <Label htmlFor="commitmentAmount">Amount to Commit (USD)</Label>
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
              <RadioGroup value={fundingType} onValueChange={setFundingType} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="syndicate" id="syndicate" />
                  <Label htmlFor="syndicate">
                    {activeSyndicate ? "Join Existing Syndicate" : "Create New Syndicate"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full">Fund Entire Remaining Amount</Label>
                </div>
              </RadioGroup>
            </div>

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
              <span className="text-gray-600">Commitment Amount</span>
              <span className="font-medium text-indigo-600 text-lg">
                {commitmentAmount ? formatCurrency(parseFloat(commitmentAmount)) : "$0.00"}
              </span>
            </div>
            {activeSyndicate && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Annual Yield</span>
                  <span className="font-medium">{activeSyndicate.rate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Term</span>
                  <span className="font-medium">{activeSyndicate.term} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk Level</span>
                  <span className="font-medium capitalize">{activeSyndicate.risk}</span>
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
              disabled={isSubmitting || !commitmentAmount || parseFloat(commitmentAmount) <= 0}
            >
              {isSubmitting ? "Submitting..." : "Submit Commitment"}
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
                        {bid.user.institution_name || bid.user.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {bid.user.first_name} {bid.user.last_name}
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
