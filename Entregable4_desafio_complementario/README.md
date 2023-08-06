<a id=volver><a/>

#### **Curso Backend - Entrega Desafío Nro3 -  Alejandro Javier Morales** - com55225

La aplicación está originalmente pensada para realizar las peticiones via Insomnia o Postman trabajando siempre del lado del servidor.
De modo que en cada una de las rutas POST, PUT y DELETE del products.router.js se ejecuta un emit via websocket que da aviso desde el servidor a cada cliente conectado, actualizando los resultados en tiempo real en cada uno de ellos

********
//websockets
const io = req.app.get('socketio');
// Emitir evento 'update_products' a todos los clientes conectados
io.emit('update_products', {id:0, msg:'Se Agregó un Producto a la base de datos'});
********

Rutas:

http://localhost:8080/
Esta ruta apunta a la peticion GET http que trae la lista de productos existente.

http://localhost:8080/realtimeproducts
Esta ruta apunta a la petición via websocket que trae la lista de productos y que se actualiza en tiempo real


Adicionalmente, en la siguiente ruta se puede, desde el cliente, ejecutar las peticiones y observar el mismo comportamiento que en las opciones anteriores

http://localhost:8080/client

Esta ruta visualiza el archivo index.html del lado del cliente, a traves del cual, utilizando Fetch se realizan peticiones http al servidor
Se trata de un formulario muy sencillo que permite agregar un producto o eliminar un producto:
Con la consola del navegador a la vista, podemos hacer las peticiones y ver las respuesta del servidor en cada una de ellas

Algunas propiedades como 'status' y 'category' están hardcodeadas y 'thumbnails' se crea como un array vacio ([]).
Luego para poder asignar una imagen al producto se hace a través de la petición POST http://localhost:8080/api/products/:pid/upload la cual debe tener un body Multipart con el archivo a cargar (desde Insomnia o Postman).
Las imágenes se cargan en la carpeta 'uploads' del servidor.