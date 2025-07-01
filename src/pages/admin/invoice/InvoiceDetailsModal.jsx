import { useState } from "react";
import { formatDate } from "../../../utils/formatData";

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "bmp"];
const PDF_EXTENSIONS = ["pdf"];

function getFileExtension(url = "", fallback = "pdf") {
  const ext = url.split(".").pop().split("?")[0]?.toLowerCase();
  if (!ext || ext.length > 5) return fallback;
  return ext;
}

function getFileType(url = "") {
  const ext = getFileExtension(url);
  if (IMAGE_EXTENSIONS.includes(ext)) return "image";
  if (PDF_EXTENSIONS.includes(ext)) return "pdf";
  return "other";
}

function getDefaultFileName(invoice, url) {
  const ext = getFileExtension(url);
  const base =
    invoice?.invoiceNumber || invoice?.systemInvoiceNumber || "invoice-file";
  return `${base}.${ext}`;
}

const InvoiceDetailsModal = ({ invoice, onClose }) => {
  const {
    invoiceNumber,
    systemInvoiceNumber,
    type,
    clientCompany,
    supplierCompany,
    client,
    supplier,
    currency,
    dateIssued,
    dueDate,
    status,
    category,
    tags,
    notes,
    items = [],
    subtotal,
    totalTax,
    totalAmount,
    imageUrl,
  } = invoice;

  const [showImagePreview, setShowImagePreview] = useState(false);

  const fileType = getFileType(imageUrl);
  const fileName = getDefaultFileName(invoice, imageUrl);

  const downloadUrl = imageUrl
    ? `/api/download?url=${encodeURIComponent(
        imageUrl
      )}&name=${encodeURIComponent(fileName)}`
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Image Modal Preview */}
      {showImagePreview && fileType === "image" && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/80"
          onClick={() => setShowImagePreview(false)}
        >
          <img
            src={imageUrl}
            alt="Invoice Preview"
            className="max-w-4xl max-h-[90vh] rounded-lg border-2 border-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div
        className="
        bg-[#23263a] text-white rounded-2xl shadow-2xl
        flex flex-col md:flex-row relative min-h-[600px] overflow-hidden
        w-[90vw] max-w-[1400px] min-w-[900px]
        p-0
      "
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-400 hover:text-gray-200 text-2xl font-bold z-10"
        >
          ×
        </button>

        {/* Left: Details */}
        <div className="basis-1/2 min-w-0 p-8 flex flex-col overflow-y-auto max-h-[80vh]">
          <h2 className="text-2xl font-bold mb-4">Invoice Details</h2>
          <div className="mb-2">
            <span className="font-semibold">Invoice #:</span>{" "}
            {invoiceNumber || systemInvoiceNumber}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Type:</span> {type}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Status:</span> {status}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Date Issued:</span>{" "}
            {formatDate(dateIssued)}
          </div>
          {dueDate && (
            <div className="mb-2">
              <span className="font-semibold">Due Date:</span>{" "}
              {formatDate(dueDate)}
            </div>
          )}
          <div className="mb-2">
            <span className="font-semibold">Currency:</span> {currency}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Category:</span> {category || "—"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Tags:</span>{" "}
            {tags?.length > 0 ? tags.join(", ") : "—"}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Notes:</span> {notes || "—"}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Client:</span>{" "}
            {clientCompany ? (
              <>
                {clientCompany.name}
                {clientCompany.vatNumber
                  ? ` (VAT: ${clientCompany.vatNumber})`
                  : ""}
              </>
            ) : (
              <span>{client || "—"}</span>
            )}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Supplier:</span>{" "}
            {supplierCompany ? (
              <>
                {supplierCompany.name}
                {supplierCompany.vatNumber
                  ? ` (VAT: ${supplierCompany.vatNumber})`
                  : ""}
              </>
            ) : (
              <span>{supplier || "—"}</span>
            )}
          </div>
          {/* Items table */}
          <div className="mb-4">
            <div className="font-semibold mb-2">Products:</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-700 rounded">
                <thead>
                  <tr className="bg-[#252a3a]">
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-right">Qty</th>
                    <th className="p-2 text-right">Unit Price</th>
                    <th className="p-2 text-right">Tax %</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} className="border-t border-gray-700">
                      <td className="p-2 text-left">{item.description}</td>
                      <td className="p-2 text-right">{item.quantity}</td>
                      <td className="p-2 text-right">{item.price}</td>
                      <td className="p-2 text-right">{item.taxRate}</td>
                      <td className="p-2 text-right">
                        {(
                          Number(item.price || 0) *
                          Number(item.quantity || 1) *
                          (1 + Number(item.taxRate || 0) / 100)
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex flex-col gap-2 border-t border-gray-700 pt-2 mt-4">
            <div>
              <span className="font-semibold">Subtotal:</span>{" "}
              {Number(subtotal).toFixed(2)} {currency}
            </div>
            <div>
              <span className="font-semibold">Total Tax:</span>{" "}
              {Number(totalTax).toFixed(2)} {currency}
            </div>
            <div>
              <span className="font-semibold">Total Amount:</span>{" "}
              {Number(totalAmount).toFixed(2)} {currency}
            </div>
          </div>
        </div>

        {/* Right: File/Image/PDF */}
        <div className="basis-1/2 min-w-0 p-8 flex flex-col items-center justify-start gap-4">
          <div className="font-semibold mb-2 mt-1 md:mt-0 text-lg w-full text-center">
            Invoice File:
          </div>
          {imageUrl &&
            (fileType === "image" ? (
              <>
                <img
                  src={imageUrl}
                  alt="Invoice"
                  className="w-full max-w-[540px] max-h-[600px] border border-gray-600 rounded-lg cursor-zoom-in hover:shadow-lg transition"
                  title="Click to preview"
                  onClick={() => setShowImagePreview(true)}
                  style={{ objectFit: "contain" }}
                />
                <a
                  href={downloadUrl}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded transition text-sm mt-2"
                >
                  Download Image
                </a>
              </>
            ) : fileType === "pdf" ? (
              <>
                <div
                  className="border border-gray-700 rounded-lg bg-white w-full flex justify-center items-center"
                  style={{ minHeight: 540, height: 540, maxWidth: "100%" }}
                >
                  <iframe
                    src={`/api/download?url=${encodeURIComponent(
                      imageUrl
                    )}&inline=true`}
                    title="PDF Preview"
                    className="w-full h-full rounded-lg"
                    style={{ minHeight: 530, height: 530 }}
                    frameBorder={0}
                    allowFullScreen
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <a
                    href={downloadUrl}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded transition text-sm"
                  >
                    Download PDF
                  </a>
                </div>
              </>
            ) : (
              <a
                href={downloadUrl}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded transition text-sm"
              >
                Download File
              </a>
            ))}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsModal;
