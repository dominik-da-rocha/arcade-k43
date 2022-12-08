import {
  TetrisBlockTypes,
  TetrisBlock,
  TetrisBlockRotation,
} from "./TetrisBlock";

export enum TetrisGameStage {
  Running,
  GameOver,
  TestScreen,
  Pause,
}

export enum TetrisMenu {
  Game,
  Main,
  Highscore,
  Level,
  Keys,
  EnterHighscore,
}

export interface TetrisHighscore {
  player: string;
  score: number;
}

export class TetrisEngine {
  width: number;
  height: number;
  field: number[][];
  block: number[][];
  nextField: number[][];
  state: TetrisBlock;
  nextState: TetrisBlock;
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

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height + this.hiddenRows;
    if (this.gameStage === TetrisGameStage.TestScreen) {
      this.width = 19;
      this.height = 33;
    }
    this.field = this.initialField(this.width, this.height, 0);
    this.block = this.initialField(this.width, this.height, 0);
    this.nextField = this.initialField(4, 4, 0);
    this.nextState = new TetrisBlock();
    this.nextState.x = Math.round(this.width / 2);
    this.state = this.nextBlockState();
    this.gameStage = TetrisGameStage.Running;
    this.sortHighscore();
  }

  sortHighscore() {
    this.highscore.sort((l, r) => r.score - l.score);
  }

  start() {
    this.field = this.initialField(this.width, this.height, 0);
    this.block = this.initialField(this.width, this.height, 0);
    this.state = this.nextBlockState();
    this.gameStage = TetrisGameStage.Running;
    this.score = 0;
    this.rang = undefined;
  }

  pause() {
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

  nextBlockState() {
    let result = this.nextState.copy();
    result.x = Math.round(this.width / 2) - 1;
    this.nextState = new TetrisBlock();
    this.nextState.x = 0;
    this.nextState.y = 0;
    this.nextState.rotation = (Math.round(Math.random() * 100000) %
      4) as TetrisBlockRotation;
    let index = Math.round(Math.random() * 7) % 7;
    this.nextState.type = TetrisBlockTypes[index];
    return result;
  }

  initialField(xCount: number, yCount: number, init: number) {
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

  renderToBlock(b: number[], value: number, block: number[][]) {
    block[b[1]][b[0]] = value;
    block[b[3]][b[2]] = value;
    block[b[5]][b[4]] = value;
    block[b[7]][b[6]] = value;
    return block;
  }

  testScreen() {
    let state = new TetrisBlock();
    state.y = 0;
    TetrisBlockTypes.forEach((type) => {
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

  update() {
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

  updateGameOver() {
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

  updateFullRows() {
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

  removeRow(rowToRemove: number) {
    for (let r = rowToRemove; r >= 1; r--) {
      this.field[r] = [...this.field[r - 1]];
    }
  }

  updateMoveX() {
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

  updateRotation() {
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

  updateMoveDown() {
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

  manipulateState(
    callback: (newState: TetrisBlock) => TetrisBlock,
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

  popRequestedX() {
    let delta = this.requestedX;
    this.requestedX = 0;
    return delta;
  }

  popRequestedRotation() {
    let delta = this.requestedRotation;
    this.requestedRotation = 0;
    return delta;
  }

  popRequestedY() {
    let delta = this.requestedY;
    this.requestedY = 0;
    return delta;
  }

  clearBlock(b: number[]) {
    if (!this.hitTest(b)) {
      this.renderToBlock(b, 0, this.block);
    }
    return b;
  }

  copyBlockToField(b: number[]) {
    for (let i = 0; i < 7; i += 2) {
      let n = i + 1;
      this.field[b[n]][b[i]] = 1;
    }
  }

  hitTest(b: number[]): boolean {
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

  rotateCCW() {
    if (this.gameStage === TetrisGameStage.Running) {
      this.requestedRotation--;
    }
  }

  rotateCW() {
    if (this.gameStage === TetrisGameStage.Running) {
      this.requestedRotation++;
    }
  }

  moveRight() {
    if (this.gameStage === TetrisGameStage.Running) {
      this.requestedX++;
    }
  }

  moveDown() {
    if (this.gameStage === TetrisGameStage.Running) {
      this.requestedY++;
    }
  }

  moveLeft() {
    if (this.gameStage === TetrisGameStage.Running) {
      this.requestedX--;
    }
  }
}
