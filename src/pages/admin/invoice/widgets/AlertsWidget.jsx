export default function AlertsWidget({ data }) {
  return (
    <div className="w-full flex flex-col gap-3 p-6">
      <div className="flex gap-4">
        <div className="bg-red-600/80 px-4 py-2 rounded text-white text-lg font-bold flex-1">
          Overdue Invoices:{" "}
          <span className="font-mono">{data?.overdue ?? "--"}</span>
        </div>
        <div className="bg-amber-500/80 px-4 py-2 rounded text-white text-lg font-bold flex-1">
          Stale Drafts:{" "}
          <span className="font-mono">{data?.staleDrafts ?? "--"}</span>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-base font-bold text-sky-400 mb-2">
          High-Value Unpaid Invoices:
        </div>
        <ul className="text-white space-y-2">
          {Array.isArray(data?.highUnpaid) && data.highUnpaid.length ? (
            data.highUnpaid.map((inv) => (
              <li
                key={inv.invoiceNumber || inv._id}
                className="bg-gray-800 px-3 py-2 rounded"
              >
                <span className="text-rose-400 font-bold">
                  {inv.totalAmount}
                </span>
                <span className="mx-2 text-xs text-gray-400">
                  due: {new Date(inv.dueDate).toLocaleDateString()}
                </span>
                <span className="ml-2 text-sky-300">{inv.invoiceNumber}</span>
                <span className="ml-2 text-green-400">
                  {inv.clientCompany?.name || ""}
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">None</li>
          )}
        </ul>
      </div>
    </div>
  );
}
