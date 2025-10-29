'use client';

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost, login } from "@/lib/api";
import type { LoginResponse, User } from "@/lib/types/api";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirectMessage, setRedirectMessage] = useState("");

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setRedirectMessage(message);
      toast.info("Authentication Required", {
        description: message,
        duration: 5000,
      });
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await apiPost("/login", { 
        email, 
        password,
        remember: rememberMe
      });

      if (response.ok) {
        const result: LoginResponse = await response.json();
        
        // Check if login was successful
        if (result.status === "success" && result.data) {
          // Store token and user data in Zustand store
          login(result.data.access_token, result.data.user);
          
          toast.success("Login Successful!", {
            description: `Welcome back, ${result.data.user.name}!`,
            duration: 3000,
          });
          
          // Redirect based on redirect parameter or user type
          const redirectPath = searchParams.get('redirect');
          if (redirectPath) {
            router.push(redirectPath);
          } else if (result.data.user.user_type === "borrower") {
            router.push('/borrower/dashboard');
          } else if (result.data.user.user_type === "lender") {
            // Check if lender has completed registration
            if (result.data.user.completed_registration === 0) {
              router.push('/funder/onboarding');
            } else {
              router.push('/funder/dashboard');
            }
          } else if (result.data.user.user_type === "admin") {
            router.push('/bank/dashboard');
          } else if (result.data.user.user_type === "superadmin") {
            router.push('/bank/dashboard');
          } else {
            router.push('/');
          }
        
          
          
        } else {
          setError(result.message || "Login failed");
          toast.error("Login Failed", {
            description: result.message || "Login failed",
          });
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Invalid email or password");
        toast.error("Login Failed", {
          description: errorData.message || "Invalid email or password",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
      toast.error("Error", {
        description: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <a
              href="/auth/funder-register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </a>
          </p>
        </div>

        {redirectMessage && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            {redirectMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
