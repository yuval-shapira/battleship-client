//import "../App.css";
import React, {useEffect} from "react";
import gameBuilderReducer from "../store/GameBuilder.Reducer";
import initTableGame from "../utils/InitTableGame";
import GameBoard from "./GameBoard";
import LegendBoard from "./LegendBoard";

import { optionalDirections, suggesmentOption } from "../utils/PlaceShips.js";

export default function GameBuilder({
  highLevelDispatch,
  myName,
  opponentName,
  opponentTable,
  opponentLegend,
  gameState,
  isOpponentReady,
}) {
  const [host, gameBuilderDispatch] = React.useReducer(
    gameBuilderReducer,
    initTableGame()
  );

  const [imReady, setImReady] = React.useState(false);

  useEffect(() => {
    sendImReady();
  }, [imReady]);
  function playButtonHandler() {
    highLevelDispatch({
      type: "PLACE_SHIPS",
      payload: {
        myTable: host.table,
        myLegend: host.legend,
      },
    });
    setImReady(true);
  }

  function removeShipHanler(shipID, x, y) {
    gameBuilderDispatch({
      type: "REMOVE_SHIP",
      payload: { shipID: shipID, x, y },
    });
  }

  function handleClick(x, y) {
    if (x !== 0 && y !== 0) {
      let reducerType = "";
      if (
        host.selectedShip.shipID === null &&
        host.table[x][y].shipID !== null
      ) {
        reducerType = "BUTTON_REMOVE_SHIP";
      }
      if (
        host.selectedShip &&
        !host.firstPlaced &&
        host.table[x][y].shipID === null
      ) {
        reducerType = "FIRST_PLACED";
      }
      if (
        host.selectedShip &&
        host.firstPlaced &&
        host.table[x][y].shipID === null
      ) {
        reducerType = "FULL_PLACED";
      }
      gameBuilderDispatch({
        type: reducerType,
        payload: {
          x,
          y,
          //className: "cell placed-ship",
        },
      });
    }
  }

  function selectShipHandler(shipID, shipSize, shipNum) {
    for (let i = 0; i < host.legend.length; i++) {
      if (
        host.legend[i].shipID === shipID &&
        host.legend[i].isPlaced === true &&
        host.legend[i].toRemove !== false
      ) {
        return;
      }
    }
    //if (host.shipID !== shipID) {
    gameBuilderDispatch({
      type: "SELECT_SHIP",
      payload: {
        shipID,
        shipSize,
        shipNum,
      },
    });
    //}
  }

  function mouseHandler(action, x, y) {
    if (host.selectedShip.shipID || host.firstPlaced) {
      //return all posible directions
      const directions = optionalDirections(
        host.table,
        x,
        y,
        host.selectedShip,
        host.firstPlaced
      );
      //return array with all the cells to mark in green
      const shipToPlace = suggesmentOption(
        directions,
        x,
        y,
        host.selectedShip.shipSize
      );
      // call gameBuilderReducer for each cell to mark
      shipToPlace.forEach((cell) => {
        gameBuilderDispatch({
          type: action,
          payload: {
            x: cell.x,
            y: cell.y,
          },
        });
      });
    }
  }
  const waitingMessage = opponentName ? 
  `Waiting for you and ${opponentName} to be ready...`
  : "Waiting for opponent to join...";
  return (
    <>
      <main className="grid-game-container">
        <div className="flex-column">
          <h2 className="name my-name-clr-bg">{myName}</h2>
          <div className="legend-board-container">
            {/* !!!!!!! LEGEND !!!!!!!! */}
            <LegendBoard
              legendTable={host.legend}
              selectShipHandler={selectShipHandler}
              playerType={"player1"}
              gameState={gameState}
            />
            {/* !!!!!!! GAME !!!!!!!! */}
            <GameBoard
              table={host.table}
              handleClick={handleClick}
              mouseHandler={mouseHandler}
              removeShipHanler={removeShipHanler}
            />
          </div>
        </div>

        <div className="flex-column">
        {(!opponentName || !isOpponentReady) ? (
            <h3 className="wait-to-player">{waitingMessage}</h3>
          ) : (<>
            <h2 className="name opponent-name-clr-bg">{opponentName}</h2>
            <div className="legend-board-container opponent">
            {!isOpponentReady && <div className="opponent-turn"></div>}
            {/* !!!!!!! GAME !!!!!!!! */}
            <GameBoard table={opponentTable} />
            {/* !!!!!!! LEGEND !!!!!!!! */}
            <LegendBoard legendTable={opponentLegend} playerType={"player2"} gameState={"PLACE_SHIPS"}/>
          </div>
            </>)}
        </div>
      </main>
      {host.numOfShipsPlaced === host.legend.length && !host.gameStarted && (
        <button onClick={() => playButtonHandler()} className="d">
          Let's Play
        </button>
      )}
    </>
  );
}
