"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CommitPage({ params }: PageProps) {
  const [isLeadInvestor, setIsLeadInvestor] = useState(false);
  const [commitmentAmount, setCommitmentAmount] = useState("");
  const { id } = await params;

  const loan = {
    id: id,
    borrower: "FreshHarvest Farms",
    loanType: "Seasonal Working Capital",
    amount: "$1,200,000",
    remainingAmount: "$1,200,000",
    interestRate: "7.25% fixed",
    term: "9 months",
    minCommitment: "$100,000",
    isNew: true, // This loan is new and unfunded
    riskRating: "BB",
  };

  const isNewLoan =
    loan.isNew &&
    parseInt(loan.remainingAmount.replace(/\D/g, "")) ===
      parseInt(loan.amount.replace(/\D/g, ""));

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCommitmentAmount(value);

    // Auto-select lead investor if committing full amount
    if (value === loan.remainingAmount.replace(/\D/g, "")) {
      setIsLeadInvestor(true);
    }
  };

  const handleLeadInvestorChange = (checked: boolean) => {
    setIsLeadInvestor(checked);
    // If becoming lead investor, suggest full amount
    if (checked && !commitmentAmount) {
      setCommitmentAmount(loan.remainingAmount.replace(/\D/g, ""));
    }
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            Commit Funds to Loan #{loan.id}
          </h1>
          <p className="text-gray-600">
            {loan.borrower} - {loan.loanType}
          </p>
          {isNewLoan && (
            <div className="mt-2 bg-blue-100 border border-blue-200 text-blue-700 px-4 py-2 rounded-md">
              🚀 New Opportunity - Be the first to fund this loan!
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Loan Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label>Borrower</Label>
              <p className="font-medium">{loan.borrower}</p>
            </div>
            <div>
              <Label>Loan Type</Label>
              <p className="font-medium">{loan.loanType}</p>
            </div>
            <div>
              <Label>Total Amount</Label>
              <p className="font-medium">{loan.amount}</p>
            </div>
            <div>
              <Label>Remaining for Funding</Label>
              <p className="font-medium">{loan.remainingAmount}</p>
            </div>
            <div>
              <Label>Interest Rate</Label>
              <p className="font-medium">{loan.interestRate}</p>
            </div>
            <div>
              <Label>Term</Label>
              <p className="font-medium">{loan.term}</p>
            </div>
            <div>
              <Label>Risk Rating</Label>
              <p className="font-medium">{loan.riskRating}</p>
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
                min={loan.minCommitment.replace(/\D/g, "")}
                max={loan.remainingAmount.replace(/\D/g, "")}
                className="mt-1"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Minimum commitment: {loan.minCommitment}
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
                        • Minimum commitment: $
                        {Math.max(
                          parseInt(loan.minCommitment.replace(/\D/g, "")),
                          Math.ceil(
                            parseInt(loan.amount.replace(/\D/g, "")) * 0.25
                          )
                        ).toLocaleString()}
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
              <RadioGroup defaultValue="syndicate" className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="syndicate" id="syndicate" />
                  <Label htmlFor="syndicate" className="cursor-pointer">
                    Join Syndicate {isLeadInvestor && "(as Lead)"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full" className="cursor-pointer">
                    Fund Entire Remaining Amount
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <textarea
                id="notes"
                rows={3}
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
              <span className="font-medium">
                $
                {commitmentAmount
                  ? parseInt(commitmentAmount).toLocaleString()
                  : "0"}
              </span>
            </div>

            {isLeadInvestor && (
              <div className="flex justify-between text-green-600">
                <span>Lead Arrangement Fee</span>
                <span className="font-medium">
                  +$
                  {commitmentAmount
                    ? Math.floor(
                        parseInt(commitmentAmount) * 0.005
                      ).toLocaleString()
                    : "0"}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Annual Yield</span>
              <span className="font-medium">{loan.interestRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Term</span>
              <span className="font-medium">{loan.term}</span>
            </div>
            {isLeadInvestor && (
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Potential Earnings</span>
                  <span className="text-green-600">
                    $
                    {commitmentAmount
                      ? Math.floor(
                          parseInt(commitmentAmount) * 1.005
                        ).toLocaleString()
                      : "0"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="border-gray-300">
              Download Term Sheet
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 flex-1">
              {isLeadInvestor ? "Submit as Lead Investor" : "Submit Commitment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
