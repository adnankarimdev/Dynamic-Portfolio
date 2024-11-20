"use client";

import AuthPage from "@/components/ui/login/AuthPage";
import AnimatedLayout from "@/components/animations/AnimatedLayout";

export default function Dashboard() {
  return (
    <AnimatedLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-screen">
          <AuthPage />
        </div>
      </div>
    </AnimatedLayout>
  );
}
