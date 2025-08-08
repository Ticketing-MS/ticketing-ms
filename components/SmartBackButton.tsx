"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type Props = {
  fallbackUrl: string;
  className?: string;
};

export function SmartBackButton({ fallbackUrl, className }: Props) {
  const router = useRouter();
  const hasHistory = useRef(false);

  useEffect(() => {
    hasHistory.current = window.history.length > 1;
  }, []);

  return (
    <button
      type="submit"
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      onClick={() => {
        if (hasHistory.current) {
          router.back();
        } else {
          router.push(fallbackUrl);
        }
      }}
    >
      Cancel
    </button>
  );
}
