// MULTIPLAS SOLUÇÕES ÓTIMAS
export const tipo = 'max';
export const objetivo = '3x1 + 2x2 = 0';
export const restricoes = [
  'x1 <= 4',
  '2x2 <= 12',
  '3x1 + 2x2 <= 18',
]

export const cabecalhoTopo = ['x1', 'x2', 'f1', 'f2', 'f3', 'b'];
export const variaveis = cabecalhoTopo.filter(item => item.includes('x'))
export const cabecalhoEsquerda = ['f1', 'f2', 'f3', 'z'];
export const simplex = [
  [1, 0, 1, 0, 0, 4],
  [0, 2, 0, 1, 0, 12],
  [3, 2, 0, 0, 1, 18],
  [-3, -2, 0, 0, 0, 0]
]

// Solução:
// x1 = 4
// f2 = 6
// x2 = 3
// z = 18
