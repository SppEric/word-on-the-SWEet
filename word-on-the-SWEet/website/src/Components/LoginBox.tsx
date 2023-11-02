import React, {useState} from 'react';
import {Socket} from "socket.io-client";

interface LoginBoxProps {
    socket: Socket
}


export default function LoginBox({socket}: LoginBoxProps) {
    // input variables
    const [username, setUsername] = useState<string>("");
    const [roomCode, setRoomCode] = useState<string>("");
    return (
        <div id="login-box-div">
            <form id="login-box-form" action="/game">
                <span className="login-box-span">
                    Username:
                    <input type="text" name="username"
                        className="login-box-input" id="username-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        aria-label="Username input box"
                        aria-description="Use this box to type in your username."/>
                </span>
                <br/>
                <span className="login-box-span">
                    Room code:
                    <input type="text" name="roomcode"
                        className="login-box-input" id="roomcode-input"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        aria-label="Room code input box"
                        aria-description="Use this box to type in your room code."/>
                </span>
                <br/>
                <input type="submit" 
                    id="loginbox-button"
                    value="Join!" 
                    //onSubmit={(e) => )}
                    aria-label="Login submit button"
                    aria-description="Press this button to submit your username and room code."/>
            </form>
        </div>)
}