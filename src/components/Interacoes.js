import React, { Component } from 'react'

export default class Interacoes extends Component {
  state = {
    simplex: this.props.simplexAjustado,
    simplex2: [],
    simplex3: [],
    simplex4: []
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
          return item - simplex[3][1] * (simplex[0][i] / 6)
        } else {
          return item
        }
      })
    )

    const simplex3 = simplex2.map((array, row) =>
      array.map((item, i) => {
        if (row === 0) {
          return item + 1 / 6 * (simplex2[1][i] * 2);
        } else if (row === 1) {
          return item / 0.5
        } else if (row === 2) {
          return item - 1 / 3 * (simplex2[1][i] * 2);
        } else if (row === 3) {
          return item - simplex2[3][2] * (simplex2[1][i] * 2);
        } else {
          return item
        }
      })
    )

    const simplex4 = simplex3.map((array, row) =>
      array.map((item, i) => {
        if (row === 0) {
          return item + 1 / 3 * (simplex3[2][i] / (2 / 3));
        } else if (row === 1) {
          return item + 2 * (simplex3[2][i] / (2 / 3));
        } else if (row === 2) {
          return item / (2 / 3);
        } else if (row === 3) {
          return item - simplex3[3][3] * (simplex3[2][i] / (2 / 3));
        } else {
          return item
        }
      })
    )

    this.setState({ simplex, simplex2, simplex3, simplex4 })
  }

  render() {
    const { simplex2, simplex3, simplex4 } = this.state;
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
        <hr />
        <table className="table text-center table-bordered">
          <tbody>
            {simplex3.map(array => {
              return (
                <tr key={Math.random()}>
                  {array.map(item => <td key={Math.random()}>{item} </td>)}
                </tr>
              )
            })}
          </tbody>
        </table>
        <hr />
        <table className="table text-center table-bordered">
          <tbody>
            {simplex4.map(array => {
              return (
                <tr key={Math.random()}>
                  {array.map(item => <td key={Math.random()}>{(item.toString().length > 1) ? item.toFixed(1) : item} </td>)}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

