const { io } = require('../server');
const {Usuarios} = require('../classes/usuarios');
const {crearMensaje} = require('../utils/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    // cuando usuario se conecta
    client.on('entrarChat', (data, callback) => {

        if(!data.nombre || !data.sala){
            return callback({
                error:true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        // conectar usuario a sala
        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);
        // console.log(personas);

        // usuario entra o sale del chat emite a todos en el chat
        client.broadcast
            .to(data.sala)
            .emit('listaPersona', usuarios.getPersonasPorSala(data.sala));

        callback(usuarios.getPersonasPorSala(data.sala));
    });

    // de utils
    client.on('crearMensaje', (data) =>{
        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast
            .to(persona.sala)
            .emit('crearMensaje', mensaje);
    })

    // cuando un usuario se desconecta/recarga pantalla, para depurar usuario y no se duplique
    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        // cuando persona abandona chat
        client.broadcast
            .to(personaBorrada.sala)
            // {usuario:'Admin', mensaje: `${personaBorrada.nombre} abandonó el chat`}
            .emit('crearMensaje', crearMensaje('Admin', `${personaBorrada.nombre} salió`));

        // usuario entra o sale del chat
        client.broadcast
            .to(personaBorrada.sala)
            .emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));

    });

    // Mensajes privados con un id de una persona
    client.on('mensajePrivado', data =>{
        let persona = usuarios.getPersona(client.id);
        // validar que el mensaje viene en la data
        // data.para es el id a quien se le enviará el PM
        client.broadcast
            .to(data.para)
            .emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });
   
});