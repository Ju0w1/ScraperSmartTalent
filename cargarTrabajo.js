import connection from './db/conexion.js'
import conectar from './db/inicializoConexion.js'

conectar();

const insertData = (id, link, job_name, company, end_date, actual_date) => { 

    // inserto datos
    const sql = 'INSERT INTO jobs (id, link, job_name, company, end_date, actual_date, shown) VALUES (?,?,?,?,?,?,0)'
    const data = [id, link, job_name, company, end_date, actual_date]

    connection.execute(sql,data,(err,results) =>{
        if (err){
            throw err
        }else{
            console.log('Se inserto, ID: ', results.insertId)
        }
    })
  
}


export default insertData