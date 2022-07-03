const fs = require("fs");

const args = process.argv.filter((arg) => arg.includes("--")).map((arg) => arg.replace("--", ""));

if (args.length !== 1) {
    throw new Error("Only parameter ´--<file_name.json>´ is supported, and it must exist!");
}

const readJson = (dir) => JSON.parse(fs.readFileSync(dir).toString());
const replacementsJson = readJson(`${__dirname}/${args.find((a) => a)}`);

const { client, server, dexGuruProxy } = readJson(`${__dirname}/template-config.json`);
const writeFileFunctions = [client].map(({ templateFile, outputFile }) => {
    const template = fs.readFileSync(`${__dirname}/${templateFile}`).toString();

    const replace = (template, json) => {
        const replaceImpl = (text) => {
            if (!text.includes("{$")) {
                return text;
            }

            const start = text.indexOf("{$");
            const rest = text.substring(start);
            const end = text.length - rest.length + rest.indexOf("}");
            const key = text.substring(start, end).replace("{", "").replace("}", "").replace("$", "");

            const value = json[key];
            return (
                text.substring(0, start) +
                (typeof value === "string" ? `"${value.toString()}"` : value) +
                replaceImpl(text.substring(end + 1, text.length))
            );
        };

        return replaceImpl(template);
    };

    return () => fs.writeFileSync(outputFile, replace(template, replacementsJson));
});

writeFileFunctions.forEach((f) => f());
