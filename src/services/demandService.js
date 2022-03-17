import { Client } from 'pg';
import { normalizeQueryUpdate } from '../utils/funcs';

export default class PizzaService {

  static async getDemand(idDemand) {
    let resp = [];
    let status = 200;
    try {
      const conn = new Client({ connectionString: process.env.DB_URI, ssl: eval(process.env.DB_SSL) });
      conn.connect();

      const idPizzas = [];
      let payload = {pizzas: []};

      await new Promise((resolve, reject) => {
        conn.query(`SELECT u.id as iddemand, u.id as iduser, a.id as idaddress, * FROM demand as d
        INNER JOIN address as a on d.id_address = a.id
        INNER JOIN users as u on d.id_user = u.id
        WHERE d.id=$1`, [idDemand], (err, response) => {
          if(err) {
            reject(err)
          }
          
          const rows = response.rows[0];
          const {street, neighborhood, city, cep, complement, number, name, cpf, pizzas} = rows;

          pizzas.forEach(pizza => {
            const splitPizza = pizza.split('=');
            idPizzas.push(splitPizza[0]);
            payload = {
              ...payload,
              pizzas: [...payload.pizzas, {id: splitPizza[0], value: splitPizza[1] }]
            }
          })

          payload = {
            id: rows.iddemand,
            totalValue: rows.total_value,
            address: {
              id: rows.idaddress,
              cep,
              city,
              street,
              neighborhood,
              number,
              complement
            },
            user: {
              id: rows.iduser,
              name,
              cpf,
            },
            ...payload,
          }
        
          resolve(payload)
        })
      })

      const res =  await new Promise((resolve, reject) => {
        let params = '';
        for(var i = 1; i <= idPizzas.length; i++) {
          if(i === 1) {
            params += `($${i}`;
          }else {
            params += `, $${i}`;
          }
        }
        params += `)`;
        conn.query(`SELECT name FROM pizzas WHERE id in ${params}`, idPizzas, (err, response) => {
          if(err) {
            reject(err)
          }
          resolve(response.rows)
        })
      })
      
      let newPayload = {...payload, pizzas: []}

      payload.pizzas.forEach((pizza, idx) => {
        newPayload = {...newPayload, pizzas: [...newPayload.pizzas, {...pizza, name: res[idx].name}]}
      });

      resp = {
        success: true,
        message: 'Dados do pedido',
        data: newPayload
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

  static async createDemand(idUser, idAddress, pizzaList) {
    let resp = [];
    let status = 200;
    try {
      const conn = new Client({ connectionString: process.env.DB_URI, ssl: eval(process.env.DB_SSL) });
      conn.connect();
      
      const pizzasInsert = []; 
      let totalDemand = 0;

      pizzaList.forEach((pizza) => {
        pizzasInsert.push(`${pizza.id}=${pizza.value}`);
        totalDemand += parseFloat(pizza.value);
      });
      
      const date = new Date().toJSON()
      const sql = 'INSERT INTO demand(id_user, id_address, total_value, pizzas, creation_date) VALUES ($1, $2, $3, $4, $5) RETURNING id';
      const values = [idUser, idAddress, totalDemand.toFixed(2), pizzasInsert, date];

     const id =  await new Promise((resolve, reject) => {
        conn.query(sql, values, (err, response) => {
          if(err) {
            reject(err)
          }
          resolve(response.rows[0])
        })
      })

      resp = {
        success: true,
        message: 'Demanda criada',
        data: id,
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

  static async updatePizzas(values) {
    let resp = [];
    let status = 200;
    try {
      const conn = new Client({ connectionString: process.env.DB_URI, ssl: eval(process.env.DB_SSL) });
      conn.connect();

      const normalize = normalizeQueryUpdate('pizzas', 'id', values);

      await new Promise((resolve, reject) => {
        conn.query(normalize.sql, normalize.values, (err, response) => {
          if(err) {
            reject(err)
          }
          resolve(response)
        })
      })

      resp = {
        success: true,
        message: 'Pizza atualizada',
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
