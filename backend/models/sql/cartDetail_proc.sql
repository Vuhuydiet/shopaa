-----------------check product in cart----------
CREATE OR REPLACE PROCEDURE sp_add_product_to_cart(
    IN p_userId INT,
    IN p_productId INT
)
LANGUAGE plpgsql AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "CartDetail"
        WHERE "userId" = p_userId
        AND "productId" = p_productId
    ) THEN
        RAISE NOTICE 'Product % is already in the cart for user %', p_productId, p_userId;
    ELSE

        INSERT INTO "CartDetail" ("userId", "productId", "createdAt")
        VALUES (p_userId, p_productId, CURRENT_TIMESTAMP);
        RAISE NOTICE 'Product % has been added to the cart for user %', p_productId, p_userId;
    END IF;
END;
$$;



--DO $$ 
--BEGIN

  --  CALL sp_add_product_to_cart(4, 2);  
--END $$;



-------------------------delete product
CREATE OR REPLACE PROCEDURE sp_remove_product_from_cart(
    IN p_userId INT,
    IN p_productId INT
)
LANGUAGE plpgsql AS $$
BEGIN
    DELETE FROM "CartDetail"
    WHERE "userId" = p_userId
    AND "productId" = p_productId;
END;
$$;


--CALL sp_remove_product_from_cart(4,2);


----------------------------get all product in cart for user
CREATE OR REPLACE FUNCTION fn_get_all_products_in_cart(p_userId INT)
RETURNS TABLE (
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
    FROM "CartDetail" c
    JOIN "Product" p ON c."productId" = p."productId"
    WHERE c."userId" = p_userId;
END;
$$;



--SELECT * FROM fn_get_all_products_in_cart(4);  

