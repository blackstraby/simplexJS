export const tipo = 'max';
export const objetivo = '3x1 + 5x2 = 0';
export const restricoes = [
  'x1 <= 4',
  '2x2 <= 12',
  '2x1 + 3x2 <= 9',
  //x1 >= 0 e x2 >= 0
]

export const cabecalhoTopo = ['x1', 'x2', 'f1', 'f2', 'b'];
export const variaveis = cabecalhoTopo.filter(item => item.includes('x'))
export const cabecalhoEsquerda = ['f1', 'f2', 'z'];
export const simplex = [
  [40, 25, 1, 0, 400],
  [24, 30, 0, 1, 360],
  [-520, -450, 0, 0, 0]
]