import React, { useState } from "react";
import "./styles.css";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice(); // squares 配列のコピー（nextSquares）を作成
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    // setSquares(nextSquares) コピーした配列を set 関数に渡して更新
    // setXIsNext(!xIsNext);
    onPlay(nextSquares); // setSquares, setXIsNext の代わり
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  // 盤面の履歴：[[null, ...], ]
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0); // 現在ユーザーが見ているのが何番目の着手であるのかを管理
  const xIsNext = currentMove % 2 === 0;
  // const currentSquares = history[history.length - 1]; // 始めは history[1-1] → history[0] = [[null が 9 個]]
  const currentSquares = history[currentMove]; // 現在選択されている着手をレンダーするように設定

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; // 履歴のうち着手時点までの部分のみが保持されるようになる
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove); // const currentSquares = history[currentMove]; が変わる
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // 横
    [3, 4, 5], // 横
    [6, 7, 8], // 横
    [0, 3, 6], // 縦
    [1, 4, 7], // 縦
    [2, 5, 8], // 縦
    [0, 4, 8], // 斜め（左上から右下）
    [2, 4, 6], // 斜め（右上から左下）
  ];
  // 勝利条件の判定
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]; // 勝ちパターンのひとつ
    // 勝利条件の盤面が全て同じ図形（X or O）であればその図形を返す
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
