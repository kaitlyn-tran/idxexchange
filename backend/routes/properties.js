const express = require('express');
const router = express.Router();
const pool = require('../config/db'); 

router.get('/', async (req, res) => {
    try {
        let { city, zipcode, minPrice, maxPrice, beds, baths, limit, offset } = req.query;

       if (limit == undefined) {
            limit = 20; 
        } else {
            const parsedLimit = Number(limit);
            if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
                return res.status(400).json({ 
                    error: "Invalid limit. Limit must be a whole number between 1 and 100." 
                });
            }
            limit = parsedLimit;
        }

        if (offset == undefined) {
            offset = 0; 
        } else {
            const parsedOffset = Number(offset);

            if (!Number.isInteger(parsedOffset) || parsedOffset < 0) {
                return res.status(400).json({ 
                    error: "Invalid offset. Offset must be a non-negative whole number." 
                });
            }
            offset = parsedOffset;
        }

        if (minPrice && (isNaN(Number(minPrice)) || Number(minPrice) < 0)) {
            return res.status(400).json({ error: "minPrice must be a valid positive number" });
        }
        if (maxPrice && (isNaN(Number(maxPrice)) || Number(maxPrice) < 0)) {
            return res.status(400).json({ error: "maxPrice must be a valid positive number" });
        }
        if (beds && (isNaN(Number(beds)) || Number(beds) < 0)) {
            return res.status(400).json({ error: "beds must be a valid positive number" });
        }
        if (baths && (isNaN(Number(baths)) || Number(baths) < 0)) {
            return res.status(400).json({ error: "baths must be a valid positive number" });
        }

        const conditions = [];
        const values = [];

        if (city) {
            conditions.push("LOWER(TRIM(L_City)) = LOWER(TRIM(?))");
            values.push(city);
        }
        if (zipcode) {
            conditions.push("L_Zip = ?");
            values.push(zipcode);
        }
        if (minPrice) {
            conditions.push("L_SystemPrice >= ?");
            values.push(Number(minPrice));
        }
        if (maxPrice) {
            conditions.push("L_SystemPrice <= ?");
            values.push(Number(maxPrice));
        }
        if (beds) {
            conditions.push("L_Keyword2 = ?");
            values.push(Number(beds));
        }
        if (baths) {
            conditions.push("LM_Dec_3 >= ?"); 
            values.push(Number(baths));
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        
        const countQuery = `SELECT COUNT(*) as total FROM rets_property ${whereClause}`;
        const [countResult] = await pool.query(countQuery, values);
        const total = countResult[0].total;

        const resultsQuery = `SELECT * FROM rets_property ${whereClause} ORDER BY L_ListingID LIMIT ? OFFSET ? `;
        const [results] = await pool.query(resultsQuery, [...values, limit, offset]);

        return res.json({
            total,
            limit,
            offset,
            results
        });

    } catch (error) {
        console.error("Database query error:", error);
        return res.status(500).json({ error: "Internal server error occurred." });
    }
});

const isValidListingId = (id) => {
    const parsed = Number(id);
    return Number.isInteger(parsed) && parsed > 0;
};

//openhouses
router.get('/:id/openhouses', async (req, res, next) => {
  const { id } = req.params;

  if (!isValidListingId(id)) {
    return res.status(400).json({ error: 'Invalid or malformed property ID format.' });
  }

  try {
    const [propertyCheck] = await pool.query(
      'SELECT L_ListingID FROM rets_property WHERE L_ListingID = ?', 
      [id]
    );

    if (propertyCheck.length === 0) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    const [openHouses] = await pool.query(
      `SELECT OpenHouseDate, OH_StartTime, OH_EndTime, all_data 
       FROM rets_openhouse 
       WHERE L_ListingID = ? 
       ORDER BY OpenHouseDate ASC, OH_StartTime ASC`,
      [id]
    );

    return res.json(openHouses);

  } catch (error) {
    next(error); 
  }
});

//id
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  if (!isValidListingId(id)) {
    return res.status(400).json({ error: 'Invalid or malformed property ID format.' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT L_ListingID, L_Address, L_City, L_State, L_Zip, 
              L_SystemPrice, L_Keyword2, LM_Dec_3, LM_Int2_3, 
              L_Photos, LMD_MP_Latitude, LMD_MP_Longitude, 
              L_Remarks, YearBuilt, LotSizeAcres 
       FROM rets_property 
       WHERE L_ListingID = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Property not found"});
    }

    const property = rows[0];

    return res.json(property);

  } catch (error) {
    next(error);
  }
});

module.exports = router;
