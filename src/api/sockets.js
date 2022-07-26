import io from "socket.io-client";

let socket;

export function openSocket(highLevelDispatch) {
  //socket = io("http://localhost:3030");
  socket = io("https://battleship-game-yuval-shapira.herokuapp.com");
  socket.on("connect", () => {});
  socket.on("socket_id", (mySocketID) => {
    highLevelDispatch({
      type: "SET_MY_ID",
      payload: { myID: mySocketID },
    });
  });
}

// player 1
export function createGame(highLevelDispatch, onOpponentName) {
  const gameID = Math.round(Math.random() * 1000000).toString(36);

  highLevelDispatch({
    type: "CREATE_A_GAME",
    payload: { gameID },
  });
  socket.emit("create_a_game", gameID);
  socket.on("player2_name", onOpponentName);

  socket.on("opponent_is_ready", () => {
    highLevelDispatch({
      type: "OPPONENT_IS_READY",
    });
  });
}

// player 2
export function joinGame(
  gameID,
  playerName,
  highLevelDispatch,
  onOpponentName
) {
  highLevelDispatch({
    type: "JOIN_A_GAME",
    payload: { gameID },
  });
  socket.on("player1_name", onOpponentName);
  socket.emit("join_to_existing_game", { gameID, playerName });

  socket.on("opponent_is_ready", () => {
    highLevelDispatch({
      type: "OPPONENT_IS_READY",
    });
  });
}

export function disconnectesListener(playerID, onOpponentDisconnected) {
  socket.on("opponent disconnected", onOpponentDisconnected);
}

export function sendMyName(gameID, playerName, isPlayerReady) {
  socket.emit("get_host_name", { gameID, playerName, isPlayerReady });
}

export function sendImReady(gameID) {
  socket.emit("i_am_ready", gameID);
}

export function sendMyMove(gameID, myMove) {
  const { x, y } = myMove;
  socket.emit("my_move", { gameID, x, y });
}

export function sendMyMoveResponse(gameID, myMoveResponse) {
  const { guess, x, y, shipID, isOpponentWon } = myMoveResponse;
  socket.emit("my_move_response", {
    gameID,
    guess,
    x,
    y,
    shipID,
    isOpponentWon,
  });
}
// Refresh the state inside the functions
export function playListeners(onOpponentPlayed, onMyMoveResponse) {
  socket.off("opponent_played");
  socket.off("my_move_response");
  socket.on("opponent_played", onOpponentPlayed);
  socket.on("my_move_response", onMyMoveResponse);
}

export function endOfGameListeners(setNewGameReq, onOpponentResponse) {
  socket.on("new_game_req", (playerName) => {
    setNewGameReq(playerName);
  });
}

export function sendNewGameRequest(gameID, playerName, onOpponentResponse) {
  socket.off("new_game_response");
  socket.emit("new_game_request", { gameID, playerName });
  socket.on("new_game_response", onOpponentResponse);
}

export function responseForNewGame(gameID, myResponse) {
  socket.emit("new_game_response", { gameID, myResponse });
}
// when opp disconnected, it's required to close all socket in order to set new game
export function closeSockets() {
  socket.off("player1_name");
  socket.off("player2_name");
  socket.off("opponent_is_ready");
  socket.off("opponent_played");
  socket.off("my_move_response");
  socket.off("new_game_req");
  socket.off("new_game_response");
  socket.off("opponent disconnected");
}
