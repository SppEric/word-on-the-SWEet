import React from 'react';
import { BrowserRouter, Routes, Route, Link, useSearchParams } from "react-router-dom";
import Gamestate from "../Interfaces/Gamestate";
import Game from "./Game";
import LoginBox from "./LoginBox";
import { Socket } from "socket.io-client";

// Default gamestate of an emmpty board
let initialGamestate: Gamestate = {
  nextPlayer: {id: "", username: "", room: "", numLives: 0},
  validGuess: false,
  substring: "",
  users: [],
}

export default function GameSite({socket}: {socket: Socket}) {
  return(
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<LoginBox socket={socket}/>} />
              <Route path="/game" element={<Game initialGamestate={initialGamestate} socket={socket}/>} />
          </Routes>
      </BrowserRouter>
  )
}