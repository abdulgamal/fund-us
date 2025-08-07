import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              LoanConnect
            </Link>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              <Link
                href="/loans"
                className="text-gray-700 hover:text-indigo-600"
              >
                Loan Marketplace
              </Link>
              <Link
                href="/funder/dashboard"
                className="text-gray-700 hover:text-indigo-600"
              >
                Funder Portal
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="border-indigo-600 text-indigo-600"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/funder-register">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
