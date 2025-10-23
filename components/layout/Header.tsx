"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { useAuthStore, logout } from "@/lib/api";
import { useRouter } from "next/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    
    switch (user.user_type) {
      case "borrower":
        return "/borrower/dashboard";
      case "lender":
        return "/funder/dashboard";
      case "admin":
      case "superadmin":
        return "/bank/dashboard";
      default:
        return "/";
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              <Image
                src="/paysoko_logo_trans.png"
                alt="Logo"
                width={200}
                height={40}
                className="mr-2"
              />
            </Link>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              {/* Show different links based on user type */}
              {isAuthenticated && user?.user_type === "lender" && (
                <Link
                  href="/loans"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Loan Marketplace
                </Link>
              )}
              
              {isAuthenticated && user?.user_type === "borrower" && (
                <Link
                  href="/loans"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  My Loans
                </Link>
              )}

              {isAuthenticated && (
                <Link
                  href={getDashboardLink()}
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Dashboard
                </Link>
              )}

              {!isAuthenticated && (
                <>
                  <Link
                    href="/loans"
                    className="text-gray-700 hover:text-indigo-600"
                  >
                    Loan Marketplace
                  </Link>
                </>
              )}
              
              <Link
                href="https://real-estate-wine-nine.vercel.app/"
                target="_blank"
                className="text-gray-700 hover:text-indigo-600"
              >
                Real Estate Marketplace
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-4 items-center">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700 font-medium">
                    Welcome, {user?.name || user?.first_name}
                  </span>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="border-indigo-600 text-indigo-600"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* Show different links based on user type */}
          {isAuthenticated && user?.user_type === "lender" && (
            <Link
              href="/loans"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
            >
              Loan Marketplace
            </Link>
          )}
          
          {isAuthenticated && user?.user_type === "borrower" && (
            <Link
              href="/loans"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
            >
              My Loans
            </Link>
          )}

          {isAuthenticated && (
            <Link
              href={getDashboardLink()}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
            >
              Dashboard
            </Link>
          )}

          {!isAuthenticated && (
            <>
              <Link
                href="/loans"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              >
                Loan Marketplace
              </Link>
              
            </>
          )}
          
          <Link
            href="https://real-estate-wine-nine.vercel.app/"
            target="_blank"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
          >
            Real Estate Marketplace
          </Link>
          
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 text-base font-medium text-gray-700">
                Welcome, {user?.name || user?.first_name}
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:text-indigo-800 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                href="/auth/funder-register"
                className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:text-indigo-800 hover:bg-gray-50"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
