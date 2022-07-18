import { useEffect, useState } from "react";
import io from "socket.io-client";

function openSocket() {
  const socket = io("http://localhost:3030");
  socket.on("connect", () => {
    console.log("connected", socket.id);
  });
  // socket.on("opponent_name", onOpponentName);

  // //opponent played
  // socket.on("opponent_played", onOpponentPlayed);
  // //response for my move (hit or miss or game over)
  // socket.on("my_move_response", onMyMoveResponse);
  return socket;
}

export const useSocket = (
  onOpponentName,
  onOpponentPlayed,
  onMyMoveResponse
) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const gameSocket = openSocket();
    setSocket(gameSocket);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("create_a_game");
      socket.on("opponent_name", onOpponentName);
      socket.on("on_oppent_played", onOpponentPlayed);
    }
    return () => {
      if (socket) {
        socket.off("opponent_name");
        socket.off("on_oppent_played");
      }
    };
    
  }, [socket, onOpponentName, onOpponentPlayed]);

  // socket.on("opponent_played", onOpponentPlayed);
};
// export function createGame(createCb) {
//       console.log("socket", socket);
//       socket.emit("create_a_game");
//       socket.on("game_ID", createCb);
//       //socket.on("opponent_name", joinCb);
//     }
// // player 2

// export function joinGame(gameID, playerName, joinCb) {
//       console.log("joinGame", gameID, playerName);
//       socket.emit("join_to_existing_game", { gameID, playerName });
//       socket.on("host_name", joinCb);
//     }

// export function sendMyName(gameID, playerName) {
//   console.log("P2_name_to_update_at_p1", playerName);
//   socket.emit("opponent_name", { gameID, playerName });
//}
