import * as React from "react";
import Button from "@mui/material/Button";

export default function NewButton({ action, func }) {
  let text, color, variant;
  switch (action) {
    case "I-am-ready":
      text = "Let\`s Play";
      color = "success";
      variant = "contained";
      break;
    case "request-new-game":
      text = "Send Request";
      color = "secondary";
      variant = "text";
      break;
    case "Create Game":
      text = "Create Game";
      color = "primary";
      variant = "contained";
      break;
    case "Join Game":
      text = "Join Game";
      color = "primary";
      variant = "contained";
      break;

    default:
      break;
  }
  return (
    <Button color={color} variant={variant} onClick={() => func()}>
      {text}
    </Button>
  );
}
