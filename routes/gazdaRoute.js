import pool from '../utils/db.js';
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
    let params = [];
    let szurok = [];

    const {varos} = req.query;

    if(varos){
        params.push(varos);
        szurok.push(`varos = ?`);
    }

    let sql = `SELECT gazdak.id, gazdak.nev, gazdak.varos, COUNT(allatok.id) AS allatDB FROM gazdak LEFT JOIN allatok ON allatok.gazda_id = gazdak.id LEFT JOIN kezelesek ON kezelesek.allat_id = allatok.id`;


    if (szurok.length > 0) {
        sql += ` WHERE ${szurok.join(' AND ')}`;
    }

    sql += ` GROUP BY gazdak.nev ORDER BY gazdak.nev`;

    try {   
        const [results] = await pool.query(sql, params);
        res.json({ gazdak: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatbázis lekérdezése során' });
    }
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;

    let sql = `SELECT gazdak.id, gazdak.nev, gazdak.varos, COUNT(allatok.id) AS allatDB FROM gazdak LEFT JOIN allatok ON allatok.gazda_id = gazdak.id LEFT JOIN kezelesek ON kezelesek.allat_id = allatok.id WHERE gazdak.id = ?`;
    let sql2 = `SELECT allatok.id, allatok.nev, allatok.faj, allatok.szuletes FROM allatok LEFT JOIN gazdak ON gazdak.id = allatok.gazda_id LEFT JOIN kezelesek ON kezelesek.allat_id = allatok.id WHERE allatok.gazda_id = ?`;
    
    try{
        const [results] = await pool.query(sql, id);
        const [subresults] = await pool.query(sql2, id);
        res.json({
            gazdak: results,
            allatok: subresults
        })
    }
    catch(error){
        console.error(error);
        res.status(500).json({hiba: 'Hiba történt az adatbázis lekérdezése során'});
    }


});


export default router;