import React from "react";
import Cell from "./Cell";

export default function GameBoard({table, handleClick = null, mouseHandler, removeShipHanler = null}) {

  return (
        <div className="game-grid">
        {table.map((row, x) => (
          <div className="row" key={x}>
            {row.map((cell, y) => (
              <Cell
                key={`${x}${y}`}
                cell={cell}
                x={x}
                y={y}
                handleClick={handleClick ? handleClick : null}
                mouseHandler={mouseHandler}
                removeShipHanler={removeShipHanler ? removeShipHanler : null}
              />
            ))}
            {/* add class name logic - start with change className to status... */}
          </div>
        ))}
      </div>
    );
}

