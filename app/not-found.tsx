import Link from "next/link";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-white">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-[#F59E0B] flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-6 h-6 text-black" />
        </div>
        <h1 className="text-4xl font-bold mb-3">404</h1>
        <p className="text-white/50 mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
