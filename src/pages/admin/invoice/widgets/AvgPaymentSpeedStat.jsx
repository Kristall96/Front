export default function AvgPaymentSpeedStat({ data, loading }) {
  const avg = data?.avgDays ?? null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-7 text-sky-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-7">
      <div className="text-5xl font-extrabold text-sky-300">
        {avg !== null ? avg.toFixed(1) : "--"}
        <span className="text-2xl text-gray-400"> days</span>
      </div>
      <div className="text-base text-gray-400 mt-2 font-medium">
        Average Payment Speed
      </div>
    </div>
  );
}
