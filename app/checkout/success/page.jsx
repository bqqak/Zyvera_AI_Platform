export default function SuccessPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold">Payment successful 🎉</h1>
        <p className="text-gray-500 dark:text-gray-300 mt-3">
          Your subscription is active. You can now access all premium features.
        </p>
        <div className="mt-6">
          <a href="/workspace" className="underline">Go to workspace</a>
        </div>
      </div>
    </div>
  );
}
