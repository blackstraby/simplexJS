//ÓTIMO NÃO FINITO
export const tipo = 'max';
export const objetivo = '6x1 + 10x2 = 0';
export const restricoes = [
  '-x1 + x2 <= 1',
  '-3x1 + 3x2 <= 6',
]
export const cabecalhoTopo = ['x1', 'x2', 'f1', 'f2', 'b'];
export const variaveis = cabecalhoTopo.filter(item => item.includes('x'))
export const cabecalhoEsquerda = ['f1', 'f2', 'z'];
export const simplex = [
  [-1, 1, 1, 0, 1],
  [-3, 3, 0, 1, 6],
  [-6, -10, 0, 0, 0]
]

// Solução:
// x2 = 1
// f2 = 3
// z = 10