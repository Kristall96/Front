// src/pages/admin/invoice/index.jsx
import { Routes, Route } from "react-router-dom";
import InvoiceList from "./InvoiceList";
import InvoiceForm from "./InvoiceForm";
import InvoiceDetails from "./InvoiceDetails";

const InvoiceRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<InvoiceList />} />
      <Route path="new" element={<InvoiceForm />} />
      <Route path=":id" element={<InvoiceDetails />} />
      <Route path=":id/edit" element={<InvoiceForm />} />
    </Routes>
  );
};

export default InvoiceRoutes;
