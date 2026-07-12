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
            // Reject if it's not a valid integer, less than 1, or greater than 100
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

module.exports = router;