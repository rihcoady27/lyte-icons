require("dotenv").config();
const svgo = require("@figma-export/transform-svg-with-svgo");
const fileId = process.env.FILE_ID;

const capitalize = (s) =>
  s
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

/** @type {import('svgo').PluginConfig[]} */
const solidSVGOConfig = [
  {
    sortAttrs: true,
    removeDimensions: true,
    name: "preset-default",
    params: {
      overrides: {
        removeAttrs: { attrs: "fill|stroke" },
        addAttributesToSVGElement: { attribute: { fill: "currentColor" } },
      },
    },
  },
];

const outputters = [
  require("@figma-export/output-components-as-svg")({ output: "./" }),
  require("@figma-export/output-components-as-svgr")({
    getFileExtension: () => ".tsx",
    getComponentName: ({ componentName }) => capitalize(componentName),
    getSvgrConfig: () => ({ typescript: true }),
    output: "./src",
  }),
];
const transformers = [svgo({ multipass: true, plugins: solidSVGOConfig })];

/** @type {import('@figma-export/types').FigmaExportRC} */
module.exports = {
  commands: [
    [
      "components",
      {
        fileId,
        onlyFromPages: ["General"],
        transformers,
        outputters,
      },
    ],
  ],
};
