-- Free-text fallback for testimonials whose programme isn't (or isn't yet)
-- a real Programme record.
ALTER TABLE "Testimonial" ADD COLUMN "programmeName" TEXT;
