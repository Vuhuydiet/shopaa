-------------------------------------add voucher----
CREATE OR REPLACE PROCEDURE sp_add_voucher
(
    IN p_voucherCode TEXT,
    IN p_desciptione TEXT,
    IN p_discountValue INT,
    IN p_minimumOrderValue INT,
    IN p_startDate DATE,
    IN p_expiryDate DATE
)
LANGUAGE plpgsql AS $$
BEGIN
        INSERT INTO "Voucher"("voucherCode","description","discountValue","minimumOrderValue","startDate","expiryDate")
        VALUES
                (p_voucherCode,p_desciptione,p_discountValue,p_minimumOrderValue,p_startDate,p_expiryDate);
END;
$$;

--CALL sp_add_voucher('DISCOUNT10','Giảm 10%',10000,100000,'2024-11-01','2024-12-01');


-----------------------------update voucher

CREATE OR REPLACE PROCEDURE sp_update_voucher_(
    IN p_voucherId INT,
    IN p_description TEXT,
    IN p_discountValue INT,
    IN p_minimumOrderValue INT,
    IN p_startDate DATE,
    IN p_expiryDate DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE "Voucher"
    SET "description" = p_description,
        "discountValue" = p_discountValue,
        "minimumOrderValue" = p_minimumOrderValue,
        "startDate" = p_startDate,
        "expiryDate" = p_expiryDate
    WHERE "voucherId" = p_voucherId;
END;
$$;

--CALL sp_update_voucher_proc(6,'Giảm 10% cho mùa hè 2024',12000,120000,'2024-11-01','2024-12-01');


------------------------------------delete voucher
CREATE OR REPLACE PROCEDURE sp_delete_voucher(
    IN p_voucherId INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM "Voucher"
    WHERE "voucherId" = p_voucherId;
END;
$$;


--CALL sp_delete_voucher(6);


--------------mark_voucher_used--
CREATE OR REPLACE PROCEDURE sp_mark_voucher_used(
    IN p_userId INT,
    IN p_voucherId INT
)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE "UsableVoucher"
    SET "isUsed"=TRUE
    WHERE "userId"=p_userId and "voucherId"=p_voucherId;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Don not find voucher';
    END IF;
END;
$$;


--CALL sp_mark_voucher_used(2,3);



----------------display valid voucher

CREATE OR REPLACE FUNCTION fn_get_valid_vouchers(p_userId INT)
RETURNS TABLE (
    "voucherId" INT,
    "voucherCode" TEXT,
    "description" TEXT,
    "discountValue" INT,
    "minimumOrderValue" INT,
    "startDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT v."voucherId", v."voucherCode", v."description", v."discountValue", 
           v."minimumOrderValue", v."startDate", v."expiryDate"
    FROM "Voucher" v
    JOIN "UsableVoucher" u ON v."voucherId" = u."voucherId"
    WHERE u."userId" = p_userId
      AND u."isUsed" = FALSE;
END;
$$;


--SELECT * FROM fn_get_valid_vouchers(1);

