import axios from 'axios';
import { Client } from 'pg';
import { normalizeQueryUpdate } from '../utils/funcs';

export default class AddressService {
  static async getAddressByUser(idUser) {
    let resp = [];
    let status = 200;
    try {
      const conn = new Client({ connectionString: process.env.DB_URI, ssl: eval(process.env.DB_SSL) });
      conn.connect();

      const response = await new Promise((resolve, reject) => {
        conn.query(`SELECT a.id as idaddress, a.cep as cep, a.city as city, a.street as street, a.number as number, a.neighborhood as neighborhood, a.complement as complement, a.state as state, u.id as iduser, u.name as name, u.cpf as cpf FROM address as a INNER JOIN users as u on u.id = a.id_user WHERE u.id=$1`, [idUser], (err, response) => {
          if(err) {
            reject(err)
          }
          const rows = response.rows;
          const res = [];
          rows.forEach(e => {
            if(Object.keys(e).length > 0) {
              res.push({
                id: e.iduser,
                name: e.name,
                cpf: e.cpf,
                address: {
                  id: e.idaddress,
                  cep: e.cep,
                  state: e.state,
                  city: e.city,
                  street: e.street,
                  number: e.number,
                  neighborhood: e.neighborhood,
                  complement: e.complement
                }
              })
            }
          })
          resolve(res)
        })
      })
    
      resp = {
        success: true,
        message: 'Dados do endereço',
        data: response
      };

      conn.end(); 
    } catch(error) {
      status = 400;
      resp = {
        success: false,
        message: 'Erro ao realizar a operação',
        error
      };
    }
    return {resp, status};
  }

  static async createAddress(cep, idUser, numberHouse) {
    let resp = [];
    let status = 200;
    try {
      const conn = new Client({ connectionString: process.env.DB_URI, ssl: eval(process.env.DB_SSL) });
      conn.connect();

      const payload = await axios
      .create({
        baseURL: 'https://viacep.com.br',
      })
      .get(`/ws/${cep}/json/`)
      .then(resp => resp.data);

      console.log('to ai', payload)

      const sql = 'INSERT INTO address(street, state, cep, neighborhood, city, number, complement, id_user) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
      const values = [payload.logradouro, payload.uf, cep, payload.bairro, payload.localidade, numberHouse, payload.complemento, idUser];

      await new Promise((resolve, reject) => {
        conn.query(sql, values, (err, response) => {
          if(err) {
            reject(err)
          }
          resolve(response)
        })
      })

      resp = {
        success: true,
        message: 'Endereço adicionado',
      };

      conn.end(); 
    } catch(error) {
      status = 400;
      resp = {
        success: false,
        message: 'Erro ao realizar a operação',
        error
      };
    }
    return {resp, status};
  }


  static async deleteAddress(id) {
    let resp = [];
    let status = 200;
    try {
      const conn = new Client({ connectionString: process.env.DB_URI, ssl: eval(process.env.DB_SSL) });
      conn.connect();

      await new Promise((resolve, reject) => {
        conn.query(`DELETE FROM address WHERE id=$1`, [id], (err, response) => {
          if(err) {
            reject(err)
          }
          resolve(response)
        })
      })

      resp = {
        success: true,
        message: 'Endereço deletado',
      };

      conn.end(); 
    } catch(error) {
      status = 400;
      resp = {
        success: false,
        message: 'Erro ao realizar a operação',
        error
      };
    }
    return {resp, status};
  }
}
