import pool from '../utils/db.js';
import { Router } from 'express';

const router = Router();

router.get('/fajok', async (req, res) => {
    let sql = `SELECT allatok.faj, COUNT(allatok.id) AS allatDB, COUNT(kezelesek.allat_id) AS kezelesDb, SUM(kezelesek.dij) AS bevetel FROM allatok LEFT JOIN gazdak ON allatok.gazda_id = gazdak.id LEFT JOIN kezelesek ON kezelesek.allat_id = allatok.id GROUP BY allatok.faj`;
    const results = await pool.query(sql);
    res.json(results);
});

router.get('/havi', async (req, res) => {
    let sql = `SELECT DATE_FORMAT(kezelesek.datum, '%Y-%m') AS honap, COUNT(MONTH(kezelesek.datum)) AS kezelesDb, SUM(kezelesek.dij) AS bevetel FROM allatok JOIN gazdak ON allatok.gazda_id = gazdak.id JOIN kezelesek ON kezelesek.allat_id = allatok.id GROUP BY DATE_FORMAT(kezelesek.datum, '%Y-%m')`;
    const results = await pool.query(sql);
    res.json(results);
});

router.get('/gazdak', async (req, res) => {
    let sql = `SELECT gazdak.nev AS gazda, COUNT(DISTINCT allatok.id) AS allatDB, SUM(kezelesek.dij) AS osszKoltes FROM allatok LEFT JOIN gazdak ON allatok.gazda_id = gazdak.id LEFT JOIN kezelesek ON kezelesek.allat_id = allatok.id GROUP BY gazdak.nev ORDER BY SUM(kezelesek.dij) DESC`;
    const results = await pool.query(sql);
    res.json(results);
})


export default router;