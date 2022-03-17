import PizzaService from "../services/pizzasService";

const Pizzas = (router) => {
    const mainUrl = 'pizzas';

    // METODO POST, INSERE PRODUTOS
    router.post(`/${mainUrl}/`, async (req,res) => {
        const {body} = req;     
        const {resp, status} = await PizzaService.createPizzas(body.name, body.value);
        res.status(status).send(resp);
    });

    // MÉTODO GET, RETORNA PRODUTOS
    router.get(`/${mainUrl}/`, async (_, res) =>{
        const {resp, status} = await PizzaService.getAllPizzas();
        res.status(status).send(resp);
    });

    // MÉTODO PUT, ATUALIZA PRODUTOS
      router.put(`/${mainUrl}/`, async (req, res) =>{
        const {body} = req; 
        const {resp, status} = await PizzaService.updatePizzas(body);
        res.status(status).send(resp);
    });

    // MÉTODO GET, RETORNA DADOS ESPECIFICOS DE PRODUTOS
    router.get(`/${mainUrl}/:id`, async (req, res) => {
        const id = req.params.id
        const {resp, status} = await PizzaService.getPizza(id);
        res.status(status).send(resp);
    });

    // MÉTODO DELETE, DELETA O PRODUTO CUJO ID E PASSADO
    router.delete(`/${mainUrl}/:id`, async (req, res) => {
        const id = req.params.id
        const {resp, status} = await PizzaService.deletePizza(id);
        res.status(status).send(resp);
    });
}

export default Pizzas;