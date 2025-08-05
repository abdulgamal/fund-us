"use client";
import {
  CreditCard,
  FileText,
  Users,
  PieChart,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const stats = [
  {
    name: "Active Loans",
    value: "24",
    icon: <CreditCard className="h-6 w-6" />,
    change: "+12%",
    changeType: "positive",
  },
  {
    name: "Applications",
    value: "56",
    icon: <FileText className="h-6 w-6" />,
    change: "+5",
    changeType: "positive",
  },
  {
    name: "Syndicated Deals",
    value: "8",
    icon: <Users className="h-6 w-6" />,
    change: "+2",
    changeType: "positive",
  },
  {
    name: "Approval Rate",
    value: "68%",
    icon: <PieChart className="h-6 w-6" />,
    change: "-3%",
    changeType: "negative",
  },
];

const recentApplications = [
  {
    id: "APL-1024",
    borrower: "AgriPro Inc.",
    loanType: "Commodity",
    amount: "$250,000",
    status: "Under Review",
    date: "2023-11-15",
    daysPending: 2,
  },
  {
    id: "APL-1023",
    borrower: "Global Traders LLC",
    loanType: "Trade Finance",
    amount: "$180,000",
    status: "Pending Docs",
    date: "2023-11-14",
    daysPending: 3,
  },
  {
    id: "APL-1022",
    borrower: "Urban Farms Co.",
    loanType: "Agri-Business",
    amount: "$320,000",
    status: "Approved",
    date: "2023-11-10",
    daysPending: 0,
  },
  {
    id: "APL-1021",
    borrower: "Metro Retailers",
    loanType: "Inventory",
    amount: "$150,000",
    status: "Rejected",
    date: "2023-11-08",
    daysPending: 0,
  },
];

const portfolioData = [
  { name: "Commodity", value: 45, amount: "$1.2M" },
  { name: "Inventory", value: 25, amount: "$680K" },
  { name: "Real Estate", value: 15, amount: "$420K" },
  { name: "Trade Finance", value: 10, amount: "$275K" },
  { name: "Agri-Business", value: 5, amount: "$150K" },
];

const performanceData = [
  { month: "Jan", approved: 12, rejected: 3 },
  { month: "Feb", approved: 15, rejected: 2 },
  { month: "Mar", approved: 18, rejected: 4 },
  { month: "Apr", approved: 14, rejected: 3 },
  { month: "May", approved: 20, rejected: 5 },
  { month: "Jun", approved: 22, rejected: 4 },
  { month: "Jul", approved: 19, rejected: 3 },
  { month: "Aug", approved: 25, rejected: 2 },
  { month: "Sep", approved: 28, rejected: 4 },
  { month: "Oct", approved: 30, rejected: 5 },
  { month: "Nov", approved: 18, rejected: 2 },
];

export default function BankDashboard() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Bank Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  {stat.icon}
                </div>
              </div>
              <p
                className={`mt-3 text-sm ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stat.changeType === "positive" ? (
                  <span className="inline-flex items-center">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    {stat.change}
                  </span>
                ) : (
                  <span className="inline-flex items-center">
                    <ArrowDown className="h-4 w-4 mr-1" />
                    {stat.change}
                  </span>
                )}{" "}
                from last month
              </p>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Recent Applications</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {recentApplications.map((app, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{app.borrower}</p>
                      <p className="text-sm text-gray-500">
                        {app.loanType} Loan • {app.id}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : app.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="flex justify-between mt-3">
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium">{app.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Submitted</p>
                      <p className="text-sm">
                        {new Date(app.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pending Days</p>
                      <p className="text-sm">
                        {app.daysPending > 0 ? `${app.daysPending} days` : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Loan Portfolio */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-6">Loan Portfolio</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Portfolio Distribution */}
              <div>
                <h3 className="font-medium text-gray-700 mb-4">By Loan Type</h3>
                <div className="space-y-3">
                  {portfolioData.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500">{item.amount}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Chart */}
              <div>
                <h3 className="font-medium text-gray-700 mb-4">
                  Monthly Performance
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="approved"
                        fill="#4f46e5"
                        name="Approved"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="rejected"
                        fill="#ef4444"
                        name="Rejected"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Portfolio Summary */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-indigo-600 font-medium">
                    Total Loans
                  </p>
                  <p className="text-2xl font-bold mt-1">89</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Active</p>
                  <p className="text-2xl font-bold mt-1">72</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">
                    Syndicated
                  </p>
                  <p className="text-2xl font-bold mt-1">8</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
