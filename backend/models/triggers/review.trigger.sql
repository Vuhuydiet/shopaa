-- Active: 1734185756352@@127.0.0.1@5432@shopaa_db_xcjo@public
CREATE OR REPLACE FUNCTION fn_inc_review_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."rating" IS NULL THEN
      RAISE EXCEPTION 'Rating cannot be null';
  END IF;

  IF NEW."rating" < 1 OR NEW."rating" > 5 THEN
      RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;

  UPDATE "Product"
  SET "numReviews" = "numReviews" + 1,
      "totalRating" = "totalRating" + NEW."rating"
  WHERE "productId" = NEW."productId";

  UPDATE "Shop"
  SET "numReviews" = "numReviews" + 1,
      "totalRating" = "totalRating" + NEW."rating"
  WHERE "shopOwnerId" = (
    SELECT "shopId"
    FROM "Order"
    WHERE "orderId" = NEW."orderId"
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_insert_review
AFTER INSERT ON "Review"
FOR EACH ROW
EXECUTE FUNCTION fn_inc_review_count();




CREATE OR REPLACE FUNCTION fn_dec_review_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "Product"
  SET "numReviews" = "numReviews" - 1,
      "totalRating" = "totalRating" - OLD."rating"
  WHERE "productId" = OLD."productId";

  UPDATE "Shop"
  SET "numReviews" = "numReviews" - 1,
      "totalRating" = "totalRating" - OLD."rating"
  WHERE "shopId" = (
    SELECT p."sellerId"
    FROM "OrderDetail" od
    JOIN "Product" p ON p."productId" = od."productId"
    WHERE od."orderId" = NEW."orderId"
    AND od."orderDetailNumber" = OLD."orderDetailNumber"
  );

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tg_delete_review
AFTER DELETE ON "Review"
FOR EACH ROW
EXECUTE FUNCTION fn_dec_review_count();
