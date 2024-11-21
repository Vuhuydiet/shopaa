--------------------------create report
CREATE OR REPLACE PROCEDURE sp_create_report(
    IN p_reporterId INT,
    IN p_type TEXT,
    IN p_shopCategory TEXT DEFAULT NULL,
    IN p_productCategory TEXT DEFAULT NULL,
    IN p_shopId INT DEFAULT NULL,
    IN p_productId INT DEFAULT NULL,
    IN p_description TEXT DEFAULT NULL
)
LANGUAGE plpgsql AS $$
BEGIN
    IF p_type NOT IN ('shop', 'product') THEN
        RAISE EXCEPTION 'Invalid report type "%". Expected "shop" or "product".', p_type;
    END IF;

   
    INSERT INTO "Report" (
        "reporterId", "type", "shopCategory", "productCategory", "shopId", "productId", "description"
    ) VALUES (
        p_reporterId, p_type, p_shopCategory, p_productCategory, p_shopId, p_productId, p_description
    );
END;
$$;



--CALL sp_create_report(1, 'shop', 'post banned product', NULL, 1, NULL, 'This shop has banned products.');

--CALL sp_create_report(2, 'product', NULL, 'fake product', NULL, 3, 'This product is fake.');




----------------------------read report
CREATE OR REPLACE FUNCTION fn_get_report_by_id(
    p_reportId INT
) RETURNS TABLE (
    "reportId" INT,
    "reporterId" INT,
    "type" TEXT,
    "shopCategory" TEXT,
    "productCategory" TEXT,
    "shopId" INT,
    "productId" INT,
    "description" TEXT,
    "createdAt" TIMESTAMP
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r."reportId", r."reporterId", r."type", r."shopCategory", r."productCategory", 
        r."shopId", r."productId", r."description", r."createdAt"
    FROM "Report" r
    WHERE r."reportId" = p_reportId;
END;
$$;



--SELECT * FROM fn_get_report_by_id(16); 



----------delete report

CREATE OR REPLACE PROCEDURE sp_delete_report(
    IN p_reportId INT
)
LANGUAGE plpgsql AS $$
BEGIN
    DELETE FROM "Report"
    WHERE "reportId" = p_reportId;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Report with ID % does not exist.', p_reportId;
    END IF;
END;
$$;


--CALL sp_delete_report(17); 


---------------------update report
CREATE OR REPLACE PROCEDURE sp_update_report(
    IN p_reportId INT,
    IN p_description TEXT DEFAULT NULL,
    IN p_shopCategory TEXT DEFAULT NULL,
    IN p_productCategory TEXT DEFAULT NULL,
    IN p_shopId INT DEFAULT NULL,
    IN p_productId INT DEFAULT NULL
)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE "Report"
    SET 
        "description" = COALESCE(p_description, "description"),
        "shopCategory" = COALESCE(p_shopCategory, "shopCategory"),
        "productCategory" = COALESCE(p_productCategory, "productCategory"),
        "shopId" = COALESCE(p_shopId, "shopId"),
        "productId" = COALESCE(p_productId, "productId")
    WHERE "reportId" = p_reportId;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Report with ID % does not exist.', p_reportId;
    END IF;
END;
$$;


CALL sp_update_report( , 'Updated description', 'fake product', NULL, 2, NULL);
