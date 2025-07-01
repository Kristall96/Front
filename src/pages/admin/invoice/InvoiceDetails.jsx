import { useEffect, useState } from "react";
import secureAxios from "../../../utils/secureAxios";
import { formatDate } from "../../../utils/formatData";
import InvoiceForm from "./InvoiceForm";
import InvoiceDetailsModal from "./InvoiceDetailsModal"; // Import this!

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  // NEW: For details modal
  const [detailsInvoice, setDetailsInvoice] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await secureAxios.get("/invoices");
      const data = Array.isArray(res.data) ? res.data : res.data.invoices || [];
      setInvoices(data);
    } catch (err) {
      console.error("Failed to fetch invoices:", err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line
  }, []);

  const handleCreate = () => {
    setEditingInvoice(null);
    setIsModalOpen(true);
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setIsModalOpen(true);
  };

  // NEW: Show details modal
  const handleViewDetails = (invoice) => {
    setDetailsInvoice(invoice);
    setShowDetailsModal(true);
  };

  return (
    <div className="bg-[#181A23] text-white rounded-lg p-6 shadow-lg relative min-h-[60vh]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">🧾 All Invoices</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
        >
          + New Invoice
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">
          Loading invoices...
        </div>
      ) : invoices.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          No invoices found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-inner">
          <table className="min-w-full text-sm bg-[#222436] rounded-lg overflow-hidden">
            <thead className="bg-[#23263a] text-gray-200">
              <tr>
                <th className="p-3 font-semibold">#</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Client</th>
                <th className="p-3 font-semibold">Supplier</th>
                <th className="p-3 font-semibold">Total</th>
                <th className="p-3 font-semibold">Issued</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv._id}
                  className="border-t border-[#27293e] hover:bg-[#25294a] transition"
                >
                  <td className="p-3">{inv.invoiceNumber || "—"}</td>
                  <td className="p-3 capitalize">
                    {inv.type === "income"
                      ? "Income (You receive)"
                      : inv.type === "outcome"
                      ? "Expense (You pay)"
                      : inv.type}
                  </td>
                  <td className="p-3">
                    {inv.clientCompany?.name || inv.client || "—"}
                  </td>
                  <td className="p-3">
                    {inv.supplierCompany?.name || inv.supplier || "—"}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {Number(inv.totalAmount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    {inv.currency}
                  </td>
                  <td className="p-3">{formatDate(inv.dateIssued)}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleViewDetails(inv)}
                      className="text-green-400 hover:underline hover:text-green-300 transition"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleEdit(inv)}
                      className="text-blue-400 hover:underline hover:text-blue-300 transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-lg">
          <div className="w-full max-w-2xl mx-4">
            <InvoiceForm
              invoice={editingInvoice}
              onClose={() => setIsModalOpen(false)}
              onSaved={() => {
                setIsModalOpen(false);
                fetchInvoices();
              }}
            />
          </div>
        </div>
      )}

      {/* Modal for Details (READ-ONLY) */}
      {showDetailsModal && detailsInvoice && (
        <InvoiceDetailsModal
          invoice={detailsInvoice}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
};

export default InvoiceList;
