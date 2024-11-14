----------------------------------Seller cannot buy their product----
CREATE OR REPLACE FUNCTION fn_prevent_seller_from_buying()
RETURNS trigger AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "Product" p JOIN "Shop" s ON s."shopOwnerId" = p."sellerId"
        WHERE p."productId" = NEW."productId"
          AND s."shopOwnerId" = NEW."userId" 
    ) THEN
        RAISE EXCEPTION 'The seller cannot purchase products from their own shop.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER tg_prevent_seller_from_buying
BEFORE INSERT OR UPDATE ON "CartDetail"
FOR EACH ROW
EXECUTE FUNCTION fn_prevent_seller_from_buying();



-----------------------------number of product in cart isn't larger than 200-----
CREATE OR REPLACE FUNCTION fn_check_cart_quantity()
RETURNS TRIGGER AS $$
BEGIN
        IF(
            SELECT COUNT(*) FROM "CartDetail" WHERE "userId"=new."userId"
        ) >200
        THEN 
            RAISE EXCEPTION 'The maximum number of products in the shopping cart is 200';
        END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_cart_quantity_limit
BEFORE INSERT OR UPDATE ON "CartDetail"
FOR EACH ROW
EXECUTE FUNCTION fn_check_cart_quantity();

