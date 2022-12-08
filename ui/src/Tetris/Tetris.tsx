import React, { useEffect, useState } from "react";
import { Button } from "../Controls/Button";
import { Input } from "../Controls/Input";
import "./Tetris.css";
import { TetrisEngine, TetrisGameStage, TetrisMenu } from "./TetrisEngine";

let engines = new Map<string, TetrisEngine>();

function useTetrisEngine(props: TetrisProps) {
  let engine = engines.get(props.id);
  if (!engine) {
    engine = new TetrisEngine(props.width, props.height);
    engines.set(props.id, engine);
  }
  return engine;
}

export interface TetrisProps {
  id: string;
  height: number;
  width: number;
}

export function Tetris(props: TetrisProps) {
  let [trigger, setTrigger] = useState(false);
  let engine = useTetrisEngine(props);
  engine.trigger = () => setTrigger(!trigger);

  useEffect(() => {
    let timer = setInterval(() => {
      engine.update();
      setTrigger(!trigger);
    }, 1);

    let keyHandler = (event: any) => {
      switch (event.key) {
        case "ArrowLeft":
          engine.moveLeft();
          break;
        case "ArrowRight":
          engine.moveRight();
          break;
        case "Y":
        case "y":
          engine.rotateCCW();
          break;
        case "x":
        case "X":
          engine.rotateCW();
          break;
        case "ArrowDown":
          engine.moveDown();
          break;
        case " ":
          engine.pause();
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
  }, [trigger, engine, props.id, engine.menu, engine.gameStage]);

  function renderGame(): React.ReactNode {
    if (engine.gameStage === TetrisGameStage.TestScreen) {
      engine.testScreen();
    }

    return (
      <div className="Game">
        {renderField("game", engine.field, engine.block)}
      </div>
    );
  }

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

  function renderMainMenu() {
    return (
      <div className="Overlay">
        <h4>tetris</h4>
        <Button onClick={() => (engine.menu = TetrisMenu.Highscore)}>
          highscore
        </Button>
        <Button onClick={() => (engine.menu = TetrisMenu.Level)}>level</Button>
        <Button onClick={() => (engine.menu = TetrisMenu.Keys)}>keys</Button>
        <Button onClick={() => engine.start()}>new game</Button>
        <Button onClick={() => (engine.menu = TetrisMenu.EnterHighscore)}>
          enter
        </Button>
      </div>
    );
  }

  function renderLevelMenu() {
    var levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return (
      <div
        className="Overlay Level"
        onClick={() => {
          engine.menu = TetrisMenu.Main;
        }}
      >
        <h4>level</h4>
        <div className="Levels">
          {levels.map((l) => {
            return (
              <Button
                className={engine.level === l ? "Checked" : ""}
                key={"level-" + l}
                onClick={() => {
                  engine.level = l;
                }}
              >
                {"level " + l}
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  function renderHighscoreMenu(id: string, editRang?: number | undefined) {
    let clickHandler =
      editRang === undefined
        ? () => (engine.menu = TetrisMenu.Main)
        : undefined;
    return (
      <div className="Overlay Highscore" onClick={clickHandler}>
        <h4>highscore</h4>
        {engine.highscore.map((high, rang) => {
          return (
            <div className="Entry" key={id + "-highscore-" + rang}>
              <span>
                <span className="Rang">{rang + 1}</span>
                {editRang === rang ? (
                  <span className="EditHighscore">
                    <Input
                      onBlur={(e) => {
                        engine.highscore[rang].player = (e.target as any).value;
                        engine.highscore[rang].score = engine.score;
                      }}
                    ></Input>
                    <Button onClick={() => (engine.menu = TetrisMenu.Main)}>
                      ok
                    </Button>
                  </span>
                ) : (
                  <span>{high.player}</span>
                )}
              </span>
              <span>{high.score}</span>
            </div>
          );
        })}
      </div>
    );
  }

  function renderKeyMenu() {
    return (
      <div
        className="Overlay Keys"
        onClick={() => {
          engine.menu = TetrisMenu.Main;
        }}
      >
        <h4>keys</h4>
        <div className="Entry">
          <div className="Button">
            <span className="MaterialIcons">arrow_left</span>
          </div>
          <span>move left</span>
        </div>
        <div className="Entry">
          <div className="Button">
            <span className="MaterialIcons">arrow_right</span>
          </div>
          <span>move right</span>{" "}
        </div>
        <div className="Entry">
          <div className="Button">
            <span className="MaterialIcons">arrow_drop_down</span>
          </div>
          <span>move down</span>
        </div>
        <div className="Entry">
          <div className="Button">y</div>
          <span>rotate CCW</span>
        </div>
        <div className="Entry">
          <div className="Button">x</div>
          <span>rotate CW</span>
        </div>
        <div className="Entry">
          <div className="Button Space">space</div>
          <span>start/pause</span>
        </div>
      </div>
    );
  }

  function renderNext() {
    let nextBlock: number[][] = engine.initialField(4, 4, 0);
    let block = engine.renderToBlock(engine.nextState.toBlock(), 2, nextBlock);
    return (
      <div className="Next">{renderField("next", engine.nextField, block)}</div>
    );
  }

  function renderOverlay(): React.ReactNode {
    if (
      engine.gameStage === TetrisGameStage.Pause ||
      engine.gameStage === TetrisGameStage.GameOver
    ) {
      if (engine.menu === TetrisMenu.EnterHighscore) {
        return renderHighscoreMenu("edit", engine.rang);
      } else if (engine.gameStage === TetrisGameStage.GameOver) {
        return (
          <div className="Overlay GameOver" onClick={() => engine.start()}>
            <div>Game Over</div>
          </div>
        );
      } else if (engine.menu === TetrisMenu.Main) {
        return renderMainMenu();
      } else if (engine.menu === TetrisMenu.Highscore) {
        return renderHighscoreMenu("view");
      } else if (engine.menu === TetrisMenu.Level) {
        return renderLevelMenu();
      } else if (engine.menu === TetrisMenu.Keys) {
        return renderKeyMenu();
      }
    }
    return <></>;
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
          <div>{engine.level}</div>
          <div>{engine.score}</div>
        </div>
        <Button className="Menu" onClick={() => engine.pause()}>
          <span className="MaterialIcons">menu</span>
        </Button>
      </div>

      <div className="Board">
        {renderNext()}
        {renderOverlay()}
        {renderGame()}
      </div>

      <div className="Controls Bottom">
        <div>
          <Button onClick={() => engine.moveLeft()}>
            <span className="MaterialIcons">arrow_left</span>
          </Button>
          <Button onClick={() => engine.moveRight()}>
            <span className="MaterialIcons">arrow_right</span>
          </Button>
        </div>
        <div>
          <Button onClick={() => engine.moveDown()}>
            <span className="MaterialIcons">arrow_drop_down</span>
          </Button>
        </div>
        <div>
          <Button onClick={() => engine.rotateCW()}>
            <span className="MaterialIcons">rotate_right</span>
          </Button>
          <Button onClick={() => engine.rotateCCW()}>
            <span className="MaterialIcons">rotate_left</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
