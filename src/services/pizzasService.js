import { Client } from 'pg';
import { normalizeQueryUpdate } from '../utils/funcs';

export default class PizzaService {
  static async getAllPizzas() {
    let resp = [];
    let status = 200;
    try {
      
      const conn = new Client({ connectionString: process.env.DB_URI, ssl: eval(process.env.DB_SSL) });
      conn.connect();

      const response = await new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM pizzas`, (err, response) => {
          if(err) {
            reject(err)
          }
          resolve(response.rows)
        })
      })

      resp = {
        success: true,
        message: 'Todas as pizzas',
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

  static async getPizza(id) {
    let resp = [];
    let status = 200;
    try {
      const conn = new Client({ connectionString: process.env.DB_URI, ssl: eval(process.env.DB_SSL) });
      conn.connect();

      const response = await new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM pizzas WHERE id=$1`, [id], (err, response) => {
          if(err) {
            reject(err)
          }
          resolve(response.rows[0])
        })
      })

      resp = {
        success: true,
        message: 'Dados da pizza',
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

  static async createPizzas(namePizza, valuePizza) {
    let resp = [];
    let status = 200;
    try {
      const conn = new Client({ connectionString: process.env.DB_URI, ssl: eval(process.env.DB_SSL) });
      conn.connect();

      const sql = 'INSERT INTO pizzas(name, value) VALUES ($1, $2)';
      const values = [namePizza, valuePizza];

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
        message: 'Pizza adicionada',
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

  static async deletePizza(id) {
    let resp = [];
    let status = 200;
    try {
      const conn = new Client({ connectionString: process.env.DB_URI, ssl: eval(process.env.DB_SSL) });
      conn.connect();

      await new Promise((resolve, reject) => {
        conn.query(`DELETE FROM pizzas WHERE id=$1`, [id], (err, response) => {
          if(err) {
            reject(err)
          }
          resolve(response)
        })
      })

      resp = {
        success: true,
        message: 'Pizza deletada',
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
