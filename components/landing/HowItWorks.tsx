import {
  FileSearch,
  Handshake,
  CircleDollarSign,
  CheckCircle,
} from "lucide-react";

const steps = [
  {
    icon: <FileSearch className="w-8 h-8 text-indigo-600" />,
    title: "Pre-Approval",
    description: "Borrowers get loans pre-approved by our partner institutions",
  },
  {
    icon: <Handshake className="w-8 h-8 text-indigo-600" />,
    title: "List on Marketplace",
    description: "Pre-approved loans are listed for funding partners to review",
  },
  {
    icon: <CircleDollarSign className="w-8 w-8 text-indigo-600" />,
    title: "Funding Commitments",
    description:
      "Banks and funders commit capital, either fully or through syndication",
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-indigo-600" />,
    title: "Loan Disbursement",
    description: "Funds are disbursed when commitments reach 100%",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          How Our Marketplace Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-indigo-100 p-4 rounded-full mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
