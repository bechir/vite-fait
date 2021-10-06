import chalk from "chalk";

function error(...text: unknown[]) {
    console.log(chalk.white.bgRed(text, '\n'));
}

function info(...text: unknown[]) {
    console.log(chalk.underline(text));
}

function success(...text: unknown[]) {
    console.log(chalk.green(text));
}

export default {
    error,
    info,
    success
};
