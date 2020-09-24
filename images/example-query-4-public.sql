--
-- Example Query --
-- This query creates a Helpix map of number of galaxies
-- and their mean magnitude on a resolution of NSIDE = 1024
-- using NEST Schema
SELECT count(dr1.MAG_AUTO_I) COUNT,avg(dr1.MAG_AUTO_I) AVERAGE,dr1.HPIX_1024
FROM DR1_MAIN dr1
where
dr1.WAVG_SPREAD_MODEL_I + 3.0*dr1.WAVG_SPREADERR_MODEL_I > 0.005 and
dr1.WAVG_SPREAD_MODEL_I + 1.0*dr1.WAVG_SPREADERR_MODEL_I > 0.003 and
dr1.WAVG_SPREAD_MODEL_I - 1.0*dr1.WAVG_SPREADERR_MODEL_I > 0.001 and
dr1.WAVG_SPREAD_MODEL_I > -1 and
dr1.IMAFLAGS_ISO_I = 0 and
dr1.MAG_AUTO_I < 23
group by dr1.HPIX_1024
