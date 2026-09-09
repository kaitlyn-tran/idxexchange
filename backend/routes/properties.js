const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const SORT_FIELDS = {
  price: 'L_SystemPrice',
  date: 'OnMarketDate',
  sqft: 'LM_Int2_3',
  beds: 'L_Keyword2'
};

router.get('/', async (req, res) => {
  try {
    let {
      city,
      zipcode,
      minPrice,
      maxPrice,
      beds,
      baths,
      limit,
      offset,
      sortBy,
      sortOrder
    } = req.query;

    // Default limit
    if (limit == undefined) {
      limit = 20;
    } else {
      const parsedLimit = Number(limit);

      if (
        !Number.isInteger(parsedLimit) ||
        parsedLimit < 1 ||
        parsedLimit > 100
      ) {
        return res.status(400).json({
          error: 'Invalid limit. Limit must be a whole number between 1 and 100.'
        });
      }

      limit = parsedLimit;
    }

    // Default offset
    if (offset == undefined) {
      offset = 0;
    } else {
      const parsedOffset = Number(offset);

      if (
        !Number.isInteger(parsedOffset) ||
        parsedOffset < 0
      ) {
        return res.status(400).json({
          error: 'Invalid offset. Offset must be a non-negative whole number.'
        });
      }

      offset = parsedOffset;
    }

    // Validate sortBy
    if (
      sortBy != undefined &&
      SORT_FIELDS[sortBy] == undefined
    ) {
      return res.status(400).json({
        error: 'Invalid sortBy. Valid values are price, date, sqft, and beds.'
      });
    }

    // Validate sortOrder
    if (
      sortOrder != undefined &&
      sortOrder != 'asc' &&
      sortOrder != 'desc'
    ) {
      return res.status(400).json({
        error: 'Invalid sortOrder. Valid values are asc and desc.'
      });
    }

    // Default sorting
    if (sortBy == undefined) {
      sortBy = 'price';
    }

    if (sortOrder == undefined) {
      sortOrder = 'asc';
    }

    const sortColumn = SORT_FIELDS[sortBy];

    // Build filter conditions
    const conditions = [];
    const values = [];

    // Validate minPrice
    if (
      minPrice &&
      (isNaN(Number(minPrice)) || Number(minPrice) < 0)
    ) {
      return res.status(400).json({
        error: 'minPrice must be a valid positive number'
      });
    }

    // Validate maxPrice
    if (
      maxPrice &&
      (isNaN(Number(maxPrice)) || Number(maxPrice) < 0)
    ) {
      return res.status(400).json({
        error: 'maxPrice must be a valid positive number'
      });
    }

    // Validate beds
    if (
      beds &&
      (isNaN(Number(beds)) || Number(beds) < 0)
    ) {
      return res.status(400).json({
        error: 'beds must be a valid positive number'
      });
    }

    // Validate baths
    if (
      baths &&
      (isNaN(Number(baths)) || Number(baths) < 0)
    ) {
      return res.status(400).json({
        error: 'baths must be a valid positive number'
      });
    }

    // City filter
    if (city) {
      conditions.push(
        'LOWER(TRIM(L_City)) = LOWER(TRIM(?))'
      );
      values.push(city);
    }

    // Zipcode filter
    if (zipcode) {
      conditions.push('L_Zip = ?');
      values.push(zipcode);
    }

    // Minimum price filter
    if (minPrice) {
      conditions.push('L_SystemPrice >= ?');
      values.push(Number(minPrice));
    }

    // Maximum price filter
    if (maxPrice) {
      conditions.push('L_SystemPrice <= ?');
      values.push(Number(maxPrice));
    }

    // Beds filter
    if (beds) {
      conditions.push('L_Keyword2 = ?');
      values.push(Number(beds));
    }

    // Baths filter
    if (baths) {
      conditions.push('LM_Dec_3 >= ?');
      values.push(Number(baths));
    }

    // Build WHERE clause
    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

    // Count matching properties
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM rets_property
      ${whereClause}
    `;

    const [countResult] = await pool.query(
      countQuery,
      values
    );

    const total = countResult[0].total;

    // Get properties
    const resultsQuery = `
      SELECT *
      FROM rets_property
      ${whereClause}
      ORDER BY ${sortColumn} ${sortOrder.toUpperCase()},
               L_ListingID ASC
      LIMIT ? OFFSET ?
    `;

    const [results] = await pool.query(
      resultsQuery,
      [...values, limit, offset]
    );

    return res.json({
      total,
      limit,
      offset,
      sortBy,
      sortOrder,
      results
    });

  } catch (error) {
    console.error('Database query error:', error);

    return res.status(500).json({
      error: 'Internal server error occurred.'
    });
  }
});


// Check whether a listing ID is valid
const isValidListingId = (id) => {
  const parsed = Number(id);

  return Number.isInteger(parsed) && parsed > 0;
};


// Open houses for a property
router.get('/:id/openhouses', async (req, res, next) => {
  const { id } = req.params;

  if (!isValidListingId(id)) {
    return res.status(400).json({
      error: 'Invalid or malformed property ID format.'
    });
  }

  try {
    // Make sure property exists
    const [propertyCheck] = await pool.query(
      'SELECT L_ListingID FROM rets_property WHERE L_ListingID = ?',
      [id]
    );

    if (propertyCheck.length == 0) {
      return res.status(404).json({
        error: 'Property not found.'
      });
    }

    // Get open houses
    const [openHouses] = await pool.query(
      `SELECT OpenHouseDate,
              OH_StartTime,
              OH_EndTime,
              all_data
       FROM rets_openhouse
       WHERE L_ListingID = ?
       ORDER BY OpenHouseDate ASC,
                OH_StartTime ASC`,
      [id]
    );

    return res.json(openHouses);

  } catch (error) {
    next(error);
  }
});


// Get a single property by ID
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  if (!isValidListingId(id)) {
    return res.status(400).json({
      error: 'Invalid or malformed property ID format.'
    });
  }

  try {
    const [rows] = await pool.query(
      `SELECT L_ListingID,
              L_Address,
              L_City,
              L_State,
              L_Zip,
              L_SystemPrice,
              L_Keyword2,
              LM_Dec_3,
              LM_Int2_3,
              L_Photos,
              LMD_MP_Latitude,
              LMD_MP_Longitude,
              L_Remarks,
              YearBuilt,
              LotSizeAcres
       FROM rets_property
       WHERE L_ListingID = ?`,
      [id]
    );

    if (rows.length == 0) {
      return res.status(404).json({
        error: 'Property not found'
      });
    }

    const property = rows[0];

    return res.json(property);

  } catch (error) {
    next(error);
  }
});


module.exports = router;