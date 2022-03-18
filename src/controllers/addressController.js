import AddressService from "../services/addressService";

const Address = (router) => {
    const mainUrl = 'address';

    // METODO POST, INSERE PRODUTOS
    router.post(`/${mainUrl}/`, async (req,res) => {
       
        const {body} = req;     
        const {resp, status} = await AddressService.createAddress(body.cep, body.idUser, body.numberHouse);
        console.log('Usuario:', body)
        res.status(status).send(resp);
    });

    // MÉTODO GET, RETORNA DADOS ESPECIFICOS DE PRODUTOS
    router.get(`/${mainUrl}/:id`, async (req, res) => {
        const idUser = req.params.id
        const {resp, status} = await AddressService.getAddressByUser(idUser);
        res.status(status).send(resp);
    });

    // MÉTODO DELETE, DELETA O PRODUTO CUJO ID E PASSADO
    router.delete(`/${mainUrl}/:id`, async (req, res) => {
        const id = req.params.id
        const {resp, status} = await AddressService.deleteAddress(id);
        res.status(status).send(resp);
    });
}

export default Address;