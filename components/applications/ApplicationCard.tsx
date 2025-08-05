import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const statusColors = {
  New: "bg-blue-100 text-blue-800",
  "Under Review": "bg-yellow-100 text-yellow-800",
  "Pending Documents": "bg-orange-100 text-orange-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

export function ApplicationCard({
  application,
  isBankView,
}: {
  application: any;
  isBankView: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h3 className="text-lg font-semibold">
            {isBankView ? application.borrower : application.loanName}
          </h3>
          <p className="text-sm text-gray-600">
            {isBankView ? application.loanType : application.lender}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline" className="border-gray-300">
              Amount: {application.amount}
            </Badge>
            <Badge
              className={
                statusColors[application.status as keyof typeof statusColors]
              }
            >
              {application.status}
            </Badge>
            {application.syndicate && (
              <Badge className="bg-purple-100 text-purple-800">
                Syndicated
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <p className="text-sm text-gray-500 mb-2">
            Applied on {new Date(application.date).toLocaleDateString()}
          </p>
          <Link href={`/applications/${application.id}`}>
            <Button
              variant="outline"
              className="border-indigo-600 text-indigo-600"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>

      {isBankView && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Documents submitted: {application.documents}
          </p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-600 text-red-600"
            >
              Reject
            </Button>
            {application.syndicate && (
              <Button size="sm" variant="outline">
                Syndicate
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
