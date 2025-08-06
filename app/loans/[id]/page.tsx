import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import LoanDetailCard from "@/components/loans/LoanDetailsCard";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LoanDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const loan = {
    id,
    borrower: "AgriPro Inc.",
    loanType: "Commodity Purchase",
    amount: "$2,500,000",
    interestRate: "Prime + 2.5%",
    term: "18 months",
    status: "Seeking Funding",
    fundedPercentage: 35,
    collateral: "Warehouse receipts",
    preApprovedBy: "First Commercial Bank",
    syndicateOpportunity: true,
    riskRating: "BB+",
    fundingTerms: {
      minimumCommitment: "$100,000",
      fundingDeadline: "December 15, 2023",
      disbursementDate: "December 30, 2023",
    },
    syndicateMembers: [
      { name: "First National Bank", committed: "$750,000", lead: true },
      { name: "Regional Credit Union", committed: "$500,000", lead: false },
    ],
    documents: [
      { name: "Credit Approval Memo", type: "pdf" },
      { name: "Collateral Valuation", type: "pdf" },
      { name: "Term Sheet", type: "doc" },
    ],
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold">{loan.borrower}</h1>
            <p className="text-gray-600">
              {loan.loanType} • Pre-approved by {loan.preApprovedBy}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-indigo-600 text-indigo-600"
            >
              Download Documents
            </Button>
            <Link href={`/loans/${loan.id}/commit`}>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Commit Funds
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <LoanDetailCard
              title="Loan Terms"
              items={[
                { label: "Amount", value: loan.amount },
                { label: "Interest Rate", value: loan.interestRate },
                { label: "Term", value: loan.term },
                { label: "Collateral", value: loan.collateral },
                { label: "Risk Rating", value: loan.riskRating },
              ]}
            />

            <LoanDetailCard
              title="Funding Terms"
              items={[
                {
                  label: "Minimum Commitment",
                  value: loan.fundingTerms.minimumCommitment,
                },
                {
                  label: "Funding Deadline",
                  value: loan.fundingTerms.fundingDeadline,
                },
                {
                  label: "Disbursement Date",
                  value: loan.fundingTerms.disbursementDate,
                },
              ]}
            />
          </div>

          <div className="space-y-6">
            <LoanDetailCard
              title="Syndicate Members"
              items={loan.syndicateMembers.map((member) => ({
                label: member.name,
                value: member.committed,
                badge: member.lead ? "Lead Arranger" : null,
              }))}
            />

            <LoanDetailCard
              title="Documents"
              items={loan.documents.map((doc) => ({
                label: doc.name,
                value: doc.type.toUpperCase(),
                downloadable: true,
              }))}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Funding Progress</h2>
          <div className="mb-4">
            <Progress value={loan.fundedPercentage} className="h-3" />
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-600">
                ${((2500000 * loan.fundedPercentage) / 100).toLocaleString()}{" "}
                committed
              </span>
              <span className="text-sm text-gray-600">
                $
                {(
                  (2500000 * (100 - loan.fundedPercentage)) /
                  100
                ).toLocaleString()}{" "}
                remaining
              </span>
            </div>
          </div>
          <Link href={`/loans/${loan.id}/commit`}>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
              Commit Funds to This Loan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
