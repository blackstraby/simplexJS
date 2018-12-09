//Autores: Jonas Silva Gomes e Rafael Souza de Lana
export const transformarCanonica = (restricoes) => {
  let matriz = [];
  let matrizNumerica = []
  let listaFolga = [];
  let listaArtificial = [];
  let listaX = [];

  restricoes.map((restricao, i) => {
    let vetor = mapearExpressao(restricao.replace(/\s+/g, ''));
    listaX.push(vetor);

    if (restricao.search('<=') !== -1) {
      return listaFolga.push('f' + (listaFolga.length + 1));
    }

    else if (restricao.search('>=') !== -1) {
      listaFolga.push('f' + (listaFolga.length + 1));
      return listaArtificial.push('a' + (listaArtificial.length + 1));
    }

    else if (restricao.search('=') !== -1) {
      return listaArtificial.push('a' + (listaArtificial.length + 1));
    }
    return false;
  });


  restricoes.map((restricao, i) => {
    let expressao = validarExpressao(restricao, i, listaFolga, listaArtificial)
    return matriz.push(expressao);
  });

  //console.log(listaX)
  let listaCabecalho = gerarListaDeX(listaX)
  let listaCabecalhoEsquerda = getCabecalhoEsquerda(listaFolga, listaArtificial)

  listaFolga.map(item => listaCabecalho.push(item))
  listaArtificial.map(item => listaCabecalho.push(item))

  listaCabecalhoEsquerda.push('z')
  listaCabecalho.push('b')

  matrizNumerica = getMatrizNumerica(matriz, listaCabecalho)

  let matrizCanonica = {
    matriz, //restricoes
    listaFolga,
    listaArtificial,
    listaCabecalho,
    listaCabecalhoEsquerda,
    matrizNumerica //valor acompanhado das restricoes
  }
  return matrizCanonica;
}
const getMatrizNumerica = (matriz, topo) => {

  console.log(matriz)

  let m = matriz.map((linha, i) => {


    let newLinha = linha.replace(/\s+/g, '');

    return topo.map(item => {
      let matrizNumerica = []

      let posicao = newLinha.indexOf(item)

      if (posicao !== -1) {
        let elemento = ''
        for (let index = 0; index < posicao; index++) {
          elemento += newLinha[index]
        }
        newLinha = newLinha.replace(item, '')
        newLinha = newLinha.replace(elemento, '')

        if (elemento === '+')
          elemento += '1'

        //console.log(item, elemento)
        matrizNumerica.push(parseInt(elemento))
      } else {
        matrizNumerica.push(0)
        //console.log(0)
      }
      return matrizNumerica;
    })

  });
  console.log(m)
  return m;
}

const getMatrizNumerica2 = (matriz) => {
  let matrizNumerica = []

  matriz.map((linha, i) => {

    let linhaNumerica = []

    for (let index = 0; index < linha.length; index++) {
      const elemento = linha[index];

      if (elemento === 'x' && linha[index - 1] === undefined) {
        linhaNumerica.push(1)

      } else if (elemento === 'x' && !isNaN(linha[index - 1])) {
        if (!isNaN(linha[index - 2]) && !isNaN(linha[index - 1])) {
          let n = linha[index - 2] + linha[index - 1]
          linhaNumerica.push(Number(n))
        } else {
          linhaNumerica.push(Number(linha[index - 1]))
        }

      } else if (elemento === 'f' && !isNaN(linha[index - 1])) {
        linhaNumerica.push(1)

      } else if (elemento === 'a' && !isNaN(linha[index - 1])) {
        linhaNumerica.push(1)

      } else if (elemento === '=') {
        if (!isNaN(linha[linha.length - 2]) && !isNaN(linha[linha.length - 3])) {
          let n = linha[linha.length - 3] + linha[linha.length - 2] + linha[linha.length - 1]
          linhaNumerica.push(Number(n))
        }
        else if (!isNaN(linha[linha.length - 1]) && !isNaN(linha[linha.length - 2])) {
          linhaNumerica.push(Number(linha[linha.length - 2] + linha[linha.length - 1]))
        } else {
          linhaNumerica.push(Number(linha[linha.length - 1]))
        }
      }
    }
    return matrizNumerica.push(linhaNumerica)

  })
  return matrizNumerica;
}

export const geObjetivoNumerico = (linha) => {
  let linhaNumerica = []
  for (let index = 0; index < linha.length; index++) {
    const elemento = linha[index];

    if (elemento === 'x' && linha[index - 1] === undefined) {
      linhaNumerica.push(1)

    } else if (elemento === 'x' && !isNaN(linha[index - 1])) {
      if (!isNaN(linha[index - 2]) && !isNaN(linha[index - 3])) {
        let n = linha[index - 3] + linha[index - 2] + linha[index - 1]
        linhaNumerica.push(Number(n))
      } else if (!isNaN(linha[index - 2]) && !isNaN(linha[index - 1])) {
        let n = linha[index - 2] + linha[index - 1]
        linhaNumerica.push(Number(n))
      } else {
        linhaNumerica.push(Number(linha[index - 1]))
      }

    } else if (elemento === '=') {
      if (!isNaN(linha[linha.length - 2]) && !isNaN(linha[linha.length - 3])) {
        let n = linha[linha.length - 3] + linha[linha.length - 2] + linha[linha.length - 1]
        linhaNumerica.push(Number(n))
      }
      else if (!isNaN(linha[linha.length - 1]) && !isNaN(linha[linha.length - 2])) {
        linhaNumerica.push(Number(linha[linha.length - 2] + linha[linha.length - 1]))
      } else {
        linhaNumerica.push(Number(linha[linha.length - 1]))
      }
    }
  }
  return linhaNumerica
}

const getCabecalhoEsquerda = (listaFolga, listaArtificial) => {
  let listaCabecalhoEsquerda = []
  if (listaFolga.length > 0)
    listaFolga.map(item => listaCabecalhoEsquerda.push(item))


  if (listaArtificial.length > 0)
    listaArtificial.map(item => listaCabecalhoEsquerda.push(item))

  return listaCabecalhoEsquerda;
}

const validarExpressao = (expressao, i, listaF, listaA) => {
  let exp = '';
  let indiceArtificialAux = 0;
  let indiceFolgalAux = 0;

  let listaX = mapearExpressao(expressao.replace(/\s+/g, ''));

  if (listaA.length < i) {
    indiceArtificialAux = i - listaA.length
  } else if (listaA.length > i) {
    indiceArtificialAux = i
  }

  //Valida lista de F para nao chegar um indice que nao existe
  if (listaF.length < i) {
    indiceFolgalAux = i - listaF.length
  } else if (listaF.length > i) {
    indiceFolgalAux = i
  }

  if (listaF[indiceFolgalAux] === undefined) {
    listaF[indiceFolgalAux] = listaF[0]
  }

  // Colocar os F de acordo com x1, x2 ou x3
  if (expressao.search('<=') !== -1) {
    if (expressao.search(listaX[0]) !== -1) {
      if (listaX[2] === undefined && listaX[1] === undefined)
        exp = expressao.replace(listaX[0], listaX[0] + ' + ' + listaF[indiceFolgalAux]);
      if (listaX[2] !== undefined)
        exp = expressao.replace(listaX[2], listaX[2] + ' + ' + listaF[indiceFolgalAux]);
      if (listaX[1] !== undefined)
        exp = expressao.replace(listaX[1], listaX[1] + ' + ' + listaF[indiceFolgalAux]);
      else
        exp = expressao.replace(listaX[0], listaX[0] + ' + ' + listaF[indiceFolgalAux]);
    }
    return exp.replace('<=', '=');
  }

  if (expressao.search('>=') !== -1) {
    if (expressao.search(listaX[0]) !== -1)
      exp = expressao.replace(listaX[0], listaX[0] + ' - ' + listaF[indiceFolgalAux] + ' + ' + listaA[indiceArtificialAux]);
    return exp.replace('>=', '=');
  }

  if (expressao.search('=') !== -1) {
    if (expressao.search(listaX[0]) !== -1)
      return expressao.replace(listaX[0], listaX[0] + ' + ' + listaA[indiceArtificialAux]);
  }

  return false;
}

const gerarListaDeX = (listaX) => {
  let novaListaX = []

  listaX.map((itemX) => {
    return itemX.map((item) => { return novaListaX.push(item) });
  })

  //GERA LISTA X sem repetir para montar o cabeçalho posteriormente
  novaListaX = novaListaX.filter(function (elemento, i) {
    return novaListaX.indexOf(elemento) === i;
  });

  return novaListaX;

}

const mapearExpressao = (expressao) => {
  let vetorX = [];
  let elemento = '';

  for (let index = 0; index < expressao.length; index++) {
    let valorAtual = expressao[index];

    //Acerta a expressao para ficar na forma correta
    if (valorAtual === 'x') {
      elemento = 'x';
    } else if (!isNaN(valorAtual)) {
      elemento = elemento + valorAtual;
    }

    if ((valorAtual === '<' || valorAtual === '>' || valorAtual === '=' ||
      valorAtual === '+' || valorAtual === '-') && elemento) {
      vetorX.push(elemento);
      elemento = '';
    }
  }

  return vetorX;
}

export const converterObjetivo = (objetivoZ) => {
  let objetivo = objetivoZ.split(' ');

  let objAux = objetivo.map(obj => {

    if (obj !== '+' || obj !== '-') {
      let listaX = mapearExpressao(objetivo);

      if (obj.search(listaX[0]) !== -1) {
        let o = obj.split(listaX[0]);
        return o[0];
      }
    }
    return '';
  });

  let objCanonico = [];
  objAux.map(item => {
    if (item !== '') {
      let aux = item;
      if (!isNaN(item[0]) && item[0] !== '0') {
        if (item[0] === '-') {
          aux = item.replace('-', '+');
          return objCanonico.push(aux);
        }
        if (item[0] === '+') {
          aux = item.replace('+', '-');
          return objCanonico.push(aux);
        } else {
          aux = '-' + item;
          return objCanonico.push(aux);
        }
      }
    }
    return objCanonico;
  });

  //console.log(objCanonico);
  return objCanonico;

}

export const formatarValor = valor => (valor.toString().indexOf('.') !== -1)
  ? valor.toFixed('2').replace('.', ',')
  : valor
