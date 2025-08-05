import { Hero } from "@/components/landing/Hero";
import { LoanCategories } from "@/components/landing/LoanCategories";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CTA } from "@/components/landing/CTA";

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <LoanCategories />
      <HowItWorks />
      <CTA />
    </div>
  );
}
