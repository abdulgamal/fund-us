import { CheckCircle } from "lucide-react";

export function Requirements({ requirements }: { requirements: any }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Requirements</h2>
      <ul className="space-y-3">
        {requirements.map((req: any, index: number) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">{req.name}</p>
              {req.description && (
                <p className="text-sm text-gray-600">{req.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
