import connection from './conexion.js'

const desconectar = () => {

    // finalizo conexion
    connection.end((err) => {
        if (err) {
            console.error('Error al desconectarse: ', err.message);
            return;
        }
        console.log('Conexion cerrada.');
    });

}

export default desconectar


