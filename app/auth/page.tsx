import { Suspense } from "react";
import { AuthPageContent } from "@/features/auth";

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageContent />
    </Suspense>
  );
}
