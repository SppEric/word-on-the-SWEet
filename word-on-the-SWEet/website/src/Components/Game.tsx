import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { useSearchParams } from "react-router-dom";
import '../style/InputBox.css';
import GameBoard from './GameBoard';
import Gamestate from '../Interfaces/Gamestate';
import '../style/Game.css';
import VictoryScreen from './VictoryScreen';
import { useBeforeunload } from 'react-beforeunload';

interface GameProps {
  initialGamestate: Gamestate,
  socket: Socket
}

// Global timer variable for their turn
let timer: NodeJS.Timer | undefined;
let gameInProgress: boolean = false;
let INPUT_PLACEHOLDER_TEXT = "Type now!"

// amount of time given for each turn (in seconds)
export const TURN_DURATION: number = 8;

export default function Game({initialGamestate, socket}: GameProps) {
  // URL params (i.e., [URL]?username=___&roomcode=___)
  const [searchParams, _] = useSearchParams();

  // Define socket id to be used later for identification
  let id: string = socket.id;

  // managing the current gamestate
  const [gamestate, setGamestate] = useState<Gamestate>(initialGamestate);

  // true if the game is currently in progress, false otherwise
  // const [gameInProgress, setGameInProgress] = useState<boolean>(false);
  
  // true if the player is currently disabled. a player is disabled if:
  // 1. it is not currently their turn, or
  // 2. they are only spectating (happens when they join in the middle of the game)
  const [disabled, setDisabled] = useState<boolean>(true);

  // Victor state tracker for the 
  const [victor, setVictor] = useState<string | undefined>(undefined);

  // Input state tracker for the input box
  const [input, setInput] = useState<string>("");

  function manageTurn(gamestate: Gamestate) {
    // if it's not currently this player's turn, and they're up next,
    // then start their turn. 
    if (disabled && gamestate.nextPlayer["id"] == id) {
      setDisabled(false);
      // start the timer!
      console.log("Started timer!");
      timer = setTimeout(() => {
        // What to do when bomb explodes
        socket.emit("timeup");
        console.log("Your time is up!");
        setDisabled(true);
      }, TURN_DURATION * 1000);  // guessing time in milliseconds
    } 
    // if it's currently this player's turn, and they guessed right:
    else if (!disabled && gamestate.validGuess) {
      // Stop the timer and prevent any more input.
      // no need to emit here because InputBox will emit the guess.
      clearTimeout(timer);
      console.log("Your guess was valid!");
      setDisabled(true);
    } 
    // if it's currently this player's turn, and they guessed wrong:
    else if (!disabled && !gamestate.validGuess) {
      // do nothing, just print invalid message
      console.log("Your guess was invalid!");
    }
  }

  // manage user's turn each time the gamestate changes
  useEffect(() => {
    if (gamestate.nextPlayer!) {
      manageTurn(gamestate);
    }
    setGamestate(gamestate)
  }, [gamestate]);

  
  // Socket listeners
  useEffect(() => {
    // when a new player joins, check if game is in progress. 
    // if not, update the gamestate to include the new player.
    socket.on("roomUsers", (newGamestate) => { 
        console.log(newGamestate)
      if (!gameInProgress) {
        setGamestate(newGamestate)
        console.log("New user joined!")
      } else {
        console.log("User joined but game was in progress")
      }
    });

    // when game starts, set playing to true and then set the initial gamestate.
    socket.on("gameStartResponse", (newGamestate) => {
      console.log("Starting the game")
      gameInProgress = true;
      setVictor(undefined);
      console.log(newGamestate)
      setGamestate(newGamestate);
    })

    // when receiving a new gamestate after a guess, update frontend gamestate
    socket.on("guessResponse", (newGamestate) => { 
      // if game is still going on, update gamestate
      if (gameInProgress) {
        setGamestate(newGamestate);
        setInput("");
      };
    });

    // when someone disconnects from the game, update gamestate to remove them
    socket.on("disconnectResponse", 
      (newGamestate: Gamestate) => { setGamestate(newGamestate); });

    // when someone wins, print win message and end game
    socket.on("victoryRoyale", (gamestate) => { 
      console.log(gamestate["users"][0]["username"] + " is POG");
      setVictor(gamestate["users"][0]["username"]);
      setGamestate(gamestate)
      gameInProgress = false;
    });

    // Tell the server that someone joined the room when the game loads
    socket.emit("joinRoom", {username: searchParams.get("username"), room: searchParams.get("roomcode")});

    // Close open sockets
    return () => {
      socket.off("roomUsers");
      socket.off("gameStartResponse");
      socket.off("guessReponse");
      socket.off("disconnectResponse");
      socket.off("victoryRoyale");
    };
  }, []);

  
  // Enables using enter to submit guess for input box
  function handleKeypress(key: String) {
      if (key === "Enter") {
          // Emit the guess to the server to see if it was correct
          socket.emit("guess", input.toUpperCase())
          console.log(input.toUpperCase())
  
          // Empty the input box
          setInput("")
      }
  }

  // If a user closes the tab let the server know they've disconnected
  useBeforeunload(() => {
    socket.emit("disconnect");
    socket.disconnect()
  });
  return (
    <div className="game">
      <p className="game-header">
        Word on the SWEet
      </p>

      <GameBoard gamestate={gamestate} />

      {(victor !== undefined) ? <VictoryScreen victor={victor} params={searchParams} /> : <div></div>}

      {!gameInProgress && victor === undefined ? 
      <button 
        className='start-game-button' 
        type="button" 
        onClick={(e) => {socket.emit("gameStart");}}>Start Game!</button> : 
      <div></div>}

      <input
            className="input-box"
            id={"InputBox"}
            disabled={disabled}
            value={disabled ? "" : input}
            placeholder={disabled ? "" : INPUT_PLACEHOLDER_TEXT}
            onChange={(e => setInput(e.target.value))}
            onKeyDown={(e) => handleKeypress(e.key)}
            aria-label={'input_box'}
            aria-description={"Contains the input to enter guesses into."}
        ></input>
    </div>
  );
}