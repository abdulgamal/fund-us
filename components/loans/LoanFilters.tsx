import { ChevronDown } from "lucide-react";

export function LoanFilters() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loan Type
          </label>
          <div className="relative">
            <select className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option>All Types</option>
              <option>Commodity</option>
              <option>Inventory</option>
              <option>Real Estate</option>
              <option>Trade Finance</option>
              <option>Agri-Business</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Min"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Max"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Term
          </label>
          <div className="relative">
            <select className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option>Any Term</option>
              <option>0-6 months</option>
              <option>6-12 months</option>
              <option>1-2 years</option>
              <option>2+ years</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex items-end">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 h-[42px]">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
