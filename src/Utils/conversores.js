export const transformarCanonica = (restricoes) => {
  let matriz = []

  restricoes.map((restricao, i) => {

    let expressao = validarExpressao(restricao, i)

    if (!expressao) return false;

    return matriz.push(expressao);
  });

  return matriz;

}

export const validarExpressao = (expressao, i) => {
  let exp = '';

  if (expressao.search('<=') !== -1) {

    if (expressao.search('x1') !== -1)
      exp = expressao.replace('x1', 'x1 + f' + (i + 1));

    if (expressao.search('x2') !== -1)
      exp = expressao.replace('x2', 'x2 + f' + (i + 1))

    return exp.replace('<=', '=')
  }

  if (expressao.search('>=') !== -1) {
    return 'maior';
  }

  if (expressao.search('=') !== -1) {
    return 'igual';
  }
  return false;
}

export const converterObjetivo = (objetivoZ) => {
  let objetivo = objetivoZ.split(' ');

  let objAux = objetivo.map(obj => {

    if (obj !== '+' || obj !== '-') {
      if (obj.search('x1') !== -1) {
        let o = obj.split('x1')
        return o[0]
      }

      if (obj.search('x2') !== -1) {
        let o = obj.split('x2')
        return o[0]
      }
    }
    return '';
  });

  let objCanonico = [];

  objAux.map(o => {
    if (o !== '') {
      let aux = o;

      if (o[0] === '-') {
        aux = o.replace('-', '+');
        return objCanonico.push(aux);
      }
      if (o[0] === '+') {
        aux = o.replace('+', '-');
        return objCanonico.push(aux);
      } else {
        aux = '-' + o;
        return objCanonico.push(aux);
      }

    }
    return objCanonico;
  });

  console.log(objCanonico);
  return objCanonico;

}
