import UsersService from "../services/usersService";

const Users = (router) => {
    const mainUrl = 'users';

    // METODO POST, INSERE PRODUTOS
    router.post(`/${mainUrl}/`, async (req,res) => {
        const {body} = req;
        const {resp, status} = await UsersService.createUsers(body.name, body.cpf);
        res.status(status).send(resp);
    });

    // MÉTODO GET, RETORNA PRODUTOS
    router.get(`/${mainUrl}/`, async (_, res) =>{
        const {resp, status} = await UsersService.getAllUsers();
        res.status(status).send(resp);
    });

    // MÉTODO PUT, ATUALIZA PRODUTOS
      router.put(`/${mainUrl}/`, async (req, res) =>{
        const {body} = req; 
        const {resp, status} = await UsersService.updateUsers(body);
        res.status(status).send(resp);
    });

    // MÉTODO GET, RETORNA DADOS ESPECIFICOS DE PRODUTOS
    router.get(`/${mainUrl}/:id`, async (req, res) => {
        const id = req.params.id
        const {resp, status} = await UsersService.getUser(id);
        res.status(status).send(resp);
    });

    // MÉTODO DELETE, DELETA O PRODUTO CUJO ID E PASSADO
    router.delete(`/${mainUrl}/:id`, async (req, res) => {
        const id = req.params.id
        const {resp, status} = await UsersService.deleteUser(id);
        res.status(status).send(resp);
    });
}

export default Users;