const { exec } = require("child_process");
const path = require("path");
const ini = require('ini');
const os = require("os");
const fs = require("fs");

/**
 * Returns the path to the current kde globals.
 * @returns {String}
 */
const getGlobalsPath = () => {
  return new Promise((resolve, reject) => {
    let o = new String();
    exec("kf5-config --path config", (error, stdout, stderr) => {
      if (error) reject(error);
      if (stderr) reject(new Error("stderr: "+stderr));

      let paths = stdout.trim().split(":").filter(p => {
        let subdir = path.basename(p);
        if (!subdir.endsWith("kdedefaults")) {
          let globalsDir = path.join(p, "kdeglobals");
          return (fs.existsSync(globalsDir));
        } else return false;
      });

      let homeGlobals = paths.find(p => (
        path.dirname(p).split(path.sep)[1] === "home"
        && path.dirname(p).split(path.sep)[2] === os.userInfo().username
      ));

      if(paths.length == 0) reject(new Error("No valid kdedefaults found"));
      else if(homeGlobals) resolve(homeGlobals);
      else resolve(paths[0]);
    });
  });
}

/**
 * Returns the current kde globals as an object.
 * @returns {Object}
 */
async function getGlobals() {
  return new Promise((resolve, reject) => {
    getGlobalsPath().then(async p => {
      let globalPath = path.join(p, "kdeglobals");
      let rawData = await fs.promises.readFile(globalPath, "utf8");
      try {
        let data = ini.parse(rawData);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  });
}

module.exports = {
  getGlobals, getGlobalsPath
};