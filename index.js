import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { Context } from "oidascript/runner/context.js";
import { parseStatement } from "oidascript/parser/statement.js";
import { runStatement } from "oidascript/runner/statement.js";

const rl = readline.createInterface({ input: stdin, output: stdout });

async function main() {
    const context = new Context();

    while (true) {
        const input = await rl.question("> ");
        runCode(input, context);
    }

    rl.close();
}

function runCode(input, context) {
    const [parsed] = parseStatement(input);
    if (parsed === null) {
        console.log("Couldn't parse statement");
        return;
    }

    try {
        const result = runStatement(parsed, context);
        if (result === null) {
            return;
        }

        console.log(result.value);
    } catch (e) {
        console.log(e);
        return;
    }
}

main();
