import Link from "next/link";

export function CTA() {
  return (
    <section className="py-16 px-4 bg-indigo-600 text-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <div className="bg-white p-6 rounded-lg text-gray-900 flex-1 max-w-md">
            <h3 className="text-xl font-semibold mb-4">Borrowers</h3>
            <p className="mb-4">
              Find the perfect financing solution for your business needs.
            </p>
            <Link href="/loans">
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
                Apply Now
              </button>
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg text-gray-900 flex-1 max-w-md">
            <h3 className="text-xl font-semibold mb-4">Lenders</h3>
            <p className="mb-4">
              Join our platform and connect with qualified borrowers.
            </p>
            <Link href="/auth/bank-register">
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
                Register as Lender
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
