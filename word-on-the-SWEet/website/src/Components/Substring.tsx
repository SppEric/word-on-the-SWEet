import { useState } from 'react';
import '../style/Substring.css';

export default function Substring({substring}: {substring: string}) {
    return (
        <div className="substring">
            <p>{substring}</p>
        </div>
    )
}