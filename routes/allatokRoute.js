import pool from '../utils/db.js';
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
    let params = [];
    let szurok = [];

    const {faj} = req.query;

    if(faj){
        params.push(faj);
        szurok.push(`WHERE allatok.faj = ?`);
    }

    let sql = `SELECT allatok.id, allatok.nev, allatok.faj, allatok.szuletes, gazdak.nev AS gazda FROM allatok JOIN gazdak ON gazdak.id = allatok.gazda_id JOIN kezelesek ON kezelesek.allat_id = allatok.id`;

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
})

export default router;