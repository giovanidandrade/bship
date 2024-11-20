import { render } from "https://esm.sh/preact@10.7.2";
import { useState } from "https://esm.sh/preact@10.7.2/hooks";
import { html } from "https://esm.sh/htm@3.0.4/preact";

const user = {
  hit: "HIT",
  miss: "MISS",
  mine: "MINE",
  ship: "SHIP",
};

const pokemon = {
  hit: "HIT",
  miss: "MISS",
  mine: "MINE",
  ship: "SHIP",
  normal: "NORMAL",
};

function pokemonClick(state, setState, boardIndex) {
  if (state.board[boardIndex] == pokemon.normal) {
    const newBoard = state.board;
    newBoard[boardIndex] = state.mode;
    setState({ ...state, board: newBoard });
  } else {
    const newBoard = state.board;
    newBoard[boardIndex] = pokemon.normal;
    setState({ ...state, board: newBoard });
  }
}

function getPokemonClass(pokemonState) {
  switch (pokemonState) {
    case pokemon.hit:
      return "hit-pokemon";

    case pokemon.miss:
      return "miss-pokemon";

    case pokemon.mine:
      return "mine-pokemon";

    case pokemon.ship:
      return "ship-pokemon";

    default:
      return "";
  }
}

function Square(props) {
  const boardIndex = props.column + 12 * props.row;
  const dexNumber = 494 + boardIndex;
  const pokemonName = pokemonNames[boardIndex];
  const klass = getPokemonClass(props.state.board[boardIndex]);

  return html`<button
    className="square ${klass}"
    onclick=${() => pokemonClick(props.state, props.setState, boardIndex)}
    title="${pokemonName}"
  >
    <img
      src="https://www.serebii.net/pokedex-bw/icon/${dexNumber}.png"
      alt="${pokemonName}"
    />
  </button>`;
}

function Row(props) {
  const squares = [];
  for (let i = 0; i < 12; ++i) {
    squares.push(Square({ column: i, ...props }));
  }

  return html`<div className="row">${squares}</div>`;
}

function changeUserMode(state, setState, newMode) {
  setState({
    ...state,
    mode: newMode,
  });
}

function clearAll(state, setState) {
  setState({
    ...state,
    board: new Array(156).fill(pokemon.normal),
  });
}

function Header(props) {
  const isActive = (mode, target) => (mode === target ? "active-btn" : "");

  return html`<div id="header">
    <button
      className="small-btn ${isActive(props.state.mode, user.hit)}"
      onclick=${() => changeUserMode(props.state, props.setState, user.hit)}
    >
      Hit
    </button>
    <button
      className="small-btn  ${isActive(props.state.mode, user.miss)}"
      onclick=${() => changeUserMode(props.state, props.setState, user.miss)}
    >
      Miss
    </button>
    <button
      className="small-btn ${isActive(props.state.mode, user.ship)}"
      onclick=${() => changeUserMode(props.state, props.setState, user.ship)}
    >
      Ship
    </button>
    <button
      className="small-btn ${isActive(props.state.mode, user.mine)}"
      onclick=${() => changeUserMode(props.state, props.setState, user.mine)}
    >
      Bomb
    </button>
    <button
      className="small-btn"
      onclick=${() => clearAll(props.state, props.setState)}
    >
      Clear
    </button>
  </div>`;
}

function hotkeys(event, state, setState) {
  if (event.key == "h") {
    setState({ ...state, mode: user.hit });
  } else if (event.key == "m") {
    setState({ ...state, mode: user.miss });
  } else if (event.key == "s") {
    setState({ ...state, mode: user.ship });
  } else if (event.key == "b") {
    setState({ ...state, mode: user.mine });
  }
}

function App() {
  const [state, setState] = useState({
    mode: user.hit,
    board: new Array(156).fill(pokemon.normal),
  });

  document.onkeydown = (event) => hotkeys(event, state, setState);

  const rows = [];
  for (let i = 0; i < 13; ++i) {
    rows.push(Row({ row: i, state, setState }));
  }

  return html`<div id="app">
    <div id="board">${Header({ state, setState })}${rows}</div>
  </div>`;
}

render(html`<${App} />`, document.body);
