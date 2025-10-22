"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  DollarSign, 
  Clock, 
  CheckCircle,
  PlusCircle,
  TrendingUp,
  AlertCircle,
  X,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authGet, authPost } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SyndicateBid {
  id: number;
  syndicate_id: number;
  user_id: number;
  amount: number;
  rate: number;
  term: string;
  status: string;
  status_reason: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Bid {
  id: number;
  syndicate_id: number;
  user_id: number;
  amount: number;
  rate: number;
  term: string;
  status: string;
  status_reason: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface SyndicateBidsResponse {
  success: boolean;
  syndicate_bids: SyndicateBid[];
}

interface LeadFunder {
  id: number;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  institution_name: string | null;
}

interface Syndicate {
  id: number;
  name: string;
  description: string;
  status: string;
  created_by: number;
  updated_by: number;
  lead_funder: LeadFunder;
  loan_application_id: number;
  amount: number;
  rate: number;
  term: number;
  risk: string;
  funding_progress: number;
  created_at: string;
  updated_at: string;
  bids: Bid[];
  groups: any[];
}

interface LoanApplication {
  id: number;
  application_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  business_name: string;
  business_type: string;
  industry: string;
  annual_revenue: number;
  credit_score: number;
  loan_amount: number;
  loan_purpose: string;
  status: string;
  created_at: string;
  updated_at: string;
  syndicates: Syndicate[];
}

interface PaginationData {
  current_page: number;
  data: LoanApplication[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface ApiResponse {
  success: boolean;
  loan_applications: PaginationData;
}

interface DashboardStats {
  total_applications: number;
  pending_applications: number;
  approved_applications: number;
  active_loans: number;
  total_borrowed: number;
  total_bids: number;
}

export default function BorrowerDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [syndicateBids, setSyndicateBids] = useState<SyndicateBid[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_applications: 0,
    pending_applications: 0,
    approved_applications: 0,
    active_loans: 0,
    total_borrowed: 0,
    total_bids: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [acceptingBidId, setAcceptingBidId] = useState<number | null>(null);
  const [rejectingBidId, setRejectingBidId] = useState<number | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [selectedBidId, setSelectedBidId] = useState<number | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch both applications and bids in parallel
      const [appsResponse, bidsResponse] = await Promise.all([
        authGet("/v1/loan-applications"),
        authGet("/v1/syndicate-bids")
      ]);

      const appsData: ApiResponse = await appsResponse.json();
      const bidsData: SyndicateBidsResponse = await bidsResponse.json();

      if (appsResponse.ok && appsData.success) {
        const apps = appsData.loan_applications.data;
        setApplications(apps);
        
        // Set bids if available
        if (bidsResponse.ok && bidsData.success) {
          setSyndicateBids(bidsData.syndicate_bids);
          
          // Calculate stats including bids
          const calculatedStats = calculateStats(apps, bidsData.syndicate_bids);
          setStats(calculatedStats);
        } else {
          // Calculate stats without bids
          const calculatedStats = calculateStats(apps, []);
          setStats(calculatedStats);
        }
      } else {
        toast.error("Failed to load applications", {
          description: "Please try refreshing the page.",
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Error", {
        description: "Failed to load your data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (apps: LoanApplication[], bids: SyndicateBid[]): DashboardStats => {
    const total_applications = apps.length;
    const pending_applications = apps.filter(app => 
      app.status.toLowerCase() === 'pending' || 
      app.status.toLowerCase() === 'under_review'
    ).length;
    const approved_applications = apps.filter(app => 
      app.status.toLowerCase() === 'approved'
    ).length;
    const active_loans = apps.filter(app => 
      app.status.toLowerCase() === 'funded'
    ).length;
    const total_borrowed = apps
      .filter(app => app.status.toLowerCase() === 'funded')
      .reduce((sum, app) => sum + app.loan_amount, 0);
    
    // Only count pending bids
    const total_bids = bids.filter(bid => bid.status.toLowerCase() === 'pending').length;

    return {
      total_applications,
      pending_applications,
      approved_applications,
      active_loans,
      total_borrowed,
      total_bids,
    };
  };

  const handleAcceptBidClick = (bidId: number) => {
    setSelectedBidId(bidId);
    setShowDisclaimer(true);
  };

  const handleAcceptBidConfirm = async () => {
    if (!selectedBidId) return;
    
    setAcceptingBidId(selectedBidId);
    setShowDisclaimer(false);
    
    try {
      const response = await authPost(`/v1/syndicate-bids/accept/${selectedBidId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Bid Accepted!", {
          description: data.message || "The bid has been accepted successfully.",
          duration: 3000,
        });
        
        // Refresh dashboard data to show updated bid status
        await fetchDashboardData();
      } else {
        toast.error("Failed to Accept Bid", {
          description: data.message || "Unable to accept the bid. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error accepting bid:", error);
      toast.error("Error", {
        description: "An error occurred while accepting the bid.",
      });
    } finally {
      setAcceptingBidId(null);
      setSelectedBidId(null);
    }
  };

  const handleCancelAccept = () => {
    setShowDisclaimer(false);
    setSelectedBidId(null);
  };

  const handleRejectBidClick = (bidId: number) => {
    setSelectedBidId(bidId);
    setShowRejectConfirm(true);
  };

  const handleRejectBidConfirm = async () => {
    if (!selectedBidId) return;
    
    setRejectingBidId(selectedBidId);
    setShowRejectConfirm(false);
    
    try {
      const response = await authPost(`/v1/syndicate-bids/reject/${selectedBidId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Bid Rejected!", {
          description: data.message || "The bid has been rejected successfully.",
          duration: 3000,
        });
        await fetchDashboardData();
      } else {
        toast.error("Failed to Reject Bid", {
          description: data.message || "Unable to reject the bid. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error rejecting bid:", error);
      toast.error("Error", {
        description: "An error occurred while rejecting the bid.",
      });
    } finally {
      setRejectingBidId(null);
      setSelectedBidId(null);
    }
  };

  const handleCancelReject = () => {
    setShowRejectConfirm(false);
    setSelectedBidId(null);
  };

  const handleRejectBid = async (bidId: number) => {
    setRejectingBidId(bidId);
    try {
      const response = await authPost(`/v1/syndicate-bids/reject/${bidId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Bid Rejected!", {
          description: data.message || "The bid has been rejected successfully.",
          duration: 3000,
        });
        
        // Refresh dashboard data to show updated bid status
        await fetchDashboardData();
      } else {
        toast.error("Failed to Reject Bid", {
          description: data.message || "Unable to reject the bid. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error rejecting bid:", error);
      toast.error("Error", {
        description: "An error occurred while rejecting the bid.",
      });
    } finally {
      setRejectingBidId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase().replace('_', ' ');
    
    if (statusLower === "approved" || statusLower === "active" || statusLower === "accepted") {
      return "bg-green-100 text-green-800 border-green-200";
    }
    if (statusLower === "pending" || statusLower === "under review") {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
    if (statusLower === "rejected") {
      return "bg-red-100 text-red-800 border-red-200";
    }
    if (statusLower === "funded" || statusLower === "completed") {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const statsCards = [
    {
      name: "Total Applications",
      value: stats.total_applications,
      icon: <FileText className="h-6 w-6 text-indigo-600" />,
      bgColor: "bg-indigo-100",
    },
    {
      name: "Pending Review",
      value: stats.pending_applications,
      icon: <Clock className="h-6 w-6 text-yellow-600" />,
      bgColor: "bg-yellow-100",
    },
    {
      name: "Active Bids",
      value: stats.total_bids,
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
      bgColor: "bg-blue-100",
    },
    {
      name: "Total Borrowed",
      value: formatCurrency(stats.total_borrowed),
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      bgColor: "bg-green-100",
    },
  ];

  // Enrich syndicate bids with syndicate and application details, filter for pending only
  const getEnrichedBids = () => {
    const enrichedBids: Array<SyndicateBid & { syndicate?: Syndicate; application?: LoanApplication }> = [];
    
    syndicateBids.forEach(bid => {
      // Only include pending bids
      if (bid.status.toLowerCase() !== 'pending') {
        return;
      }
      
      // Find the syndicate and application this bid belongs to
      let foundSyndicate: Syndicate | undefined;
      let foundApplication: LoanApplication | undefined;
      
      applications.forEach(app => {
        const syndicate = app.syndicates.find(s => s.id === bid.syndicate_id);
        if (syndicate) {
          foundSyndicate = syndicate;
          foundApplication = app;
        }
      });
      
      enrichedBids.push({
        ...bid,
        syndicate: foundSyndicate,
        application: foundApplication,
      });
    });
    
    return enrichedBids;
  };

  const allBids = getEnrichedBids();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Borrower Dashboard</h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600">Manage your loan applications and bids</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.name}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2 break-words">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-2 sm:p-3 rounded-full flex-shrink-0 ml-2`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-4 sm:space-y-6">
          <TabsList className="bg-white border border-gray-200 w-full sm:w-auto grid grid-cols-2 sm:inline-grid">
            <TabsTrigger value="applications" className="data-[state=active]:bg-indigo-50 text-sm sm:text-base">
              <span className="hidden sm:inline">My Applications</span>
              <span className="sm:hidden">Applications</span>
              <span className="ml-1">({applications.length})</span>
            </TabsTrigger>
            <TabsTrigger value="bids" className="data-[state=active]:bg-indigo-50 text-sm sm:text-base">
              <span className="hidden sm:inline">Pending Bids</span>
              <span className="sm:hidden">Pending</span>
              <span className="ml-1">({allBids.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">My Applications</h2>
                <Link href="/submit-loan" className="w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Application
                  </Button>
                </Link>
              </div>

              {applications && applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 sm:gap-6">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {application.business_name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {application.industry} • {application.loan_purpose}
                              </p>
                            </div>
                            <Badge className={getStatusColor(application.status)}>
                              {formatStatus(application.status)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-4">
                            <div>
                              <p className="text-sm text-gray-500">Loan Amount</p>
                              <p className="text-base font-semibold text-gray-900">
                                {formatCurrency(application.loan_amount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Application ID</p>
                              <p className="text-base font-medium text-gray-900">
                                {application.application_id}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Applied On</p>
                              <p className="text-base font-medium text-gray-900">
                                {new Date(application.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Syndicates for this application */}
                          {application.syndicates && application.syndicates.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Active Syndicates ({application.syndicates.length})
                              </p>
                              <div className="space-y-2">
                                {application.syndicates.slice(0, 2).map((syndicate) => (
                                  <div
                                    key={syndicate.id}
                                    className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded"
                                  >
                                    <div className="flex-1">
                                      <span className="font-medium">{syndicate.name}</span>
                                      <span className="text-gray-600 ml-2">
                                        {syndicate.rate}% • {syndicate.term} months
                                      </span>
                                    </div>
                                    <div className="w-32">
                                      <Progress value={syndicate.funding_progress} className="h-2" />
                                      <p className="text-xs text-gray-500 mt-1">
                                        {syndicate.funding_progress}% funded
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full sm:w-auto lg:w-48 sm:min-w-0 sm:max-w-full lg:max-w-none">
                          <Link href={`/applications/${application.application_id}`} className="w-full sm:flex-1 lg:w-full">
                            <Button
                              variant="outline"
                              className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors text-sm whitespace-nowrap px-2 sm:px-3"
                            >
                              View Details
                            </Button>
                          </Link>
                          {application.syndicates && application.syndicates.length > 0 && (
                            <Link href={`/loans/${application.id}/commits`} className="w-full sm:flex-1 lg:w-full">
                              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-sm whitespace-nowrap px-2 sm:px-3">
                                View Bids
                              </Button>
                            </Link>
                          )}
                            {application.syndicates && application.syndicates.length === 0 && (
                              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 transition-colors text-sm whitespace-nowrap px-2 sm:px-3">
                                No Bids Yet
                              </Button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Applications Yet
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
                    Get started by submitting your first loan application
                  </p>
                  <Link href="/submit-loan" className="inline-block">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 transition-colors">
                      <PlusCircle className="h-5 w-5 mr-2" />
                      <span className="hidden sm:inline">Create New Application</span>
                      <span className="sm:hidden">New Application</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Bids Tab */}
          <TabsContent value="bids" className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Pending Loan Bids</h2>

              {allBids && allBids.length > 0 ? (
                <div className="space-y-4">
                  {allBids.map((bid) => {
                    // Skip bids without syndicate/application data
                    if (!bid.syndicate || !bid.application) {
                      return null;
                    }
                    
                    return (
                      <div
                        key={bid.id}
                        className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 sm:gap-6">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {bid.syndicate.name}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {bid.syndicate.description}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  For: {bid.application.business_name}
                                </p>
                              </div>
                              <Badge className={getStatusColor(bid.status)}>
                                {formatStatus(bid.status)}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
                              <div>
                                <p className="text-sm text-gray-500">Bid Amount</p>
                                <p className="text-base font-semibold text-gray-900">
                                  {formatCurrency(bid.amount)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Interest Rate</p>
                                <p className="text-base font-semibold text-gray-900">
                                  {bid.rate}%
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Term</p>
                                <p className="text-base font-semibold text-gray-900">
                                  {bid.term}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Lender</p>
                                <p className="text-base font-medium text-gray-900">
                                  {bid.syndicate.lead_funder.name}
                                </p>
                              </div>
                            </div>

                            {bid.notes && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Note: </span>
                                  {bid.notes}
                                </p>
                              </div>
                            )}

                            {/* Funding Progress */}
                            <div className="mt-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                  Funding Progress
                                </span>
                                <span className="text-sm text-gray-600">
                                  {bid.syndicate.funding_progress}%
                                </span>
                              </div>
                              <Progress value={bid.syndicate.funding_progress} className="h-2" />
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full sm:w-auto lg:w-48 sm:min-w-0 sm:max-w-full lg:max-w-none">
                            
                            {bid.status.toLowerCase() === "pending" && (
                              <>
                                <Button 
                                  onClick={() => handleAcceptBidClick(bid.id)}
                                  disabled={acceptingBidId === bid.id || rejectingBidId === bid.id}
                                  className="w-full sm:flex-1 lg:w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors text-sm px-2 py-2 flex items-center justify-center"
                                >
                                  {acceptingBidId === bid.id ? (
                                    <>
                                      <div className="h-3 w-3 sm:h-4 sm:w-4 mr-1 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
                                      <span className="whitespace-nowrap text-xs sm:text-sm">Accepting...</span>
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                                      <span className="whitespace-nowrap text-xs sm:text-sm">Accept Bid</span>
                                    </>
                                  )}
                                </Button>
                                <Button 
                                  onClick={() => handleRejectBidClick(bid.id)}
                                  disabled={acceptingBidId === bid.id || rejectingBidId === bid.id}
                                  className="w-full sm:flex-1 lg:w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors text-sm px-2 py-2 flex items-center justify-center"
                                >
                                  {rejectingBidId === bid.id ? (
                                    <>
                                      <div className="h-3 w-3 sm:h-4 sm:w-4 mr-1 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
                                      <span className="whitespace-nowrap text-xs sm:text-sm">Rejecting...</span>
                                    </>
                                  ) : (
                                    <>
                                      <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                                      <span className="whitespace-nowrap text-xs sm:text-sm">Reject Bid</span>
                                    </>
                                  )}
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Pending Bids
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
                    You have no pending bids to review. New bids from lenders will appear here.
                  </p>
                  <Link href="/loans" className="inline-block">
                    <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors">
                      <span className="hidden sm:inline">Browse Available Loans</span>
                      <span className="sm:hidden">Browse Loans</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Lead Funder Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <Info className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Lead Funder Disclaimer</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                By accepting this bid, you will make this funder the <strong>Lead Funder</strong> for this syndicate. 
                This means they will take on additional responsibilities and risks.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Lead Funder Responsibilities:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Primary point of contact for the syndicate</li>
                  <li>• Responsible for syndicate management</li>
                  <li>• May have additional liability exposure</li>
                  <li>• Expected to provide ongoing support</li>
                </ul>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                <Link 
                  href="/help/lead-funder" 
                  className="text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                >
                  Learn more about Lead Funder responsibilities →
                </Link>
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleCancelAccept}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAcceptBidConfirm}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                I Understand, Accept Bid
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Bid Confirmation Modal */}
      {showRejectConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Reject Bid</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to reject this bid? This action cannot be undone.
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-red-800 mb-2">What happens when you reject:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• The funder will be notified of the rejection</li>
                  <li>• This bid will be marked as rejected</li>
                  <li>• The funder cannot resubmit the same bid</li>
                  <li>• You may receive other bids from different funders</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleCancelReject}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectBidConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, Reject Bid
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

