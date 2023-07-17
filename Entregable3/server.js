const express = require('express');
const { api, views } = require('./routes/index')
const path = require('path');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const http = require('http');




const app = express();

app.use(express.urlencoded({ extended: true })); //middleware que parsea url
app.use(express.json()); //middleware que parsea el body (JSON)

//routers
app.use('/api',api);
app.use('/',views);

const port = 8080;

const httpServer = app.listen(port, () => {
    console.log(`Express Server waiting on port ${port}...`);
});

const socketServer = new Server(httpServer); //servidor para trabajar con socket
//configuraciones de Template Engine
app.engine('handlebars', handlebars.engine());
app.set('views',path.join(__dirname + '/views'));
app.set('view engine','handlebars');

/* app.use(express.static(path.join(__dirname,'public'))); */
app.use('/static', express.static(path.join(__dirname,'public')));



// Asignar la instancia de Socket.IO a una propiedad personalizada en el objeto 'app'
app.set('socketio', socketServer);//esta me permite llamarla desde las rutas POST y PUT para que
//el  modificar algun prpoducto pueda avisar al Servidor y este a todos los clientes conectados (y actualizar todas las vistas en "tiempo real")

const chat = [];

socketServer.on('connection', socket =>{
    console.log('Nuevo Cliente Conectado');
    
    socket.on('msg_realtime', data =>{
        console.log(data)
    })


    socket.on('message', data =>{
        console.log(data);
        chat.push({id_socket: socket.id, message:data})
       /*  socket.broadcast.emit('msg_server', 'Me escribiste: '+ data) */
       socketServer.emit('msg_server', chat)

    })
    socket.emit('msg_server', 'Hola Hermano te escribo desde el servidor')
})



