------------------------Age < 16------------------------
CREATE OR REPLACE FUNCTION check_age()
RETURNS TRIGGER AS $$
DECLARE
    calculated_age INT;
BEGIN
    calculated_age := DATE_PART('year', AGE(NEW."dateOfBirth"));

    IF calculated_age < 16 THEN
        RAISE EXCEPTION 'Tuổi không hợp lệ. Phải lớn hơn hoặc bằng 16';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER limit_age
BEFORE INSERT OR UPDATE ON "UserProfile"
FOR EACH ROW
EXECUTE FUNCTION check_age();

--------------------Gender is 'Male' or 'Female'-----------------------
CREATE OR REPLACE FUNCTION check_gender()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."gender" NOT IN ('Male','Female','Other') THEN
        RAISE EXCEPTION 'Giới tính không hợp lệ';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_check_gender
BEFORE INSERT OR UPDATE ON "UserProfile"
FOR EACH ROW
EXECUTE FUNCTION check_gender();

-----------------------fullname is not contain special character except space------
CREATE OR REPLACE FUNCTION check_fullname()
RETURNS TRIGGER AS $$
BEGIN 
    IF NEW."fullname" !~ '^[A-Za-zÀ-ỹ\s]+$' THEN
        RAISE EXCEPTION 'Tên không hợp lệ';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER trigger_check_fullname
BEFORE INSERT OR UPDATE ON "UserProfile"
FOR EACH ROW
EXECUTE FUNCTION check_fullname();


--------------------------check_quatity of product in store-------------
CREATE OR REPLACE FUNCTION check_quatityofproduct()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."quantity" = 0 THEN
        RAISE NOTICE 'Mat hang da ban het';
    END IF;

    IF NEW."quantity" < 0 THEN
        RAISE EXCEPTION 'Số lượng sản phẩm không được âm';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_check_stock
BEFORE INSERT OR UPDATE ON "Product"
FOR EACH ROW
EXECUTE FUNCTION check_quatityofproduct();


-----------------trigger-OriginalPrice>= CurrentPrice-------------
CREATE OR REPLACE FUNCTION check_price()
RETURNS TRIGGER AS $$
BEGIN
        IF NEW."currentPrice" <= NEW."originalPrice" THEN
            RAISE EXCEPTION 'Gia san pham nhap vao khong hop le';
        END IF;

        RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE TRIGGER trigger_checkprice
BEFORE INSERT OR UPDATE ON "Product"
FOR EACH ROW
EXECUTE FUNCTION check_price();


