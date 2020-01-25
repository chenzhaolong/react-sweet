#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const program = require('commander');
const listCmd = require('./index');

const packagePath = path.resolve(__dirname, '../package.json');
let msg = fs.readFileSync(packagePath, { encoding: 'utf-8' });
msg = JSON.parse(msg);

const commandConfig = program.command(listCmd.name);
commandConfig.description(listCmd.description);
commandConfig.option(listCmd.args[0], listCmd.args[1]);
commandConfig.action(listCmd.run);
program.parse(process.argv);
