import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoanCard({ loan }: { loan: any }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden border ${
        loan.fundedPercentage === 0 ? "border-blue-200" : "border-gray-200"
      } hover:shadow-lg transition-shadow`}
    >
      {loan.fundedPercentage === 0 && (
        <div className="bg-blue-600 text-white text-xs font-medium px-3 py-1 text-center">
          NEW LISTING - NOT YET FUNDED
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">{loan.borrower}</h3>
            <p className="text-sm text-gray-600">{loan.loanType}</p>
          </div>
          <Badge variant="outline" className="border-green-600 text-green-600">
            Pre-Approved
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount:</span>
            <span className="font-medium">{loan.amount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Rate:</span>
            <span className="font-medium">{loan.interestRate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Term:</span>
            <span className="font-medium">{loan.term}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Risk:</span>
            <span className="font-medium">{loan.riskRating}</span>
          </div>
        </div>

        <div className="mt-4 mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Funding Progress</span>
            <span>
              {loan.fundedPercentage === 0
                ? "Not yet funded"
                : `${loan.fundedPercentage}% committed`}
            </span>
          </div>
          <Progress
            value={loan.fundedPercentage}
            className={`h-2 ${
              loan.fundedPercentage === 0 ? "bg-blue-100" : ""
            }`}
          />
        </div>

        <div className="flex gap-2">
          <Link href={`/loans/${loan.id}`}>
            <Button
              variant="outline"
              className="border-indigo-600 text-indigo-600 flex-1"
            >
              View Details
            </Button>
          </Link>
          {loan.syndicateOpportunity && (
            <Link
              href={
                loan.fundedPercentage === 0
                  ? `/loans/${loan.id}/commits`
                  : `/loans/${loan.id}/commit`
              }
              className="flex-1"
            >
              <Button
                className={`w-full ${
                  loan.fundedPercentage === 0
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {loan.fundedPercentage === 0
                  ? "Be First to Fund"
                  : "Join Syndicate"}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
