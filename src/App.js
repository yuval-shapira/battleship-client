import "./App.css";
import React, { useEffect } from "react";
import highLevelReducer from "./store/HighLevelReducer";
import {
  initOpponentTableGame,
  initOpponentLegend,
} from "./utils/InitTableGame";
import EnterPlayerName from "./components/EnterPlayerName";
import GameBuilder from "./components/GameBuilder";
import PlayGame from "./components/PlayGame";

import { openSocket, sendMyName} from "./api/sockets";
//import { Socket } from "socket.io-client";
//import io from "socket.io-client";
//import cloneDeep from "lodash.clonedeep";
//import { useSocket } from "./hooks/useSocket";

const initHighLevelState = {
  gameState: "ENTER_NAME",
  gameID: null,
  myName: null,
  myID: null,
  opponentName: null,
  opponentID: null,
  myTable: [],
  myLegend: [],
  opponentTable: initOpponentTableGame(),
  opponentLegend: initOpponentLegend(),
  isOpponentReady: false,
  gameOverMessage: false,
  winner: false,
  gameIDRequired: false,
  joinGameRequired: false,
  myTurn: false,
  currentGuessResults: null,
  gameStarted: false,
  opponentDisconnected: false
};
export default function App() {
  const [highLevelState, highLevelDispatch] = React.useReducer(
    highLevelReducer,
    initHighLevelState
  );
  useEffect(() => {
    openSocket(highLevelDispatch, onOpponentDisconnected);
  }, []);

    function onOpponentName(data) {
      const { gameID, playerName, playerID } = data;
      const { myName, opponentName } = highLevelState;
      if (!opponentName) {
        sendMyName(gameID, myName);
        highLevelDispatch({
          type: "SET_OPPONENT_NAME",
          payload: { 
            opponentName: playerName,
            opponentID: playerID },
        });
      }
    }
    function onHostName(data) {
      const { gameID, playerName } = data;
      const { myName, opponentName } = highLevelState;
      if (!opponentName) {
        sendMyName(gameID, myName);
        highLevelDispatch({
          type: "SET_OPPONENT_NAME",
          payload: { opponentName: playerName },
        });
      }
    }

function onOpponentDisconnected(opponentID){
  if(opponentID === highLevelState.opponentID){
    highLevelDispatch({
      type: "OPPONENT_DISCONNECTED",
    });
  }
}

  /* 
  
  creator ========= joiner 
  createGame ========= joinGame
  waitForOpponentName ========= oppenentName
  (got opponentName) => hostName ========= waitHostName
  startGame ========= waitStartGame
  
  */

  function stateRender(highLevelState, highLevelDispatch) {
    switch (highLevelState.gameState) {
      case "ENTER_NAME":
        return (
          <EnterPlayerName
            highLevelDispatch={highLevelDispatch}
            onOpponentName={onOpponentName}
            onHostName={onHostName}
            gameID={highLevelState.gameID}
            gameIDRequired={highLevelState.gameIDRequired}
            joinGameRequired={highLevelState.joinGameRequired}
          />
        );
      case "PLACE_SHIPS":
        console.log("App:", highLevelState.gameState);
        return (
          <GameBuilder
            highLevelDispatch={highLevelDispatch}
            myName={highLevelState.myName}
            opponentName={highLevelState.opponentName}
            opponentTable={highLevelState.opponentTable}
            opponentLegend={highLevelState.opponentLegend}
            gameState={highLevelState.gameState}
            isOpponentReady={highLevelState.isOpponentReady}
          />
        );
      case "GAME_STARTED":
        return (
          <PlayGame
            game={highLevelState}
            highLevelDispatch={highLevelDispatch}
          />
        );
      // case "GAME_OVER":
      //  return <GameOver highLevelDispatch={highLevelDispatch} />;
      default:
        return <div>Error</div>;
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to BattleShip</h1>
        {highLevelState.gameID && (<h2 className="game-ID">Game ID: {highLevelState.gameID}</h2>)}

      </header>
      {stateRender(highLevelState, highLevelDispatch)}
    </div>
  );
}
