import PDFDocument from "pdfkit";
import fs from "fs";

export const generateInvoice = (order, path) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(path));

  doc.fontSize(20).text("Invoice", { align: "center" });
  doc.text(`Order ID: ${order._id}`);
  doc.text(`Total: $${order.total}`);

  doc.end();
};
