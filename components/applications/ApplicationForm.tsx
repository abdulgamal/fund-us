import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ApplicationForm({ requirements }: { requirements: any }) {
  return (
    <form>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" type="text" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Input id="businessType" type="text" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input id="registrationNumber" type="text" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="taxId">Tax ID</Label>
              <Input id="taxId" type="text" className="mt-1" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Loan Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requirements.map((req: any, index: number) => (
              <div key={index}>
                {req.type === "file" ? (
                  <>
                    <Label htmlFor={req.name}>{req.label}</Label>
                    <Input id={req.name} type="file" className="mt-1" />
                  </>
                ) : req.type === "textarea" ? (
                  <>
                    <Label htmlFor={req.name}>{req.label}</Label>
                    <Textarea id={req.name} className="mt-1" rows={3} />
                  </>
                ) : (
                  <>
                    <Label htmlFor={req.name}>{req.label}</Label>
                    <Input id={req.name} type={req.type} className="mt-1" />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
            Submit Application
          </Button>
        </div>
      </div>
    </form>
  );
}
