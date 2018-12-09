export const tipo = 'max';
export const objetivo = '520x1 + 450x2 = 0';
export const restricoes = [
  '40x1 + 25x2 <= 400',
  '24x1 + 30x2 <= 360',
]

export const cabecalhoTopo = ['x1', 'x2', 'f1', 'f2', 'b'];
export const variaveis = cabecalhoTopo.filter(item => item.includes('x'))
export const cabecalhoEsquerda = ['f1', 'f2', 'z'];
export const simplex = [
  [40, 25, 1, 0, 400],
  [24, 30, 0, 1, 360],
  [-520, -450, 0, 0, 0]
]

// Solução:
// x1 = 5
// x2 = 8
// z = 6200
