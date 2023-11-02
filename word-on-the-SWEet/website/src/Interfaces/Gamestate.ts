import { Socket } from "socket.io-client"
import User from "./User"

export default interface Gamestate {
  nextPlayer: User
  validGuess: boolean
  substring: string
  users: User[]
}