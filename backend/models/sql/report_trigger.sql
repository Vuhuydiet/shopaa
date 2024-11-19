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
CREATE TYPE report_type AS ENUM ('Shop', 'Product');

CREATE OR REPLACE FUNCTION fn_check_report_type()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT (NEW."type" IN ('Shop', 'Product')) THEN
        RAISE EXCEPTION 'Invalid type: %', NEW."type";
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE TRIGGER tg_before_insert_report_result
BEFORE INSERT ON "Report"
FOR EACH ROW
EXECUTE FUNCTION trg_check_report_type();



--------------------check category
CREATE OR REPLACE FUNCTION fn_validate_category_based_on_type()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."type" = 'Shop' THEN
        IF NEW."category" NOT IN (
            'post banned product', 
            'signs of fraud', 
            'post fake product', 
            'spam message',
            'transaction outside shop',
            'privacy violation',
            'vulgar and offensive content',
            'other'
        ) THEN
            RAISE EXCEPTION 'Invalid category "%", expected one of: post banned product, signs of fraud, post fake product, spam message, transaction outside shop, privacy violation, vulgar and offensive content, other', NEW."category";
        END IF;
    END IF;

    IF NEW."type" = 'Product' THEN
        IF NEW."category" NOT IN (
            'signs of fraud', 
            'fake product', 
            'origin unknown', 
            'vulgar and offensive content',
            'wrong description',
            'signs of virtual single increase',
            'transaction outside shop',
            'other', 
            'post banned product'
        ) THEN
            RAISE EXCEPTION 'Invalid category "%", expected one of: signs of fraud, fake product, origin unknown, vulgar and offensive content, wrong description, signs of virtual single increase, transaction outside shop, other, post banned product', NEW."category";
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE TRIGGER tg_validate_category_trigger
BEFORE INSERT OR UPDATE ON "Report"
FOR EACH ROW
EXECUTE FUNCTION fn_validate_category_based_on_type();


