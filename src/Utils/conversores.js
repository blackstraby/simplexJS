/*
      TODO

  lista de F (f1, f2, f3)
  lista de A (a1, a2)

  Retornar cabeçalho do topo e lateral

*/

export const transformarCanonica = (restricoes) => {
  let matriz = []

  restricoes.map((restricao, i) => {
    let expressao = validarExpressao(restricao, i)
    if (!expressao) return false;

    return matriz.push(expressao);
  });

  return matriz;
}

const mapearExpressao = (expressao) => {
  let vetorX = [];
  let elemento = '';

  for (let index = 0; index < expressao.length; index++) {
    let valorAtual = expressao[index]

    if (valorAtual === 'x') {
      elemento = 'x'
    } else if (!isNaN(valorAtual)) {
      elemento = elemento + valorAtual
    }

    if ((valorAtual === '<' || valorAtual === '>' || valorAtual === '=' ||
      valorAtual === '+' || valorAtual === '-') && elemento) {
      vetorX.push(elemento)
      elemento = ''
    }
  }

  return vetorX;
}

export const validarExpressao = (expressao, i) => {
  let exp = '';
  let listaX = mapearExpressao(expressao.replace(/\s+/g, ''));

  if (expressao.search('<=') !== -1) {
    if (expressao.search(listaX[0]) !== -1)
      exp = expressao.replace(listaX[0], listaX[0] + ' + f' + (i + 1));

    return exp.replace('<=', '=')
  }

  if (expressao.search('>=') !== -1) {
    if (expressao.search(listaX[0]) !== -1)
      exp = expressao.replace(listaX[0], listaX[0] + ' + a' + (i + 1) + ' - f' + (i + 1));

    return exp.replace('>=', '=')
  }

  if (expressao.search('=') !== -1) {
    if (expressao.search(listaX[0]) !== -1)
      return expressao.replace(listaX[0], listaX[0] + ' + a' + (i + 1));
  }

  return false;
}

export const converterObjetivo = (objetivoZ) => {
  let objetivo = objetivoZ.split(' ');

  let objAux = objetivo.map(obj => {

    if (obj !== '+' || obj !== '-') {
      let listaX = mapearExpressao(objetivo);

      if (obj.search(listaX[0]) !== -1) {
        let o = obj.split(listaX[0])
        return o[0]
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
          return objCanonico.push(aux)
        }
      }
    }
    return objCanonico;
  });

  console.log(objCanonico);
  return objCanonico;

}
