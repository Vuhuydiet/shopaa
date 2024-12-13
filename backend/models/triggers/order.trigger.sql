-- Active: 1732783228217@@127.0.0.1@5432@shopaa_db@public

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

CREATE OR REPLACE FUNCTION fn_update_order_status()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD."status" = 'COMPLETED' AND NEW."status" != 'COMPLETED' THEN
        RAISE EXCEPTION 'Cannot revert order status';
    END IF;

    IF NEW."status" = 'COMPLETED' AND OLD."status" != 'COMPLETED' THEN
        UPDATE "Product"
        SET "numSoldProduct" = "numSoldProduct" + od."quantity"
        FROM "OrderDetail" od
        WHERE od."productId" = "Product"."productId"
        AND od."orderId" = NEW."orderId";

        UPDATE "Shop"
        SET "bankingBalance" = "bankingBalance" + NEW."totalAmount",
            "numSoldOrders" = "numSoldOrders" + 1
        WHERE "shopOwnerId" = NEW."shopId";

    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_update_numSoldProduct
BEFORE UPDATE ON "Order"
FOR EACH ROW
EXECUTE FUNCTION fn_update_order_status();
