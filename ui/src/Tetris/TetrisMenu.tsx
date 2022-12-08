import { Button } from "../Controls/Button";
import { Input } from "../Controls/Input";
import { TetrisGameOverEvent } from "./TetrisEngine";

export enum TetrisMenuPage {
  Game,
  GameOver,
  TestScreen,
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

export interface TetrisEngine {
  start: () => void;
  pause: () => void;
  setLevel: (level: number) => void;
  getLevel: () => number;
  onGameOver: (event: TetrisGameOverEvent) => void;
}

export class TetrisMenu {
  private menu = TetrisMenuPage.Game;
  private highscore: TetrisHighscore[] = [
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
  private rang: number | undefined = undefined;
  private score: number | undefined = undefined;
  private engine: TetrisEngine;

  constructor(engine: TetrisEngine) {
    this.engine = engine;
    this.handleGameOver = this.handleGameOver.bind(this);
    engine.onGameOver = this.handleGameOver;
    this.menu = TetrisMenuPage.Game;
    this.sortHighscore();
  }

  private sortHighscore() {
    this.highscore.sort((l, r) => r.score - l.score);
  }

  public pause() {
    if (this.menu === TetrisMenuPage.Game) {
      this.menu = TetrisMenuPage.Main;
      this.engine.pause();
    } else if (
      this.menu === TetrisMenuPage.Main ||
      this.menu === TetrisMenuPage.Highscore ||
      this.menu === TetrisMenuPage.Level ||
      this.menu === TetrisMenuPage.Keys ||
      this.menu === TetrisMenuPage.EnterHighscore
    ) {
      this.menu = TetrisMenuPage.Game;
      this.engine.pause();
    } else if (this.menu === TetrisMenuPage.GameOver) {
      this.menu = TetrisMenuPage.Main;
    }
  }

  handleGameOver(event: TetrisGameOverEvent) {
    this.score = event.score;
    this.rang = this.highscore.findIndex((high) => high.score < event.score);
    this.menu = TetrisMenuPage.GameOver;
    if (this.rang >= 0 && this.rang < this.highscore.length) {
      this.menu = TetrisMenuPage.EnterHighscore;
    }
  }

  private renderMainMenu() {
    return (
      <div className="Overlay">
        <h4>tetris</h4>
        <Button onClick={() => this.pause()}>resume</Button>
        <Button onClick={() => (this.menu = TetrisMenuPage.Highscore)}>
          highscore
        </Button>
        <Button onClick={() => (this.menu = TetrisMenuPage.Level)}>
          level
        </Button>
        <Button onClick={() => (this.menu = TetrisMenuPage.Keys)}>keys</Button>
        <Button onClick={() => this.start()}>new game</Button>
      </div>
    );
  }

  start() {
    this.engine.start();
    this.menu = TetrisMenuPage.Game;
  }

  private renderLevelMenu() {
    var levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return (
      <div
        className="Overlay Level"
        onClick={() => {
          this.menu = TetrisMenuPage.Main;
        }}
      >
        <h4>level</h4>
        <div className="Levels">
          {levels.map((l) => {
            return (
              <Button
                className={this.engine.getLevel() === l ? "Checked" : ""}
                key={"level-" + l}
                onClick={() => {
                  this.engine.setLevel(l);
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

  private renderHighscoreMenu(id: string, editRang?: number | undefined) {
    let clickHandler =
      editRang === undefined
        ? () => (this.menu = TetrisMenuPage.Main)
        : undefined;
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
                        this.highscore[rang].score = this.score
                          ? this.score
                          : 0;
                      }}
                    ></Input>
                    <Button
                      onClick={() => {
                        this.menu = TetrisMenuPage.Main;
                      }}
                    >
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

  private renderKeyMenu() {
    return (
      <div
        className="Overlay Keys"
        onClick={() => {
          this.menu = TetrisMenuPage.Main;
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

  render(): React.ReactNode {
    if (this.menu === TetrisMenuPage.EnterHighscore) {
      return this.renderHighscoreMenu("edit", this.rang);
    } else if (this.menu === TetrisMenuPage.GameOver) {
      return this.renderGameOver();
    } else if (this.menu === TetrisMenuPage.Main) {
      return this.renderMainMenu();
    } else if (this.menu === TetrisMenuPage.Highscore) {
      return this.renderHighscoreMenu("view");
    } else if (this.menu === TetrisMenuPage.Level) {
      return this.renderLevelMenu();
    } else if (this.menu === TetrisMenuPage.Keys) {
      return this.renderKeyMenu();
    } else {
      return <></>;
    }
  }

  renderGameOver() {
    return (
      <div className="Overlay GameOver" onClick={() => this.pause()}>
        <div>Game Over</div>
      </div>
    );
  }
}
