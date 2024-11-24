import { render } from "https://esm.sh/preact@10.7.2";
import { useState } from "https://esm.sh/preact@10.7.2/hooks";
import { html } from "https://esm.sh/htm@3.0.4/preact";

const gen = genMetadata[4];

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

const INIT_BOARD = {
  mode: user.hit,
  left_board: new Array(gen.numberPokemon).fill(pokemon.normal),
  right_board: new Array(gen.numberPokemon).fill(pokemon.normal),
};

function pokemonClick(state, setState, board, boardIndex) {
  if (board[boardIndex] == pokemon.normal) {
    const newBoard = board;
    newBoard[boardIndex] = state.mode;
    setState({ ...state, board: newBoard });
  } else {
    const newBoard = board;
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

function preprocessDexNumber(number) {
  const str = number.toString();
  return ("000" + str).slice(-3);
}

function Square(props) {
  const boardIndex = props.column + gen.columns * props.row;
  const dexNumber = preprocessDexNumber(gen.offset + boardIndex);
  const pokemonName = gen.names[boardIndex];
  const board = props.left ? props.state.left_board : props.state.right_board;
  const klass = getPokemonClass(board[boardIndex]);

  return html`<button
    className="square ${klass}"
    onclick=${() =>
      pokemonClick(props.state, props.setState, board, boardIndex)}
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
  for (let i = 0; i < gen.columns; ++i) {
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
    left_board: new Array(gen.numberPokemon).fill(pokemon.normal),
    right_board: new Array(gen.numberPokemon).fill(pokemon.normal),
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

function Board(props) {
  const rows = [];
  for (let i = 0; i < gen.rows; ++i) {
    rows.push(
      Row({
        row: i,
        ...props,
      })
    );
  }

  return html`<div>${rows}</div>`;
}

function App() {
  const [state, setState] = useState(structuredClone(INIT_BOARD));

  document.onkeydown = (event) => hotkeys(event, state, setState);

  return html`<div id="app">
    <div id="board">
      ${Header({ state, setState })}
      <div id="board2">
        ${Board({ state, setState, left: true })}
        ${Board({ state, setState, left: false })}
      </div>
    </div>
  </div>`;
}

render(html`<${App} />`, document.body);
