-- Active: 1732951377524@@127.0.0.1@5432@shopaa_db@public

CREATE OR REPLACE FUNCTION fn_generate_orderdetail_number()
RETURNS TRIGGER AS $$
DECLARE
    max_orderdetail_number INT;
BEGIN
    -- Find the max `orderdetail_number` for the given `orderid`
    SELECT COALESCE(MAX("orderDetailNumber"), -1) + 1
    INTO max_orderdetail_number
    FROM "OrderDetail"
    WHERE "orderId" = NEW."orderId";

    -- Assign it to the new row
    NEW."orderDetailNumber" = max_orderdetail_number;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_set_orderdetail_number
BEFORE INSERT ON "OrderDetail"
FOR EACH ROW
EXECUTE FUNCTION fn_generate_orderdetail_number();
