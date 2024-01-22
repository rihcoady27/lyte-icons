import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

const config = [
  {
    input: 'index.js',
    output: {
      dir: 'dist',
      format: 'esm',
    },
    plugins: [commonjs(), resolve(), typescript()],
  },
]

export default config
