import { useState } from "react";
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
  name: string;
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
  private rang: number | undefined = undefined;
  private score: number | undefined = undefined;
  private engine: TetrisEngine;
  private highscore: TetrisHighscore[] = [];

  constructor(engine: TetrisEngine) {
    this.engine = engine;
    this.handleGameOver = this.handleGameOver.bind(this);
    engine.onGameOver = this.handleGameOver;
    this.setMenu(TetrisMenuPage.Game);
    this.fetchHighscore();
  }

  private setMenu(menu: TetrisMenuPage) {
    if (menu === TetrisMenuPage.Highscore) {
      this.fetchHighscore().then(() => {
        this.menu = menu;
      });
    } else {
      this.menu = menu;
    }
  }

  private getMenu(): TetrisMenuPage {
    return this.menu;
  }

  public pause() {
    if (this.getMenu() === TetrisMenuPage.Game) {
      this.setMenu(TetrisMenuPage.Main);
      this.engine.pause();
    } else if (
      this.getMenu() === TetrisMenuPage.Main ||
      this.getMenu() === TetrisMenuPage.Highscore ||
      this.getMenu() === TetrisMenuPage.Level ||
      this.getMenu() === TetrisMenuPage.Keys ||
      this.getMenu() === TetrisMenuPage.EnterHighscore
    ) {
      this.setMenu(TetrisMenuPage.Game);
      this.engine.pause();
    } else if (this.getMenu() === TetrisMenuPage.GameOver) {
      this.setMenu(TetrisMenuPage.Main);
    }
  }

  handleGameOver(event: TetrisGameOverEvent) {
    this.score = event.score;
    this.rang = this.highscore.findIndex((high) => high.score < event.score);
    this.setMenu(TetrisMenuPage.GameOver);
    if (this.rang >= 0 && this.rang < this.highscore.length) {
      this.setMenu(TetrisMenuPage.EnterHighscore);
    }
  }

  private fetchHighscore() {
    return fetch("/api/v1/tetris/highscore")
      .then((r) => r.json())
      .then((json) => (this.highscore = json))
      .catch((err) => {
        console.error(err);
      });
  }

  private postHighscore(score: TetrisHighscore) {
    return fetch("/api/v1/tetris/highscore", {
      method: "POST",
      body: JSON.stringify([score]),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => {
        if (r.status >= 200 && r.status < 300) {
          this.fetchHighscore();
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        this.score = undefined;
        this.rang = undefined;
        this.engine.start();
        this.engine.pause();
      });
  }

  private renderMainMenu() {
    return (
      <div className="Overlay">
        <h4>tetris</h4>
        <Button onClick={() => this.pause()}>resume</Button>
        <Button onClick={() => this.setMenu(TetrisMenuPage.Highscore)}>
          highscore
        </Button>
        <Button onClick={() => this.setMenu(TetrisMenuPage.Level)}>
          level
        </Button>
        <Button onClick={() => this.setMenu(TetrisMenuPage.Keys)}>keys</Button>
        <Button onClick={() => this.start()}>new game</Button>
      </div>
    );
  }

  start() {
    this.engine.start();
    this.setMenu(TetrisMenuPage.Game);
  }

  private renderLevelMenu() {
    var levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return (
      <div
        className="Overlay Level"
        onClick={() => {
          this.setMenu(TetrisMenuPage.Main);
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
    return (
      <TetrisHighscoreMenu
        id={id}
        score={this.score}
        editRang={editRang}
        highscore={this.highscore}
        goBackHandler={() => this.setMenu(TetrisMenuPage.Main)}
        postHighscore={(score) => {
          this.postHighscore(score);
        }}
      />
    );
  }

  private renderKeyMenu() {
    return (
      <div
        className="Overlay Keys"
        onClick={() => {
          this.setMenu(TetrisMenuPage.Main);
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
    if (this.getMenu() === TetrisMenuPage.EnterHighscore) {
      return this.renderHighscoreMenu("edit", this.rang);
    } else if (this.getMenu() === TetrisMenuPage.GameOver) {
      return this.renderGameOver();
    } else if (this.getMenu() === TetrisMenuPage.Main) {
      return this.renderMainMenu();
    } else if (this.getMenu() === TetrisMenuPage.Highscore) {
      return this.renderHighscoreMenu("view");
    } else if (this.getMenu() === TetrisMenuPage.Level) {
      return this.renderLevelMenu();
    } else if (this.getMenu() === TetrisMenuPage.Keys) {
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

interface TetrisHighscoreMenuProps {
  goBackHandler: () => void;
  id: string;
  editRang: number | undefined;
  score: number | undefined;
  highscore: TetrisHighscore[];
  postHighscore: (score: TetrisHighscore) => void;
}

function TetrisHighscoreMenu(props: TetrisHighscoreMenuProps) {
  let [highscore, setHighscore] = useState<TetrisHighscore>({
    name: "",
    score: 0,
  });

  return (
    <div
      className="Overlay Highscore"
      onClick={() => {
        if (props.editRang === undefined) {
          props.goBackHandler();
        }
      }}
    >
      <h4>highscore</h4>
      {props.highscore.map((high, rang) => {
        return (
          <div className="Entry" key={props.id + "-highscore-" + rang}>
            <span>
              <span className="Rang">{rang + 1}</span>
              {props.editRang === rang ? (
                <span className="EditHighscore">
                  <Input
                    onInput={(e) => {
                      setHighscore({
                        name: (e.target as any).value,
                        score: props.score ? props.score : 0,
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        props.postHighscore(highscore);
                        props.goBackHandler();
                      }
                    }}
                  ></Input>
                  <Button
                    onClick={() => {
                      props.postHighscore(highscore);
                      props.goBackHandler();
                    }}
                  >
                    ok
                  </Button>
                </span>
              ) : (
                <span>{high.name}</span>
              )}
            </span>
            <span>{high.score}</span>
          </div>
        );
      })}
    </div>
  );
}
