export const transformarCanonica = (restricoes) => {
  let matriz = [];
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
  listaFolga.map(item => listaCabecalho.push(item))
  listaArtificial.map(item => listaCabecalho.push(item))
  listaCabecalho.push('b')
  console.log(listaCabecalho)

  let matrizCanonica = {
    matriz,
    listaFolga,
    listaArtificial,
    listaCabecalho
  }
  return matrizCanonica;
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

  if (expressao.search('<=') !== -1) {
    if (expressao.search(listaX[0]) !== -1)
      exp = expressao.replace(listaX[0], listaX[0] + ' + ' + listaF[indiceFolgalAux]);
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

  console.log(objCanonico);
  return objCanonico;

}

export const formatarValor = valor => (valor.toString().indexOf('.') !== -1) ? valor.toFixed('2').replace('.', ',') : valor