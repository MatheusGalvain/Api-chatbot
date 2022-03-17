import DemandService from "../services/demandService";

const Demand = (router) => {
    const mainUrl = 'demand';

    // METODO POST, INSERE PRODUTOS
    router.post(`/${mainUrl}/`, async (req,res) => {
        const {body} = req;     
        const {resp, status} = await DemandService.createDemand(body.idUser, body.idAddress, body.pizzaList);
        res.status(status).send(resp);
    });

    // MÉTODO GET, RETORNA DADOS ESPECIFICOS DE PRODUTOS
    router.get(`/${mainUrl}/:id`, async (req, res) => {
        const id = req.params.id
        const {resp, status} = await DemandService.getDemand(id);
        res.status(status).send(resp);
    });

}

export default Demand;