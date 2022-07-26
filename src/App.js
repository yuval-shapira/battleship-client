import "./App.css";
import React, { useEffect } from "react";
import highLevelReducer from "./store/HighLevelReducer";
import { initBoard, initLegend } from "./utils/InitTableGame";
import EnterPlayerName from "./components/EnterPlayerName";
import GameBuilder from "./components/GameBuilder";
import PlayGame from "./components/PlayGame";
import GameOver from "./components/GameOver";

import { openSocket, sendMyName, disconnectesListener } from "./api/sockets";

const initHighLevelState = {
  gameState: "ENTER_NAME",
  gameID: null,
  myName: null,
  myID: null,
  opponentName: null,
  opponentID: null,
  myTable: initBoard(),
  myLegend: initLegend(),
  opponentTable: initBoard(),
  opponentLegend: initLegend(),
  isOpponentReady: false,
  gameOverMessage: false,
  winner: false,
  gameIDRequired: false,
  joinGameRequired: false,
  myTurn: false,
  currentGuessResults: null,
  imReady: false,
  opponentDisconnected: false,
};
export default function App() {
  const [highLevelState, highLevelDispatch] = React.useReducer(
    highLevelReducer,
    initHighLevelState
  );
  const [dataToSend, setDataToSend] = React.useState(null);
  const [addDisconnectListener, setAddDisconnectListener] =
    React.useState(false);

  useEffect(() => {
    dataToSend &&
      sendMyName(dataToSend.gameID, dataToSend.myName, highLevelState.imReady);
  }, [dataToSend]);

  useEffect(() => {
    addDisconnectListener &&
      disconnectesListener(highLevelState.opponentID, onOpponentDisconnected);
  }, [addDisconnectListener]); 

  useEffect(() => {
    openSocket(highLevelDispatch);
  }, []);

  function onOpponentName(data) {
    const { gameID, playerName, playerID, isPlayerReady = false } = data;
    const { myName, opponentName } = highLevelState;
    if (!opponentName) {
      setDataToSend({ gameID, myName });
      highLevelDispatch({
        type: "SET_OPPONENT_NAME",
        payload: {
          opponentName: playerName,
          opponentID: playerID,
          isOpponentReady: isPlayerReady,
        },
      });
      setAddDisconnectListener(true);
    }
  }
  function onOpponentDisconnected(opponentID) {
    if (opponentID === highLevelState.opponentID) {
      highLevelDispatch({
        type: "OPPONENT_DISCONNECTED",
      });
    }
  }

  function stateRender(highLevelState, highLevelDispatch) {
    switch (highLevelState.gameState) {
      case "ENTER_NAME":
        return (
          <EnterPlayerName
            highLevelDispatch={highLevelDispatch}
            onOpponentName={onOpponentName}
            gameIDRequired={highLevelState.gameIDRequired}
            joinGameRequired={highLevelState.joinGameRequired}
          />
        );
      case "PLACE_SHIPS":
        return (
          <GameBuilder
            highLevelDispatch={highLevelDispatch}
            game={highLevelState}
            onOpponentDisconnected={onOpponentDisconnected}
          />
        );
      case "GAME_STARTED":
        return (
          <PlayGame
            game={highLevelState}
            highLevelDispatch={highLevelDispatch}
          />
        );
      case "GAME_OVER":
        return (
          <GameOver
            game={highLevelState}
            highLevelDispatch={highLevelDispatch}
          />
        );
      default:
        return <div>Error</div>;
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to BattleShip</h1>
        {highLevelState.gameID && (
          <h2 className="game-ID">Game ID: {highLevelState.gameID}</h2>
        )}
      </header>
      {stateRender(highLevelState, highLevelDispatch)}
    </div>
  );
}
