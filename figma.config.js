require('dotenv').config()
const fs = require('fs')
const svgo = require('@figma-export/transform-svg-with-svgo')
const fileId = process.env.FILE_ID

const toPascalCase = (string) => {
  // If the string is already in PascalCase, return it as is
  // Example: "PascalCase" remains "PascalCase"
  if (/^[A-Z][a-z]*((?<=\s)[A-Z][a-z]*)*$/.test(string)) {
    return string
  }

  let result = `${string}`

  // If the string contains '-' or '_', replace them with a space
  // Example: "hello-world" becomes "hello world"
  if (result.includes('-') || result.includes('_')) {
    result = result.replace(new RegExp(/[-_]+/, 'g'), ' ')
  }

  // If the string contains any character that is not a word character (\w) or a whitespace (\s), remove it
  // Example: "hello@world" becomes "helloworld"
  if (/[^\w\s]/.test(result)) {
    result = result.replace(new RegExp(/[^\w\s]/, 'g'), '')
  }

  // If the string contains a space followed by any character and any number of word characters,
  // replace it with the same string but with the first character after the space capitalized
  // Example: "hello world" becomes "hello World"
  if (/\s+(.)(\w*)/.test(result)) {
    result = result.replace(
      new RegExp(/\s+(.)(\w*)/, 'g'),
      ($1, $2, $3) => `${$2.toUpperCase() + $3}`
    )
  }

  // If the string starts with a lowercase word character, replace the first occurrence with its uppercase version
  // Example: "hello" becomes "Hello"
  if (/^[a-z]/.test(result)) {
    result = result.replace(new RegExp(/^[a-z]/), (s) => s.toUpperCase())
  }

  return result
}

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
  require('@figma-export/output-components-as-svg')({
    // output them in the src/icons folder
    // and name them in PascalCase
    output: './src/icons',
    // remove the "04 Icons" folder from the output path
    getDirname: ({ dirname }) => dirname.replace('04 Icons', ''),
    getBasename: ({ basename }) => `${toPascalCase(basename)}.svg`,
  }),
  require('@figma-export/output-components-as-svgr')({
    getFileExtension: () => '.tsx',
    getComponentName: ({ componentName }) => toPascalCase(componentName),
    getSvgrConfig: () => ({ typescript: true }),

    // same as above but output them in the src/react folder
    // since we're creating the React components here
    output: './src/react',
    // remove the "04 Icons" folder from the output path
    getDirname: ({ dirname }) => dirname.replace('04 Icons', ''),

    getExportTemplate: ({ componentName }) => {
      console.log(`Exporting ${componentName}`)
      // check if existing, otherwise skip
      // this is a workaround for handling duplicates
      if (!fs.existsSync(`./src/react/${toPascalCase(componentName)}.tsx`)) return

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
