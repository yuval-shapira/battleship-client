//import "../App.css";
import React, { useEffect } from "react";
import LegendBoard from "./LegendBoard";
import GameBoard from "./GameBoard";
import { sendMyMove, sendMyMoveResponse, playListeners, imReady } from "../api/sockets";
import GameOverAlert from "../utils/gameOverMessage";

export default function PlayGame({ game, highLevelDispatch }) {
  const [opponentLeft, setOpponentLeft] = React.useState(false);
  const [myMove, setMyMove] = React.useState(null);
  const [myMoveResponse, setMyMoveResponse] = React.useState(null);

  useEffect(() => {
    console.log("imReady function called");
    imReady(game.gameID, game.opponentID, game.isOpponentReady, highLevelDispatch);
  }, [game.opponentID]);

  useEffect(() => {
    myMove !== null && sendMyMove(game.gameID, myMove, highLevelDispatch);
  }, [myMove]);

  useEffect(() => {
    myMoveResponse !== null &&
    sendMyMoveResponse(game.gameID, myMoveResponse);
    // sendMyMoveResponse(game.gameID, game.currentGuessResults, myMoveResponse.isOpponentWon);
  }, [myMoveResponse]);

  useEffect(() => {
    game.gameStarted && playListeners(onOpponentPlayed, onMyMoveResponse);
  }, [game.gameStarted, myMoveResponse]);

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
      console.log("countOfHits", countOfHits, "countOfShipParts", countOfShipParts);
      if (countOfHits === countOfShipParts) {
        isOpponentWon = true;
        console.log("opponent won the game");
      }
    }
    setMyMoveResponse({ guess, x, y, shipID: game.myTable[x][y].shipID, isOpponentWon });
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
  function mouseHandler(action, x, y) {
    highLevelDispatch({
      type: action,
      payload: { x, y },
    });
  }

  function shoot(x, y) {
    if(game.opponentTable[x][y].cellStatus === "") {
    setMyMove({ x, y });
    }
  }
  const waitingMessage = game.opponentName ? `Waiting for ${game.opponentName} to be ready...` : "Waiting for opponent to join...";
  return (
    <>
      <main className="grid-game-container">
        {game.opponentDisconnected && <div className="opponent-disconnected">{game.opponentName} has left the game</div>}
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
          {(!game.opponentName || !game.isOpponentReady) ? (
            <h3 className="wait-to-player">{waitingMessage}</h3>
          ) : (
            <>
              <h2 className="name opponent-name-clr-bg">{game.opponentName}</h2>
              <div className="legend-board-container opponent">
              {!game.myTurn && <div className="opponent-turn"/>}
              {/* {!game.isOpponentReady && <div className="opponent-turn">{waitingMessage}</div>} */}
                {/* !!!!!!! OPPONENT GAME !!!!!!!! */}
                <GameBoard
                  table={game.opponentTable}
                  handleClick={shoot}
                  // mouseHandler={mouseHandler}
                />
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
        {game.gameOverMessage && <GameOverAlert isWonTheGame={game.winner} highLevelDispatch={highLevelDispatch} />}
      </main>
    </>
  );
}
