--------------------------------expiredate> startDate
CREATE OR REPLACE FUNCTION fn_check_date()
RETURNS TRIGGER AS $$
BEGIN
    IF new."startDate" > new."expiryDate"
    THEN
        RAISE EXCEPTION 'Invalid Date. StartDate must be smaller or equal than ExpriryDate';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_check_date_expire
BEFORE INSERT OR UPDATE ON "Voucher"
FOR EACH ROW
EXECUTE FUNCTION fn_check_date();



----------------------DiscountValue<=MinimumOrderValue------
CREATE OR REPLACE FUNCTION fn_check_discount_value()
RETURNS TRIGGER AS $$
BEGIN
    IF new."discountValue" > new."minimumOrderValue"
    THEN
        RAISE EXCEPTION 'Invalid Voucher. DiscountValue must be smaller or equal than MinimumOrderValue';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_check_discount_value
BEFORE INSERT OR UPDATE ON "Voucher"
FOR EACH ROW
EXECUTE FUNCTION fn_check_discount_value();



---------------------------------------assign voucher to use

CREATE OR REPLACE FUNCTION fn_assign_new_voucher_to_all_user()
RETURNS TRIGGER AS $$
BEGIN
        INSERT INTO "UsableVoucher" ("userId","voucherId","isUsed")
        SELECT u."userId", NEW."voucherId",FALSE
        FROM "UserProfile" u;

        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tg_assgin_voucher
AFTER INSERT ON "Voucher"
FOR EACH ROW
EXECUTE FUNCTION fn_assign_new_voucher_to_all_user();