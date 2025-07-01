import { useEffect, useState } from "react";
import secureAxios from "../../../utils/secureAxios";
import { formatDate } from "../../../utils/formatData";
import InvoiceForm from "./InvoiceForm";
import CompanyCreateModal from "./CompanyCreateModal";
import InvoiceDetailsModal from "./InvoiceDetailsModal";
import InvoiceAnalyticsModal from "./InvoiceAnalyticsModal";
const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [companyListUpdated, setCompanyListUpdated] = useState(0);
  const [sortBy, setSortBy] = useState("dateIssued");
  const [sortOrder, setSortOrder] = useState("desc");
  // Details modal state
  const [detailsInvoice, setDetailsInvoice] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Deleting state
  const [deletingId, setDeletingId] = useState(null);
  // Analysis
  const [showAnalytics, setShowAnalytics] = useState(false);
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await secureAxios.get("/invoices", {
        params: { sortBy, sortOrder, all: true },
      });
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
  }, [sortBy, sortOrder]); // re-fetch on sort change

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleCreate = () => {
    setEditingInvoice(null);
    setIsModalOpen(true);
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleViewDetails = (invoice) => {
    setDetailsInvoice(invoice);
    setShowDetailsModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;
    setDeletingId(id);
    try {
      await secureAxios.delete(`/invoices/${id}`);
      fetchInvoices();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err.message ||
          "Failed to delete invoice"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-[#181A23] text-white rounded-lg p-6 shadow-lg relative min-h-[60vh]">
      <div className="flex items-center justify-between mb-6 gap-3">
        <h2 className="text-2xl font-bold tracking-tight">🧾 All Invoices</h2>
        <button
          onClick={() => setShowAnalytics(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 focus:outline-none"
          type="button"
        >
          📊 Analytics
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setIsCompanyModalOpen(true)}
            className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600 focus:outline-none"
            type="button"
          >
            + New Company
          </button>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
          >
            + New Invoice
          </button>
        </div>
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
          {/* Table with fixed column widths for perfect alignment */}
          <table className="table-fixed w-full min-w-[1250px] text-sm bg-[#222436] rounded-lg overflow-hidden">
            <thead className="bg-[#23263a] text-gray-200 uppercase text-xs tracking-wide">
              <tr>
                <th
                  className="px-4 py-3 font-bold text-left cursor-pointer select-none"
                  onClick={() => handleSort("systemInvoiceNumber")}
                >
                  System #
                  {sortBy === "systemInvoiceNumber" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 font-bold text-left cursor-pointer select-none"
                  onClick={() => handleSort("invoiceNumber")}
                >
                  Invoice #
                  {sortBy === "invoiceNumber" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 font-bold text-left cursor-pointer select-none"
                  onClick={() => handleSort("type")}
                >
                  Type
                  {sortBy === "type" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 font-bold text-left cursor-pointer select-none"
                  onClick={() => handleSort("client")}
                >
                  Client
                  {sortBy === "client" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 font-bold text-left cursor-pointer select-none"
                  onClick={() => handleSort("supplier")}
                >
                  Supplier
                  {sortBy === "supplier" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>

                <th
                  className="px-4 py-3 font-bold text-left cursor-pointer select-none"
                  onClick={() => handleSort("status")}
                >
                  Status
                  {sortBy === "status" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 font-bold text-left cursor-pointer select-none"
                  onClick={() => handleSort("dateIssued")}
                >
                  Issued
                  {sortBy === "dateIssued" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 font-bold text-left cursor-pointer select-none"
                  onClick={() => handleSort("dueDate")}
                >
                  Due
                  {sortBy === "dueDate" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 font-bold text-left cursor-pointer select-none"
                  onClick={() => handleSort("totalAmount")}
                >
                  Total
                  {sortBy === "totalAmount" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 font-bold text-left cursor-pointer select-none"
                  onClick={() => handleSort("createdAt")}
                >
                  Created
                  {sortBy === "createdAt" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 font-bold text-left cursor-pointer select-none"
                  onClick={() => handleSort("updatedAt")}
                >
                  Edited
                  {sortBy === "updatedAt" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th className="px-4 py-3 font-bold text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv) => {
                const isOverdue =
                  inv.status === "unpaid" &&
                  inv.dueDate &&
                  new Date(inv.dueDate) < new Date();
                return (
                  <tr
                    key={inv._id}
                    className="border-t border-[#8f8f8f] hover:bg-[#23273d] transition"
                  >
                    <td className="px-2 py-1 text-xs">
                      {inv.systemInvoiceNumber || "—"}
                    </td>
                    <td className="px-2 py-1 text-xs">
                      {inv.invoiceNumber || "—"}
                    </td>
                    <td className="px-4 py-2 text-xs max-w-[120px] truncate">
                      {inv.type === "income"
                        ? "Income"
                        : inv.type === "outcome"
                        ? "Expense"
                        : inv.type}
                    </td>
                    <td className="px-2 py-1 text-xs max-w-[120px] truncate">
                      {inv.clientCompany?.name || inv.client || "—"}
                    </td>
                    <td className="px-2 py-1 text-xs max-w-[120px] truncate">
                      {inv.supplierCompany?.name || inv.supplier || "—"}
                    </td>

                    <td className="px-2 py-1">
                      <span
                        className={
                          "px-2 py-0.5 rounded text-[11px] font-bold uppercase " +
                          (inv.status === "paid"
                            ? "bg-green-700 text-green-100"
                            : inv.status === "unpaid"
                            ? "bg-red-700 text-red-100"
                            : "bg-gray-700 text-gray-200")
                        }
                        style={{
                          minWidth: 46,
                          display: "inline-block",
                          textAlign: "center",
                        }}
                      >
                        {inv.status || "—"}
                      </span>
                    </td>
                    <td className="px-2 py-1 text-xs">
                      {inv.dateIssued ? formatDate(inv.dateIssued) : "—"}
                    </td>
                    <td
                      className={
                        "px-2 py-1 text-xs" +
                        (isOverdue ? " text-red-400 font-bold" : "")
                      }
                    >
                      {inv.dueDate ? formatDate(inv.dueDate) : "—"}
                    </td>
                    <td className="px-2 py-1 text-xs whitespace-nowrap">
                      {Number(inv.totalAmount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {inv.currency}
                    </td>
                    <td className="px-2 py-1 text-[11px]">
                      {inv.createdAt
                        ? new Date(inv.createdAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-2 py-1 text-[11px]">
                      {inv.updatedAt && inv.updatedAt !== inv.createdAt
                        ? new Date(inv.updatedAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-2 py-1 flex gap-1 min-w-[88px]">
                      <button
                        onClick={() => handleViewDetails(inv)}
                        className="text-green-400 hover:bg-green-900 hover:text-white px-1 py-0.5 rounded text-[11px] font-medium transition"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleEdit(inv)}
                        className="text-blue-400 hover:bg-blue-900 hover:text-white px-1 py-0.5 rounded text-[11px] font-medium transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(inv._id)}
                        className="text-red-400 hover:bg-red-900 hover:text-white px-1 py-0.5 rounded text-[11px] font-medium transition"
                        disabled={deletingId === inv._id}
                      >
                        {deletingId === inv._id ? "..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Invoice Modal */}
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
              companyListUpdated={companyListUpdated}
            />
          </div>
        </div>
      )}

      {/* Company Create Modal */}
      {isCompanyModalOpen && (
        <CompanyCreateModal
          onClose={() => setIsCompanyModalOpen(false)}
          onSaved={() => {
            setIsCompanyModalOpen(false);
            setCompanyListUpdated((n) => n + 1);
          }}
        />
      )}

      {/* Invoice Details Modal */}
      {showDetailsModal && detailsInvoice && (
        <InvoiceDetailsModal
          invoice={detailsInvoice}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
      <div className="...">
        {/* ... all your UI ... */}
        {/* Invoice Details Modal */}
        {showDetailsModal && detailsInvoice && (
          <InvoiceDetailsModal
            invoice={detailsInvoice}
            onClose={() => setShowDetailsModal(false)}
          />
        )}
        {/* Analytics Modal */}
        {showAnalytics && (
          <InvoiceAnalyticsModal onClose={() => setShowAnalytics(false)} />
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
