import * as React from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";

export default function WaitingLoader({ opponentName }) {
  return (
    <div>
      <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <DialogTitle id="alert-dialog-title">
          Request sent to {opponentName}
        </DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
        <DialogContent>Waitng for answer</DialogContent>
      </Dialog>
    </div>
  );
}
