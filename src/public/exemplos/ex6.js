//DEGENERESCÊNCIA
export const tipo = 'max';
export const objetivo = '3x1 + 9x2 = 0';
export const restricoes = [
  'x1 + 4x2 <= 8',
  'x1 + 2x2 <= 4',
]
export const cabecalhoTopo = ['x1', 'x2', 'f1', 'f2', 'b'];
export const variaveis = cabecalhoTopo.filter(item => item.includes('x'))
export const cabecalhoEsquerda = ['f1', 'f2', 'z'];
export const simplex = [
  [1, 4, 1, 0, 8],
  [1, 2, 0, 1, 4],
  [-3, -9, 0, 0, 0]
]

// Solução:
// x2 = 2
// x1 = 0
// z = 18