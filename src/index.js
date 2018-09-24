import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.squareClass} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, isHighlight) {
	let styles = "square";
	
	if (isHighlight) styles += " highlightItem";
	
    return (
      <Square
        value={this.props.squares[i]}
		squareClass = {styles}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  
  createBoard()	{
	  let board = [];
	  for (let i = 0; i < 3; i++)
	  {
		  let row = [];
		  for (let j = 0; j < 3; j++)
		  {
			  row.push(this.renderSquare(i * 3 + j, this.props.pos.includes(i * 3 + j)));
		  }
		  board.push(<div className="board-row">{row}</div>);
	  }
	  return board;
  }
	
  render() {
    return (
      <div>
	  {this.createBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
		  index: [0],
          squares: Array(9).fill(null),
		  row: Array(9),
		  col: Array(9)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
	  changeSortTo: 'descending'
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
		  index: history.length,
          squares: squares,
		  row: Math.floor(i / 3),
		  col: i % 3
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }
  
  changeStyleSort() {
	this.setState({
      changeSortTo: this.state.changeSortTo == 'ascending' ? 'descending' : 'ascending'
    });  
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
	let posWinner = [];
	let historyMoves = history;
	
	if (this.state.changeSortTo == 'ascending') historyMoves = historyMoves.slice(0).reverse();
    const moves = historyMoves.map((step, move) => {
      const desc = step.index != 0 ?
        'Go to move (col, row) = ' + ' (' + step.col + ', ' + step.row + ')':
        'Go to game start';
      return (
        <li key={step.index}>
			{step.index != this.state.stepNumber ? <button onClick={() => this.jumpTo(step.index)}>{desc}</button> : 
			<button className="selectedItem" onClick={() => this.jumpTo(step.index)}>{desc}</button>}
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner.player;
	  posWinner = winner.pos;
    } else {
		if (this.state.stepNumber == 9)
			status = "Game draw";
		else
			status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
			pos = {posWinner}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
		  <button onClick={() => this.changeStyleSort()}> Change sort moves to {this.state.changeSortTo} order</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
		let result = {pos: lines[i], player: squares[a]};
		return result;
    }
  }
  return null;
}
