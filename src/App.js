import React, { Component } from 'react';
import Simplex from "./components/Simplex";
import Interacoes from './components/Interacoes';

class App extends Component {

  state = {
    simplex: [],
    simplex2: [],
    simplex3: [],
    simplex4: []
  }

  componentWillMount = () => {
    const simplex = [];
    simplex[0] = [1, 6, -1, 0, 1, 0, 0, 7]
    simplex[1] = [4, 3, 0, -1, 0, 1, 0, 12]
    simplex[2] = [1, 2, 0, 0, 0, 0, 1, 18]
    simplex[3] = [-15, -32, 0, 0, 999999, 999999, 999999, 0]

    const simplex2 = simplex.map((array, row) =>
      array.map((item, i) =>
        (simplex.length - 1 === row) ?
          item - 999999 * simplex[0][i]
          :
          item
      )
    )

    const simplex3 = simplex2.map((array, row) =>
      array.map((item, i) =>
        (simplex.length - 1 === row) ?
          item - 999999 * simplex[1][i]
          :
          item
      )
    )

    const simplex4 = simplex3.map((array, row) =>
      array.map((item, i) =>
        (simplex.length - 1 === row) ?
          item - 999999 * simplex[2][i]
          :
          item
      )
    )
    this.setState({ simplex, simplex2, simplex3, simplex4 })
  }

  render() {
    const { simplex, simplex2, simplex3, simplex4 } = this.state;
    return (
      <div className="container">
        <h2>Simplex React</h2>
        <Simplex />
        <h4>Ajustes</h4>
        <table className="table text-center table-bordered">
          <tbody>
            {simplex.map(array => {
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
                  {array.map(item => <td key={Math.random()}>{item} </td>)}
                </tr>
              )
            })}
          </tbody>
        </table>
        <br />
        <h4>Interações</h4>
        <Interacoes simplexAjustado={simplex4} />
      </div>
    );
  }
}

export default App;
