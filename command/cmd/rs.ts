#!/usr/bin/env node

// @ts-ignore
const program = require('commander');
const path = require('path');
const fs = require('fs');

const packagePath = path.resolve(__dirname, '../../package.json');
let msg = fs.readFileSync(packagePath, { encoding: 'utf-8' });
msg = JSON.parse(msg);

program
  .version(msg.version, '-v, --version')
  .usage('<command> [option]')
  .description('Desc: create and handle project by ird')
  .command('create', 'generate a new project from a template')
  .command('list', 'checklist the templates')
  .parse(process.argv);
