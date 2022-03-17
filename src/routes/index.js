import express from 'express';
import Address from '../controllers/addressController';
import Demand from '../controllers/demandController';
import Pizzas from '../controllers/pizzasController';
import Users from '../controllers/usersController';

const router = express.Router();

router.get('/', (_, res)=> {
  res.status(200).send({
    server: 'Online!'
  })
})

Pizzas(router);
Demand(router);
Users(router);
Address(router);

export default router;
