import React, { useEffect, useState } from "react";
import { Button } from "../Controls/Button";
import "./Tetris.css";

type BlockType = "I" | "J" | "L" | "T" | "O" | "S" | "Z";
const BlockTypes: BlockType[] = ["I", "J", "L", "T", "O", "S", "Z"];
type BlockRotation = 0 | 1 | 2 | 3;
enum GameStage {
  Running,
  GameOver,
  TestScreen,
  Pause,
}

class TetrisBlockState {
  x: number = 0;
  y: number = 0;
  rotation: BlockRotation = 0;
  type: BlockType = "I";

  copy() {
    let c = new TetrisBlockState();
    c.rotation = this.rotation;
    c.x = this.x;
    c.y = this.y;
    c.type = this.type;
    return c;
  }

  toBlock() {
    switch (this.type) {
      case "I":
        return this.toBlockI();
      case "T":
        return this.toBlockT();
      case "O":
        return this.toBlockO();
      case "L":
        return this.toBlockL();
      case "J":
        return this.toBlockJ();
      case "S":
        return this.toBlockS();
      case "Z":
        return this.toBlockZ();
    }
  }

  toBlockI() {
    let b: number[] = [0, 0, 0, 0, 0, 0, 0];
    switch (this.rotation) {
      case 0:
      case 2:
        b[0] = this.x;
        b[1] = this.y;
        b[2] = this.x;
        b[3] = this.y + 1;
        b[4] = this.x;
        b[5] = this.y + 2;
        b[6] = this.x;
        b[7] = this.y + 3;
        break;
      case 1:
      case 3:
        b[0] = this.x;
        b[1] = this.y;
        b[2] = this.x + 1;
        b[3] = this.y;
        b[4] = this.x + 2;
        b[5] = this.y;
        b[6] = this.x + 3;
        b[7] = this.y;
        break;
    }
    return b;
  }

  toBlockT() {
    let b: number[] = [0, 0, 0, 0, 0, 0, 0];
    switch (this.rotation) {
      case 0:
        b[0] = this.x;
        b[1] = this.y;
        b[2] = this.x;
        b[3] = this.y + 1;
        b[4] = this.x;
        b[5] = this.y + 2;
        b[6] = this.x + 1;
        b[7] = this.y + 1;
        break;
      case 1:
        b[0] = this.x;
        b[1] = this.y;
        b[2] = this.x + 1;
        b[3] = this.y;
        b[4] = this.x + 2;
        b[5] = this.y;
        b[6] = this.x + 1;
        b[7] = this.y + 1;
        break;
      case 2:
        b[0] = this.x + 1;
        b[1] = this.y;
        b[2] = this.x + 1;
        b[3] = this.y + 1;
        b[4] = this.x + 1;
        b[5] = this.y + 2;
        b[6] = this.x;
        b[7] = this.y + 1;
        break;
      case 3:
        b[0] = this.x;
        b[1] = this.y + 1;
        b[2] = this.x + 1;
        b[3] = this.y + 1;
        b[4] = this.x + 2;
        b[5] = this.y + 1;
        b[6] = this.x + 1;
        b[7] = this.y;
        break;
    }

    return b;
  }

  toBlockO() {
    let b: number[] = [0, 0, 0, 0, 0, 0, 0];
    switch (this.rotation) {
      case 0:
      case 1:
      case 2:
      case 3:
        b[0] = this.x;
        b[1] = this.y;
        b[2] = this.x + 1;
        b[3] = this.y;
        b[4] = this.x;
        b[5] = this.y + 1;
        b[6] = this.x + 1;
        b[7] = this.y + 1;
        break;
    }
    return b;
  }

  toBlockJ() {
    let b: number[] = [0, 0, 0, 0, 0, 0, 0];
    switch (this.rotation) {
      case 0:
        b[0] = this.x + 1;
        b[1] = this.y;
        b[2] = this.x + 1;
        b[3] = this.y + 1;
        b[4] = this.x + 1;
        b[5] = this.y + 2;
        b[6] = this.x;
        b[7] = this.y + 2;
        break;
      case 1:
        b[0] = this.x;
        b[1] = this.y + 1;
        b[2] = this.x + 1;
        b[3] = this.y + 1;
        b[4] = this.x + 2;
        b[5] = this.y + 1;
        b[6] = this.x;
        b[7] = this.y;
        break;
      case 2:
        b[0] = this.x;
        b[1] = this.y;
        b[2] = this.x + 1;
        b[3] = this.y;
        b[4] = this.x;
        b[5] = this.y + 1;
        b[6] = this.x;
        b[7] = this.y + 2;
        break;
      case 3:
        b[0] = this.x;
        b[1] = this.y;
        b[2] = this.x + 1;
        b[3] = this.y;
        b[4] = this.x + 2;
        b[5] = this.y;
        b[6] = this.x + 2;
        b[7] = this.y + 1;
        break;
    }

    return b;
  }

  toBlockL() {
    let b: number[] = [0, 0, 0, 0, 0, 0, 0];
    switch (this.rotation) {
      case 0:
        b[0] = this.x;
        b[1] = this.y;
        b[2] = this.x;
        b[3] = this.y + 1;
        b[4] = this.x;
        b[5] = this.y + 2;
        b[6] = this.x + 1;
        b[7] = this.y + 2;
        break;
      case 1:
        b[0] = this.x;
        b[1] = this.y;
        b[2] = this.x + 1;
        b[3] = this.y;
        b[4] = this.x + 2;
        b[5] = this.y;
        b[6] = this.x;
        b[7] = this.y + 1;
        break;
      case 2:
        b[0] = this.x;
        b[1] = this.y;
        b[2] = this.x + 1;
        b[3] = this.y;
        b[4] = this.x + 1;
        b[5] = this.y + 1;
        b[6] = this.x + 1;
        b[7] = this.y + 2;
        break;
      case 3:
        b[0] = this.x;
        b[1] = this.y + 1;
        b[2] = this.x + 1;
        b[3] = this.y + 1;
        b[4] = this.x + 2;
        b[5] = this.y + 1;
        b[6] = this.x + 2;
        b[7] = this.y;
        break;
    }
    return b;
  }

  toBlockS() {
    let b: number[] = [0, 0, 0, 0, 0, 0, 0];
    switch (this.rotation) {
      case 0:
      case 2:
        b[0] = this.x + 1;
        b[1] = this.y;
        b[2] = this.x + 2;
        b[3] = this.y;
        b[4] = this.x;
        b[5] = this.y + 1;
        b[6] = this.x + 1;
        b[7] = this.y + 1;
        break;
      case 1:
      case 3:
        b[0] = this.x;
        b[1] = this.y;
        b[2] = this.x;
        b[3] = this.y + 1;
        b[4] = this.x + 1;
        b[5] = this.y + 1;
        b[6] = this.x + 1;
        b[7] = this.y + 2;
        break;
    }
    return b;
  }

  toBlockZ() {
    let b: number[] = [0, 0, 0, 0, 0, 0, 0];

    switch (this.rotation) {
      case 0:
      case 2:
        b[0] = this.x;
        b[1] = this.y;
        b[2] = this.x + 1;
        b[3] = this.y;
        b[4] = this.x + 1;
        b[5] = this.y + 1;
        b[6] = this.x + 2;
        b[7] = this.y + 1;
        break;
      case 1:
      case 3:
        b[0] = this.x + 1;
        b[1] = this.y;
        b[2] = this.x + 1;
        b[3] = this.y + 1;
        b[4] = this.x;
        b[5] = this.y + 1;
        b[6] = this.x;
        b[7] = this.y + 2;
        break;
    }
    return b;
  }
}

class TetrisGame {
  width: number;
  height: number;
  field: number[][];
  block: number[][];
  preview: number[][];
  state: TetrisBlockState;
  nextState: TetrisBlockState;
  newBlockCounter = 0;
  newBlockRotation: BlockRotation = 0;
  hiddenRows = 4;
  requestedRotation: number = 0;
  requestedX: number = 0;
  gameStage = GameStage.Running;
  requestedY: number = 0;
  updateCounter: number = 0;
  score = 0;

  public constructor(width: number, height: number) {
    this.width = width;
    this.height = height + this.hiddenRows;
    if (this.gameStage === GameStage.TestScreen) {
      this.width = 19;
      this.height = 33;
    }
    this.field = this.initialField(this.width, this.height, 0);
    this.block = this.initialField(this.width, this.height, 0);
    this.preview = this.initialField(4, 4, 0);
    this.nextState = new TetrisBlockState();
    this.nextState.x = Math.round(this.width / 2);
    this.state = this.nextBlockState();
    this.gameStage = GameStage.Running;
  }

  public start() {
    this.field = this.initialField(this.width, this.height, 0);
    this.block = this.initialField(this.width, this.height, 0);
    this.state = this.nextBlockState();
    this.gameStage = GameStage.Running;
    this.score = 0;
  }

  public pause() {
    if (this.gameStage === GameStage.Running) {
      this.gameStage = GameStage.Pause;
    } else if (this.gameStage === GameStage.Pause) {
      this.gameStage = GameStage.Running;
    }
  }

  private nextBlockState() {
    let result = this.nextState.copy();
    this.nextState = new TetrisBlockState();
    this.newBlockCounter = (this.newBlockCounter + 1) % BlockTypes.length;
    this.newBlockRotation = ((this.newBlockRotation + 1) % 4) as BlockRotation;
    this.nextState.x = Math.round(this.width / 2);
    this.nextState.y = 0;
    this.nextState.rotation = this.newBlockRotation;
    this.nextState.type = BlockTypes[this.newBlockCounter];
    return result;
  }

  private initialField(xCount: number, yCount: number, init: number) {
    let field: number[][] = [];
    for (let y = 0; y < yCount; y++) {
      let row: number[] = [];
      for (let x = 0; x < xCount; x++) {
        row.push(init);
      }
      field.push(row);
    }
    return field;
  }

  public renderGame(): React.ReactNode {
    if (this.gameStage === GameStage.TestScreen) {
      this.testScreen();
    }

    return (
      <div className="Game">
        {this.field.map((row, y) => {
          // text += y < 10 ? "0" + y : y;
          return (
            <div className="BlockRow" key={"tetris-game-" + y}>
              {row.map((cell, x) => {
                if (cell > 25) {
                  return (
                    <div
                      className="Block Empty"
                      key={"tetris-game-" + y + "-" + x}
                    ></div>
                  );
                } else if (cell > 1) {
                  return (
                    <div
                      className="Block Full"
                      key={"tetris-game-" + y + "-" + x}
                    ></div>
                  );
                } else if (cell > 0) {
                  return (
                    <div
                      className="Block Settled"
                      key={"tetris-game-" + y + "-" + x}
                    ></div>
                  );
                } else if (this.block[y][x] > 0) {
                  return (
                    <div
                      className="Block Moving"
                      key={"tetris-game-" + y + "-" + x}
                    ></div>
                  );
                } else {
                  return (
                    <div
                      className="Block"
                      key={"tetris-game-" + y + "-" + x}
                    ></div>
                  );
                }
              })}
            </div>
          );
        })}
      </div>
    );
  }

  private renderBlock(b: number[], value: number) {
    this.block[b[1]][b[0]] = value;
    this.block[b[3]][b[2]] = value;
    this.block[b[5]][b[4]] = value;
    this.block[b[7]][b[6]] = value;
  }

  private testScreen() {
    let state = new TetrisBlockState();
    state.y = 0;
    BlockTypes.forEach((type) => {
      state.x = 0;
      for (let rot = 0; rot < 4; rot++) {
        state.rotation = rot as BlockRotation;
        state.type = type;
        let b = state.toBlock();
        this.renderBlock(b, 1);
        state.x += 5;
      }
      state.y += 5;
    });
  }

  public update() {
    if (this.gameStage === GameStage.Running) {
      if (this.updateCounter % 30 === 0) {
        this.moveDown();
      }
      this.updateMoveDown();
      this.updateMoveX();
      this.updateRotation();
      this.updateFullRows();
      this.updateGameOver();
    }
    this.updateCounter++;
  }

  public updateGameOver() {
    let cell = this.field[0].find((c) => c > 0);
    if (cell !== undefined) {
      this.gameStage = GameStage.GameOver;
    }
  }

  private updateFullRows() {
    for (let y = 4; y < this.height; y++) {
      let fullCells = 0;
      let value = 0;
      for (let x = 0; x < this.width; x++) {
        if (this.field[y][x] > 0) {
          fullCells++;
          value = this.field[y][x];
        }
        if (this.field[y][x] > 10) {
        }
      }
      if (fullCells === this.width) {
        fullCells = 0;
        if (value > 50) {
          this.removeRow(y);
          this.score++;
        } else {
          for (let x = 0; x < this.width; x++) {
            this.field[y][x]++;
          }
        }
      }
    }
  }

  private removeRow(rowToRemove: number) {
    for (let r = rowToRemove; r >= 1; r--) {
      this.field[r] = [...this.field[r - 1]];
    }
  }

  private updateMoveX() {
    this.manipulateState(
      (newState) => {
        newState.x += this.popRequestedX();
        return newState;
      },
      (oldB) => {
        return oldB;
      }
    );
  }

  private updateRotation() {
    this.manipulateState(
      (newState) => {
        newState.rotation += this.popRequestedRotation();
        newState.rotation = (newState.rotation % 4) as BlockRotation;
        if (newState.rotation < 0) {
          newState.rotation += 4;
        }
        return newState;
      },
      (oldB) => {
        return oldB;
      }
    );
  }

  private updateMoveDown() {
    this.manipulateState(
      (newState) => {
        newState.y += this.popRequestedY();
        return newState;
      },
      (oldB: number[]) => {
        this.copyBlockToField(oldB);
        this.state = this.nextBlockState();
        return this.state.toBlock();
      }
    );
  }

  private manipulateState(
    callback: (newState: TetrisBlockState) => TetrisBlockState,
    onHit: (oldB: number[]) => number[]
  ) {
    let oldB = this.clearBlock(this.state.toBlock());
    let newState = callback(this.state.copy());
    let newB = newState.toBlock();
    if (this.hitTest(newB)) {
      newB = oldB;
      newB = onHit(oldB);
    } else {
      this.state = newState;
    }
    this.renderBlock(newB, 1);
  }

  private popRequestedX() {
    let delta = this.requestedX;
    this.requestedX = 0;
    return delta;
  }

  private popRequestedRotation() {
    let delta = this.requestedRotation;
    this.requestedRotation = 0;
    return delta;
  }

  private popRequestedY() {
    let delta = this.requestedY;
    this.requestedY = 0;
    return delta;
  }

  private clearBlock(b: number[]) {
    if (!this.hitTest(b)) {
      this.renderBlock(b, 0);
    }
    return b;
  }

  private copyBlockToField(b: number[]) {
    for (let i = 0; i < 7; i += 2) {
      let n = i + 1;
      this.field[b[n]][b[i]] = 1;
    }
  }

  private hitTest(b: number[]): boolean {
    let maxW = this.width;
    let maxH = this.height;
    for (let xi = 0; xi < 7; xi += 2) {
      let yi = xi + 1;
      if (b[xi] < 0) {
        return true;
      } else if (b[xi] >= maxW) {
        return true;
      } else if (b[yi] < 0) {
        return true;
      } else if (b[yi] >= maxH) {
        return true;
      } else if (this.field[b[yi]][b[xi]] > 0) {
        return true;
      }
    }
    return false;
  }

  public rotateCCW() {
    this.requestedRotation--;
  }

  public rotateCW() {
    this.requestedRotation++;
  }

  public moveRight() {
    this.requestedX++;
  }

  public moveDown() {
    this.requestedY++;
  }

  public moveLeft() {
    this.requestedX--;
  }

  public renderOverlay(): React.ReactNode {
    if (this.gameStage === GameStage.GameOver) {
      return (
        <div className="Overlay">
          <div>Game Over</div>
        </div>
      );
    } else if (this.gameStage === GameStage.Pause) {
      return (
        <div className="Overlay">
          <div>Pause</div>
        </div>
      );
    }
    return <></>;
  }
}

let games = new Map<string, TetrisGame>();

function useTetrisGame(props: TetrisProps) {
  let game = games.get(props.id);
  if (!game) {
    game = new TetrisGame(props.width, props.height);
    games.set(props.id, game);
  }
  return game;
}

export interface TetrisProps {
  id: string;
  height: number;
  width: number;
}

export function Tetris(props: TetrisProps) {
  let [trigger, setTrigger] = useState(false);
  let game = useTetrisGame(props);

  useEffect(() => {
    let timer = setInterval(() => {
      game.update();
      setTrigger(!trigger);
    }, 10);

    let keyHandler = (event: any) => {
      switch (event.key) {
        case "ArrowLeft":
          game.moveLeft();
          break;
        case "ArrowRight":
          game.moveRight();
          break;
        case "ArrowUp":
          game.rotateCCW();
          break;
        case "ArrowDown":
          game.rotateCW();
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
  });

  return (
    <div className="Tetris">
      <div className="Controls">
        <div className="Control">next</div>
        <div className="Control">score: {game.score}</div>
        <Button
          onClick={() => {
            game.start();
          }}
        >
          <span className="MaterialIcons">restart_alt</span>
        </Button>
      </div>

      <div className="Board">
        {game.renderOverlay()}
        {game.renderGame()}
      </div>

      <div className="Controls Bottom">
        <div>
          <Button
            onClick={() => {
              game.moveLeft();
            }}
          >
            <span className="MaterialIcons">arrow_left</span>
          </Button>
          <Button
            onClick={() => {
              game.moveRight();
            }}
          >
            <span className="MaterialIcons">arrow_right</span>
          </Button>
        </div>
        <div>
          <Button
            onClick={() => {
              game.pause();
            }}
          >
            <span className="MaterialIcons">pause</span>
          </Button>
        </div>
        <div>
          <Button
            onClick={() => {
              game.rotateCW();
            }}
          >
            <span className="MaterialIcons">rotate_right</span>
          </Button>

          <Button
            onClick={() => {
              game.rotateCCW();
            }}
          >
            <span className="MaterialIcons">rotate_left</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
