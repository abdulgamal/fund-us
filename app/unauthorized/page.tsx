'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/api";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    // Redirect based on user type
    if (user?.user_type === 'borrower') {
      router.push('/borrower/dashboard');
    } else if (user?.user_type === 'lender') {
      router.push('/funder/dashboard');
    } else if (user?.user_type === 'admin' || user?.user_type === 'superadmin') {
      router.push('/bank/dashboard');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-lg shadow-md">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <svg
              className="h-16 w-16 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don&apos;t have permission to access this page.
          </p>
          {user && (
            <p className="text-sm text-gray-500">
              Your account type: <span className="font-semibold capitalize">{user.user_type}</span>
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            Go Back
          </Button>
          <Button
            onClick={handleGoHome}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

