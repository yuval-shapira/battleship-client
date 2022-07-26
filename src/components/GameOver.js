import React, { useEffect } from "react";
import LegendBoard from "./LegendBoard";
import GameBoard from "./GameBoard";
import DisableBoard from "./DisableBoard";
import { endOfGameListeners, sendNewGameRequest, responseForNewGame, closeSockets } from "../api/sockets";
import GameOverAlert from "./gameOverMessage"; 
import NewGameButton from "./NewButton";
import StartNewGame from "./StartNewGame";
import WaitingLoader from "./WaitingLoader";
import NoGameMessage from "./NoGameMessage";
import OpponentDisconnected from "./OpponentDisconnected";

export default function GameOver({ game, highLevelDispatch }) {
  const [waitingLoader, setWaitingLoader] = React.useState(false);
  const [newGameReq, setNewGameReq] = React.useState(null);
  const [newGameRes, setNewGameRes] = React.useState(null);
  const [resetSession, setResetSession] = React.useState(false);
  const [noGameMessage, setNoGameMessage] = React.useState(false);

  useEffect(() => {
    endOfGameListeners(setNewGameReq, onOpponentResponse);
    }
    , []);

  useEffect(() => {
    if(newGameRes) {
      responseForNewGame(game.gameID, newGameRes);
      if(newGameRes === "yes") {
        highLevelDispatch({ type: "SET_NEW_GAME" });
      }
      setNewGameRes(null);
      setNewGameReq(null);
    };
  }, [newGameRes]); 

  useEffect(() => {
    resetSession && 
      highLevelDispatch({ type: "RESET_SESSION" });
  }, [resetSession]); 
    
  function newGameRequest() {
    setWaitingLoader(true);
    sendNewGameRequest(game.gameID, game.myName, onOpponentResponse);
  }
  function onOpponentResponse(answer){
    setWaitingLoader(false)
    if(answer === "yes"){
      highLevelDispatch({
        type: "SET_NEW_GAME",
      });
    }else{
      setNoGameMessage(true);
    }
  }
  return (
    <>
      <main className="grid-game-container">

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
          <h2 className="name opponent-name-clr-bg">{game.opponentName}</h2>
          <div className="legend-board-container opponent">
            <DisableBoard
              myTurn={game.myTurn}
              winner={game.winner}
              loser={game.loser}
            />
            {/* !!!!!!! OPPONENT GAME !!!!!!!! */}
            <GameBoard table={game.opponentTable} />
            {/* !!!!!!! OPPONENT LEGEND !!!!!!!! */}
            <LegendBoard
              legendTable={game.opponentLegend}
              playerType={"player2"}
              gameState={game.gameState}
            />
          </div>
        </div>
      </main>
       <div className="new-game-container">
             <h3 className="new-game-button">
                Invite {game.opponentName} for another game:
                <NewGameButton action={"request-new-game"} func={newGameRequest}/>
            </h3>
        </div>
        {game.gameOverMessage && (
          <GameOverAlert
            isWonTheGame={game.winner}
            highLevelDispatch={highLevelDispatch}
          />
        )}
        {waitingLoader && (<WaitingLoader opponentName={game.opponentName}/>)}
        {newGameReq && <StartNewGame 
      setNewGameRes={setNewGameRes}
      setNewGameReq={setNewGameReq}
      />}
        {noGameMessage && <NoGameMessage
        opponentName={game.opponentName}
        setNoGameMessage={setNoGameMessage}
        setNewGameRes={setNewGameRes} />}
      {game.opponentDisconnected && (closeSockets(),
      <OpponentDisconnected 
      opponentName={game.opponentName}
      setResetSession={setResetSession}
      />)}
    </>
  );
}
