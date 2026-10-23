type Props = {
  title: string;
  subtitle: string;
  isLoading: boolean;
  isError: boolean;
  children: React.ReactNode;
};

export default function ChartCard({
  title,
  subtitle,
  isLoading,
  isError,
  children,
}: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="mb-4 text-sm text-gray-500">{subtitle}</p>

      {isLoading && (
        <div className="h-[320px] animate-pulse rounded-lg bg-gray-100" />
      )}
      {isError && (
        <div className="flex h-[320px] items-center justify-center text-sm text-gray-500">
          Couldn&apos;t load the chart.
        </div>
      )}
      {!isLoading && !isError && children}
    </div>
  );
}
