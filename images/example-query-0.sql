--
-- Example Query --
-- This query selects 0.001% of the data
SELECT RA, DEC, MAG_AUTO_G, TILENAME from Y3_GOLD_2_2 sample(0.001) LIMIT 5
