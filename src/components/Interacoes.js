import React, { Component } from 'react'

export default class Interacoes extends Component {
  state = {
    simplex: this.props.simplexAjustado,
    simplex2: []
  }

  componentDidMount = () => {
    const simplex = this.state.simplex;

    const simplex2 = simplex.map((array, row) =>
      array.map((item, i) => {
        if (row === 0) {
          return item / 6;
        } else if (row === 1) {
          return item - 3 * (simplex[0][i] / 6)
        } else if (row === 2) {
          return item - 2 * (simplex[0][i] / 6)
        } else if (row === 3) {
          return item + 11000021 * (simplex[0][i] / 6)
        } else {
          return item
        }
      })
    )

    this.setState({ simplex, simplex2 })
  }

  render() {
    const { simplex2 } = this.state;
    return (
      <div>
        <table className="table text-center table-bordered">
          <tbody>
            {simplex2.map(array => {
              return (
                <tr key={Math.random()}>
                  {array.map(item => <td key={Math.random()}>{item} </td>)}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

