import React from "react";
import Alert from "@mui/material/Alert";

function closeButton(highLevelDispatch){
  highLevelDispatch({
    type: "CLOSE_GAME_OVER_MESSAGE",
  });

}
export default function GameOverAlert({isWonTheGame, highLevelDispatch}) {
  console.log("isWonTheGame", isWonTheGame);

  const alertSeverity = isWonTheGame ? "success" : "info";
  const alertMessage = isWonTheGame
    ? "You won the game!"
    : "You lost the game!";
  return (
    <Alert severity={alertSeverity} onClose={() => {closeButton(highLevelDispatch)}}>
      {alertMessage}
    </Alert>
  );
}
