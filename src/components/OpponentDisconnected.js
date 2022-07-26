import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FaceTwoToneIcon from "@mui/icons-material/FaceTwoTone";

export default function OpponentDisconnected({ opponentName, setResetSession }) {
  const [open, setOpen] = React.useState(true);

  function handleClick() {
    setOpen(false);
    setResetSession(true);
  }
  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <DialogTitle id="alert-dialog-title">
          {opponentName} has been disconnected
        </DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <FaceTwoToneIcon color="primary" sx={{ fontSize: 40 }} />
        </Box>
        <DialogContent>Click here to start a new session</DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => handleClick()}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
