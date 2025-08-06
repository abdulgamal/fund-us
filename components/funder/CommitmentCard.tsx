import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CommitmentCard({ commitment }: { commitment: any }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{commitment.borrower}</h3>
          <p className="text-sm text-gray-600">
            Commitment ID: {commitment.id}
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          {commitment.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">Amount Committed</p>
          <p className="font-medium">{commitment.amountCommitted}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Loan</p>
          <p className="font-medium">{commitment.totalLoanAmount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Interest Rate</p>
          <p className="font-medium">{commitment.interestRate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Maturity Date</p>
          <p className="font-medium">{commitment.maturityDate}</p>
        </div>
      </div>

      {commitment.isSyndicated && (
        <div className="mb-4">
          <p className="text-sm text-gray-500">Syndicate Lead</p>
          <p className="font-medium">{commitment.leadArranger}</p>
        </div>
      )}

      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500">Next Payment</p>
            <p className="font-medium">{commitment.nextPayment}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Due Date</p>
            <p className="font-medium">{commitment.nextPaymentDate}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          Payment History
        </Button>
        <Button variant="outline" className="flex-1">
          Loan Documents
        </Button>
      </div>
    </div>
  );
}
