import React, { useEffect, useState } from "react";
import { Button } from "../Controls/Button";
import "./Tetris.css";
import { TetrisEngine } from "./TetrisEngine";
import { TetrisMenu } from "./TetrisMenu";

interface TetrisController {
  engine: TetrisEngine;
  menu: TetrisMenu;
}

let controller = new Map<string, TetrisController>();

function useTetrisEngine(props: TetrisProps) {
  let ctl = controller.get(props.id);
  if (!ctl) {
    let engine = new TetrisEngine(props.width, props.height);
    let menu = new TetrisMenu(engine);
    ctl = {
      engine: engine,
      menu: menu,
    };
    controller.set(props.id, ctl);
  }
  return ctl;
}

export interface TetrisProps {
  id: string;
  height: number;
  width: number;
}

export function Tetris(props: TetrisProps) {
  let [trigger, setTrigger] = useState(false);
  let ctl = useTetrisEngine(props);
  ctl.engine.trigger = () => setTrigger(!trigger);

  useEffect(() => {
    let timer = setInterval(() => {
      ctl.engine.update();
      setTrigger(!trigger);
    }, 1);

    let keyHandler = (event: any) => {
      switch (event.key) {
        case "ArrowLeft":
          ctl.engine.moveLeft();
          break;
        case "ArrowRight":
          ctl.engine.moveRight();
          break;
        case "Y":
        case "y":
          ctl.engine.rotateCCW();
          break;
        case "x":
        case "X":
          ctl.engine.rotateCW();
          break;
        case "ArrowDown":
          ctl.engine.moveDown();
          break;
        case " ":
          ctl.menu.pause();
          break;
        default:
          console.log(event.key);
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => {
      window.removeEventListener("keydown", keyHandler);
      clearInterval(timer);
    };
  }, [ctl, props.id, trigger]);

  function renderField(id: string, field: number[][], block: number[][]) {
    return field.map((row, y) => renderRow(id, row, y, block));
  }

  function renderRow(id: string, row: number[], y: number, block: number[][]) {
    return (
      <div className="BlockRow" key={"tetris-game-" + id + "-" + id + "-" + y}>
        {row.map((cell, x) => renderCell(id, cell, x, y, block))}
      </div>
    );
  }

  function renderCell(
    id: string,
    cell: number,
    x: number,
    y: number,
    block: number[][]
  ) {
    if (cell > 25) {
      return (
        <div
          className="Block Empty"
          key={"tetris-game-" + id + "-" + y + "-" + x}
        ></div>
      );
    } else if (cell > 1) {
      return (
        <div
          className="Block Full"
          key={"tetris-game-" + id + "-" + y + "-" + x}
        ></div>
      );
    } else if (cell > 0) {
      return (
        <div
          className="Block Settled"
          key={"tetris-game-" + id + "-" + y + "-" + x}
        ></div>
      );
    } else if (block[y][x] > 0) {
      return (
        <div
          className="Block Moving"
          key={"tetris-game-" + id + "-" + y + "-" + x}
        ></div>
      );
    } else {
      return (
        <div
          className="Block"
          key={"tetris-game-" + id + "-" + y + "-" + x}
        ></div>
      );
    }
  }

  return (
    <div className="Tetris">
      <div className="Controls">
        <div className="Control">
          <div>level</div>
          <div>score</div>
          <div>next</div>
        </div>
        <div>
          <div>{ctl.engine.getLevel()}</div>
          <div>{ctl.engine.getScore()}</div>
        </div>
        <Button
          className="Menu"
          onClick={() => {
            ctl.menu.pause();
          }}
        >
          <span className="MaterialIcons">menu</span>
        </Button>
      </div>

      <div className="Board">
        <div className="Next">
          {renderField(
            "next",
            ctl.engine.getNextField(),
            ctl.engine.getNextBlock()
          )}
        </div>
        {ctl.menu.render()}
        <div className="Game">
          {renderField("game", ctl.engine.getField(), ctl.engine.getBlock())}
        </div>
      </div>

      <div className="Controls Bottom">
        <div>
          <Button onClick={() => ctl.engine.moveLeft()}>
            <span className="MaterialIcons">arrow_left</span>
          </Button>
          <Button onClick={() => ctl.engine.moveRight()}>
            <span className="MaterialIcons">arrow_right</span>
          </Button>
        </div>
        <div>
          <Button onClick={() => ctl.engine.moveDown()}>
            <span className="MaterialIcons">arrow_drop_down</span>
          </Button>
        </div>
        <div>
          <Button onClick={() => ctl.engine.rotateCW()}>
            <span className="MaterialIcons">rotate_right</span>
          </Button>
          <Button onClick={() => ctl.engine.rotateCCW()}>
            <span className="MaterialIcons">rotate_left</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
