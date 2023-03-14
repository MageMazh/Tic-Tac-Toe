import React from 'react'
import Square from '../Square/Square';
import styles from './Board.module.css';
import Score from '../Score/Score';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //inisialisasi array squares dengan panjang 9 elemen dan nilai awal setiap elemennya adalah null
      squares: Array(9).fill(null),
      xIsNext: false,
      finish : false,
      enemyFirst: true,
      hasComMove: false,
      click: false,
      otherCondition: false, //kalau musuh menang pas memegang pihak 'O'
      score: {
        X: 0,
        O: 0,
      }
    };
  }

  hasWin(squares) {
    const validLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < validLines.length; i++) {
      const [a, b, c] = validLines[i];
      if (squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if(!squares.includes(null)) {
      return "draw";
    } else {
      return null;
    }
    
  }

  getRandomInt(max) {
    while (true) {
      const index = Math.floor(Math.random() * Math.floor(max));
       if (this.state.squares[index] === null) {
        return index
    } 
    }
    
  }

  handleWon(squaresCopy) {
    const won = this.hasWin(squaresCopy);
    if (won === "O" && this.state.finish === false && this.state.enemyFirst) {
        this.setState(prevState => ({
          finish: true,
          score: {
            X: prevState.score.X,
            O: prevState.score.O + 1,
          },
        }));
    } else if (won === "X" && this.state.finish === false && this.state.enemyFirst){
      this.setState(prevState => ({
        finish: true,
        score: {  
          X: prevState.score.X +1,
          O: prevState.score.O,
        },
      }));
    } else if (won === "X" && this.state.finish === false && !this.state.enemyFirst){
      this.setState(prevState => ({
        finish: true,
        score: {  
          X: prevState.score.X ,
          O: prevState.score.O+1,
        },
      }));
    } else if (won === "O" && this.state.finish === false && !this.state.enemyFirst){
      this.setState(prevState => ({
        finish: true,
        score: {  
          X: prevState.score.X +1,
          O: prevState.score.O,
        },
      }));
    }
  }

  handleClick(i) {
    if (!this.state.squares[i] && this.state.finish === false) {
    // untuk membuat sebuah salinan (copy) dari array tersebut
      const squaresCopy = this.state.squares.slice();
      if(!this.state.click || !this.state.otherCondition) {
        squaresCopy[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
          click: true,
          squares: squaresCopy,
          xIsNext: !this.state.xIsNext,
        });
      } else {
        squaresCopy[i] = this.state.xIsNext ? 'O' : 'X';
        this.setState({
          click: true,
          squares: squaresCopy,
          otherCondition: true,
          xIsNext: !this.state.xIsNext,
        });
    }
 
    this.handleWon(squaresCopy)

    }
  }

  computerMove(squaresCopy) {
    squaresCopy[this.getRandomInt(squaresCopy.length)] = this.state.xIsNext ? 'X' : 'O';
    if(this.state.xIsNext) {
      this.setState({
        squares: squaresCopy,
        xIsNext: !this.state.xIsNext,
        hasComMove: true,
      });
      this.handleWon(squaresCopy)
    }
  }

  computerMoveFirst(squaresCopy) {
    if(!this.state.xIsNext && !this.state.otherCondition) {
    squaresCopy[this.getRandomInt(squaresCopy.length)] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      xIsNext : !this.state.xIsNext,
      squares: squaresCopy,
      hasComMove: true,
      click: false,
    });
    } else if (!this.state.xIsNext && this.state.otherCondition) {
      squaresCopy[this.getRandomInt(squaresCopy.length)] = this.state.xIsNext ? 'X' : 'X';
      this.setState({
        otherCondition: false,
        squares: squaresCopy,
        hasComMove: true,
        click: false,
      });
    }
    this.handleWon(squaresCopy)

  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.xIsNext === true && 
      prevState.xIsNext === false && 
      this.state.hasComMove === false &&
      this.state.finish === false && 
      (this.state.squares.includes(null))) {
      setTimeout(() => {
        this.computerMove(this.state.squares);
      }, 10);
  
    }
    else if (
      this.state.xIsNext === false && 
      prevState.xIsNext === true && 
      this.state.finish === false && 
      this.state.hasComMove === false &&
      (this.state.squares.includes(null))) {
      setTimeout(() => {
        this.computerMoveFirst(this.state.squares)
      }, 10);
  
    } else if (this.state.hasComMove === true) {
        setTimeout(() => {

        this.setState({
          hasComMove: false,
        });
        
      }, 1);
      
    }
  }

  handleReset() {
    if(this.state.click) {
      this.setState({
        squares: Array(9).fill(null),
        xIsNext: !this.state.enemyFirst,
        enemyFirst: !this.state.enemyFirst,
        finish: false,

      });
    } else {
      this.setState({
        squares: Array(9).fill(null),
        enemyFirst: !this.state.enemyFirst,
      });
    }

      // Computer's move as 'O'
      if (this.state.enemyFirst) {
        setTimeout(() => {
          const squaresCopy = this.state.squares.slice();
          this.computerMoveFirst(squaresCopy);
        }, 1);
      } else if (!this.state.enemyFirst && this.state.click === true) {
          this.setState({
            xIsNext: false,
            click: false,
            finish: false,
          });
      
      }else if (!this.state.enemyFirst && this.state.click === false) {
      
        this.setState({
          finish: false,
          click: true,
          otherCondition: true,
        });

      }
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
  const winner = this.hasWin(this.state.squares)

  return (
  <div className={styles.tes}>

    <div>
      <div className={styles.boardrow}>
        {this.renderSquare(0)}
        {this.renderSquare(1)}
        {this.renderSquare(2)}
      </div>
      <div className={styles.boardrow}>
        {this.renderSquare(3)}
        {this.renderSquare(4)}
        {this.renderSquare(5)}
      </div>
      <div className={styles.boardrow}>
        {this.renderSquare(6)}
        {this.renderSquare(7)}
        {this.renderSquare(8)}
      </div>
    </div>

    <div className={styles.score}>
      <Score scoreO={this.state.score.O} scoreX={this.state.score.X} enemyFirst={this.state.enemyFirst} />

      <div>
        { winner === "draw" ? (
        <div>
          <p>Hmm.. tampaknya hasilnya draw</p>
          <button onClick={()=> this.handleReset()}>New Game</button>

        </div>
        ): winner !== null ? (
        <div>
          <p>Selamat! pemenangnya adalah {winner}</p>
          <button onClick={()=> this.handleReset()}>New Game</button>
        </div>
        ) : (
        ""
        )}
      </div>

    </div>
  </div>
  );
  }
}
export default Board