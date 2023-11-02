import { useState } from "react"
import User from "../Interfaces/User"

interface UserProps {
    user: User
}

export default function Player({user}: UserProps) {
    return (
        <div className={"player"}>
            <li> [{user.username}; Lives: {user.numLives}] </li>
        </div>
    )
}