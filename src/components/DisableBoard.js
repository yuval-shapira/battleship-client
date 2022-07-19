import React from 'react'

export default function DisableBoard({myTurn, winner, loser}) {
  let className = 'disable-Board ';
  if(!myTurn) className += "opponent-turn";
  if(winner || loser) className += "game-over";
    return (<>
    {(!myTurn || winner || loser) && <div className={className}/>}
    </>
  )
}
