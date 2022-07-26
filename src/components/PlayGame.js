import React, { useEffect } from "react";
import LegendBoard from "./LegendBoard";
import GameBoard from "./GameBoard";
import DisableBoard from "./DisableBoard";
import {
  sendMyMove,
  sendMyMoveResponse,
  playListeners,
  sendImReady,
} from "../api/sockets";

export default function PlayGame({ game, highLevelDispatch }) {
  const [myMove, setMyMove] = React.useState(null);
  const [myMoveResponse, setMyMoveResponse] = React.useState(null);

  useEffect(() => {
    sendImReady(game.gameID);
  }, []);

  useEffect(() => {
    myMove !== null && sendMyMove(game.gameID, myMove, highLevelDispatch);
  }, [myMove]);

  useEffect(() => {
    if (myMoveResponse !== null) {
      sendMyMoveResponse(game.gameID, myMoveResponse);
      myMoveResponse.isOpponentWon &&
        highLevelDispatch({
          type: "GAME_OVER",
        });
    }
  }, [myMoveResponse]);

  useEffect(() => {
    playListeners(onOpponentPlayed, onMyMoveResponse);
  }, [myMoveResponse]);

  function onOpponentPlayed(opponentPlayed) {
    const { x, y } = opponentPlayed;
    const guess = game.myTable[x][y].shipID !== null ? "hit" : "miss";
    let isOpponentWon = false;
    if (guess === "hit") {
      let countOfHits = 1;
      let countOfShipParts = 0;
      game.myLegend.forEach((ship) => {
        countOfHits += ship.numOfHits;
        countOfShipParts += ship.shipSize;
      });
      if (countOfHits === countOfShipParts) {
        isOpponentWon = true;
      }
    }
    setMyMoveResponse({
      guess,
      x,
      y,
      shipID: game.myTable[x][y].shipID,
      isOpponentWon,
    });
    highLevelDispatch({
      type: "OPPONENT_PLAYED",
      payload: { x, y, guess, isOpponentWon },
    });
  }
  function onMyMoveResponse(myMoveResponse) {
    const { x, y, guess, shipID, isOpponentWon } = myMoveResponse;
    const isIWon = isOpponentWon;
    highLevelDispatch({
      type: "MY_MOVE_RESPONSE",
      payload: { x, y, guess, shipID, isIWon },
    });
  }

  function shoot(x, y) {
    if (game.opponentTable[x][y].cellStatus === "") {
      setMyMove({ x, y });
    }
  }
  const waitingMessage = game.opponentName
    ? `Waiting for ${game.opponentName} to be ready...`
    : "Waiting for opponent to join...";
  return (
    <>
      <main className="grid-game-container">
        {game.opponentDisconnected && (
          <div className="opponent-disconnected">
            {game.opponentName} has left the game
          </div>
        )}
        <div className="flex-column">
          <h2 className="name my-name-clr-bg">{game.myName}</h2>
          <div className="legend-board-container">
            {/* !!!!!!! MY LEGEND !!!!!!!! */}
            <LegendBoard
              legendTable={game.myLegend}
              playerType={"player1"}
              gameState={game.gameState}
            />
            {/* !!!!!!! MY GAME !!!!!!!! */}
            <GameBoard table={game.myTable} />
          </div>
        </div>
        <div className="flex-column">
          {!game.opponentName || !game.isOpponentReady ? (
            <h3 className="wait-to-player">{waitingMessage}</h3>
          ) : (
            <>
              <h2 className="name opponent-name-clr-bg">{game.opponentName}</h2>
              <div className="legend-board-container opponent">
                <DisableBoard
                  myTurn={game.myTurn}
                  winner={game.winner}
                  loser={game.loser}
                />
                {/* !!!!!!! OPPONENT GAME !!!!!!!! */}
                <GameBoard table={game.opponentTable} handleClick={shoot} />
                {/* !!!!!!! OPPONENT LEGEND !!!!!!!! */}
                <LegendBoard
                  legendTable={game.opponentLegend}
                  playerType={"player2"}
                  gameState={game.gameState}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
