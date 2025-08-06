import { Badge } from "@/components/ui/badge";

export default function LoanDetailCard({
  title,
  items,
}: {
  title: string;
  items: Array<{
    label: string;
    value: string;
    badge?: string | null;
    downloadable?: boolean;
  }>;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="font-medium text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-gray-600">{item.label}</span>
            <div className="flex items-center">
              <span className="font-medium text-right">
                {item.value}
                {item.downloadable && (
                  <button className="ml-2 text-indigo-600 hover:text-indigo-800">
                    Download
                  </button>
                )}
              </span>
              {item.badge && (
                <Badge className="ml-2 bg-purple-100 text-purple-800">
                  {item.badge}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
