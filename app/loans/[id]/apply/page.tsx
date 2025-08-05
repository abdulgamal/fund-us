import { ApplicationForm } from "@/components/applications/ApplicationForm";

const loan = {
  id: 1,
  name: "Commodity Purchase Loan",
  requirements: [
    { name: "business_license", label: "Business License", type: "file" },
    { name: "purchase_contract", label: "Purchase Contract", type: "file" },
    {
      name: "financial_statements",
      label: "Financial Statements (2 years)",
      type: "file",
    },
    {
      name: "bank_statements",
      label: "Bank Statements (6 months)",
      type: "file",
    },
    { name: "loan_amount", label: "Requested Loan Amount", type: "number" },
    { name: "loan_purpose", label: "Loan Purpose", type: "textarea" },
  ],
};

export default function ApplyPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Apply for {loan.name}</h1>
          <p className="text-gray-600 mt-2">
            Please complete the form below and upload all required documents.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <ApplicationForm requirements={loan.requirements} />
        </div>
      </div>
    </div>
  );
}
