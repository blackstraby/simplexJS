//Autores: Jonas Silva Gomes e Rafael Souza de Lana
import React, { Component } from 'react';
import { transformarCanonica, converterObjetivo, formatarValor, geObjetivoNumerico } from "../Utils/conversores";
import { Table, Divider, Segment, Label } from "semantic-ui-react";
import * as Problema from "../public/exemplos/ex1";
import simplex1 from "../public/jsons/ex3";
export default class Simplex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bigM: 999999,
      entrada: {
        tipo: Problema.tipo,
        objetivo: Problema.objetivo,
        restricoes: Problema.restricoes.map(item => item)
      },
      simplex: Problema.simplex.map(item => item),
      cabecalhoTopo: Problema.cabecalhoTopo.map(item => item),
      cabecalhoEsquerda: Problema.cabecalhoEsquerda.map(item => item),
      variaveis: Problema.variaveis.map(item => item),
      iteracoes: [],
      ajustes: [],
      iteracoesCabecalhoEsquerda: [Problema.cabecalhoEsquerda.map(item => item)],
      solucao: [],
      casoParticular: "",
      metodo: "",
      b: []
    };
  }

  componentWillReceiveProps = (nextProps) => {
    console.log("Entrada: ", nextProps.entrada)
  }

  componentDidMount = () => {
    let { matriz, matrizNumerica, listaCabecalho, listaCabecalhoEsquerda } = transformarCanonica(simplex1.restricoes);
    converterObjetivo(simplex1.objetivo);

    let objetivo = geObjetivoNumerico(simplex1.objetivo)

    matrizNumerica.push(objetivo);

    console.log(listaCabecalho);
    console.log(listaCabecalhoEsquerda);
    console.log(matrizNumerica);

    matriz.push(simplex1.objetivo);

    const simplex = this.state.simplex.map(linha => linha)

    if (this.state.cabecalhoTopo.some(item => item.includes('a'))) {
      this.setState({ metodo: "Big M" })
      console.log("##### SOLUÇÃO VARIÁVEIS ARTIFICIAIS - BIG M")
      const cabecalhoEsquerda = this.state.cabecalhoEsquerda.map(item => item)
      cabecalhoEsquerda.forEach((item, index) => {
        const linha = item.indexOf('a');

        if (linha > -1) {
          const novaLinha = simplex[simplex.length - 1].map((valor, i) => {
            return valor - this.state.bigM * simplex[index][i]
          })
          simplex[simplex.length - 1] = novaLinha;

          const ajustes = this.state.ajustes;
          ajustes.push(simplex.map(item => item));

          this.setState({ ajustes })
        }
      });
    }

    //Se teve ajuste vai pegar o último quadro ajustado, se não pega o quadro inicial
    const resultado = (this.state.ajustes.length > 0) ?
      this.gerarIteracoes(this.state.ajustes.slice(-1)[0])
      :
      this.gerarIteracoes(simplex)

    const solucao = this.state.iteracoesCabecalhoEsquerda.slice(-1)[0].map(variavel => {
      const linha = this.state.iteracoesCabecalhoEsquerda.slice(-1)[0].indexOf(variavel)
      if (linha !== -1)
        return resultado[linha].slice(-1)[0]
      else
        return 0
    })

    //VERIFICAR MÚLTIPLAS SOLUÇÕES ÓTIMAS

    this.state.cabecalhoTopo.forEach((item, posicao) => {
      if (item.indexOf('f') > -1) {
        const ultimoQuadro = this.state.iteracoes.slice(-1)[0].map(item => item);

        ultimoQuadro.forEach(linha => {
          if (linha[posicao] > 0 && ultimoQuadro.slice(-1)[0][posicao] === 0) {
            console.log("É MÚLTIPLAS SOLUÇÕES ÓTIMAS")
            this.setState({ casoParticular: "Múltiplas Soluções Ótimas" })
          }
        })
      }
    })


    this.setState({ solucao })
  }

  temParcelasNegativas = simplex => simplex[simplex.length - 1].some(item => item < 0)

  otimoNaoFinito = (simplex, colunaPivo) => (simplex.every(linha => linha[colunaPivo] <= 0))

  gerarIteracoes = (simplex) => {

    if (!this.temParcelasNegativas(simplex)) {
      return simplex
    } else {
      // console.log("&&&&#####", simplex.map(item => item))
      let colunaPivo = this.getColunaPivo(simplex[simplex.length - 1])
      console.log('coluna pivo', colunaPivo)

      let linhaPivo = this.getLinhaPivo(simplex, colunaPivo.coluna)
      console.log('linha pivo', linhaPivo)

      //ÓTIMO NÃO FINITO
      //Retorna se todos os itens da coluna pivô não são positivos (são todos <= 0)
      if (this.otimoNaoFinito(simplex, colunaPivo.coluna)) {
        this.setState({ casoParticular: "Solução ótimo não finito" })
        console.log("##### SOLUÇÃO ÓTIMO NÃO FINITO")
        return simplex
      }

      //console.log('Quem sai', simplex[linhaPivo.linha][colunaPivo.coluna])

      const novaLinhaPivo =
        this.gerarNovaLinhaPivo(simplex, colunaPivo.coluna, linhaPivo.linha);

      //Retorna uma nova tabela com as operações feitas. 
      //Se for a linha pivô retorna ela mesmo,
      //se não, retorna linha antiga - (coeficiente da coluna pivô) * nova linha pivô
      const novoSimplex = simplex.map((linha, posicaoLinha) =>
        (linhaPivo.linha === posicaoLinha) ?
          novaLinhaPivo
          :
          linha.map((item, posicaoColuna) =>
            item - linha[colunaPivo.coluna] * novaLinhaPivo[posicaoColuna]
          )
      )

      //DEGENERESCÊNCIA
      //Se há pelo menos uma solução básica viável com uma variável básica com valor zero (=0). 
      //Se há, essa solução é uma solução básica viável degenerada.
      novoSimplex.forEach(linha => {
        if (linha[linha.length - 1] === 0) {
          this.setState({ casoParticular: "Solução ótima e degenerada" })
          console.log("##### SOLUÇÃO DEGENERADA")
        }
      });

      const iteracoesCabecalhoEsquerda = this.state.iteracoesCabecalhoEsquerda;
      const novoCabecalhoEsquerda = iteracoesCabecalhoEsquerda.slice(-1)[0].map(item => item);

      novoCabecalhoEsquerda[linhaPivo.linha] = this.state.cabecalhoTopo[colunaPivo.coluna];
      iteracoesCabecalhoEsquerda.push(novoCabecalhoEsquerda);

      const iteracoes = this.state.iteracoes;
      iteracoes.push(novoSimplex);

      this.setState({ iteracoes, iteracoesCabecalhoEsquerda })
      return this.gerarIteracoes(novoSimplex)
    }
  }

  getColunaPivo = simplex => {
    let pivo = {
      coluna: 0,
      valor: 0
    }
    let maior = 0;
    for (let i = 0; i < simplex.length - 1; i++) {
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
    let linhas = [];

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
          if (objEntrada.valor < 0) {
            return processoProducao;
          } else {
            let valorPp = obj.valor / objEntrada.valor
            linhas[indice] = { valorPp, linha: indice }
            return processoProducao.push(valorPp)
          }
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

    //ordena para que o primeiro item seja a linha com menor valor
    linhas.sort(function (a, b) {
      if (a.valorPp > b.valorPp) {
        return 1;
      }
      if (a.valorPp < b.valorPp) {
        return -1;
      }
      return 0;
    });

    // processoProducao.map((valor, i) => {
    //   if (valor === linhaPivo.valor)
    //     return linhaPivo.linha = i
    //   return null;
    // })

    linhaPivo.valor = linhas[0].valorPp;
    linhaPivo.linha = linhas[0].linha;

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
    const { simplex, iteracoes, iteracoesCabecalhoEsquerda, cabecalhoTopo, solucao, casoParticular, ajustes, metodo } = this.state;
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
                    <Table.Cell>{iteracoesCabecalhoEsquerda[0][i]}</Table.Cell>
                    {linha.map((valor, iCelula) =>
                      <Table.Cell
                        key={iCelula}
                        className={(cabecalhoTopo[iCelula].indexOf('a' + 1) > -1 && i === simplex.length - 1) ? "ajuste" : ""}
                      >
                        {formatarValor(valor)}
                      </Table.Cell>)}
                  </Table.Row>
                )
              })
            }
          </Table.Body>
        </Table>
        <Divider hidden />
        {(ajustes.length > 0) ?
          ajustes.map((tabela, i) => {
            return (
              <div key={i}>
                <h3>{i + 1}ª Ajuste</h3>
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
                            <Table.Cell>{iteracoesCabecalhoEsquerda[i + 1][j]}</Table.Cell>
                            {linha.map((valor, iCelula) =>
                              <Table.Cell
                                key={iCelula}
                                className={
                                  (cabecalhoTopo[iCelula].indexOf('a' + (i + 1 + 1)) > -1 && j === simplex.length - 1) ? "ajuste" : ""
                                }
                              >
                                {formatarValor(valor)}
                              </Table.Cell>)
                            }
                          </Table.Row>
                        )
                      })
                    }
                  </Table.Body>
                </Table>
                <Divider hidden />
              </div>
            )
          })
          :
          (false)
        }
        {iteracoes.map((tabela, i) => {
          return (
            <div key={i}>
              <h3>{i + 1}ª Iteração</h3>
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
                          <Table.Cell>{iteracoesCabecalhoEsquerda[i + 1][j]}</Table.Cell>
                          {linha.map((valor, i) => <Table.Cell key={i}>{formatarValor(valor)}</Table.Cell>)}
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
            <Label color='purple'>Solução básica</Label>
          }

          {(metodo) ?
            <h3>Método: &nbsp;<Label color='purple'>{metodo}</Label></h3>
            :
            <Label color='purple'>Simplex Simples</Label>
          }
          <div>
            <Divider />
            <h3>Solução:</h3>
            {(solucao.length > 0) ?
              iteracoesCabecalhoEsquerda.slice(-1)[0].map((variavel, i) => {
                return <h4 key={i}>{`${variavel} = ${formatarValor(solucao[i])}`}</h4>
              })
              :
              (false)
            }
          </div>
        </Segment>
      </div>
    );
  }
}
