const GET_TAX_INVOICES = `
  SELECT 
    tax_invoices.tax_invoice_id AS tax_id_alias,
    tax_invoices.sale_id AS sale_id_alias,
    tax_invoices.invoice_id AS invoice_id_alias,
    tax_invoices.deleted_at AS tax_invoice_deleted_at,
    * FROM tax_invoices
  LEFT JOIN invoices ON invoices.invoice_id = tax_invoices.invoice_id
  LEFT JOIN quotation_sales ON quotation_sales.sale_id = invoices.sale_id
  LEFT JOIN businesses ON businesses.bus_id = quotation_sales.bus_id
  LEFT JOIN banks ON banks.bank_id = businesses.bank_id
  LEFT JOIN customers ON quotation_sales.customer_id = customers.customer_id
  LEFT JOIN employees ON employees."employee_id"  = quotation_sales."employee_id" 
  LEFT JOIN billings ON billings.invoice_id = invoices.invoice_id 
  WHERE quotation_sales.bus_id = :bus_id
  ORDER BY tax_invoices.tax_invoice_number ASC;
`;

const GET_ALL_QUOTATION_DETAILS = `
  SELECT * FROM quotation_sale_details;
`;

// เพิ่ม query ใหม่สำหรับ getBilling
const GET_BILLINGS = `
  SELECT 
    billings.*,
    tax_invoices.*,
    invoices.*,
    quotation_sales.*,
    employees.*,
    customers.*,
    billings.deleted_at AS billings_deleted_at,
    billings.remark AS billings_remark
  FROM billings
  LEFT JOIN tax_invoices ON billings.tax_invoice_id = tax_invoices.tax_invoice_id
  LEFT JOIN invoices ON billings.invoice_id = invoices.invoice_id
  LEFT JOIN quotation_sales ON billings.sale_id = quotation_sales.sale_id
  LEFT JOIN customers ON quotation_sales.customer_id = customers.customer_id
  LEFT JOIN employees ON employees."employee_id"  = quotation_sales."employee_id" 
  WHERE quotation_sales.bus_id = :bus_id
  ORDER BY invoices.invoice_number ASC;
`;

const GET_INVOICES = `
  SELECT *, 
    invoices.deleted_at AS invoice_deleted_at,
    invoices.remark AS invoices_remark
  FROM invoices
  LEFT JOIN quotation_sales ON quotation_sales.sale_id = invoices.sale_id
  LEFT JOIN businesses ON businesses.bus_id = quotation_sales.bus_id
  LEFT JOIN banks ON banks.bank_id = businesses.bank_id
  LEFT JOIN customers ON quotation_sales.customer_id = customers.customer_id
  LEFT JOIN employees ON employees."employee_id" = quotation_sales."employee_id" 
  LEFT JOIN billings ON billings.invoice_id = invoices.invoice_id 
  WHERE quotation_sales.bus_id = :bus_id
  ORDER BY invoices.invoice_number ASC;
`;

module.exports = {
  GET_TAX_INVOICES,
  GET_ALL_QUOTATION_DETAILS,
  GET_BILLINGS,
  GET_INVOICES
};