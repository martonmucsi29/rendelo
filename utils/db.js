import 'dotenv/config';
import mysql from 'mysql2/promise';

let dbConfig = {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'rendelo',
    connectionLimit: 10,
};

const pool = mysql.createPool(dbConfig);


try {
    await pool.query('SELECT 1');
    console.log('Sikeres adatbázis kapcsolat!');
} catch (error) {
    console.error('Az adatbázis nem érhető el:', error.code ?? error.message);
}

export default pool;