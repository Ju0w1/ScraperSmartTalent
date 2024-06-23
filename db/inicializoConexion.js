import connection from './conexion.js'

// inicializo conexion
const conectar = () => {

    connection.connect(function(error) {
        if (error) {
            console.error('Error al conectarse: ' + error.stack);
            return;
        }
    
        console.log('Conectado con el id ' + connection.threadId);
    })

}

export default conectar