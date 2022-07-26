import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

export default function NoGameMessage({opponentName, setNoGameMessage}) {
  const [open, setOpen] = React.useState(true);

  const closeButton = () => {
    setOpen(false);
    setNoGameMessage(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{opponentName} don`t want to play another game</DialogTitle>
        <DialogActions>
          <Button variant="outlined" onClick={() => closeButton()}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
