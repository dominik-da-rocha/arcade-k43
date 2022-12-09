import React from "react";
import "./App.css";
import { Tetris } from "./Tetris/Tetris";
import { HashRouter, Link, Route, Routes } from "react-router-dom";

function App() {
  return (
    <HashRouter>
      <div className="App">
        <header>
          <Neon>
            <Link to="/" className="left">
              <span>💀</span>
            </Link>
            <div className="right">arcade-k43</div>
          </Neon>
        </header>
        <main>
          <Routes>
            <Route index path="/" element={<Home />} />
            <Route
              path="/tetris"
              element={<Tetris id="tetris" width={15} height={19}></Tetris>}
            />
            <Route path="/notice" element={<Notice></Notice>} />
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
        <ul>
          <li>
            <a href="/tennis1958.html">1958 Tennis Cup</a>
          </li>
          <li>
            <Link to="tetris">tetris</Link>
          </li>
        </ul>
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

function Neon(props: { children: React.ReactNode }) {
  return <div className="Neon">{props.children}</div>;
}
/*
function LoremIpsum(props: { count: number }) {
  var items = [];
  for (let i = 0; i < props.count; i++) {
    items.push(
      <div className="LoremIpsum" key={"lorem-" + i}>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
        sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
        rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
        ipsum dolor sit amet.
      </div>
    );
  }
  return <>{items}</>;
}
*/
export default App;
