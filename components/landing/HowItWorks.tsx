import { Search, FileText, Handshake, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: <Search className="w-8 h-8 text-indigo-600" />,
    title: "Browse Loans",
    description:
      "Explore our marketplace of loan products from various lenders",
  },
  {
    icon: <FileText className="w-8 h-8 text-indigo-600" />,
    title: "Check Requirements",
    description: "Review eligibility criteria and required documentation",
  },
  {
    icon: <Handshake className="w-8 h-8 text-indigo-600" />,
    title: "Submit Application",
    description: "Complete the online form and upload necessary documents",
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-indigo-600" />,
    title: "Get Funded",
    description: "Receive offers and get funded by one or multiple lenders",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
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
