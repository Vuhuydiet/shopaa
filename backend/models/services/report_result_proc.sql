--------------------------------------------------create----
CREATE OR REPLACE PROCEDURE sp_create_report_result(
    IN p_reportId INT,
    IN p_result TEXT,
    IN p_handlerId INT
)
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO "ReportResult" (
        "reportId", "result", "handlerId"
    ) VALUES (
        p_reportId, p_result, p_handlerId
    );
END;
$$;

-- CALL sp_create_report_result(1, 'Approved', 2);
-----------------------------get-----------
CREATE OR REPLACE FUNCTION fn_get_report_result_by_id(
    p_id INT
) RETURNS TABLE (
    "id" INT,
    "reportId" INT,
    "result" TEXT,
    "createdAt" TIMESTAMP,
    "handlerId" INT
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rr."id", rr."reportId", rr."result", rr."createdAt", rr."handlerId"
    FROM "ReportResult" rr
    WHERE rr."id" = p_id;
END;
$$;

-- SELECT * FROM fn_get_report_result_by_id(1);
-------------------------------------update---------
CREATE OR REPLACE PROCEDURE sp_update_report_result(
    IN p_id INT,
    IN p_result TEXT DEFAULT NULL,
    IN p_handlerId INT DEFAULT NULL
)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE "ReportResult"
    SET 
        "result" = COALESCE(p_result, "result"),
        "handlerId" = COALESCE(p_handlerId, "handlerId")
    WHERE "id" = p_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'ReportResult with ID % does not exist.', p_id;
    END IF;
END;
$$;

-- CALL sp_update_report_result(1, 'Updated result', 3);
-----------------------------delete--------------------
CREATE OR REPLACE PROCEDURE sp_delete_report_result(
    IN p_id INT
)
LANGUAGE plpgsql AS $$
BEGIN
    DELETE FROM "ReportResult"
    WHERE "id" = p_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'ReportResult with ID % does not exist.', p_id;
    END IF;
END;
$$;

-- CALL sp_delete_report_result(1);
