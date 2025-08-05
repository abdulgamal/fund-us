import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LoanCard({ loan }: { loan: any }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium mb-2">
              {loan.type}
            </span>
            <h3 className="text-lg font-semibold mb-1">{loan.name}</h3>
            <p className="text-sm text-gray-600 mb-3">By {loan.lender}</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount:</span>
            <span className="font-medium">{loan.amount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Interest Rate:</span>
            <span className="font-medium">{loan.interestRate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Term:</span>
            <span className="font-medium">{loan.term}</span>
          </div>
        </div>

        <div className="mt-6">
          <Link href={`/loans/${loan.id}`}>
            <Button
              variant="outline"
              className="w-full border-indigo-600 text-indigo-600"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
