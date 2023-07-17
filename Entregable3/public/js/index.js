const socket = io(); //levantamos socket del lado del cliente
console.log('Holaaaaaa')

socket.emit('message', 'Hola Me estoy vomunicando desde un websocket');


const chat = document.getElementById('chat');
/* console.log(chat.textContent) */
let messages =[]
socket.on('msg_server', data => {
    
    if (data && data.length>0) {
        messages=data;
        chat.innerHTML='';
        /* console.log(data)
        console.log(data.length) */
       /*  chat.textContent += `${data[data.length-1].message} \n` */
       
        messages.forEach(element => {
            chat.innerHTML +=  `<B>id_socket:</B> ${element?.id_socket} **** <B>message:</B> ${element?.message} <br>`
        }); 

    }

    console.log(data)
})

