"use client";

import { Suspense } from "react";
import { AuthPageContent } from "@/components/auth/auth-form";

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageContent />
    </Suspense>
  );
}
