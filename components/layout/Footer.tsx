import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              LoanMarket
            </h3>
            <p className="text-gray-600">
              Connecting borrowers with lenders for seamless financing
              solutions.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Borrowers
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/loans"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Browse Loans
                </Link>
              </li>
              <li>
                <Link
                  href="/applications"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  My Applications
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Lenders
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/bank/dashboard"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Lender Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/bank-register"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Register as Lender
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-indigo-600">
                  Syndication
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-indigo-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-indigo-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-indigo-600">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} LoanMarket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
