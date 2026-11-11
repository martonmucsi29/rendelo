import 'dotenv/config';
import express from 'express';
import gazdiroute from './routes/gazdaRoute.js';
import allatroute from './routes/allatokRoute.js';
import kezelesroute from './routes/kezelesRoute.js';
import statroute from './routes/statisztikaRoute.js';

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT ?? 3000);
let vegpontok = [
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/gazdak`, leiras: 'Gazdák' },
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/allatok`, leiras: 'Állatok' },
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/kezelesek`, leiras: 'Kezelesek' },
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/statisztika`, leiras: 'Statisztika' }
]

app.use('/gazdak', gazdiroute);
app.use('/allatok', allatroute);
app.use('/kezelesek', kezelesroute);
app.use('/statisztika', statroute);
app.use('/', (req, res) => {
    res.status(404).json(vegpontok);
});

app.use((err, res, req) => {
    console.error(err);
    res.status(500).json({ hiba: 'Belső szerverhiba' });
});

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));