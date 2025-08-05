import {
  Truck,
  Warehouse,
  Building2,
  ShoppingCart,
  Sprout,
} from "lucide-react";

const categories = [
  {
    name: "Commodity Loans",
    icon: <Truck className="w-8 h-8 text-indigo-600" />,
    description: "Finance for agricultural and raw material purchases",
  },
  {
    name: "Inventory Loans",
    icon: <Warehouse className="w-8 h-8 text-indigo-600" />,
    description: "Working capital for your stock and inventory needs",
  },
  {
    name: "Commercial Real Estate",
    icon: <Building2 className="w-8 h-8 text-indigo-600" />,
    description: "Property acquisition and development financing",
  },
  {
    name: "Trade Finance",
    icon: <ShoppingCart className="w-8 h-8 text-indigo-600" />,
    description: "Solutions for import/export businesses",
  },
  {
    name: "Agri-Business",
    icon: <Sprout className="w-8 h-8 text-indigo-600" />,
    description: "Specialized financing for farming operations",
  },
];

export function LoanCategories() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Loan Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="p-6 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex justify-center mb-4">{category.icon}</div>
              <h3 className="text-lg font-semibold text-center mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 text-center">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
