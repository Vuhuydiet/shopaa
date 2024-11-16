--------------------------add new shop
CREATE OR REPLACE PROCEDURE sp_add_shop(
    IN p_shopOwnerId INT,
    IN p_shopName TEXT,
    IN p_shopDescription TEXT,
    IN p_address TEXT
)
LANGUAGE plpgsql AS $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM "Shop" 
        WHERE "shopOwnerId" = p_shopOwnerId
    ) THEN
        RAISE EXCEPTION 'Shop already exists for owner ID %', p_shopOwnerId;
    END IF;

    INSERT INTO "Shop" ("shopOwnerId", "shopName", "shopDescription", "address", "bankingBalance")
    VALUES (p_shopOwnerId, p_shopName, p_shopDescription, p_address, 0);
END;
$$;



--CALL sp_add_shop(3, 'Shop ABC', 'Description of Shop ABC', '123 Main Street');


------------------------update shop----
CREATE OR REPLACE PROCEDURE sp_update_infor_shop
(
    IN p_shopOwnerId INT,
    IN p_shopName TEXT,
    IN p_shopDescription TEXT,
    IN p_address TEXT
)
LANGUAGE plpgsql AS $$
BEGIN 
    IF NOT EXISTS(
        SELECT 1
        FROM "Shop"
        WHERE "shopOwnerId"=p_shopOwnerId
    )
    THEN 
        RAISE EXCEPTION 'Shop not found for owner ID %', p_shopOwnerId;
    END IF;

    UPDATE "Shop"
    SET "shopName" = p_shopName,
        "shopDescription" = p_shopDescription,
        "address" = p_address
    WHERE "shopOwnerId" = p_shopOwnerId;
END;
$$;


CALL sp_update_infor_shop(1, 'Chien than bao ve dat nuoc', 'Chien than review so 1 VN', '456 Thien Long Vuong');


----------------------------delete shop
CREATE OR REPLACE PROCEDURE sp_delete_shop
(
    IN p_shopOwnerId INT
)
LANGUAGE plpgsql AS $$
BEGIN
    IF NOT EXISTS
    (
        SELECT 1
        FROM "Shop"
        WHERE "shopOwnerId"=p_shopOwnerId
    )
    THEN
        RAISE EXCEPTION 'Shop is not found for owner ID %',p_shopOwnerId;
    END IF;


    DELETE FROM "Shop"
    WHERE "shopOwnerId"=p_shopOwnerId;
     
END;
$$;


--CALL sp_delete_shop(3);


-----------------------------------FIND SHOP BY NAME
CREATE OR REPLACE FUNCTION fn_find_shop(
    p_shopName TEXT
)
RETURNS TABLE (
    "shopOwnerId" INT,
    "shopName" TEXT,
    "shopDescription" TEXT,
    "address" TEXT
)
LANGUAGE plpgsql AS $$
BEGIN
    -- Kiểm tra nếu không tìm thấy bất kỳ shop nào
    IF NOT EXISTS (
        SELECT 1
        FROM "Shop"
        WHERE "Shop"."shopName" ILIKE '%' || p_shopName || '%'
    ) THEN
        RAISE EXCEPTION 'No shops found for the name: %', p_shopName;
    END IF;

    -- Trả về danh sách shop phù hợp
    RETURN QUERY
    SELECT "Shop"."shopOwnerId", 
           "Shop"."shopName", 
           "Shop"."shopDescription", 
           "Shop"."address" 
    FROM "Shop"
    WHERE "Shop"."shopName" ILIKE '%' || p_shopName || '%';
END;
$$;



--SELECT * FROM fn_find_shop('chien than');

------------------------display list of product in shop

CREATE OR REPLACE FUNCTION fn_display_product_in_shop(
    IN p_shopName TEXT
)
RETURNS TABLE(
    "productName" TEXT,
    "currentPrice" INT,
    "originalPrice" INT,
    "quantity" INT,
    "productDescription" TEXT,
    "numSoldProduct" INT
)
LANGUAGE plpgsql AS $$
BEGIN 
        RETURN QUERY
        SELECT p."productName",
               p."currentPrice",
               p."originalPrice",
               p."quantity",
               p."productDescription",
               p."numSoldProduct"
        FROM "Product" p JOIN "Shop" s ON s."shopOwnerId"=p."sellerId"
        WHERE s."shopName"=p_shopName;
END;
$$;



--SELECT * FROM fn_display_product_in_shop('hihi');



