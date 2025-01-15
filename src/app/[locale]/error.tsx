"use client";

import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-center">
      <h2 className="text-2xl">Something went wrong!</h2>
      <p>We are experiencing some issues. Please try again later!</p>
    </div>
  );
}
