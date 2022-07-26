import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export default function StartNewGame({setNewGameReq, setNewGameRes}) {
   const [open, setOpen] = React.useState(true);
  
   // let open = true;

  //   const handleClickOpen = () => {
  //     setOpen(true); 
  //   };
  function handleClick(action){
    //setNewGameReq(null);
    setOpen(false);
    setNewGameRes(action);
  };

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Do you want to play another game?
        </DialogTitle>
        <DialogContent>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => handleClick("no")}>
            No
          </Button>
          <Button variant="contained" onClick={() => handleClick("yes")} autoFocus>
            Yes, I want to play
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
