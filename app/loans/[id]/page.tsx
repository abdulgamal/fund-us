import { Requirements } from "@/components/loans/Requirements";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const loan = {
  id: 1,
  name: "Commodity Purchase Loan",
  description:
    "This loan product is designed for businesses that need to purchase agricultural commodities or raw materials in bulk. Perfect for processors, traders, and aggregators.",
  type: "Commodity",
  amount: "$50,000 - $500,000",
  interestRate: "7.5% - 9.5%",
  term: "6-18 months",
  lender: "AgriFinance Bank",
  requirements: [
    {
      name: "Business license",
      description: "Valid business registration documents",
    },
    { name: "Purchase contract", description: "Signed contract with supplier" },
    {
      name: "Financial statements",
      description: "2 years of audited financials",
    },
    { name: "Bank statements", description: "6 months recent bank statements" },
  ],
  process: [
    "Submit application with required documents",
    "Underwriting review (3-5 business days)",
    "Offer letter with terms",
    "Acceptance and disbursement",
  ],
};

export default function LoanDetailsPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                {loan.type} Loan
              </span>
              <h1 className="text-3xl font-bold">{loan.name}</h1>
              <p className="text-gray-600 mt-2">Offered by {loan.lender}</p>
            </div>
            <Link href={`/loans/${loan.id}/apply`}>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Apply Now
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Product Details</h2>
            <p className="text-gray-700">{loan.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-500">Loan Amount</h3>
                <p className="text-lg font-semibold">{loan.amount}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-500">Interest Rate</h3>
                <p className="text-lg font-semibold">{loan.interestRate}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-500">Term</h3>
                <p className="text-lg font-semibold">{loan.term}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Application Process</h2>
            <ol className="list-decimal pl-5 space-y-2">
              {loan.process.map((step, index) => (
                <li key={index} className="text-gray-700">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <Requirements requirements={loan.requirements} />
        </div>
      </div>
    </div>
  );
}
