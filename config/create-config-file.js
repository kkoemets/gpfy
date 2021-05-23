const fs = require("fs");
const { outputFile } = require("./conf");
const { templateFile } = require("./conf");
const { replacementsFile } = require("./conf");

const args = process.argv
  .filter((arg) => arg.includes("--"))
  .map((arg) => arg.replace("--", ""));

const replacementsJson = JSON.parse(
  fs
    .readFileSync(
      `${__dirname}/${args
        .map((arg) => replacementsFile[arg])
        .find((file) => file)}`
    )
    .toString()
);

const templateScript = fs
  .readFileSync(`${__dirname}/${templateFile}`)
  .toString();

const replace = (template, json) => {
  const replaceImpl = (text) => {
    if (!text.includes("{$")) {
      return text;
    }

    const start = text.indexOf("{$");
    const rest = text.substring(start);
    const end = text.length - rest.length + rest.indexOf("}");
    const key = text
      .substring(start, end)
      .replace("{", "")
      .replace("}", "")
      .replace("$", "");

    const value = json[key];
    return (
      text.substring(0, start) +
      (typeof value === "string" ? `"${value.toString()}"` : value) +
      replaceImpl(text.substring(end + 1, text.length))
    );
  };

  return replaceImpl(template);
};

fs.writeFileSync(outputFile, replace(templateScript, replacementsJson));
