"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { authGet } from "@/lib/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Building, Calendar } from "lucide-react";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  user_type: string;
  institution_name: string | null;
  investor_type_id: number | null;
  business_name: string | null;
  business_type_id: number | null;
  completed_registration: number;
  years_experience: number | null;
  investment_preferences: string | null;
  risk_tolerance: string | null;
  minimum_investment: number | null;
  maximum_investment: number | null;
  funder_profile: any | null;
}

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const userId = params.id as string;

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const response = await authGet(`/v1/user-profile/${userId}`);
      const data = await response.json();

      if (response.ok && data.data && data.data.user) {
        setUser(data.data.user);
      } else {
        toast.error("Failed to load user profile", {
          description: "Please try again later.",
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Error", {
        description: "Failed to load user profile.",
      });
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUserTypeBadgeColor = (userType: string) => {
    switch (userType.toLowerCase()) {
      case "borrower":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "lender":
        return "bg-green-100 text-green-800 border-green-200";
      case "superadmin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center py-20 text-red-600">
        <p className="text-lg mb-4">User profile not found</p>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-3xl font-bold text-indigo-600">
                      {user.first_name[0]}{user.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getUserTypeBadgeColor(user.user_type)}>
                        {user.user_type.toUpperCase()}
                      </Badge>
                      {user.email_verified_at && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(user.created_at)}</span>
                  </div>
                  {user.institution_name && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building className="h-4 w-4" />
                      <span>{user.institution_name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Information */}
        {user.business_name && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Business Name</label>
                <p className="font-medium">{user.business_name}</p>
              </div>
              {user.business_type_id && (
                <div>
                  <label className="text-sm text-gray-500">Business Type ID</label>
                  <p className="font-medium">{user.business_type_id}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Funder Information */}
        {(user.user_type === "lender" && (user.years_experience || user.investment_preferences || user.risk_tolerance || user.minimum_investment || user.maximum_investment)) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Funder Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.years_experience && (
                <div>
                  <label className="text-sm text-gray-500">Years of Experience</label>
                  <p className="font-medium">{user.years_experience} years</p>
                </div>
              )}
              {user.risk_tolerance && (
                <div>
                  <label className="text-sm text-gray-500">Risk Tolerance</label>
                  <p className="font-medium capitalize">{user.risk_tolerance}</p>
                </div>
              )}
              {user.minimum_investment && (
                <div>
                  <label className="text-sm text-gray-500">Minimum Investment</label>
                  <p className="font-medium">
                    ${user.minimum_investment.toLocaleString()}
                  </p>
                </div>
              )}
              {user.maximum_investment && (
                <div>
                  <label className="text-sm text-gray-500">Maximum Investment</label>
                  <p className="font-medium">
                    ${user.maximum_investment.toLocaleString()}
                  </p>
                </div>
              )}
              {user.investment_preferences && (
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-500">Investment Preferences</label>
                  <p className="font-medium">{user.investment_preferences}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
