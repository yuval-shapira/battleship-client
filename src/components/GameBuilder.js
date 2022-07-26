import React from "react";
import gameBuilderReducer from "../store/GameBuilderReducer";
import initTableGame from "../utils/InitTableGame";
import GameBoard from "./GameBoard";
import LegendBoard from "./LegendBoard";
import NewButton from "./NewButton";
import { optionalDirections, suggesmentOption } from "../utils/PlaceShips.js";

export default function GameBuilder({ highLevelDispatch, game }) {
  const [host, gameBuilderDispatch] = React.useReducer(
    gameBuilderReducer,
    initTableGame()
  );

  function playButtonHandler() {
    highLevelDispatch({
      type: "PLACE_SHIPS",
      payload: {
        myTable: host.table,
        myLegend: host.legend,
      },
    });
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
    gameBuilderDispatch({
      type: "SELECT_SHIP",
      payload: {
        shipID,
        shipSize,
        shipNum,
      },
    });
  }

  function mouseHandler(action, x, y) {
    if (host.selectedShip.shipID || host.firstPlaced) {
      const directions = optionalDirections(
        host.table,
        x,
        y,
        host.selectedShip
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
  let waitingMessage = game.opponentName
    ? `Waiting for you and ${game.opponentName} to be ready...`
    : "Waiting for opponent to join...";

  if (game.isOpponentReady) {
    waitingMessage = `${game.opponentName} is ready and waiting for you to be ready...`;
  }

  return (
    <>
      <main className="grid-game-container">
        <div className="flex-column">
          <h2 className="name my-name-clr-bg">{game.myName}</h2>
          <div className="legend-board-container">
            {/* !!!!!!! LEGEND !!!!!!!! */}
            <LegendBoard
              legendTable={host.legend}
              selectShipHandler={selectShipHandler}
              playerType={"player1"}
              gameState={game.gameState}
            />
            {/* !!!!!!! GAME !!!!!!!! */}
            <GameBoard
              table={host.table}
              handleClick={handleClick}
              mouseHandler={mouseHandler}
              removeShipHanler={removeShipHanler}
            />
          </div>
          {host.numOfShipsPlaced === host.legend.length && !host.imReady && (
            <NewButton action={"I-am-ready"} func={playButtonHandler} />
          )}
        </div>

        <div className="flex-column">
          <h3 className="wait-to-player">{waitingMessage}</h3>
        </div>
      </main>
    </>
  );
}
