import cloneDeep from "lodash.clonedeep";
import { initBoard, initLegend } from "../utils/InitTableGame";

export default function highLevelReducer(state, { type, payload }) {
  switch (type) {
    case "SET_MY_ID":
      return {
        ...state,
        myID: payload.myID,
      };

    case "GAME_ID_REQUIRED":
      return {
        ...state,
        myName: payload.myName,
        gameIDRequired: true,
      };

    case "JOIN_GAME_REQUIRED":
      return {
        ...state,
        myName: payload.myName,
        joinGameRequired: true,
      };

    case "SET_OPPONENT_NAME":
      return {
        ...state,
        opponentName: payload.opponentName,
        opponentID: payload.opponentID,
        isOpponentReady: payload.isOpponentReady,
      };

    case "ENTER_NAME":
      return {
        ...state,
        myName: payload.myName,
      };

    case "CREATE_A_GAME":
      const createGameState = cloneDeep(state);
      createGameState.gameID = payload.gameID;
      createGameState.myTurn = true;
      createGameState.gameState = "PLACE_SHIPS";
      return createGameState;

    case "JOIN_A_GAME":
      const joinGameState = cloneDeep(state);
      joinGameState.gameID = payload.gameID;
      joinGameState.gameState = "PLACE_SHIPS";
      return joinGameState;

    case "PLACE_SHIPS":
      const placeState = cloneDeep(state);
      placeState.imReady = true;
      placeState.myTable = cloneDeep(payload.myTable);
      placeState.myTable.forEach((row) => {
        row.forEach((cell) => {
          cell.disable = true;
          cell.removeShip = false;
          cell.className = "cell";
          cell.shipID && (cell.cellStatus = "placed-ship");
        });
      });
      placeState.myLegend = cloneDeep(payload.myLegend);
      placeState.gameState = "GAME_STARTED";
      return placeState;

    case "MOUSE_OVER":
      const mouseOverState = cloneDeep(state);
      const cellOver = mouseOverState.opponentTable[payload.x][payload.y];
      if (!cellOver?.axe) cellOver.cellStatus = "hover-ship";
      return mouseOverState;

    case "MOUSE_LEAVE":
      const mouseLeaveState = cloneDeep(state);
      mouseLeaveState.opponentTable.forEach((row) => {
        row.forEach((cell) => {
          if (!cell?.axe) {
            cell.shipID ? (cell.cellStatus = "hit") : (cell.cellStatus = "");
          }
        });
      });
      return mouseLeaveState;

    case "OPPONENT_IS_READY":
      const opponentReadyState = cloneDeep(state);
      opponentReadyState.isOpponentReady = true;
      return opponentReadyState;

    case "OPPONENT_PLAYED":
      const opponentPlayedState = cloneDeep(state);
      opponentPlayedState.myTurn = payload.guess === "miss" ? true : false;
      opponentPlayedState.myTable[payload.x][payload.y].cellStatus =
        payload.guess;
      const shipID = opponentPlayedState.myTable[payload.x][payload.y].shipID;
      opponentPlayedState.currentGuessResults = {
        guess: payload.guess,
        x: payload.x,
        y: payload.y,
        shipID: shipID,
      };

      if (payload.guess === "hit") {
        const shipInLegend = opponentPlayedState.myLegend.findIndex(
          (ship) => ship.shipID === shipID
        );
        opponentPlayedState.myLegend[shipInLegend].numOfHits++;
      }
      if (payload.isOpponentWon) {
        opponentPlayedState.gameOverMessage = true;
      }

      return opponentPlayedState;

    case "MY_MOVE_RESPONSE":
      const myMoveResponseState = cloneDeep(state);
      myMoveResponseState.opponentTable[payload.x][payload.y].cellStatus =
        payload.guess;
      myMoveResponseState.myTurn = payload.guess === "hit" ? true : false;
      if (payload.shipID) {
        myMoveResponseState.opponentTable[payload.x][payload.y].shipID =
          payload.shipID;

        const shipInLegend = myMoveResponseState.opponentLegend.findIndex(
          (ship) => ship.shipID === payload.shipID
        );
        myMoveResponseState.opponentLegend[shipInLegend].shipLocation.push({
          x: payload.x,
          y: payload.y,
        });
        myMoveResponseState.opponentLegend[shipInLegend].numOfHits++;
        if (payload.isIWon) {
          myMoveResponseState.winner = true;
          myMoveResponseState.gameOverMessage = true;
          myMoveResponseState.gameState = "GAME_OVER";
        }
      }
      return myMoveResponseState;

    case "GAME_OVER":
      const gameOverState = cloneDeep(state);
      gameOverState.gameState = "GAME_OVER";
      return gameOverState;

    case "WINNER":
      const winnerState = cloneDeep(state);
      winnerState.winner = true;
      winnerState.gameOverMessage = true;
      return winnerState;

    case "LOSER":
      const loserState = cloneDeep(state);
      loserState.loser = true;
      loserState.gameOverMessage = true;
      return loserState;

    case "CLOSE_GAME_OVER_MESSAGE":
      const closeGameOverMessageState = cloneDeep(state);
      closeGameOverMessageState.gameOverMessage = false;
      return closeGameOverMessageState;

    case "SET_NEW_GAME":
      const newGameState = cloneDeep(state);
      newGameState.gameState = "PLACE_SHIPS";
      // newGameState.myName = null;
      // newGameState.myID = null;
      // newGameState.opponentName = null;
      // newGameState.opponentID = null;
      newGameState.myTable = [];
      newGameState.myLegend = [];
      newGameState.opponentTable = initBoard();
      newGameState.opponentLegend = initLegend();
      newGameState.isOpponentReady = false;
      newGameState.gameOverMessage = false;
      newGameState.winner = false;
      newGameState.loser = false;
      newGameState.gameIDRequired = false;
      newGameState.joinGameRequired = false;
      newGameState.currentGuessResults = null;
      newGameState.imReady = false;
      newGameState.opponentDisconnected = false;
      return newGameState;

    case "OPPONENT_DISCONNECTED":
      const opponentDisconnectedState = cloneDeep(state);
      opponentDisconnectedState.gameState = "GAME_OVER";
      opponentDisconnectedState.opponentDisconnected = true;
      return opponentDisconnectedState;
 
    case "RESET_SESSION":
      const resetSessionState = cloneDeep(state);
      resetSessionState.gameState = "ENTER_NAME";
      resetSessionState.myName = null;
      resetSessionState.myID = null;
      resetSessionState.opponentName = null;
      resetSessionState.opponentID = null;
      resetSessionState.myTable = [];
      resetSessionState.myLegend = [];
      resetSessionState.opponentTable = initBoard();
      resetSessionState.opponentLegend = initLegend();
      resetSessionState.isOpponentReady = false;
      resetSessionState.gameOverMessage = false;
      resetSessionState.winner = false;
      resetSessionState.loser = false;
      resetSessionState.gameIDRequired = false;
      resetSessionState.joinGameRequired = false;
      resetSessionState.currentGuessResults = null;
      resetSessionState.imReady = false;
      resetSessionState.opponentDisconnected = false;
      return resetSessionState;

    default:
      return { ...state };
  }
}
