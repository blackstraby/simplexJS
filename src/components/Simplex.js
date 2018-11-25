import React, { Component } from 'react';
import { transformarCanonica, converterObjetivo } from "../Utils/conversores";
import { Table, Divider, Segment, Label } from "semantic-ui-react";
import * as Problema from "../public/exemplos/ex1";

export default class Simplex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      entrada: {
        tipo: Problema.tipo,
        objetivo: Problema.objetivo,
        restricoes: Problema.restricoes
      },
      simplex: Problema.simplex,
      cabecalhoTopo: Problema.cabecalhoTopo,
      cabecalhoEsquerda: Problema.cabecalhoEsquerda,
      variaveis: Problema.variaveis,
      iteracoes: [],
      iteracoesCabecalhoEsquerda: [Problema.cabecalhoEsquerda],
      solucao: [],
      solucoesAlternativas: [],
      casoParticular: "",
      b: []
    };
  }

  componentWillReceiveProps = (nextProps) => {
    console.log("Entrada: ", nextProps.entrada)
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

    const cabecalhoTopo = this.state.cabecalhoTopo;
    const variaveis = this.state.variaveis;
    const cabecalhoEsquerda = this.state.cabecalhoEsquerda;
    const simplex = this.state.simplex;
    // const iteracoesCabecalhoEsquerda = this.state.iteracoesCabecalhoEsquerda;
    const iteracoes = this.state.iteracoes;
    iteracoes.push(simplex);

    this.setState({ simplex })

    const resultado = this.gerarIteracoes(simplex, variaveis, cabecalhoEsquerda, cabecalhoTopo);
    const solucao = variaveis.map(variavel => {
      const linha = cabecalhoEsquerda.indexOf(variavel)
      if (linha !== -1)
        return resultado[linha][resultado[linha].length - 1]
      else
        return 0
    })
    solucao[solucao.length] = resultado[resultado.length - 1][resultado[0].length - 1]

    //SOLUÇÕES ALTERNATIVAS
    // variaveis.map(variavel => {
    //   const coluna = cabecalhoTopo.indexOf(variavel)
    //   if (coluna !== -1) {

    //   }
    // })
    this.setState({ solucao })
    console.log(solucao)
  }

  temParcelasNegativas = simplex => simplex[simplex.length - 1].some(item => item < 0)

  gerarIteracoes = (simplex, variaveis, cabecalhoEsquerda, cabecalhoTopo) => {
    if (!this.temParcelasNegativas(simplex)) {
      return simplex
    } else {
      let colunaPivo = this.getColunaPivo(simplex[simplex.length - 1])
      // console.log('coluna pivo', colunaPivo)

      let linhaPivo = this.getLinhaPivo(simplex, colunaPivo.coluna)
      //console.log('linha pivo', linhaPivo)

      //ÓTIMO NÃO FINITO
      //Retorna se todos os itens da coluna pivô não são positivos (são todos <= 0)
      if (simplex.every(linha => linha[colunaPivo.coluna] <= 0)) {
        this.setState({ casoParticular: "Ótimo não finito" })
        return simplex
      }

      //console.log('Quem sai', simplex[linhaPivo.linha][colunaPivo.coluna])

      simplex[linhaPivo.linha] =
        this.gerarNovaLinhaPivo(simplex, colunaPivo.coluna, linhaPivo.linha);

      //Retorna uma nova tabela com as operações feitas. 
      //Se for a linha pivô retorna ela mesmo,
      //se não, retorna linha antiga - (coeficiente da coluna pivô) * nova linha pivô
      const novoSimplex = simplex.map((linha, posicaoLinha) =>
        (linhaPivo.linha === posicaoLinha) ?
          linha
          :
          linha.map((item, posicaoColuna) =>
            item - linha[colunaPivo.coluna] * simplex[linhaPivo.linha][posicaoColuna]
          )
      )

      console.log(cabecalhoEsquerda)
      cabecalhoEsquerda[linhaPivo.linha] = cabecalhoTopo[colunaPivo.coluna];

      const iteracoesCabecalhoEsquerda = this.state.iteracoesCabecalhoEsquerda;
      iteracoesCabecalhoEsquerda.push(cabecalhoEsquerda);

      const iteracoes = this.state.iteracoes;
      iteracoes.push(novoSimplex);

      this.setState({ iteracoes, cabecalhoEsquerda })
      return this.gerarIteracoes(novoSimplex, variaveis, cabecalhoEsquerda, cabecalhoTopo)
    }
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


  gerarNovaLinhaPivo = (simplex, coluna, linha) => {
    let variavelParaSair = this.getVariavelParaSair(simplex, coluna, linha);

    return simplex[linha].map(variavel => variavel / variavelParaSair)
  }

  render = () => {
    const { simplex, iteracoes, iteracoesCabecalhoEsquerda, cabecalhoTopo, cabecalhoEsquerda, variaveis, solucao, casoParticular } = this.state;
    console.log(Problema.cabecalhoEsquerda)
    return (
      <div>
        <h3>Quadro de cálculos</h3>
        <Divider hidden />
        <Table celled className="tabela-simplex">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>BASE</Table.HeaderCell>
              {cabecalhoTopo.map((valor, i) => <Table.HeaderCell key={i}>{valor}</Table.HeaderCell>)}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              simplex.map((linha, i) => {
                return (
                  <Table.Row key={i}>
                    <Table.Cell>{cabecalhoEsquerda[i]}</Table.Cell>
                    {linha.map((valor, i) => <Table.Cell key={i}>{(valor.toString().indexOf('.') !== -1) ? valor.toFixed('3').replace('.', ',') : valor}</Table.Cell>)}
                  </Table.Row>
                )
              })
            }
          </Table.Body>
        </Table>
        {iteracoes.map((tabela, i) => {
          return (
            <div key={i}>
              <h3>{i + 1}ª iteração</h3>
              <Divider hidden />
              <Table celled className="tabela-simplex">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>BASE</Table.HeaderCell>
                    {cabecalhoTopo.map((valor, i) => <Table.HeaderCell key={i}>{valor}</Table.HeaderCell>)}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                    tabela.map((linha, j) => {
                      return (
                        <Table.Row key={j}>
                          <Table.Cell>{iteracoesCabecalhoEsquerda[i][j]}</Table.Cell>
                          {linha.map((valor, i) => <Table.Cell key={i}>{(valor.toString().indexOf('.') !== -1) ? valor.toFixed('3').replace('.', ',') : valor}</Table.Cell>)}
                        </Table.Row>
                      )
                    })
                  }
                </Table.Body>
              </Table>
              <Divider hidden />
            </div>
          )
        })}
        <Segment padded>
          {(casoParticular) ?
            <h3>Caso particular: &nbsp;<Label color='purple'>{casoParticular}</Label></h3>
            :
            <div>
              <h3>Solução:</h3>
              {variaveis.map((variavel, i) => {
                return <h4 key={i}>{`${variavel} = ${solucao[i]}`}</h4>
              })}
              <h4>Z = {solucao[solucao.length - 1]}</h4>
            </div>
          }
        </Segment>
      </div>
    );
  }
}

