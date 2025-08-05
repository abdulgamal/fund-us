import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Modern Financing for Your Business Needs
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Connect with lenders offering competitive loan products tailored to
          your specific requirements. Fast, transparent, and hassle-free.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/loans">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              Browse Loans
            </Button>
          </Link>
          <Link href="/bank/dashboard">
            <Button
              size="lg"
              variant="outline"
              className="border-indigo-600 text-indigo-600"
            >
              Lender Portal
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
