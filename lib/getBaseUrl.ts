export function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) {
    const protocol = process.env.VERCEL_ENV === "production" ? "https" : "http";
    return `${protocol}://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
