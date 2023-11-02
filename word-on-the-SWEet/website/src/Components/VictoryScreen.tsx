import React from "react"

export default function VictoryScreen ({victor, params}: {victor : string, params: URLSearchParams}) {
    return (<div id="victory-box" aria-label="box displaying the game's victor">
        <p> {victor} has won! Congratulations!</p>
        <form 
        id="play-again-form" 
        action={`/game`}>
            <input type="hidden" 
                name="username" 
                value={params.get('username') ? params.get('username') as string : "default"}
                /> 
            <input type="hidden" 
            name="roomcode" 
            value={params.get('roomcode') ? params.get('roomcode') as string : "default"}/> 
            <input type="submit" 
                className='play-again-button'
                id="play-again-button"
                value="Play again!" 
                aria-label="Play again button"
                aria-description="Press this button to play another game."/>
        </form>
    </div>);
}