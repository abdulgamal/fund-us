import { ApplicationCard } from "@/components/applications/ApplicationCard";

const applications = [
  {
    id: 1,
    loanName: "Commodity Purchase Loan",
    lender: "AgriFinance Bank",
    amount: "$250,000",
    status: "Under Review",
    date: "2023-11-15",
    documents: 4,
  },
  {
    id: 2,
    loanName: "Inventory Line of Credit",
    lender: "Merchant Capital",
    amount: "$180,000",
    status: "Approved",
    date: "2023-10-28",
    documents: 5,
  },
];

export default function ApplicationsPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Applications</h1>

        <div className="space-y-4">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              isBankView={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
