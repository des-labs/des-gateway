--
-- Example Query --
-- This query creates a Helpix map of number of galaxies
-- and their mean magnitude on a resolution of NSIDE = 1024
-- using NEST Schema
SELECT count(dr2.MAG_AUTO_I) COUNT,avg(dr2.MAG_AUTO_I) AVERAGE,dr2.HPIX_1024
FROM DR2_MAIN dr2
WHERE
  dr2.WAVG_SPREAD_MODEL_I + 3.0*dr2.WAVG_SPREADERR_MODEL_I > 0.005 and
  dr2.WAVG_SPREAD_MODEL_I + 1.0*dr2.WAVG_SPREADERR_MODEL_I > 0.003 and
  dr2.WAVG_SPREAD_MODEL_I - 1.0*dr2.WAVG_SPREADERR_MODEL_I > 0.001 and
  dr2.WAVG_SPREAD_MODEL_I > -1 and
  dr2.IMAFLAGS_ISO_I = 0 and
  dr2.MAG_AUTO_I < 23
GROUP BY dr2.HPIX_1024
