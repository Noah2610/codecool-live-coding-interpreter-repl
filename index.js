import fs from "node:fs/promises";
import process, { stdin, stdout } from "node:process";
import * as readline from "node:readline/promises";
import { run } from "oidascript";
import { isError } from "oidascript/langError.js";
import { parseStatement } from "oidascript/parser/statement.js";
import { Context } from "oidascript/runner/context.js";
import { runStatement } from "oidascript/runner/statement.js";

const rl = readline.createInterface({ input: stdin, output: stdout });

async function main() {
    const arg = process.argv[2];

    try {
        if (arg && arg.trim().length > 0) {
            await runFile(arg);
        } else {
            await runRepl();
        }
    } catch (e) {
        if (isError(e)) {
            console.error(e.display());
        } else if (e instanceof Error) {
            console.error(e);
        } else {
            console.error(e);
        }
    }

    rl.close();
}

async function runFile(file) {
    const content = await fs.readFile(file, "utf8").catch(() => {
        throw new Error(`Failed to read file: ${file}`);
    });

    const result = run(content);
    if (result.isErr()) {
        throw result.getError();
    }
}

async function runRepl() {
    const context = new Context();

    while (true) {
        const input = await rl.question("> ");
        runCode(input, context);
    }
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
