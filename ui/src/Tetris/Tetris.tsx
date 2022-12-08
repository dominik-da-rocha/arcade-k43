import React, { useEffect, useState } from "react";
import { Button } from "../Controls/Button";
import { Input } from "../Controls/Input";
import "./Tetris.css";

type TetrisBlockType = "I" | "J" | "L" | "T" | "O" | "S" | "Z";
const BlockTypes: TetrisBlockType[] = ["I", "J", "L", "T", "O", "S", "Z"];
type TetrisBlockRotation = 0 | 1 | 2 | 3;
enum TetrisGameStage {
  Running,
  GameOver,
  TestScreen,
  Pause,
}

enum TetrisMenu {
  Game,
  Main,
  Highscore,
  Level,
  Keys,
  EnterHighscore,
}

interface TetrisHighscore {
  player: string;
  score: number;
}

class TetrisBlockState {
  x: number = 0;
  y: number = 0;
  rotation: TetrisBlockRotation = 0;
  type: TetrisBlockType = "I";

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
  nextField: number[][];
  state: TetrisBlockState;
  nextState: TetrisBlockState;
  hiddenRows = 4;
  requestedRotation: number = 0;
  requestedX: number = 0;
  gameStage = TetrisGameStage.Running;
  requestedY: number = 0;
  updateCounter: number = 0;
  lines = 0;
  score = 0;
  menu = TetrisMenu.Game;
  highscore: TetrisHighscore[] = [
    { player: "xxx", score: 0 },
    { player: "xxx", score: 0 },
    { player: "xxx", score: 0 },
    { player: "xxx", score: 0 },
    { player: "xxx", score: 0 },
    { player: "xxx", score: 0 },
    { player: "xxx", score: 0 },
    { player: "xxx", score: 0 },
    { player: "xxx", score: 0 },
  ];
  level: number = 1;
  speed: number[] = [100, 90, 80, 70, 60, 50, 45, 40, 35, 30];
  rang: number | undefined;
  //         Level    1   2   3   4   5   6   7   8   9 10
  trigger: () => void = () => {};

  public constructor(width: number, height: number) {
    this.width = width;
    this.height = height + this.hiddenRows;
    if (this.gameStage === TetrisGameStage.TestScreen) {
      this.width = 19;
      this.height = 33;
    }
    this.field = this.initialField(this.width, this.height, 0);
    this.block = this.initialField(this.width, this.height, 0);
    this.nextField = this.initialField(4, 4, 0);
    this.nextState = new TetrisBlockState();
    this.nextState.x = Math.round(this.width / 2);
    this.state = this.nextBlockState();
    this.gameStage = TetrisGameStage.Running;
    this.sortHighscore();
  }

  public start() {
    this.field = this.initialField(this.width, this.height, 0);
    this.block = this.initialField(this.width, this.height, 0);
    this.state = this.nextBlockState();
    this.gameStage = TetrisGameStage.Running;
    this.score = 0;
    this.rang = undefined;
  }

  public pause() {
    if (this.gameStage === TetrisGameStage.Running) {
      this.gameStage = TetrisGameStage.Pause;
      this.menu = TetrisMenu.Main;
    } else if (this.gameStage === TetrisGameStage.Pause) {
      this.gameStage = TetrisGameStage.Running;
      this.menu = TetrisMenu.Game;
    } else {
      this.gameStage = TetrisGameStage.Pause;
      this.menu = TetrisMenu.Main;
    }
  }

  private nextBlockState() {
    let result = this.nextState.copy();
    result.x = Math.round(this.width / 2) - 1;
    this.nextState = new TetrisBlockState();
    this.nextState.x = 0;
    this.nextState.y = 0;
    this.nextState.rotation = (Math.round(Math.random() * 100000) %
      4) as TetrisBlockRotation;
    let index = Math.round(Math.random() * 7) % 7;
    this.nextState.type = BlockTypes[index];
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
    if (this.gameStage === TetrisGameStage.TestScreen) {
      this.testScreen();
    }

    return (
      <div className="Game">
        {this.renderField("game", this.field, this.block)}
      </div>
    );
  }

  private renderField(id: string, field: number[][], block: number[][]) {
    return field.map((row, y) => this.renderRow(id, row, y, block));
  }

  private renderRow(id: string, row: number[], y: number, block: number[][]) {
    return (
      <div className="BlockRow" key={"tetris-game-" + id + "-" + id + "-" + y}>
        {row.map((cell, x) => this.renderCell(id, cell, x, y, block))}
      </div>
    );
  }

  private renderCell(
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

  private renderToBlock(b: number[], value: number, block: number[][]) {
    block[b[1]][b[0]] = value;
    block[b[3]][b[2]] = value;
    block[b[5]][b[4]] = value;
    block[b[7]][b[6]] = value;
    return block;
  }

  private testScreen() {
    let state = new TetrisBlockState();
    state.y = 0;
    BlockTypes.forEach((type) => {
      state.x = 0;
      for (let rot = 0; rot < 4; rot++) {
        state.rotation = rot as TetrisBlockRotation;
        state.type = type;
        let b = state.toBlock();
        this.block = this.renderToBlock(b, 1, this.block);
        state.x += 5;
      }
      state.y += 5;
    });
  }

  public update() {
    if (this.gameStage === TetrisGameStage.Running) {
      if (this.updateCounter % this.speed[this.level - 1] === 0) {
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
      this.rang = this.highscore.findIndex((high) => high.score < this.score);
      this.gameStage = TetrisGameStage.GameOver;
      if (this.rang >= 0 && this.rang < this.highscore.length) {
        this.menu = TetrisMenu.EnterHighscore;
        this.trigger();
      }
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
          this.lines++;
          this.score += this.level;
          if (this.lines % 10 === 0 && this.level < 10) {
            this.level++;
          }
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
        newState.rotation = (newState.rotation % 4) as TetrisBlockRotation;
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
    this.renderToBlock(newB, 1, this.block);
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
      this.renderToBlock(b, 0, this.block);
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
    if (this.gameStage === TetrisGameStage.Running) {
      this.requestedRotation--;
    }
  }

  public rotateCW() {
    if (this.gameStage === TetrisGameStage.Running) {
      this.requestedRotation++;
    }
  }

  public moveRight() {
    if (this.gameStage === TetrisGameStage.Running) {
      this.requestedX++;
    }
  }

  public moveDown() {
    if (this.gameStage === TetrisGameStage.Running) {
      this.requestedY++;
    }
  }

  public moveLeft() {
    if (this.gameStage === TetrisGameStage.Running) {
      this.requestedX--;
    }
  }

  public renderOverlay(): React.ReactNode {
    if (
      this.gameStage === TetrisGameStage.Pause ||
      this.gameStage === TetrisGameStage.GameOver
    ) {
      if (this.menu === TetrisMenu.EnterHighscore) {
        return this.renderHighscoreMenu("edit", this.rang);
      } else if (this.gameStage === TetrisGameStage.GameOver) {
        return (
          <div className="Overlay GameOver" onClick={() => this.start()}>
            <div>Game Over</div>
          </div>
        );
      } else if (this.menu === TetrisMenu.Main) {
        return this.renderMainMenu();
      } else if (this.menu === TetrisMenu.Highscore) {
        return this.renderHighscoreMenu("view");
      } else if (this.menu === TetrisMenu.Level) {
        return this.renderLevelMenu();
      } else if (this.menu === TetrisMenu.Keys) {
        return this.renderKeyMenu();
      }
    }
    return <></>;
  }

  renderMainMenu() {
    return (
      <div className="Overlay">
        <h4>tetris</h4>
        <Button onClick={() => (this.menu = TetrisMenu.Highscore)}>
          highscore
        </Button>
        <Button onClick={() => (this.menu = TetrisMenu.Level)}>level</Button>
        <Button onClick={() => (this.menu = TetrisMenu.Keys)}>keys</Button>
        <Button onClick={() => this.start()}>new game</Button>
        <Button onClick={() => (this.menu = TetrisMenu.EnterHighscore)}>
          enter
        </Button>
      </div>
    );
  }

  renderLevelMenu() {
    var levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return (
      <div
        className="Overlay Level"
        onClick={() => {
          this.menu = TetrisMenu.Main;
        }}
      >
        <h4>level</h4>
        <div className="Levels">
          {levels.map((l) => {
            return (
              <Button
                className={this.level === l ? "Checked" : ""}
                key={"level-" + l}
                onClick={() => {
                  this.level = l;
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

  renderHighscoreMenu(id: string, editRang?: number | undefined) {
    let clickHandler =
      editRang === undefined ? () => (this.menu = TetrisMenu.Main) : undefined;
    return (
      <div className="Overlay Highscore" onClick={clickHandler}>
        <h4>highscore</h4>
        {this.highscore.map((high, rang) => {
          return (
            <div className="Entry" key={id + "-highscore-" + rang}>
              <span>
                <span className="Rang">{rang + 1}</span>
                {editRang === rang ? (
                  <span className="EditHighscore">
                    <Input
                      onBlur={(e) => {
                        this.highscore[rang].player = (e.target as any).value;
                        this.highscore[rang].score = this.score;
                      }}
                    ></Input>
                    <Button onClick={() => (this.menu = TetrisMenu.Main)}>
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

  renderKeyMenu() {
    return (
      <div
        className="Overlay Keys"
        onClick={() => {
          this.menu = TetrisMenu.Main;
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

  sortHighscore() {
    this.highscore.sort((l, r) => r.score - l.score);
  }

  renderNext() {
    let nextBlock: number[][] = this.initialField(4, 4, 0);
    let block = this.renderToBlock(this.nextState.toBlock(), 2, nextBlock);
    return (
      <div className="Next">
        {this.renderField("next", this.nextField, block)}
      </div>
    );
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
  game.trigger = () => setTrigger(!trigger);

  useEffect(() => {
    let timer = setInterval(
      () => {
        game.update();
        setTrigger(!trigger);
      },
      game.menu,
      game.gameStage
    );

    let keyHandler = (event: any) => {
      switch (event.key) {
        case "ArrowLeft":
          game.moveLeft();
          break;
        case "ArrowRight":
          game.moveRight();
          break;
        case "Y":
        case "y":
          game.rotateCCW();
          break;
        case "x":
        case "X":
          game.rotateCW();
          break;
        case "ArrowDown":
          game.moveDown();
          break;
        case " ":
          game.pause();
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
        <div className="Control">
          <div>level</div>
          <div>score</div>
          <div>next</div>
        </div>
        <div>
          <div>{game.level}</div>
          <div>{game.score}</div>
        </div>
        <Button className="Menu" onClick={() => game.pause()}>
          <span className="MaterialIcons">menu</span>
        </Button>
      </div>

      <div className="Board">
        {game.renderNext()}
        {game.renderOverlay()}
        {game.renderGame()}
      </div>

      <div className="Controls Bottom">
        <div>
          <Button onClick={() => game.moveLeft()}>
            <span className="MaterialIcons">arrow_left</span>
          </Button>
          <Button onClick={() => game.moveRight()}>
            <span className="MaterialIcons">arrow_right</span>
          </Button>
        </div>
        <div>
          <Button onClick={() => game.moveDown()}>
            <span className="MaterialIcons">arrow_drop_down</span>
          </Button>
        </div>
        <div>
          <Button onClick={() => game.rotateCW()}>
            <span className="MaterialIcons">rotate_right</span>
          </Button>
          <Button onClick={() => game.rotateCCW()}>
            <span className="MaterialIcons">rotate_left</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
