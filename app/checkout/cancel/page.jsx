export default function CancelPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold">Payment canceled</h1>
        <p className="text-gray-500 dark:text-gray-300 mt-3">
          No charges were made. You can try again anytime.
        </p>
        <div className="mt-6">
          <a href="/" className="underline">Back to home</a>
        </div>
      </div>
    </div>
  );
}
