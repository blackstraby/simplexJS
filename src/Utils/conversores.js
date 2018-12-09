//Autores: Jonas Silva Gomes e Rafael Souza de Lana

export const BIG_M = 999999;

export const transformarCanonica = (restricoes, objetivo, tipo) => {
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

  const copiaListaArtificial = listaArtificial.map(valor => valor);
  const copiaListaFolga = listaFolga.map(valor => valor);

  restricoes.map((restricao, i) => {
    let expressao = validarExpressao(restricao, i, copiaListaFolga, copiaListaArtificial)
    return matriz.push(expressao);
  });

  let listaCabecalho = gerarListaDeX(listaX)

  listaFolga.map(item => listaCabecalho.push(item))
  listaArtificial.map(item => listaCabecalho.push(item))

  let listaCabecalhoEsquerda = getCabecalhoEsquerda(listaFolga, listaArtificial, listaCabecalho, restricoes)

  listaCabecalhoEsquerda.push('z')
  listaCabecalho.push('b')

  matriz.push(objetivo)

  matrizNumerica = getMatrizNumerica(matriz, listaCabecalho, tipo)

  let matrizCanonica = {
    matriz, //restricoes e objetivo
    listaFolga,
    listaArtificial,
    listaCabecalho,
    listaCabecalhoEsquerda,
    matrizNumerica //valor acompanhado das restricoes
  }
  return matrizCanonica;
}

const getMatrizNumerica = (matriz, topo, tipo) => {
  let m = matriz.map((linha, i) => {
    let newLinha = linha.replace(/\s+/g, '');
    let matrizNumerica = []

    topo.forEach(item => {
      let posicao = newLinha.indexOf(item)
      if (item === "b") {
        let posicao = newLinha.indexOf("=");
        let elemento = newLinha.substr(posicao + 1, newLinha.length);
        matrizNumerica.push(parseInt(elemento))
      } else if (posicao !== -1) {
        let elemento = ''
        for (let index = 0; index < posicao; index++) {
          elemento += newLinha[index]
        }
        newLinha = newLinha.replace(item, '')
        newLinha = newLinha.replace(elemento, '')

        if (elemento === '+')
          elemento = '1'
        else if (elemento === '-')
          elemento = '-1'
        else if (isNaN(parseInt(elemento)))
          elemento = '1'

        matrizNumerica.push(parseInt(elemento))
      } else {
        matrizNumerica.push(0)
      }
    })
    return matrizNumerica;
  });

  //Ajusta a linha do Z
  m[m.length - 1] = m[m.length - 1].map((valor, i) => {
    if (valor !== 0)
      return (tipo === "min") ? Math.abs(valor) : Math.abs(valor) * -1
    if (topo[i].includes('a'))
      return BIG_M
    else
      return valor
  })

  return m;
}

const getCabecalhoEsquerda = (listaFolga, listaArtificial, listaCabecalho, restricoes) => {
  let listaCabecalhoEsquerda = []

  const tamRestricoes = restricoes.length;
  const tamanhoListaA = listaArtificial.length

  const quantidadeFs = tamRestricoes - tamanhoListaA;

  listaFolga.forEach((valor, i) => {
    if (i < quantidadeFs) {
      listaCabecalhoEsquerda.push(valor);
    }
  })

  listaArtificial.forEach((valor, i) => {
    if (i < tamanhoListaA) {
      listaCabecalhoEsquerda.push(valor);
    }
  })

  return listaCabecalhoEsquerda;
}

const validarExpressao = (expressao, i, listaF, listaA) => {
  let exp = '';
  let listaX = mapearExpressao(expressao.replace(/\s+/g, ''));

  // Colocar os F de acordo com x1, x2 ou x3
  if (expressao.search('<=') !== -1) {
    exp = expressao.split('<=');
    exp = `${exp[0]} + ${listaF.shift()} = ${exp[1]}`
    return exp;
  }

  if (expressao.search('>=') !== -1) {
    if (expressao.search(listaX[0]) !== -1) {
      exp = expressao.split('>=');
      exp = `${exp[0]} - ${listaF.shift()} + ${listaA.shift()} = ${exp[1]}`
      return exp;
    }
  }

  if (expressao.search('=') !== -1) {
    if (expressao.search(listaX[0]) !== -1) {
      exp = expressao.split('=');
      exp = `${exp[0]} + ${listaA.shift()} = ${exp[1]}`
      return exp;
    }
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
  return objCanonico;

}

export const formatarValor = valor => (valor.toString().indexOf('.') !== -1)
  ? valor.toFixed('2').replace('.', ',')
  : valor
