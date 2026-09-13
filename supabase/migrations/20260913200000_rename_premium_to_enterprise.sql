-- Rename the third pricing tier from "Premium" to "Enterprise"
-- (landing page pricing cards + admin pricing list)
UPDATE public.pricing_tiers
SET name = 'Enterprise'
WHERE name ILIKE 'premium';

-- French variant, if present
UPDATE public.pricing_tiers
SET name = 'Entreprise'
WHERE name ILIKE 'premium' OR name ILIKE 'premium%';
