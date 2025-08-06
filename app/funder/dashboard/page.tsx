import {
  CreditCard,
  DollarSign,
  Users,
  TrendingUp,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CommitmentCard from "@/components/funder/CommitmentCard";

const stats = [
  {
    name: "Active Commitments",
    value: "$4.2M",
    icon: <DollarSign className="h-6 w-6" />,
    change: "+$1.1M",
    changeType: "positive",
  },
  {
    name: "Syndicated Deals",
    value: "6",
    icon: <Users className="h-6 w-6" />,
    change: "+2",
    changeType: "positive",
  },
  {
    name: "Avg. Yield",
    value: "9.2%",
    icon: <TrendingUp className="h-6 w-6" />,
    change: "+0.3%",
    changeType: "positive",
  },
  {
    name: "Upcoming Payments",
    value: "12",
    icon: <FileText className="h-6 w-6" />,
    change: "+3",
    changeType: "positive",
  },
];

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
    nextPayment: "$12,450",
    nextPaymentDate: "2023-12-15",
  },
  {
    id: "COM-2023-459",
    loanId: "LN-2023-1257",
    borrower: "FreshHarvest Farms",
    amountCommitted: "$750,000",
    totalLoanAmount: "$1,200,000",
    interestRate: "7.25% fixed",
    status: "Active",
    fundingDate: "2023-11-18",
    maturityDate: "2024-08-18",
    isSyndicated: false,
    nextPayment: "$8,125",
    nextPaymentDate: "2023-12-18",
  },
];

export default function FunderDashboard() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Funding Partner Dashboard</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  {stat.icon}
                </div>
              </div>
              <p
                className={`mt-3 text-sm ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stat.change} from last month
              </p>
            </div>
          ))}
        </div>

        {/* Recommended Opportunities */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">
              Recommended Loan Opportunities
            </h2>
            <Button
              variant="ghost"
              className="text-indigo-600 hover:text-indigo-800"
            >
              View All Opportunities
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample loan card - would fetch from API */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium mb-2">Metro Manufacturing</h3>
              <p className="text-sm text-gray-600 mb-4">
                Equipment Finance • $3.2M
              </p>
              <div className="flex justify-between text-sm mb-2">
                <span>Rate:</span>
                <span className="font-medium">7.9% fixed</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span>Term:</span>
                <span className="font-medium">36 months</span>
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                View Details
              </Button>
            </div>
          </div>
        </div>

        {/* Your Commitments Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Your Current Commitments</h2>
            <Button
              variant="ghost"
              className="text-indigo-600 hover:text-indigo-800"
            >
              View All Commitments
            </Button>
          </div>

          <div className="space-y-4">
            {commitments.map((commitment) => (
              <CommitmentCard key={commitment.id} commitment={commitment} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
