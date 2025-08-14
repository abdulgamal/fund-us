import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
      <div className="max-w-6xl mx-auto text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Connect Pre-Approved Loans with Funding Partners
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          A marketplace where qualified borrowers meet institutional funders.
          Secure full funding or syndicate deals with multiple partners.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/submit-loan">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              Apply For Loan
            </Button>
          </Link>
          <Link href="/loans">
            <Button
              size="lg"
              variant="outline"
              className="border-indigo-600 text-indigo-600"
            >
              Fund a Loan
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
