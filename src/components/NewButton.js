import * as React from "react";
// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
import Button from "@mui/material/Button";
// import Typography from '@mui/material/Typography';

export default function NewButton({ action, func }) {
  let text, color, variant;
  switch (action) {
    case "I-am-ready":
      text = "Lets Play";
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

  // const card = (
  //     <React.Fragment>
  //       <CardContent>
  //         <Typography variant="h5" component="div">
  //           Invite {opponentName} for another game
  //         </Typography>
  //       </CardContent>
  //       <CardActions sx={{justifyContent: 'flex-end'}}>
  //         <Button >Learn More</Button>
  //       </CardActions>
  //     </React.Fragment>
  //   );
  return (
    <Button color={color} variant={variant} onClick={() => func()}>
      {text}
    </Button>
    // <Box sx={{ width: 300, textAlign: 'center', justifyContent: 'center'}}>
    //   <Card >{card}</Card>
    // </Box>
  );
}
