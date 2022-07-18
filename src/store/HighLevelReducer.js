//import React from "react";
import cloneDeep from "lodash.clonedeep";

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
        gameIDRequired: true,
      };
    case "JOIN_GAME_REQUIRED":
      return {
        ...state,
        joinGameRequired: true,
      };
    case "SET_OPPONENT_NAME":
      return {
        ...state,
        opponentName: payload.opponentName,
        opponentID: payload.opponentID,
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
      placeState.gameStarted = true;
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
          //cell.className = cell.className.replace(" hover-ship", "");
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
      // opponentPlayedState.opponentLegend[shipInLegend].shipLocation.push({
      //   x: payload.x,
      //   y: payload.y,
      // });
      opponentPlayedState.myLegend[shipInLegend].numOfHits++;
      }
      console.log("isOpponentWon:", payload.isOpponentWon)
      if(payload.isOpponentWon){
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
        // myMoveResponseState.opponentLegend[shipInLegend]?.numberOfHits
        //   ? myMoveResponseState.opponentTable[payload.x][payload.y]
        //       .numberOfHits++
        //   : (myMoveResponseState.opponentLegend[shipInLegend].numberOfHits = 1);
        //  console.log("num of hits:", myMoveResponseState.opponentLegend[shipInLegend].numberOfHits);
        console.log("isIWon:", payload.isIWon)
        if(payload.isIWon){
        myMoveResponseState.winner = true;
        myMoveResponseState.gameOverMessage = true;
      }
      }
      return myMoveResponseState;
    case "WINNER":
      const winnerState = cloneDeep(state);
      winnerState.winner = true;
      winnerState.gameOverMessage = true;
      return winnerState;
    case "LOSER":
      const loserState = cloneDeep(state);
      loserState.gameOverMessage = true;
      return loserState;
    case "CLOSE_GAME_OVER_MESSAGE":
      const closeGameOverMessageState = cloneDeep(state);
      closeGameOverMessageState.gameOverMessage = false;
      return closeGameOverMessageState;
    case "OPPONENT_DISCONNECTED":
      const opponentDisconnectedState = cloneDeep(state);
      opponentDisconnectedState.opponentDisconnected = true;
      return opponentDisconnectedState;
      
    default:
      return { ...state };
  }
}
