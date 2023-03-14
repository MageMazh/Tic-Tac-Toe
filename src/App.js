import React from 'react'
import Board from './component/Board/Board'
import styles from './App.module.css'

function App() {
  return (
    <div>
    <div className={styles.title}>Tic Tac Toe</div>
      <Board />
    </div>
  )
}

export default App