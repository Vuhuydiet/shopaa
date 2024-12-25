-- Active: 1734185756352@@127.0.0.1@5432@shopaa_db_xcjo@public
CREATE OR REPLACE FUNCTION fn_inc_review_count()
RETURNS TRIGGER AS $$
DECLARE 
  row_record RECORD;
BEGIN
  IF NEW."rating" IS NULL THEN
      RAISE EXCEPTION 'Rating cannot be null';
  END IF;

  IF NEW."rating" < 1 OR NEW."rating" > 5 THEN
      RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;

  SELECT od."productId", o."shopId"
  INTO row_record
  FROM "OrderDetail" od
  JOIN "Order" o ON o."orderId" = od."orderId"
  WHERE od."orderId" = NEW."orderId"
  AND od."orderDetailNumber" = NEW."orderDetailNumber";

  UPDATE "Product"
  SET "numReviews" = "numReviews" + 1,
      "totalRating" = "totalRating" + NEW."rating"
  WHERE "productId" = row_record."productId";

  UPDATE "Shop"
  SET "numReviews" = "numReviews" + 1,
      "totalRating" = "totalRating" + NEW."rating"
  WHERE "shopOwnerId" = row_record."shopId";

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_insert_review
AFTER INSERT ON "Review"
FOR EACH ROW
EXECUTE FUNCTION fn_inc_review_count();




CREATE OR REPLACE FUNCTION fn_dec_review_count()
RETURNS TRIGGER AS $$
DECLARE 
  row_record RECORD;
BEGIN

  SELECT od."productId", o."shopId"
  INTO row_record
  FROM "OrderDetail" od
  JOIN "Order" o ON o."orderId" = od."orderId"
  WHERE od."orderId" = OLD."orderId"
  AND od."orderDetailNumber" = OLD."orderDetailNumber";

  UPDATE "Product"
  SET "numReviews" = "numReviews" - 1,
      "totalRating" = "totalRating" - OLD."rating"
  WHERE "productId" = row_record."productId";

  UPDATE "Shop"
  SET "numReviews" = "numReviews" - 1,
      "totalRating" = "totalRating" - OLD."rating"
  WHERE "shopOwnerId" = row_record."shopId";

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_delete_review
AFTER DELETE ON "Review"
FOR EACH ROW
EXECUTE FUNCTION fn_dec_review_count();
