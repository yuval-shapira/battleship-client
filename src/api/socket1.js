import io from "socket.io-client";

let socket;

export function openSocket(highLevelDispatch, onOpponentDisconnected) {
  socket = io("http://localhost:3030");
  //socket = io("https://battleship-game-yuval.herokuapp.com");
  socket.on("connect", () => {});
  socket.on("socket_id", (mySocketID) => {
  highLevelDispatch({
    type: "SET_MY_ID",
    payload: { myID: mySocketID },
  });
  });
  
  socket.on("disconnected", onOpponentDisconnected);
}

// player 1
export function createGame(setAmIReady, highLevelDispatch, onOpponentName) {
  const gameID = Math.round(Math.random() * 1000000).toString(36);
  highLevelDispatch({
    type: "CREATE_A_GAME",
    payload: { gameID },
  });
  socket.emit("create_a_game", gameID);
  socket.on("player2_name", onOpponentName);

  socket.on("opponent_is_ready", () => {
    console.log("opponent is ready");
    highLevelDispatch({
        type: "OPPONENT_IS_READY",
        });
  });
  socket.on(am_i_ready, () => {
    setAmIReady(true);
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
    console.log("opponent is ready");
    highLevelDispatch({
        type: "OPPONENT_IS_READY",
        });
  });
  socket.emit("are_you_ready", gameID);
}

export function sendMyName(gameID, playerName) {
  socket.emit("get_host_name", { gameID, playerName });
}



export function sendImReady(gameID){
    socket.emit("i_am_ready", gameID);
}

export function sendMyMove(gameID, myMove, highLevelDispatch) {
  const { x, y } = myMove;
  socket.emit("my_move", { gameID, x, y });
}

export function sendMyMoveResponse(gameID, myMoveResponse, highLevelDispatch) {
  const { guess, x, y, shipID, isOpponentWon} = myMoveResponse;
  socket.emit("my_move_response", { gameID, guess, x, y, shipID, isOpponentWon });
}
export function playListeners(onOpponentPlayed, onMyMoveResponse) {
  //opponent played
  socket.off("opponent_played");
  socket.off("my_move_response");
  socket.on("opponent_played", onOpponentPlayed);

  //response for my move (hit or miss or game over)
  socket.on("my_move_response", onMyMoveResponse);
}