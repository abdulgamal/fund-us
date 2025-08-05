import { LoanCard } from "@/components/loans/LoanCard";
import { LoanFilters } from "@/components/loans/LoanFilters";

const loans = [
  {
    id: 1,
    name: "Commodity Purchase Loan",
    type: "Commodity",
    amount: "$50,000 - $500,000",
    interestRate: "7.5% - 9.5%",
    term: "6-18 months",
    lender: "AgriFinance Bank",
    requirements: [
      "Business license",
      "Purchase contract",
      "2 years financials",
    ],
  },
  {
    id: 2,
    name: "Inventory Line of Credit",
    type: "Inventory",
    amount: "$25,000 - $250,000",
    interestRate: "8.0% - 10.5%",
    term: "12-24 months",
    lender: "Merchant Capital",
    requirements: [
      "Inventory list",
      "6 months bank statements",
      "Credit score 650+",
    ],
  },
  // More loan products...
];

export default function LoansPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Available Loan Products</h1>

        <LoanFilters />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {loans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      </div>
    </div>
  );
}
