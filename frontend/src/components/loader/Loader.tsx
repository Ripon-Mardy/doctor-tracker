import { Loader2, Stethoscope } from "lucide-react";

const Loader = () => {
  return (
    <main
      role="status"
      aria-live="polite"
      className="min-h-screen flex flex-col items-center justify-center gap-5"
    >
      {/* Logo with pulsing ring */}
      <div className="relative flex items-center justify-center">
        <span className="absolute h-16 w-16 rounded-2xl bg-gray-900/10 animate-ping" />
        <div className="relative h-14 w-14 rounded-2xl bg-gray-900 flex items-center justify-center shadow-lg">
          <Stethoscope className="h-7 w-7 text-white" />
        </div>
      </div>

      <div className="text-center">
        <p className="font-semibold text-gray-900">Doctor Tracker</p>
        <p className="mt-1 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading, please wait...
        </p>
      </div>
    </main>
  );
};

export default Loader;
