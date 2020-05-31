var socket = io();

// esta comentada por que viene desde el archivo de jquery
// let params = new URLSearchParams(window.location.search);

if(!params.has('nombre') || !params.has('sala')){
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesario');
}

// usuario por url
let usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(resp) {
        console.log('Usuarios conectados: ', resp);
        renderizarUsuarios(resp);// jquery File
    });
});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

// Enviar información
// socket.emit('crearMensaje', { //se llamaba enviarMensaje
//     usuario: 'Lalo',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    // console.log('Servidor:', mensaje);
    renderizarMensajes(mensaje, false); //aqui esta esta función
    scrollBottom();        
});

// cuando usuario entra o sale del chat, cuando hay cambios en los usuarios
socket.on('listaPersona', function(personas) {
    console.log(personas);
    renderizarUsuarios(personas);// jquery File
});

// PM
socket.on('mensajePrivado', function(mensaje){
    console.log('Mensaje privado: ', mensaje);
});
