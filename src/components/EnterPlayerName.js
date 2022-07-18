import React, { useEffect } from "react";
import { createGame, joinGame } from "../api/sockets";

export default function EnterPlayerName({gameID, highLevelDispatch, onOpponentName, onHostName, gameIDRequired, joinGameRequired }) {
  const [myName, setMyName] = React.useState("");
  const [gameID, setGameID] = React.useState("");
  const [amIready, setAmIReady] = React.useState(false);

  useEffect(() => {
    gameIDRequired === true && createGame(setAmIReady, highLevelDispatch, onOpponentName);
  }, [gameIDRequired]);

  useEffect(() => {
    joinGameRequired === true &&
      joinGame(gameID, myName, highLevelDispatch, onOpponentName);
  }, [joinGameRequired]);

  useEffect(() => {
    sendImReady(gameID)
  }, [amIready]);

  function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { myName: myNameForm, gameID: gameIDForm } =
      Object.fromEntries(formData);
    setMyName(myNameForm);
    setGameID(gameIDForm);
    if (myNameForm) {
      highLevelDispatch({
        type: "ENTER_NAME",
        payload: {
          myName: myNameForm,
        },
      });
      if (!gameIDForm) {
        highLevelDispatch({
          type: "GAME_ID_REQUIRED",
        });
      } else {
        highLevelDispatch({
          type: "JOIN_GAME_REQUIRED",
        });
      }
    }
  }
  return (
    <form onSubmit={handleFormSubmit}>
      <label>
        Your Name:
        <input type="text" name="myName" placeholder="Enter your name" />
      </label>
      
      <label>
        Game ID:
        <input
          type="text"
          name="gameID"
          placeholder="Empty to create new game"
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
