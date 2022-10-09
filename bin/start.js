#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const { exec } = require("child_process");

const packageJson = require("../package.json");

const babel = `"babel": ${JSON.stringify(packageJson.babel)}`;


const scripts = `"start": "webpack serve --mode=development --open --hot",
"build": "webpack --mode=production"`;

const getDeps = (deps) =>
  Object.entries(deps)
    .map((dep) => `${dep[0]}`)
    .toString()
    .replace(/,/g, " ")
    .replace(/^/g, "")
    // exclude the dependency only used in this file, nor relevant to the boilerplate
    .replace(/fs-extra[^\s]+/g, "");

console.log("Initializing a React in Rush project..");

// create folder and initialize npm
exec(
  `mkdir ${process.argv[2]} && cd ${process.argv[2]} && npm init -f`,
  (initErr, initStdout, initStderr) => {
    if (initErr) {
      console.error(`Everything was fine, but if it's not:
    ${initErr}`);
      return;
    }
    const packageJSON = `${process.argv[2]}/package.json`;
    fs.readFile(packageJSON, (err, file) => {
      if (err) throw err;
      const data = file
        .toString()
        .replace(
          '"test": "echo \\"Error: no test specified\\" && exit 1"',
          scripts
        )
        .replace('"keywords": []', babel);
      fs.writeFile(packageJSON, data, (err2) => err2 || true);
    });

    const filesToCopy = ["webpack.config.js"];

    for (let i = 0; i < filesToCopy.length; i += 1) {
      fs.createReadStream(path.join(__dirname, `../${filesToCopy[i]}`)).pipe(
        fs.createWriteStream(`${process.argv[2]}/${filesToCopy[i]}`)
      );
    }
    https.get(
      "https://raw.githubusercontent.com/canocalir/reactinrush/main/.gitignore",
      (res) => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", (data) => {
          body += data;
        });
        res.on("end", () => {
          fs.writeFile(
            `${process.argv[2]}/.gitignore`,
            body,
            { encoding: "utf-8" },
            (err) => {
              if (err) throw err;
            }
          );
        });
      }
    );

    console.log("npm init -- done\n");
 
    console.log("Adding ingredients -- it might take a few moment..");
    const devDeps = getDeps(packageJson.devDependencies);
    const deps = getDeps(packageJson.dependencies);
    exec(
      `cd ${process.argv[2]} && git init && node -v && npm -v && npm i -D ${devDeps} && npm i -S ${deps}`,
      (npmErr, npmStdout, npmStderr) => {
        if (npmErr) {
          console.error(`Error while installing dependencies
      ${npmErr}`);
          return;
        }
        console.log(npmStdout);
        console.log("Ingredients added");

        console.log("Copying project starter files..");
        fs.copy(path.join(__dirname, "../src"), `${process.argv[2]}/src`) && fs.copy(path.join(__dirname, "../public"), `${process.argv[2]}/public`) && fs.copy(path.join(__dirname, "../index.js"), `${process.argv[2]}/index.js`)
          .then(() =>
            console.log(
              `All done!\n\nYour project is now ready to use\n\nUse the below command to run the app.\n\ncd ${process.argv[2]}\nnpm start`
            )
          )
          .catch((err) => console.error(err));
      }
    );
  }
);