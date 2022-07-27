import React, { useEffect } from "react";
import NewButton from "./NewButton";
import { createGame, joinGame, checkIfCanJionGame } from "../api/sockets";

export default function EnterPlayerName({
  highLevelDispatch,
  onOpponentName,
  gameIDRequired,
  joinGameRequired,
}) {
  const [createOrJoin, setCreateOrJoin] = React.useState("Create Game");
  const [myName, setMyName] = React.useState("");
  const [gameID, setGameID] = React.useState("");
  const [canJoinGame, setCanJoinGame] = React.useState(false);

  useEffect(() => {
    gameIDRequired &&
      createGame(highLevelDispatch, onOpponentName, setCanJoinGame);
  }, [gameIDRequired]);

  useEffect(() => {
    joinGameRequired &&
      joinGame(gameID, myName, highLevelDispatch, onOpponentName);
  }, [joinGameRequired]);

  useEffect(() => {
    if (canJoinGame) {
      highLevelDispatch({
        type: "JOIN_GAME_REQUIRED",
        payload: {
          myName: myName,
        },
      });
    }
  }, [canJoinGame]);

  function handleFormSubmit(e) {
    e.preventDefault();
    handleClick();
  }

  function handleClick() {
    if (createOrJoin === "Create Game") {
      if (myName) {
        highLevelDispatch({
          type: "GAME_ID_REQUIRED",
          payload: {
            myName: myName,
          },
        });
      }
    }
    if (createOrJoin === "Join Game") {
      if (myName && gameID) {
        checkIfCanJionGame(gameID, setCanJoinGame);

      }
    }
  }
  function handleCheckboxChange(e) {
    setCreateOrJoin(e.target.checked ? "Join Game" : "Create Game");
  }
  return (
    <>
      <form className="enter-name-form" onSubmit={handleFormSubmit}>
        <label>
          Your Name:
          <input
            type="text"
            name="myName"
            placeholder="Enter your name"
            onChange={(e) => setMyName(e.target.value)}
          />
        </label>
        <label>
          Check here if you have game ID:
          <input
            type="checkbox"
            name="joinCheckbox"
            onClick={handleCheckboxChange}
          />
        </label>
        {createOrJoin === "Join Game" && (
          <label>
            Game ID:
            <input
              type="text"
              name="gameID"
              placeholder="Enter game ID"
              onChange={(e) => setGameID(e.target.value)}
            />
          </label>
        )}
        <NewButton action={createOrJoin} func={handleClick} />
      </form>
    </>
  );
}
