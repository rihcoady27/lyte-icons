const fs = require("fs");
const $ = require("cheerio");

const directories = ["General"];
let errors = 0;

directories.forEach((dir) =>
  fs.readdirSync(dir).forEach((file) => {
    const width = $.load(fs.readFileSync(`${dir}/${file}`))("svg").attr(
      "width"
    );
    const height = $.load(fs.readFileSync(`${dir}/${file}`))("svg").attr(
      "height"
    );
    if (width !== "24" || height !== "24") {
      console.error(
        `Error: \`${dir}/${file}\` has a width of \x1b[31m\`${width}\`\x1b[0m,}\`${height}\``
      );
      errors++;
    }
  })
);

if (errors > 0) {
  process.exit(1);
} else {
  console.log("Tests passed!");
}
