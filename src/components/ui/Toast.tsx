export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-md bg-gray-900 px-4 py-2.5 text-sm text-white shadow-lg lg:bottom-6">
      {message}
    </div>
  );
}
