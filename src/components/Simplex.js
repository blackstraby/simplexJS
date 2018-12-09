//Autores: Jonas Silva Gomes e Rafael Souza de Lana
import React, { Component } from 'react';
import { transformarCanonica, converterObjetivo, formatarValor, BIG_M } from "../Utils/conversores";
import { Table, Divider, Segment, Label, Button } from "semantic-ui-react";
export default class Simplex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      entrada: {
        tipo: "",
        objetivo: "",
        restricoes: []
      },
      simplex: [],
      cabecalhoTopo: [],
      cabecalhoEsquerda: [],
      iteracoes: [],
      ajustes: [],
      iteracoesCabecalhoEsquerda: [],
      solucao: [],
      casoParticular: "",
      metodo: "",
      problemaResolvido: false
    };
  }

  componentWillReceiveProps = (nextProps) => {
    const entrada = nextProps.entrada;
    if (entrada.objetivo) {
      let { matrizNumerica, listaCabecalho, listaCabecalhoEsquerda } = transformarCanonica(entrada.restricoes, entrada.objetivo, entrada.tipo);
      converterObjetivo(entrada.objetivo);

      let novalistaCabecalhoEsquerda = [];

      for (let index = 0; index < listaCabecalhoEsquerda.length; index++) {
        listaCabecalhoEsquerda.forEach(valorEsquerda => {
          if (listaCabecalho.indexOf(valorEsquerda) > -1) {
            if (matrizNumerica[index][listaCabecalho.indexOf(valorEsquerda)] === 1) {
              novalistaCabecalhoEsquerda.push(valorEsquerda)
            }
          }
        })
      }

      novalistaCabecalhoEsquerda.push((entrada.tipo === "max") ? "Z" : "-Z")

      this.setState({
        entrada,
        simplex: matrizNumerica.map(item => item),
        cabecalhoTopo: listaCabecalho.map(item => item),
        cabecalhoEsquerda: novalistaCabecalhoEsquerda.map(item => item),
        iteracoes: [],
        ajustes: [],
        iteracoesCabecalhoEsquerda: [novalistaCabecalhoEsquerda.map(item => item)],
        solucao: [],
        casoParticular: "",
        metodo: "",
        problemaResolvido: false
      })
    }
  }

  contemVariaveisArtificiais = (cabecalhoTopo) => cabecalhoTopo.some(item => item.includes('a'))

  aplicarMetodoBigM = (simplex) => {
    this.setState({ metodo: "Big M" })
    const cabecalhoEsquerda = this.state.cabecalhoEsquerda.map(item => item)
    cabecalhoEsquerda.forEach((item, index) => {
      if (item.includes('a')) {
        const novaLinha = simplex[simplex.length - 1].map((valor, i) => {
          return valor - BIG_M * simplex[index][i]
        })
        simplex[simplex.length - 1] = novaLinha;

        const ajustes = this.state.ajustes;
        ajustes.push(simplex.map(item => item));

        this.setState({ ajustes })
      }
    });
  }

  resolverSimplex = () => {
    const simplex = this.state.simplex.map(linha => linha)

    if (this.contemVariaveisArtificiais(this.state.cabecalhoTopo)) {
      this.aplicarMetodoBigM(simplex);
    }

    //Se teve ajuste vai pegar o último quadro ajustado, se não pega o quadro inicial
    const resultado = (this.state.ajustes.length > 0) ?
      this.gerarIteracoes(this.state.ajustes.slice(-1)[0], 0)
      :
      this.gerarIteracoes(simplex, 0)

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
            this.setState({ casoParticular: "Múltiplas Soluções Ótimas" })
          }
        })
      }
    })

    this.setState({ solucao, problemaResolvido: true })
  }

  temParcelasNegativas = simplex => simplex[simplex.length - 1].some(item => item < 0)

  variaveisXZeradas = simplex => {
    let posicoes = [];
    this.state.cabecalhoTopo.forEach((item, i) => {
      if (item.includes("x")) {
        posicoes.push(simplex[simplex.length - 1][i])
      }
    })
    return posicoes.every(item => item === 0)
  }

  gerarNovaLinhaPivo = (simplex, coluna, linha) => {
    let variavelParaSair = this.getVariavelParaSair(simplex, coluna, linha);
    return simplex[linha].map(variavel => variavel / variavelParaSair)
  }

  //DEGENERESCÊNCIA
  //Se há pelo menos uma solução básica viável com uma variável básica com valor zero (=0). 
  //Se há, essa solução é uma solução básica viável degenerada.
  contemDegenerescencia = (simplex) => simplex.some(linha => linha[linha.length - 1] === 0)

  //ÓTIMO NÃO FINITO
  //Retorna se todos os itens da coluna pivô não são positivos (são todos <= 0)
  otimoNaoFinito = (simplex, colunaPivo) => (simplex.every(linha => linha[colunaPivo] <= 0))

  //Retorna um novo quadro com as operações feitas. 
  //Se for a linha pivô retorna ela mesmo,
  //se não, retorna linha antiga - (coeficiente da coluna pivô) * nova linha pivô
  executarIteracao = (simplex, linhaPivo, novaLinhaPivo, colunaPivo) => {
    return simplex.map((linha, posicaoLinha) =>
      (linhaPivo === posicaoLinha) ?
        novaLinhaPivo
        :
        linha.map((item, posicaoColuna) =>
          item - linha[colunaPivo] * novaLinhaPivo[posicaoColuna]
        )
    )
  }

  gerarIteracoes = (simplex, i) => {
    if (i++ > 20) {
      return simplex
    }
    if (this.state.entrada.tipo === "min" && this.variaveisXZeradas(simplex)) {
      return simplex
    } else if (this.state.entrada.tipo === "max" && !this.temParcelasNegativas(simplex)) {
      return simplex
    } else {
      let colunaPivo = this.getColunaPivo(simplex[simplex.length - 1])
      let linhaPivo = this.getLinhaPivo(simplex, colunaPivo.coluna)

      if (this.otimoNaoFinito(simplex, colunaPivo.coluna)) {
        this.setState({ casoParticular: "Solução ótimo não finito" })
        return simplex
      }

      const novaLinhaPivo =
        this.gerarNovaLinhaPivo(simplex, colunaPivo.coluna, linhaPivo.linha);

      const novoSimplex =
        this.executarIteracao(simplex, linhaPivo.linha, novaLinhaPivo, colunaPivo.coluna);

      if (this.contemDegenerescencia(novoSimplex))
        this.setState({ casoParticular: "Solução ótima e degenerada" })

      const iteracoesCabecalhoEsquerda = this.state.iteracoesCabecalhoEsquerda;
      const novoCabecalhoEsquerda = iteracoesCabecalhoEsquerda.slice(-1)[0].map(item => item);

      novoCabecalhoEsquerda[linhaPivo.linha] = this.state.cabecalhoTopo[colunaPivo.coluna];
      iteracoesCabecalhoEsquerda.push(novoCabecalhoEsquerda);

      const iteracoes = this.state.iteracoes;
      iteracoes.push(novoSimplex);

      this.setState({ iteracoes, iteracoesCabecalhoEsquerda })
      return this.gerarIteracoes(novoSimplex, i)
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

  render = () => {
    const { simplex, iteracoes, iteracoesCabecalhoEsquerda, cabecalhoTopo, cabecalhoEsquerda, solucao, casoParticular, ajustes, metodo, problemaResolvido, entrada } = this.state;

    return (
      <div>
        {(simplex.length > 1) ?
          <div>
            {(!problemaResolvido) ?
              <Button onClick={this.resolverSimplex} color="purple">
                Resolver Simplex
              </Button>
              :
              <p>Problema Resolvido</p>
            }

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
                                <Table.Cell>{cabecalhoEsquerda[j]}</Table.Cell>
                                {linha.map((valor, iCelula) =>
                                  <Table.Cell
                                    key={iCelula}
                                    className={
                                      (cabecalhoTopo[iCelula].indexOf('a' + (i + 2)) > -1 && j === simplex.length - 1) ? "ajuste" : ""
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
            {(problemaResolvido) ?
              <Segment padded>
                <h3>Tipo: &nbsp;<Label color='purple'>{entrada.tipo}</Label></h3>
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
              :
              (false)
            }

          </div>
          :
          <div>
            Aqui será exibido:
            <ul>
              <li>Quadro de cálculos</li>
              <li>Ajustes</li>
              <li>Iterações</li>
              <li>Caso particular (caso tenha)</li>
              <li>Solução</li>
            </ul>
          </div>
        }
      </div>
    );
  }
}
