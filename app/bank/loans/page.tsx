import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const loans = [
  {
    id: 1,
    name: "Commodity Purchase Loan",
    type: "Commodity",
    status: "Active",
    applications: 24,
    funded: "$1,250,000",
  },
  {
    id: 2,
    name: "Inventory Line of Credit",
    type: "Inventory",
    status: "Active",
    applications: 18,
    funded: "$850,000",
  },
  {
    id: 3,
    name: "Agri-Business Expansion",
    type: "Agriculture",
    status: "Draft",
    applications: 0,
    funded: "$0",
  },
];

export default function BankLoansPage() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Loan Products</h1>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" />
            Create New Loan
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 p-4 font-medium text-gray-500 text-sm">
            <div className="col-span-4">Loan Name</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Applications</div>
            <div className="col-span-2">Amount Funded</div>
          </div>

          {loans.map((loan) => (
            <div
              key={loan.id}
              className="grid grid-cols-12 p-4 border-b border-gray-200 hover:bg-gray-50"
            >
              <div className="col-span-4 font-medium">{loan.name}</div>
              <div className="col-span-2">
                <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                  {loan.type}
                </span>
              </div>
              <div className="col-span-2">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs ${
                    loan.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {loan.status}
                </span>
              </div>
              <div className="col-span-2">{loan.applications}</div>
              <div className="col-span-2 font-medium">{loan.funded}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
