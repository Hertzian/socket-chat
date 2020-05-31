
class Usuarios{

    constructor(){
        // inicialización de arrego vacío
        this.personas =  [];
    }

    // params id: socket, nombre: usuario
    agregarPersona(id, nombre, sala){
        // persona a agregar
        let persona = {id, nombre, sala}
        // la persona a agregar se agrega al array de todas las personas
        this.personas.push(persona);

        return this.personas;
    }

    getPersona(id){
        // encuentra persona por medio del id del array personas
        let persona = this.personas.filter(persona => {
            return persona.id === id
        })[0];

        // retorna la persona encontrada
        return persona;
    }

    getPersonas(){
        // retorna todas las personas
        return this.personas;
    }

    getPersonasPorSala(sala){
        let personasEnSala = this.personas.filter(persona => {
            return persona.sala === sala
        });

        return personasEnSala;
    }

    borrarPersona(id){
        // para saber cual es la persona borrada
        let personaBorrada = this.getPersona(id);

        // para encontrar la persona por medio del id dentro del array personas
        this.personas = this.personas.filter(persona => {
            return persona.id != id;
        });

        return personaBorrada;
    }
}

module.exports = {
    Usuarios
}