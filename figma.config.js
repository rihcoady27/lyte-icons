require('dotenv').config()
const svgo = require('@figma-export/transform-svg-with-svgo')
const fileId = process.env.FILE_ID

const toPascalCase = (string) =>
  `${string}`
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(new RegExp(/\s+(.)(\w*)/, 'g'), ($1, $2, $3) => `${$2.toUpperCase() + $3}`)
    .replace(new RegExp(/\w/), (s) => s.toUpperCase())

/** @type {import('svgo').PluginConfig[]} */
const solidSVGOConfig = [
  {
    sortAttrs: true,
    removeDimensions: true,
    name: 'preset-default',
    params: {
      overrides: {
        removeAttrs: { attrs: 'fill|stroke' },
        addAttributesToSVGElement: {
          attribute: { fill: 'currentColor' },
        },
      },
    },
  },
]

const outputters = [
  require('@figma-export/output-components-as-svg')({ output: './' }),
  require('@figma-export/output-components-as-svgr')({
    getFileExtension: () => '.tsx',
    getComponentName: ({ componentName }) => toPascalCase(componentName),
    getSvgrConfig: () => ({ typescript: true }),
    output: './src',
    getExportTemplate: ({ componentName }) => {
      return `export { default as ${toPascalCase(componentName)} } from './${toPascalCase(
        componentName
      )}';`
    },
  }),
]
const transformers = [svgo({ multipass: true, plugins: solidSVGOConfig })]

/** @type {import('@figma-export/types').FigmaExportRC} */
module.exports = {
  commands: [
    [
      'components',
      {
        fileId,
        onlyFromPages: ['04 Icons'],
        transformers,
        outputters,
      },
    ],
  ],
}
