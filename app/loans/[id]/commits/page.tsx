"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { authGet, authPost, useAuthStore } from "@/lib/api";
import { toast } from "sonner";

interface Syndicate {
  id: number;
  name: string;
  description: string;
  status: string;
  lead_funder: number | null;
  amount: number;
  rate: number;
  term: number;
  risk: string;
  funding_progress: number;
  loan_application_id: number;
}

export default function CommitPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const syndicateId = searchParams.get("syndicate_id");
  const user = useAuthStore((state) => state.user);

  const [syndicate, setSyndicate] = useState<Syndicate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeadInvestor, setIsLeadInvestor] = useState(false);
  const [commitmentAmount, setCommitmentAmount] = useState("");
  const [fundingType, setFundingType] = useState("syndicate");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (syndicateId) {
      fetchSyndicate();
    } else {
      toast.error("No Syndicate ID", {
        description: "Syndicate ID is required.",
      });
      router.push("/loans");
    }
  }, [syndicateId]);

  const fetchSyndicate = async () => {
    setIsLoading(true);
    try {
      const response = await authGet(`/v1/syndicate/${syndicateId}`);
      const data = await response.json();

      if (response.ok) {
        setSyndicate(data);
      } else {
        toast.error("Failed to load syndicate", {
          description: "The syndicate could not be found.",
        });
        router.push("/loans");
      }
    } catch (error) {
      console.error("Error fetching syndicate:", error);
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

  const getRemainingAmount = () => {
    if (!syndicate) return 0;
    return syndicate.amount * (1 - syndicate.funding_progress / 100);
  };

  const getRiskColor = (risk: string) => {
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

  const isNewLoan = syndicate && !syndicate.lead_funder;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCommitmentAmount(value);

    // Auto-select lead investor if committing full amount
    const remaining = getRemainingAmount();
    if (value && parseFloat(value) >= remaining) {
      setIsLeadInvestor(true);
    }
  };

  const handleLeadInvestorChange = (checked: boolean) => {
    setIsLeadInvestor(checked);
    // If becoming lead investor, suggest full amount
    if (checked && !commitmentAmount) {
      const remaining = getRemainingAmount();
      setCommitmentAmount(remaining.toString());
    }
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

    if (!syndicate) {
      toast.error("Syndicate Not Found", {
        description: "Unable to load syndicate details.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        syndicate_id: parseInt(syndicateId || "0"),
        user_id: user.id,
        amount: parseFloat(commitmentAmount),
        rate: syndicate.rate,
        term: `${syndicate.term} months`,
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

  if (!syndicate) {
    return null;
  }

  const remainingAmount = getRemainingAmount();

  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {isNewLoan ? "Be the First to Fund" : "Join Syndicate"}
            </h1>
            <Badge className={getRiskColor(syndicate.risk)}>
              {syndicate.risk.toUpperCase()} RISK
            </Badge>
          </div>
          <p className="text-gray-600 mt-2">{syndicate.name}</p>
          {isNewLoan && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              <p className="font-semibold">🚀 Lead Investor Opportunity!</p>
              <p className="text-sm mt-1">
                Be the first to fund this syndicate and become the lead investor with priority benefits.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Syndicate Overview</h2>
          <p className="text-sm text-gray-700 mb-6">{syndicate.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label>Syndicate Name</Label>
              <p className="font-medium">{syndicate.name}</p>
            </div>
            <div>
              <Label>Status</Label>
              <p className="font-medium capitalize">{syndicate.status}</p>
            </div>
            <div>
              <Label>Total Syndicate Amount</Label>
              <p className="font-medium">{formatCurrency(syndicate.amount)}</p>
            </div>
            <div>
              <Label>Remaining for Funding</Label>
              <p className="font-medium text-indigo-600">{formatCurrency(remainingAmount)}</p>
            </div>
            <div>
              <Label>Interest Rate</Label>
              <p className="font-medium">{syndicate.rate}%</p>
            </div>
            <div>
              <Label>Term</Label>
              <p className="font-medium">{syndicate.term} months</p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm mb-2">
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
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Funding Commitment</h2>

          <div className="space-y-6">
            <div>
              <Label htmlFor="commitmentAmount">Amount to Commit (USD)*</Label>
              <Input
                id="commitmentAmount"
                type="number"
                placeholder="Enter amount"
                value={commitmentAmount}
                onChange={handleAmountChange}
                min={10000}
                max={remainingAmount}
                className="mt-1"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Maximum available: {formatCurrency(remainingAmount)}
              </p>
            </div>

            {/* Lead Investor Option - Only show for new loans */}
            {isNewLoan && (
              <div className="border-t pt-6 mt-6">
                <h3 className="text-md font-semibold mb-4 text-indigo-700">
                  Lead Investor Opportunity
                </h3>
                <div className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <Checkbox
                    id="leadInvestor"
                    checked={isLeadInvestor}
                    onCheckedChange={(checked) =>
                      handleLeadInvestorChange(checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="leadInvestor"
                      className="text-base cursor-pointer"
                    >
                      Become Lead Investor
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      As the lead investor, you'll set the terms and earn a 0.5%
                      arrangement fee. You'll need to commit at least 25% of the
                      total loan amount.
                    </p>
                    {isLeadInvestor && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <h4 className="font-medium text-sm mb-2">
                          Lead Investor Benefits:
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• 0.5% arrangement fee on total loan amount</li>
                          <li>• Priority in repayment structure</li>
                          <li>
                            • Decision-making authority on loan modifications
                          </li>
                          <li>• Enhanced due diligence access</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {isLeadInvestor && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">
                      Lead Investor Requirements:
                    </h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>
                        • Minimum commitment: {formatCurrency(Math.max(10000, Math.ceil(syndicate.amount * 0.25)))}
                      </li>
                      <li>• Must complete enhanced KYC process</li>
                      <li>• Agreement to lead investor terms</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div>
              <Label>Funding Type</Label>
              <RadioGroup value={fundingType} onValueChange={setFundingType} className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="syndicate" id="syndicate" />
                  <Label htmlFor="syndicate" className="cursor-pointer">
                    {isLeadInvestor ? "Join as Lead Investor" : "Join Syndicate"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full" className="cursor-pointer">
                    Fund Entire Remaining Amount ({formatCurrency(remainingAmount)})
                  </Label>
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Commitment Summary</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Commitment Amount</span>
              <span className="font-medium text-indigo-600 text-lg">
                {commitmentAmount ? formatCurrency(parseFloat(commitmentAmount)) : "$0"}
              </span>
            </div>

            {isLeadInvestor && (
              <div className="flex justify-between text-green-600">
                <span>Lead Arrangement Fee (0.5%)</span>
                <span className="font-medium">
                  +{commitmentAmount ? formatCurrency(parseFloat(commitmentAmount) * 0.005) : "$0"}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Annual Yield</span>
              <span className="font-medium">{syndicate.rate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Term</span>
              <span className="font-medium">{syndicate.term} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Risk Level</span>
              <span className="font-medium capitalize">{syndicate.risk}</span>
            </div>
            {isLeadInvestor && (
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total with Lead Fee</span>
                  <span className="text-green-600">
                    {commitmentAmount
                      ? formatCurrency(parseFloat(commitmentAmount) * 1.005)
                      : "$0"}
                  </span>
                </div>
              </div>
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
              {isSubmitting
                ? "Submitting..."
                : isLeadInvestor
                ? "Submit as Lead Investor"
                : "Submit Commitment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
