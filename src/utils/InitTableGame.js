export default function initTableGame() {
  const initTableGame = createTableGame();
  const legendArray = createLegend();
  return {
    legend: legendArray,
    table: initTableGame,
    player1: null,
    player2: null,
    selectedShip: {
      shipID: null,
      shipSize: null,
      shipNum: null,
      x: null,
      y: null,
    },
    firstPlaced: false,
    numOfShipsPlaced: 0,
    gameStarted: false,
  };
}
export function initBoard() {
  return createTableGame();
}
export function initLegend() {
  return createLegend();
}
function createTableGame() {
  //BOARD
  const newTableGame = [];
  for (let i = 0; i < 11; i++) {
    newTableGame.push([]);
    for (let j = 0; j < 11; j++) {
      newTableGame[i].push({
        className: "",
        cellStatus: "",
        disable: false,
        shipID: null,
        removeShip: false,
      });
    }
  }
  //AXES
  newTableGame[0][0].cellStatus = "axe";
  for (let i = 1; i < 11; i++) {
    newTableGame[0][i].axe = i;
    newTableGame[0][i].cellStatus = "axe";
    newTableGame[0][i].disable = true;
    newTableGame[i][0].axe = (i + 9).toString(36).toUpperCase();
    newTableGame[i][0].cellStatus = "axe";
    newTableGame[i][0].disable = true;
  }
  return newTableGame;
}
function createLegend() {
  const newLegendArray = [];
  for(let shipSize = 4; shipSize >= 1; shipSize--){
    for(let shipNum = 1; shipNum <= 5-shipSize; shipNum++){
      newLegendArray.push({
        shipID: `ship-${shipSize}-${shipNum}`,
        className: `ship-${shipSize}`,
        shipSize: shipSize,
        shipNum: shipNum,
        shipLocation: [],
        isPlaced: null,
        numOfHits: 0,
      });
    }
  }
  return newLegendArray;
}
