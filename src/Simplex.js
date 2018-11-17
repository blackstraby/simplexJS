import React, { Component } from 'react';
import { transformarCanonica, converterObjetivo } from "./Utils/conversores";

export default class Simplex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      entrada: {
        tipo: 'max',
        objetivo: '3x1 + 5x2 = 0',
        restricoes: [
          'x1 <= 4',
          '2x2 <= 12',
          '2x1 + 3x2 <= 21',
          //x1 >= 0 e x2 >= 0
        ]
      },
    };
  }

  componentDidMount = () => {
    let m = transformarCanonica(this.state.entrada.restricoes);

    converterObjetivo(this.state.entrada.objetivo);

    m.push(this.state.entrada.objetivo);
    this.converterMatrix(m);
  }

  converterMatrix = (m) => {
    console.log(m);
    console.log('Base x1\t x2\t f1\t f2\t f3\t b\t')
    console.log('f1\t 1\t 0\t 1\t 0\t 0\t 4\t')
    console.log('f2\t 0\t 2\t 0\t 1\t 0\t 12\t')
    console.log('f3\t 2\t 3\t 0\t 0\t 1\t 21\t')
    console.log('L\t -3\t -5\t 0\t 0\t 0\t 0\t')

  }

  render = () => {
    return (
      <div className="container">

      </div>
    );
  }
}

