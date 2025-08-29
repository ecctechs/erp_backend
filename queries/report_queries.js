// Query เดิม
const GET_SALE_REPORT_BY_PRODUCT_TYPE = `
  SELECT 
    CASE 
        WHEN products."product_type_id" = 1 THEN 'สินค้า'
        WHEN products."product_type_id" = 2 THEN 'บริการ'
        ELSE 'Other'
    END AS product_type,
    SUM(quotation_sale_details."sale_price") AS total_sale_price
  FROM public.quotation_sale_details
  LEFT JOIN public.billings ON public.billings."sale_id" = public.quotation_sale_details."sale_id"
  LEFT JOIN public.products ON public.products."product_id" = public.quotation_sale_details."product_id"
  WHERE public.products."business_id" = :business_id
    AND public.billings."billing_date"::date BETWEEN :startDate AND :endDate
  GROUP BY product_type;
`;

// Query ที่เพิ่มใหม่ 1
const GET_SALE_REPORT_BY_CATEGORY = `
  SELECT 
    public.product_categories."category_name",
    SUM(public.quotation_sale_details."sale_price") AS total_sale_price
  FROM public.quotation_sale_details
  LEFT JOIN public.billings ON public.billings."sale_id" = public.quotation_sale_details."sale_id"
  LEFT JOIN public.products ON public.products."product_id" = public.quotation_sale_details."product_id"
  LEFT JOIN public.product_categories ON public.products."category_id" = public.product_categories."category_id"
  WHERE public.products."business_id" = :business_id
    AND public.billings."billing_date"::date BETWEEN :startDate AND :endDate
  GROUP BY public.product_categories."category_name";
`;

// Query ที่เพิ่มใหม่ 2
const GET_SALE_REPORT_BY_PRODUCT_RANK = `
  WITH RankedProducts AS (
    SELECT 
        public.products."product_name",
        SUM(public.quotation_sale_details."sale_price") AS total_sale_price,
        ROW_NUMBER() OVER (ORDER BY SUM(public.quotation_sale_details."sale_price") DESC) AS rank
    FROM public.quotation_sale_details
    LEFT JOIN public.billings ON public.billings."sale_id" = public.quotation_sale_details."sale_id"
    LEFT JOIN public.products ON public.products."product_id" = public.quotation_sale_details."product_id"
    WHERE public.products."business_id" = :business_id
      AND public.products."product_type_id" != 2
      AND public.billings."billing_date"::date BETWEEN :startDate AND :endDate
    GROUP BY public.products."product_name"
  ),
  AggregatedProducts AS (
    SELECT 
        CASE 
            WHEN rank <= 7 THEN "product_name"
            ELSE 'Others'
        END AS product,
        SUM(total_sale_price) AS total_sale_price
    FROM RankedProducts
    GROUP BY 
        CASE 
            WHEN rank <= 7 THEN "product_name"
            ELSE 'Others'
        END
  )
  SELECT 
    product,
    total_sale_price
  FROM AggregatedProducts
  ORDER BY total_sale_price DESC;
`;

// Query ที่เพิ่มใหม่ 3
const GET_SALE_REPORT_BY_SERVICE = `
  SELECT 
    public.products.product_name AS product_name,
    SUM(public.quotation_sale_details."sale_price") AS total_sale_price
  FROM public.quotation_sale_details
  LEFT JOIN public.billings ON public.billings."sale_id" = public.quotation_sale_details."sale_id"
  LEFT JOIN public.products ON public.products."product_id" = public.quotation_sale_details."product_id"
  WHERE public.products."business_id" = :business_id
    AND public.products."product_type_id" = 2
    AND public.billings."billing_date"::date BETWEEN :startDate AND :endDate
  GROUP BY public.products."product_name"
  ORDER BY total_sale_price DESC;
`;


module.exports = {
  GET_SALE_REPORT_BY_PRODUCT_TYPE,
  GET_SALE_REPORT_BY_CATEGORY,
  GET_SALE_REPORT_BY_PRODUCT_RANK,
  GET_SALE_REPORT_BY_SERVICE,
};