export const tipo = 'max';
export const objetivo = '100x1 + 80x2 + 120x3 + 30x4 = 0';
export const restricoes = [
  'x1 + x2 + x3 + 4x4 <= 300',
  'x2 + x3 + 2x4 <= 600',
  '3x1 + 2x2 + 4x3 <= 500',
]

export const cabecalhoTopo = ['x1', 'x2', 'x3', 'x4', 'f1', 'f2', 'f3', 'b'];
export const variaveis = cabecalhoTopo.filter(item => item.includes('x'))
export const cabecalhoEsquerda = ['f1', 'f2', 'f3', 'z'];
export const simplex = [
  [1, 1, 1, 4, 1, 0, 0, 300],
  [0, 1, 1, 2, 0, 1, 0, 600],
  [3, 2, 4, 0, 0, 0, 1, 500],
  [-100, -80, -120, -30, 0, 0, 0, 0]
]

// Solução:
// x4 = 12,50
// f2 = 325
// x2 = 250
// z = 20375