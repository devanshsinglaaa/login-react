export default function SessionWarningModal({
  show,
  countdown,
  onStay,
  onLogout,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Session Expiring
        </h2>

        <p className="text-gray-600 mt-3">
          You will be logged out due to inactivity.
        </p>

        <div className="mt-6 text-4xl font-bold text-red-500">
          {countdown}s
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onStay}
            className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Stay Logged In
          </button>

          <button
            onClick={onLogout}
            className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
}