"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function OAuthCallback() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const accessToken = params.get("access_token");
    if (accessToken) {
      localStorage.setItem("gmail_access_token", accessToken);
      router.push("/"); // redirect to homepage or email page
    }
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">
      Authenticating with Google...
    </div>
  );
}
