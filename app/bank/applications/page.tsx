import { ApplicationCard } from "@/components/applications/ApplicationCard";

const applications = [
  {
    id: 1,
    borrower: "AgriPro Inc.",
    loanType: "Commodity Loan",
    amount: "$250,000",
    status: "Under Review",
    date: "2023-11-15",
    documents: 4,
    syndicate: false,
  },
  {
    id: 2,
    borrower: "Global Traders LLC",
    loanType: "Trade Finance",
    amount: "$180,000",
    status: "Pending Documents",
    date: "2023-11-10",
    documents: 2,
    syndicate: true,
  },
  // More applications...
];

export default function BankApplications() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Loan Applications</h1>
          <div className="flex gap-3">
            <select className="border rounded-md px-3 py-2 text-sm">
              <option>All Status</option>
              <option>New</option>
              <option>Under Review</option>
              <option>Pending Documents</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
            <input
              type="text"
              placeholder="Search applications..."
              className="border rounded-md px-3 py-2 text-sm w-64"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 p-4 font-medium text-gray-500 text-sm">
            <div className="col-span-3">Borrower</div>
            <div className="col-span-2">Loan Type</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1">Actions</div>
          </div>

          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              isBankView={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
