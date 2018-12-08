//BIG M
export const tipo = 'max';
export const objetivo = '-15x1 -32x2 = 0';
export const restricoes = [
  'x1 + 6x2 >= 7',
  '4x1 + 3x2 >= 12',
  'x1 + 2x2 = 18'
]
export const cabecalhoTopo = ['x1', 'x2', 'f1', 'f2', 'a1', 'a2', 'a3', 'b'];
export const variaveis = cabecalhoTopo.filter(item => item.includes('x'))
export const cabecalhoEsquerda = ['a1', 'a2', 'a3', 'z'];
export const simplex = [
  [1, 6, -1, 0, 1, 0, 0, 7],
  [4, 3, 0, -1, 0, 1, 0, 12],
  [1, 2, 0, 0, 0, 0, 1, 18],
  [-15, -32, 0, 0, 999999, 999999, 999999, 0]
]

// Solução:
// x2 = 9
// f1 = 47
// f2 = 15
// z = 288,00