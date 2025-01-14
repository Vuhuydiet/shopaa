
CREATE OR REPLACE FUNCTION fn_update_shop_numProducts_insert()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "Shop"
    SET "numProducts" = "numProducts" + 1
    WHERE "shopOwnerId" = NEW."sellerId";
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_insert_product
BEFORE INSERT ON "Product"
FOR EACH ROW
EXECUTE FUNCTION fn_update_shop_numProducts_insert();

CREATE OR REPLACE FUNCTION fn_update_shop_numProducts_delete()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "Shop"
    SET "numProducts" = "numProducts" - 1
    WHERE "shopOwnerId" = OLD."sellerId";
    RETURN OLD;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_delete_product
BEFORE DELETE ON "Product"
FOR EACH ROW
EXECUTE FUNCTION fn_update_shop_numProducts_delete();
