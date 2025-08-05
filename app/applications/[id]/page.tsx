import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const application = {
  id: 1,
  loanName: "Commodity Purchase Loan",
  lender: "AgriFinance Bank",
  amount: "$250,000",
  status: "Under Review",
  date: "2023-11-15",
  progress: 60,
  documents: [
    { name: "Business License", status: "approved", uploaded: "2023-11-15" },
    { name: "Purchase Contract", status: "approved", uploaded: "2023-11-15" },
    { name: "Financial Statements", status: "pending", uploaded: "2023-11-15" },
    {
      name: "Bank Statements",
      status: "rejected",
      uploaded: "2023-11-15",
      comment: "Need last 6 months",
    },
  ],
  timeline: [
    { event: "Application Submitted", date: "2023-11-15", status: "completed" },
    { event: "Initial Review", date: "2023-11-18", status: "completed" },
    { event: "Document Verification", date: "", status: "current" },
    { event: "Underwriting", date: "", status: "pending" },
    { event: "Approval", date: "", status: "pending" },
  ],
  comments: [
    {
      author: "Loan Officer",
      date: "2023-11-18",
      text: "Please upload the complete bank statements for the last 6 months.",
    },
    {
      author: "You",
      date: "2023-11-17",
      text: "I've uploaded all requested documents. Please let me know if you need anything else.",
    },
  ],
};

const statusIcons = {
  approved: <CheckCircle className="h-5 w-5 text-green-500" />,
  pending: <Clock className="h-5 w-5 text-yellow-500" />,
  rejected: <XCircle className="h-5 w-5 text-red-500" />,
  completed: <CheckCircle className="h-5 w-5 text-green-500" />,
  current: <AlertCircle className="h-5 w-5 text-blue-500" />,
};

export default function ApplicationDetailsPage() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              Application #{application.id}
            </h1>
            <p className="text-gray-600">
              Submitted on {new Date(application.date).toLocaleDateString()}
            </p>
          </div>
          <Badge className="bg-blue-100 text-blue-800 text-sm font-medium">
            {application.status}
          </Badge>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Application Progress</h2>
          <div className="mb-4">
            <Progress value={application.progress} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              {application.progress}% complete
            </p>
          </div>

          <div className="grid grid-cols-5 gap-4 mt-6">
            {application.timeline.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`rounded-full p-2 mb-2 ${
                    item.status === "completed"
                      ? "bg-green-100"
                      : item.status === "current"
                      ? "bg-blue-100"
                      : "bg-gray-100"
                  }`}
                >
                  {statusIcons[item.status as keyof typeof statusIcons]}
                </div>
                <p className="text-xs font-medium text-center">{item.event}</p>
                {item.date && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Loan Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Product</span>
                <span className="font-medium">{application.loanName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lender</span>
                <span className="font-medium">{application.lender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Requested Amount</span>
                <span className="font-medium">{application.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Application Date</span>
                <span className="font-medium">
                  {new Date(application.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {application.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Documents</h2>
            <div className="space-y-3">
              {application.documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded on{" "}
                        {new Date(doc.uploaded).toLocaleDateString()}
                      </p>
                      {doc.comment && (
                        <p className="text-xs text-red-500 mt-1">
                          {doc.comment}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {statusIcons[doc.status as keyof typeof statusIcons]}
                    <span className="ml-2 text-sm capitalize">
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-4 border-indigo-600 text-indigo-600"
              >
                Upload Additional Documents
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-lg font-semibold mb-4">Communication</h2>
          <div className="space-y-4">
            {application.comments.map((comment, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  comment.author === "You" ? "bg-indigo-50" : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">{comment.author}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))}
            <div className="mt-6">
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                placeholder="Add a comment or question..."
              />
              <div className="flex justify-end mt-2">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
