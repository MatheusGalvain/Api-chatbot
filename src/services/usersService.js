import { Client } from 'pg';
import { normalizeQueryUpdate } from '../utils/funcs';

export default class UsersService {
  static async getAllUsers() {
    let resp = [];
    let status = 200;
    try {
      const conn = new Client({ connectionString: process.env.DB_URI, ssl: eval(process.env.DB_SSL) });
      conn.connect();

      const response = await new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM users`, (err, response) => {
          if(err) {
            reject(err)
          }
          resolve(response.rows)
        })
      })

      resp = {
        success: true,
        message: 'Todas os usuarios',
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

  static async getUser(id) {
    let resp = [];
    let status = 200;
    try {
      const conn = new Client({ connectionString: process.env.DB_URI, ssl: eval(process.env.DB_SSL) });
      conn.connect();

      const response = await new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM users WHERE id=$1`, [id], (err, response) => {
          if(err) {
            reject(err)
          }
          resolve(response.rows[0])
        })
      })

      resp = {
        success: true,
        message: 'Dados do usuário',
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

  static async createUsers(name, cpf) {
    let resp = [];
    let status = 200;
    try {
      const conn = new Client({ connectionString: process.env.DB_URI, ssl: eval(process.env.DB_SSL) });
      conn.connect();

      const sql = 'INSERT INTO users(name, cpf) VALUES ($1, $2) RETURNING id';
      const values = [name, cpf];

      const response = await new Promise((resolve, reject) => {
        conn.query(sql, values, (err, response) => {
          if(err) {
            reject(err)
          }
          resolve(response.rows[0])
        })
      })

      resp = {
        success: true,
        message: 'Usuário adicionada',
        data: response,
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

  static async updateUsers(values) {
    let resp = [];
    let status = 200;
    try {
      const conn = new Client({ connectionString: process.env.DB_URI, ssl: eval(process.env.DB_SSL) });
      conn.connect();

      const normalize = normalizeQueryUpdate('users', 'id', values);

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
        message: 'Usuário atualizado',
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

  static async deleteUser(id) {
    let resp = [];
    let status = 200;
    try {
      const conn = new Client({ connectionString: process.env.DB_URI, ssl: eval(process.env.DB_SSL) });
      conn.connect();

    
     await new Promise((resolve, reject) => {
        conn.query(`DELETE FROM demand WHERE id_user=$1`, [id], (err, response) => {
          if(err) {
            reject(err)
          }
          resolve(response)
        })
      }).then(async () => {
        return await new Promise((resolve, reject) => {
          conn.query(`DELETE FROM address WHERE id_user=$1`, [id], (err, response) => {
            if(err) {
              reject(err)
            }
            resolve(response)
          })
        }).then(async () => {
          return await new Promise((resolve, reject) => {
            conn.query(`DELETE FROM users WHERE id=$1`, [id], (err, response) => {
              if(err) {
                reject(err)
              }
              resolve(response)
            })
          })
        })
      })
    
      resp = {
        success: true,
        message: 'Usuário deletado',
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
