import React from "react";

export default function LegendBoard({legendTable, selectShipHandler = null, playerType, gameState}) {
  const legendClassName = playerType === "player2" ? "player2-legend" : "player1-legend";
  const shipPlayerType = playerType === "player2" ? "player2-ship-color": "player1-ship-color";
  return (
    <div className={`legend ${legendClassName}`}>
      {legendTable.map((ship) => {
        let className = `ship ${ship.className}`;
        if(gameState === "PLACE_SHIPS") {
          if(playerType === "player1" && ship.shipLocation.length === ship.shipSize){
            className = className + " placed";
            }else{
              className = className + ` ${shipPlayerType}`;
            }
        }
        if(gameState === "GAME_STARTED") {
          //if(ship.shipLocation.length === ship.shipSize){
          if(ship.numOfHits === ship.shipSize){
              className = className + " sank";
          }else{
              className = className + ` ${shipPlayerType}`;
          }
        }
        const onClick = selectShipHandler ? () => selectShipHandler(ship.shipID, ship.shipSize, ship.shipNum) : null;
        return (
          <span
          key={ship.shipID}  
          id={ship.shipID}
            className={className}
            onClick={onClick}
          />
        );
      })}
    </div>
  );
}
