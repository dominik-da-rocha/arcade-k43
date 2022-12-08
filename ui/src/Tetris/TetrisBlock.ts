export type TetrisBlockType = "I" | "J" | "L" | "T" | "O" | "S" | "Z";
export const TetrisBlockTypes: TetrisBlockType[] = [
  "I",
  "J",
  "L",
  "T",
  "O",
  "S",
  "Z",
];
export type TetrisBlockRotation = 0 | 1 | 2 | 3;

export class TetrisBlock {
  x: number = 0;
  y: number = 0;
  rotation: TetrisBlockRotation = 0;
  type: TetrisBlockType = "I";

  copy() {
    let c = new TetrisBlock();
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
