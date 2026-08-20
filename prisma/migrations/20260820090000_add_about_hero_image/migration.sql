-- Dedicated background image for the About Us page's hero banner, separate
-- from the existing aboutTeaserImageUrl (homepage teaser photo).
ALTER TABLE "SiteSettings" ADD COLUMN "aboutHeroImageUrl" TEXT;
