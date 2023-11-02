import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import GameSite from "./Components/GameSite";
import { io, Socket } from 'socket.io-client';


const socket: Socket = io();

// Grab user's socket connection id for export
const id: string | undefined = undefined;
socket.on("connect", () => {
  const id = socket.id;
  console.log("Connected: " + id)

  // Render the app
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  root.render(
    <React.StrictMode>
      <GameSite socket={socket}/>
    </React.StrictMode>
  );
})



