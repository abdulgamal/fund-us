import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CommitPage({ params }: { params: { id: string } }) {
  const loan = {
    id: params.id,
    borrower: "FreshHarvest Farms",
    loanType: "Seasonal Working Capital",
    amount: "$1,200,000",
    remainingAmount: "$1,200,000", // Full amount available for new loan
    interestRate: "7.25% fixed",
    term: "9 months",
    minCommitment: "$100,000",
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
                min={loan.minCommitment.replace(/\D/g, "")}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-2">
                Minimum commitment: {loan.minCommitment}
              </p>
            </div>

            <div>
              <Label>Funding Type</Label>
              <RadioGroup defaultValue="syndicate" className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="syndicate" id="syndicate" />
                  <Label htmlFor="syndicate">Join Syndicate</Label>
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
                className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Add any special instructions or conditions"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Review & Submit</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Commitment Amount</span>
              <span className="font-medium">$0.00</span>{" "}
              {/* Would be dynamic in real app */}
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Annual Yield</span>
              <span className="font-medium">7.25%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Term</span>
              <span className="font-medium">9 months</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="border-gray-300">
              Download Term Sheet
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 flex-1">
              Submit Commitment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
