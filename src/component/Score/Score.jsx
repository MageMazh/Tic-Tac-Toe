import React from 'react'

function Score(props) {
const { scoreO, scoreX, enemyFirst } = props

return (
  <div>
    {enemyFirst ? (
    <div>
      Score:
      <ul>
        <li>You (O): {scoreO}</li>
        <li>Com (X): {scoreX}</li>
      </ul>
    </div>
    ) : (
    <div>
      Score:
      <ul>
        <li>You (X): {scoreO}</li>
        <li>Com (O): {scoreX}</li>
      </ul>
    </div>
    )}
  </div>
)
}

export default Score