---------- report status
CREATE TYPE report_result_status AS ENUM ('Resolved', 'Rejected', 'Invalid');


CREATE OR REPLACE FUNCTION fn_check_report_result_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT (NEW."result" IN ('Resolved', 'Rejected', 'Invalid')) THEN
        RAISE EXCEPTION 'Invalid status: %', NEW."result";
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER tg_before_insert_report_result
BEFORE INSERT ON "ReportResult"
FOR EACH ROW
EXECUTE FUNCTION fn_check_report_result_status();




---------------------------------type report
CREATE OR REPLACE FUNCTION fn_validate_report_category()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."type" = 'shop' THEN
        IF NOT EXISTS (
            SELECT 1 FROM "ShopCategoryReport" WHERE "categoryName" = NEW."shopCategory"
        ) THEN
            RAISE EXCEPTION 'Invalid category for shop: %', NEW."shopCategory";
        END IF;

        IF NEW."productId" IS NOT NULL THEN
            RAISE EXCEPTION 'productId must be NULL when type is shop';
        END IF;
    ELSIF NEW."type" = 'product' THEN
        IF NOT EXISTS (
            SELECT 1 FROM "ProductCategoryReport" WHERE "categoryName" = NEW."productCategory"
        ) THEN
            RAISE EXCEPTION 'Invalid category for product: %', NEW."productCategory";
        END IF;

        IF NEW."shopId" IS NOT NULL THEN
            RAISE EXCEPTION 'shopId must be NULL when type is product';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_validate_report_category_trigger
BEFORE INSERT OR UPDATE ON "Report"
FOR EACH ROW
EXECUTE FUNCTION fn_validate_report_category();



