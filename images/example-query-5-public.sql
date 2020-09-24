--
-- Example Query --
-- This query selects  a sample of bright galaxies
SELECT dr1.RA RA, dr1.DEC DEC, dr1.COADD_OBJECT_ID ID
FROM DR1_MAIN sample(0.01) dr1
WHERE
dr1.MAG_AUTO_G < 18 and
dr1.WAVG_SPREAD_MODEL_I + 3.0*dr1.WAVG_SPREADERR_MODEL_I > 0.005 and
dr1.WAVG_SPREAD_MODEL_I + 1.0*dr1.WAVG_SPREADERR_MODEL_I > 0.003 and
dr1.WAVG_SPREAD_MODEL_I - 1.0*dr1.WAVG_SPREADERR_MODEL_I > 0.001 and
dr1.WAVG_SPREAD_MODEL_I > -1 and
dr1.IMAFLAGS_ISO_G = 0 and
dr1.IMAFLAGS_ISO_R = 0 and
dr1.IMAFLAGS_ISO_I = 0 and
dr1.FLAGS_G < 4 and
dr1.FLAGS_R < 4 and
dr1.FLAGS_I < 4 and
dr1.NEPOCHS_G > 0 and
dr1.NEPOCHS_R > 0 and
dr1.NEPOCHS_I > 0
