------------------------Age < 16------------------------
CREATE OR REPLACE FUNCTION fn_check_age()
RETURNS TRIGGER AS $$
DECLARE
    calculated_age INT;
BEGIN
    calculated_age := DATE_PART('year', AGE(NEW."dateOfBirth"));

    IF calculated_age < 16 THEN
        RAISE EXCEPTION 'Invalid age. Must more than 16 years old.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_limit_age
BEFORE INSERT OR UPDATE ON "UserProfile"
FOR EACH ROW
EXECUTE FUNCTION fn_check_age();


-----------------------fullname is not contain special character except space------
CREATE OR REPLACE FUNCTION fn_check_fullname()
RETURNS TRIGGER AS $$
BEGIN 
    IF NEW."fullname" !~ '^[A-Za-zÀ-ỹ\s]+$' THEN
        RAISE EXCEPTION 'Invalid fullname';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER tg_check_fullname
BEFORE INSERT OR UPDATE ON "UserProfile"
FOR EACH ROW
EXECUTE FUNCTION fn_check_fullname();


--------------------------check_quatity of product in store-------------
CREATE OR REPLACE FUNCTION fn_check_quatityofproduct()
RETURNS TRIGGER AS $$
BEGIN
 
    IF NEW."quantity" < 0 THEN
        RAISE EXCEPTION 'Product quantity is not negative.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_check_stock
BEFORE INSERT OR UPDATE ON "Product"
FOR EACH ROW
EXECUTE FUNCTION fn_check_quatityofproduct();


-----------------trigger-OriginalPrice>= CurrentPrice-------------
CREATE OR REPLACE FUNCTION fn_check_price()
RETURNS TRIGGER AS $$
BEGIN
        IF NEW."currentPrice" > NEW."originalPrice" THEN
            RAISE EXCEPTION 'Invalid price. CurrentPrice must be less than or equal originalPrice';
        END IF;

        RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE TRIGGER tg_checkprice
BEFORE INSERT OR UPDATE ON "Product"
FOR EACH ROW
EXECUTE FUNCTION fn_check_price();


CREATE OR REPLACE FUNCTION fn_rollback_productImage_deletion()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT * FROM "Image" WHERE "imageId" = OLD."imageId") THEN
        RAISE EXCEPTION 'Cannot delete ProductImage with a publicId that exists in Image table.';
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_rollback_productImage_deletion
BEFORE DELETE ON "ProductImage"
FOR EACH ROW
EXECUTE FUNCTION fn_rollback_productImage_deletion();