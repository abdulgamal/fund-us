import LoanCard from "@/components/loans/LoanCard";
import { LoanFilters } from "@/components/loans/LoanFilters";

const loans = [
  {
    id: "LN-2023-1254",
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
  },
  {
    id: "LN-2023-1253",
    borrower: "Global Traders LLC",
    loanType: "Import Finance",
    amount: "$1,800,000",
    interestRate: "8.75% fixed",
    term: "12 months",
    status: "Seeking Funding",
    fundedPercentage: 15,
    collateral: "LC with AAA bank",
    preApprovedBy: "Trade Finance Solutions",
    syndicateOpportunity: true,
    riskRating: "BBB-",
  },
  {
    id: "LN-2023-1257",
    borrower: "FreshHarvest Farms",
    loanType: "Seasonal Working Capital",
    amount: "$1,200,000",
    interestRate: "7.25% fixed",
    term: "9 months",
    status: "New Listing",
    fundedPercentage: 0, // 0% funded
    collateral: "Crop liens and equipment",
    preApprovedBy: "AgriLending Partners",
    syndicateOpportunity: true,
    riskRating: "BB",
    isNew: true, // Added flag for new/unfunded loans
  },
];

export default function LoansPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Available Loan Opportunities
        </h1>
        <p className="text-gray-600 mb-8">
          Pre-approved loans seeking funding partners
        </p>

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
