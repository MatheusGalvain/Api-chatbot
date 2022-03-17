import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import dotenv from 'dotenv';

import router from './src/routes';

dotenv.config({ path: './configs/environment/.env' });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', router);

const port = process.env.PORT;

app.listen(port, () => console.log(`Servidor Rodando na porta ${port}`));
