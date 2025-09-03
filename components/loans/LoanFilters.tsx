import { ChevronDown } from "lucide-react";

export function LoanFilters() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Filter Loan Opportunities
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Loan Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Type
          </label>
          <div className="relative">
            <select className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All Types</option>
              <option value="commodity">Commodity</option>
              <option value="inventory">Inventory</option>
              <option value="real-estate">Real Estate</option>
              <option value="trade-finance">Trade Finance</option>
              <option value="agri-business">Agri-Business</option>
              <option value="equipment">Equipment Finance</option>
              <option value="working-capital">Working Capital</option>
            </select>
            {/* <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" /> */}
          </div>
        </div>

        {/* Amount Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount Range ($)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="number"
              placeholder="Max"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Term Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Term
          </label>
          <div className="relative">
            <select className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Any Term</option>
              <option value="0-6">0-6 months</option>
              <option value="6-12">6-12 months</option>
              <option value="12-24">1-2 years</option>
              <option value="24-60">2-5 years</option>
              <option value="60+">5+ years</option>
            </select>
            {/* <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" /> */}
          </div>
        </div>

        {/* Region Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region
          </label>
          <div className="relative">
            <select className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All Regions</option>
              <option value="north-america">North America</option>
              <option value="south-america">South America</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia</option>
              <option value="africa">Africa</option>
              <option value="middle-east">Middle East</option>
              <option value="oceania">Oceania</option>
            </select>
            {/* <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" /> */}
          </div>
        </div>

        {/* Sector Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Sector
          </label>
          <div className="relative">
            <select className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All Sectors</option>
              <option value="retail">Retail</option>
              <option value="hospitality">Hospitality</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="agriculture">Agriculture</option>
              <option value="construction">Construction</option>
              <option value="transportation">Transportation</option>
              <option value="energy">Energy</option>
              <option value="education">Education</option>
            </select>
            {/* <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" /> */}
          </div>
        </div>

        {/* Risk Factor Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Risk Rating
          </label>
          <div className="relative">
            <select className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All Risk Levels</option>
              <option value="AAA">AAA - Highest Quality</option>
              <option value="AA">AA - High Quality</option>
              <option value="A">A - Upper Medium Grade</option>
              <option value="BBB">BBB - Medium Grade</option>
              <option value="BB">BB - Lower Medium Grade</option>
              <option value="B">B - Non-investment Grade</option>
              <option value="CCC">CCC - High Risk</option>
              <option value="CC">CC - Very High Risk</option>
              <option value="C">C - Default Imminent</option>
            </select>
            {/* <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" /> */}
          </div>
        </div>

        {/* Interest Rate Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Interest Rate (%)
          </label>
          <input
            type="number"
            placeholder="e.g., 12.5"
            step="0.1"
            min="0"
            max="50"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Funding Progress Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Funding Progress
          </label>
          <div className="relative">
            <select className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Any Progress</option>
              <option value="0-25">0-25% funded</option>
              <option value="25-50">25-50% funded</option>
              <option value="50-75">50-75% funded</option>
              <option value="75-99">75-99% funded</option>
              <option value="100">Fully funded</option>
            </select>
            {/* <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" /> */}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end mt-6 pt-6 border-t border-gray-200">
        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          Clear Filters
        </button>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Apply Filters
        </button>
      </div>
    </div>
  );
}
