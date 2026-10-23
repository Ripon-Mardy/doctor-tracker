import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: number;
  icon: LucideIcon;
  footer: React.ReactNode;
};

export default function StatCard({ title, value, icon: Icon, footer }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-600">{title}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <p className="mt-2 text-3xl font-bold text-gray-900">
        {value.toLocaleString()}
      </p>

      <div className="mt-3 text-xs text-gray-500">{footer}</div>
    </div>
  );
}
