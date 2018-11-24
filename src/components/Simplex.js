import React, { Component } from 'react';
import { transformarCanonica, converterObjetivo } from "../Utils/conversores";

export default class Simplex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      entrada: {
        tipo: 'max',
        objetivo: '520x1 + 450x2 = 0',
        restricoes: [
          /* Precisa colocar tudo na ordem dos sinais todos F, todos A
               Caso contrario ele reseta para F1 novamente se pular
          
          '40x1 + 25x2 <= 400',
          '24x1 + 30x2 <= 360',
          '40x1 + 25x2 <= 400',
          '24x1 + 30x2 >= 360',
           40x1 + 25x2 >= 400',
          '24x1 + 30x2 >= 360',
          '24x1 + 30x2 = 360',
          */
          '40x1 + 25x2 <= 400',
          '24x1 + 30x2 <= 360',
        ]
        // objetivo: '3x1 + 5x2 = 0',
        // restricoes: [
        //   'x1 <= 4',
        //   '2x2 <= 12',
        //   '2x1 + 3x2 <= 9',
        //   //x1 >= 0 e x2 >= 0
        // ]
      },
      simplex: [[1, 0, 1, 0, 0, 4],
      [0, 2, 0, 1, 0, 12],
      [2, 3, 0, 0, 1, 21],
      [-3, -5, 0, 0, 0, 0]],
      b: []
    };
  }

  converterMatrix = (m, b) => {
    //console.log(b)
    console.log(m);
    console.log('Base x1\t x2\t f1\t f2\t f3\t b\t')
    console.log(`f1\t 1\t 0\t 1\t 0\t 0\t ${b[0]}\t`)
    console.log(`f2\t 0\t 2\t 0\t 1\t 0\t ${b[1]}\t`)
    console.log(`f3\t 2\t 3\t 0\t 0\t 1\t ${b[2]}\t`)
    console.log(`Z\t -3\t -5\t 0\t 0\t 0\t ${b[3]}\t`)

  }

  gerarB = m => {
    let b = []

    m.map((array) => {
      if (isNaN(array.length - 2)) {
        return b.push(array[array.length - 1])
      } else {
        return b.push(array[array.length - 2] + array[array.length - 1])
      }

    });

    return b;
  }

  componentDidMount = () => {
    const { matriz, listaArtificial, listaFolga } = transformarCanonica(this.state.entrada.restricoes);
    converterObjetivo(this.state.entrada.objetivo);

    console.log(listaArtificial);
    console.log(listaFolga);

    matriz.push(this.state.entrada.objetivo);

    let b = this.gerarB(matriz);

    this.converterMatrix(matriz, b);

    var simplex = [];
    // const cabecalhoTopo = ['x1', 'x2', 'f1', 'f2', 'f3', 'b'];
    // const variaveis = cabecalhoTopo.filter(item => item.includes('x'))
    // const cabecalhoEsquerda = ['f1', 'f2', 'f3', 'z'];
    // simplex[0] = [1, 0, 1, 0, 0, 4]
    // simplex[1] = [0, 2, 0, 1, 0, 12]
    // simplex[2] = [2, 3, 0, 0, 1, 21]
    // simplex[3] = [-3, -5, 0, 0, 0, 0]

    const cabecalhoTopo = ['x1', 'x2', 'f1', 'f2', 'b'];
    const variaveis = cabecalhoTopo.filter(item => item.includes('x'))
    const cabecalhoEsquerda = ['f1', 'f2', 'z'];
    simplex[0] = [40, 25, 1, 0, 400]
    simplex[1] = [24, 30, 0, 1, 360]
    simplex[2] = [-520, -450, 0, 0, 0]

    const recursiva = (simplex, index) => {
      if (index === simplex[0].length) return simplex
      if (simplex[simplex.length - 1][index] !== 0) {
        let colunaPivo = this.getColunaPivo(simplex[simplex.length - 1])
        //console.log('coluna pivo', colunaPivo)

        let linhaPivo = this.getLinhaPivo(simplex, colunaPivo.coluna)
        //console.log('linha pivo', linhaPivo)

        //console.log('Quem sai', simplex[linhaPivo.linha][colunaPivo.coluna])

        let novaLinha = this.removerVariavel(simplex, colunaPivo.coluna, linhaPivo.linha)

        simplex[linhaPivo.linha] = novaLinha;

        const novoSimplex = simplex.map((linha, i) =>
          (linhaPivo.linha === i) ?
            linha
            :
            linha.map((item, j) =>
              item - simplex[i][colunaPivo.coluna] * simplex[linhaPivo.linha][j]
            )
        )

        cabecalhoEsquerda[linhaPivo.linha] = cabecalhoTopo[colunaPivo.coluna];

        //console.log(cabecalhoEsquerda)

        return recursiva(novoSimplex, ++index)
      }
      return recursiva(simplex, ++index)
    }

    const resultado = recursiva(simplex, 0);
    //console.log("Resultado", resultado)

    const solucao = variaveis.map(variavel => {
      const linha = cabecalhoEsquerda.indexOf(variavel)
      return resultado[linha][resultado[linha].length - 1]
    })
    solucao[solucao.length] = resultado[resultado.length - 1][resultado[0].length - 1]

    //console.log(solucao)
  }

  getColunaPivo = simplex => {
    let pivo = {
      coluna: 0,
      valor: 0
    }

    let maior = 0;
    for (let i = 0; i < simplex.length; i++) {
      if (Math.abs(simplex[i]) > maior && simplex[i] < 0) {
        maior = Math.abs(simplex[i]);
        pivo.coluna = i;
      }
    }

    pivo.valor = maior * -1
    return pivo;

  }

  getLinhaPivo = (simplex, pivo) => {
    let b = [];
    let entrada = [];
    let processoProducao = [];

    let tamSimplex = simplex.length;

    simplex.map((linha, indice) => {
      if (indice !== tamSimplex - 1) {
        let obj = {
          valor: linha[linha.length - 1],
          linha: indice
        }

        b.push(obj)

        let objEntrada = {
          valor: linha[pivo],
          linha: indice
        }
        entrada.push(objEntrada)

        try {
          let valorPp = obj.valor / objEntrada.valor
          return processoProducao.push(valorPp)

        } catch (error) {
          console.log(error)
        }
      }
      return null;
    });

    //PP armazena processo de producao, deve-se pegar o menor valor
    let linhaPivo = {
      linha: 0,
      valor: Math.min(...processoProducao) //menor valor do processo de producao
    }

    processoProducao.map((valor, i) => {
      if (valor === linhaPivo.valor)
        return linhaPivo.linha = i
      return null;
    })

    //retorna objeto contendo a linha e o valor dele no simplex
    return linhaPivo;
  }


  getVariavelParaSair = (simplex, coluna, linha) => {
    let variavelParaSair = null;
    simplex[linha].map((variavel, i) => {
      if (i === coluna)
        variavelParaSair = variavel;
      return null;
    })
    return variavelParaSair;
  }


  removerVariavel = (simplex, coluna, linha) => {
    let variavelParaSair = this.getVariavelParaSair(simplex, coluna, linha);

    return simplex[linha].map(variavel => variavel / variavelParaSair)
  }

  render = () => {
    //console.log(this.state.simplex)

    return (
      <div className="container">

      </div>
    );
  }
}

