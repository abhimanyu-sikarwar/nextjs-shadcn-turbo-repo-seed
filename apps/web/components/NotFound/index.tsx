import Link from "next/link";

export function NotFound() {
  return (
    <div className="relative z-10 flex h-screen w-screen flex-col items-center justify-center gap-6">
      <h1 className="font-display bg-gradient-to-r from-black to-gray-600 bg-clip-text text-5xl font-semibold text-transparent">
        404
      </h1>
      <Link
        href="/"
        className="flex h-9 w-fit items-center justify-center rounded-md border border-black bg-black px-4 text-sm text-white hover:bg-gray-800 hover:ring-4 hover:ring-gray-200"
      >
        Go back home
      </Link>
    </div>
  );
}
