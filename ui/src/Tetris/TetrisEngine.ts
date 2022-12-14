import {
  TetrisBlockTypes,
  TetrisBlock,
  TetrisBlockRotation,
} from "./TetrisBlock";

export interface TetrisGameOverEvent {
  score: number;
}

export type TetrisGameOverHandler = (event: TetrisGameOverEvent) => void;

export class TetrisEngine {
  private width: number;
  private height: number;
  private field: number[][];
  private block: number[][];
  private nextField: number[][];
  private state: TetrisBlock;
  private nextState: TetrisBlock;
  private hiddenRows = 4;
  private requestedRotation: number = 0;
  private requestedX: number = 0;
  private requestedY: number = 0;
  private updateCounter: number = 0;
  private lines = 0;
  private score = 0;
  //                      Level   1   2  3  4  5  6  7  8  9  10
  private updateRate: number[] = [120, 100, 90, 80, 70, 60, 50, 40, 30, 20];
  private level: number = 1;

  private rang: number | undefined;
  public trigger: () => void = () => {};
  private showTestScreen: boolean | undefined;
  private isRunning: boolean = true;
  public onGameOver: TetrisGameOverHandler = () => {};

  constructor(width: number, height: number, showTestScreen?: boolean) {
    this.width = width;
    this.height = height + this.hiddenRows;
    this.showTestScreen = showTestScreen;
    if (showTestScreen) {
      this.width = 19;
      this.height = 33;
    }
    this.field = this.initialField(this.width, this.height, 0);
    this.block = this.initialField(this.width, this.height, 0);
    this.nextField = this.initialField(4, 4, 0);
    this.nextState = new TetrisBlock();
    this.nextState.x = Math.round(this.width / 2);
    this.state = this.nextBlockState();
  }

  start() {
    this.field = this.initialField(this.width, this.height, 0);
    this.block = this.initialField(this.width, this.height, 0);
    this.isRunning = true;
    this.state = this.nextBlockState();
    this.score = 0;
    this.rang = undefined;
  }

  pause() {
    this.isRunning = !this.isRunning;
  }

  private nextBlockState() {
    if (this.isRunning) {
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
    return this.nextState;
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

  private renderToBlock(b: number[], value: number, block: number[][]) {
    block[b[1]][b[0]] = value;
    block[b[3]][b[2]] = value;
    block[b[5]][b[4]] = value;
    block[b[7]][b[6]] = value;
    return block;
  }

  private updateScreen() {
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

  public update() {
    if (this.showTestScreen) {
      this.updateScreen();
    } else if (this.isRunning) {
      if (this.updateCounter % this.updateRate[this.level - 1] === 0) {
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

  private updateGameOver() {
    let cell = this.field[0].find((c) => c > 0);
    if (cell !== undefined && this.onGameOver !== undefined) {
      this.isRunning = false;
      this.onGameOver({ score: this.score });
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
    if (this.isRunning) {
      this.requestedRotation = -1;
    }
  }

  public rotateCW() {
    if (this.isRunning) {
      this.requestedRotation = 1;
    }
  }

  public moveRight() {
    if (this.isRunning) {
      this.requestedX = 1;
    }
  }

  public moveDown() {
    if (this.isRunning) {
      this.requestedY = 1;
    }
  }

  public moveLeft() {
    if (this.isRunning) {
      this.requestedX = -1;
    }
  }

  public getBlock(): number[][] {
    return this.block;
  }
  public getField(): number[][] {
    return this.field;
  }
  public getNextField(): number[][] {
    return this.nextField;
  }
  public getNextBlock(): number[][] {
    let nextBlock: number[][] = this.initialField(4, 4, 0);
    nextBlock = this.renderToBlock(this.nextState.toBlock(), 2, nextBlock);
    return nextBlock;
  }
  public getScore(): number {
    return this.score;
  }

  public getRang() {
    return this.rang;
  }
  setLevel(l: number) {
    this.level = l;
  }
  getLevel(): number {
    return this.level;
  }
}
