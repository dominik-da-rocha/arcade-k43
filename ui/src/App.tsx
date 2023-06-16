import React from "react";
import "./App.css";
import { Tetris } from "./Tetris/Tetris";
import { HashRouter, Link, Route, Routes } from "react-router-dom";
import { TestBoard } from "./Board/Board";

function App() {
  return (
    <HashRouter>
      <div className="App">
        <header>
          <div className="Neon">
            <Link to="/" className="left">
              <span>💀</span>
            </Link>
            <div className="right">arcade-k43</div>
          </div>
        </header>
        <main>
          <Routes>
            <Route index path="/" element={<Home />} />
            <Route
              path="/tetris"
              element={<Tetris id="tetris" width={15} height={19} />}
            />
            <Route path="/board" element={<TestBoard />} />
            <Route path="/notice" element={<Notice />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

function Home() {
  return (
    <div className="Home">
      <article>
        <h1>welcome</h1>
        <div className="Tiles">
          <Tile route="tetris" image="/media/tetris.png" title="tetris" />
          <Tile route="board" image="abc" title="board" />
        </div>
      </article>
      <footer>
        <Link to="/notice">notice</Link>
      </footer>
    </div>
  );
}

function Notice() {
  return (
    <div className="Notice">
      <div>
        this website is for <b>private</b> use only
      </div>
      <div>
        <a href="https://github.com/dominik-da-rocha/kesslerstrasse43">
          visit kesslerstrasse43 at github
        </a>
      </div>
    </div>
  );
}

export interface TileProps {
  route: string;
  image: string;
  title: string;
}

export function Tile(props: TileProps) {
  return (
    <Link className="Tile" to={props.route}>
      <img className="Image" src={props.image} alt={props.title}></img>
      <span className="Title">{props.title}</span>
    </Link>
  );
}

export default App;
