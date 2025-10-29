import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-4 gap-8 lg:gap-12 mb-8 lg:mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/paysoko_logo_trans.png"
                alt="PaySoko Logo"
                width={180}
                height={40}
                className="brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Connecting pre-approved loans with institutional funders and syndicates. 
              Streamline your lending and borrowing experience.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Three columns in one row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 lg:col-span-3">
            {/* Borrowers Column */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                For Borrowers
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/submit-loan" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Submit a Loan
                  </Link>
                </li>
                <li>
                  <Link href="/loans" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Browse Opportunities
                  </Link>
                </li>
                <li>
                  <Link href="/borrower/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Your Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/auth/borrower-register" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* Funders Column */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                For Funders
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/funder/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/funder/commitments" className="text-gray-400 hover:text-white transition-colors text-sm">
                    My Commitments
                  </Link>
                </li>
                <li>
                  <Link href="/loans" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Investment Opportunities
                  </Link>
                </li>
                <li>
                  <Link href="/auth/funder-register" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Register as Funder
                  </Link>
                </li>
              </ul>
            </div>

            {/* Platform Column */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Platform
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/applications" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Loan Applications
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/unauthorized" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Help & Support
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} PaySoko. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
