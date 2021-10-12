/* eslint-disable no-console */

const { exec } = require('child_process');
let execute = exec;

//= ========================================================================================
module.exports = function exec(command) {
    return new Promise((resolve) => {
        execute(command, (error, stdout, stderr) => {
            if (error) {
                console.error(new Error(`\nError on executing ${command}:\n${error}`));
                resolve(null);
            }
            if (stderr) {
                console.error(new Error(`\nError on executing ${command}:\n${error}`));
                resolve(null);
            }
            if (stdout) {
                resolve(String(stdout).trim());
            }
        });
    });
};
