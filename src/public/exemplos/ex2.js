export const tipo = 'max';
export const objetivo = '3x1 + 5x2 = 0';
export const restricoes = [
  'x1 <= 4',
  '2x2 <= 12',
  '2x1 + 3x2 <= 21',
]

export const cabecalhoTopo = ['x1', 'x2', 'f1', 'f2', 'f3', 'b'];
export const variaveis = cabecalhoTopo.filter(item => item.includes('x'))
export const cabecalhoEsquerda = ['f1', 'f2', 'f3', 'z'];
export const simplex = [
  [1, 0, 1, 0, 0, 4],
  [0, 2, 0, 1, 0, 12],
  [2, 3, 0, 0, 1, 21],
  [-3, -5, 0, 0, 0, 0]
]

// Solução:
// f1 = 2,50
// x2 = 6
// x1 = 1,50
// z = 34,50