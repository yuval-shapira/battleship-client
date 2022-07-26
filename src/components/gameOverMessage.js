import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function GameOverAlert({ isWonTheGame, highLevelDispatch }) {
  const [open, setOpen] = React.useState(true);

  const closeButton = () => {
    setOpen(false);
    highLevelDispatch({
      type: "CLOSE_GAME_OVER_MESSAGE",
    });
  };
  const titleMSG = isWonTheGame ? "Congratulations!" : "Too bad....";
  const message = isWonTheGame ? "You won the game" : "You lost the game";
  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{titleMSG}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => closeButton()}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
