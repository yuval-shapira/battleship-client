import React, { useEffect } from "react";
import NewButton from "./NewButton";
import { createGame, joinGame } from "../api/sockets";

export default function EnterPlayerName({
  highLevelDispatch,
  onOpponentName,
  gameIDRequired,
  joinGameRequired,
}) {
  const [createOrJoin, setCreateOrJoin] = React.useState("Create Game");
  const [myName, setMyName] = React.useState("");
  const [gameID, setGameID] = React.useState("");

  useEffect(() => {
    gameIDRequired && createGame(highLevelDispatch, onOpponentName);
  }, [gameIDRequired]);

  useEffect(() => {
    joinGameRequired &&
      joinGame(gameID, myName, highLevelDispatch, onOpponentName);
  }, [joinGameRequired]);

  function handleFormSubmit(e){
    e.preventDefault();
    handleClick();
  }
  
  function handleClick() {
    const regName = /^[A-Za-z][A-Za-z ][A-Za-z]{3,12}$/;
    const regGameID = /^[A-Za-z0-9]{3,4}$/;
    if (createOrJoin === "Create Game") {
      if (regName.test(myName)) {
        highLevelDispatch({
          type: "GAME_ID_REQUIRED",
          payload: {
            myName: myName,
          },
        });
      }
    }
    if (createOrJoin === "Join Game") {
      if (regName.test(myName) && regGameID.test(gameID)) {
        highLevelDispatch({
          type: "JOIN_GAME_REQUIRED",
          payload: {
            myName: myName,
          },
        });
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
