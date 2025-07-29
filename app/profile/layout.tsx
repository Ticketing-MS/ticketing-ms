// app/profile/layout.tsx
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
        {children}
      </div>
    </main>
  );
}
