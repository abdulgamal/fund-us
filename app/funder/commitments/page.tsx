import CommitmentCard from "@/components/funder/CommitmentCard";

const commitments = [
  {
    id: "COM-2023-458",
    loanId: "LN-2023-1254",
    borrower: "AgriPro Inc.",
    amountCommitted: "$500,000",
    totalLoanAmount: "$2,500,000",
    interestRate: "Prime + 2.5%",
    status: "Active",
    fundingDate: "2023-11-10",
    maturityDate: "2025-05-10",
    isSyndicated: true,
    leadArranger: "First National Bank",
  },
];

export default function CommitmentsPage() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Your Funding Commitments</h1>

        <div className="space-y-4">
          {commitments.map((commitment) => (
            <CommitmentCard key={commitment.id} commitment={commitment} />
          ))}
        </div>
      </div>
    </div>
  );
}
