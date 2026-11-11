import pool from '../utils/db.js';
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
    let params = [];
    let szurok = [];

    const {faj} = req.query;

    if(faj){
        params.push(faj);
        szurok.push(`allatok.faj = ?`);
    }

    let sql = `SELECT allatok.id, allatok.nev, allatok.faj, allatok.szuletes, gazdak.nev AS gazda FROM allatok LEFT JOIN gazdak ON gazdak.id = allatok.gazda_id LEFT JOIN kezelesek ON kezelesek.allat_id = allatok.id`;

    if (szurok.length > 0) {
        sql += ` WHERE ${szurok.join(' AND ')}`;
    }

    sql += ` GROUP BY allatok.nev`;

    try {   
        const [results] = await pool.query(sql, params);
        res.json({ allatok: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatbázis lekérdezése során' });
    }
});

router.get('/kezelesek-nelkul', async (req, res) => {
    let sql = `SELECT allatok.id, allatok.nev, allatok.faj, gazdak.nev as gazda FROM allatok LEFT JOIN gazdak ON gazdak.id = allatok.gazda_id LEFT JOIN kezelesek ON kezelesek.allat_id = allatok.id WHERE kezelesek.allat_id IS NULL`;
    const results = await pool.query(sql);
    res.json(results);
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;

    let sql = `SELECT allatok.id, allatok.nev, allatok.faj, allatok.szuletes, gazdak.nev as gazda FROM allatok LEFT JOIN gazdak ON gazdak.id = allatok.gazda_id LEFT JOIN kezelesek ON kezelesek.allat_id = allatok.id WHERE allatok.id = ?`;
    let sql2 = `SELECT kezelesek.id, kezelesek.datum, kezelesek.leiras, kezelesek.dij FROM kezelesek LEFT JOIN allatok ON kezelesek.allat_id = allatok.id WHERE allat_id = ?`;
    let sql3 = `SELECT SUM(dij) AS osszesDij FROM kezelesek LEFT JOIN allatok ON kezelesek.allat_id = allatok.id WHERE allat_id = ?`;

    sql += ` GROUP BY allatok.nev`;
    sql2 += ` ORDER BY kezelesek.datum`

    try{
        const [results] = await pool.query(sql, id);
        const [subresults] = await pool.query(sql2, id);
        const [feeresults] = await pool.query(sql3, id);
        res.json({
            allat: results,
            kezelesek: subresults,
            osszesDij: feeresults
        })
    }
    catch(error){
        console.error(error);
        res.status(500).json({hiba: 'Hiba történt az adatbázis lekérdezése során'});
    }
});

export default router;