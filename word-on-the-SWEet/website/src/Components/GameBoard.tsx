import Player from "./Player";
import Substring from "./Substring";
import Gamestate from "../Interfaces/Gamestate"
import '../style/GameBoard.css'

interface GameBoardProps {
    gamestate: Gamestate
}

export default function GameBoard({gamestate}: GameBoardProps) {
    // Create players to add to the player space
    var players = gamestate.users.map((user) => {
        return <Player user={user}/>
    })

    return (
        <div className="game-board">

            <Substring substring={gamestate.substring}/> 

            <div className="player-space">
                <ul className="player-list">
                    {players}
                </ul>
            </div>

        </div>

    )
}