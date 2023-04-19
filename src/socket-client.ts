import { Manager, Socket } from 'socket.io-client'

let socket: Socket;

export const connectToServer = (jwtToken: string) => {
  const manager = new Manager('http://localhost:3001/socket.io/socket.io.js',{
    extraHeaders: {
      hola: 'mundo',
      authentication: jwtToken
    }
  });
  socket?.removeAllListeners();
  socket = manager.socket('/');
  addListeners();
}

const addListeners = ( ) => {
  const serverStatusLabel = document.querySelector('#server-status')!;
  const clientsUl = document.querySelector('#clients-ul')!;
  const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
  const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;
  const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;

  socket.on('connect', () => {
    serverStatusLabel.innerHTML = 'connected';
    // console.log('connected')
  });

  socket.on('disconnect', () => {
    // console.log('disconnet');
    serverStatusLabel.innerHTML = 'disconnected';
  });

  socket.on('clients-updated', (clients: string[]) => {
    // console.log({ clients })
    let clientsHtml = '';
    clients.forEach( clientId  => {
      clientsHtml += `
        <li>${clientId}</li>
      `
    });
    clientsUl.innerHTML = clientsHtml
  });

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if(messageInput.value.trim().length <= 0) return;
    // console.log({ id: 'Me', message: messageInput.value })
    console.log('testtt');
    socket.emit('message-from-client',{ 
      id: 'Me!!!', message: messageInput.value 
    });
    messageInput.value = '';
  });

  socket.on('message-from-server', (payload: { fullName: string, message:string }) => {
    // console.log(payload);
    const newMessage = `
      <li>
        <strong>${payload.fullName}</strong>
        <strong>${payload.message}</strong>
      </li>
    `
    const li = document.createElement('li');
    li.innerHTML = newMessage;
    messagesUl.append(li);
  });
}