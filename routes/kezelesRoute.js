import pool from '../utils/db.js';
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
    let params =[];
    let szurok = [];

    const {tol, ig, faj} = req.query;

    if(tol || ig){
        params.push(tol, ig);
        szurok.push(`kezelesek.datum BETWEEN ? AND ?`);
    }

    if(faj){
        params.push(faj);
        szurok.push(`allatok.faj = ?`);
    }

    let sql = `SELECT kezelesek.id, kezelesek.datum, allatok.nev, allatok.nev, gazdak.nev, kezelesek.leiras, kezelesek.dij FROM kezelesek LEFT JOIN allatok ON kezelesek.allat_id = allatok.id JOIN gazdak ON gazdak.id = allatok.gazda_id`

    if (szurok.length > 0) {
        sql += ` WHERE ${szurok.join(' AND ')}`;
    }

    sql += ` ORDER BY kezelesek.datum`;

    try {   
        const [results] = await pool.query(sql, params);
        res.json({ kezelesek: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatbázis lekérdezése során' });
    }

});

router.post('/', async (req, res) => {
    const {allat_id, leiras, dij, datum} = req.body;

    if(!allat_id || !leiras || !dij || !datum){
        res.status(400).send("Hiba: Hiányzó értékek!");
    }

    let sql = `INSERT INTO kezelesek (allat_id, leiras, dij, datum) VALUES(?, ?, ?, ?)`;
    let eredmeny = await pool.query(sql, [allat_id, leiras, dij, datum]);

    return res.status(201).json(eredmeny);
})

export default router;