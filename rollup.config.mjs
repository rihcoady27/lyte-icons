import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

const config = [
  {
    input: "index.js",
    output: {
      dir: "react",
      format: "esm",
    },
    plugins: [commonjs(), typescript(), resolve()],
  },
];

export default config;
