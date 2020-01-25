#!/usr/bin/env node

// @ts-ignore
const program = require('commander');

program
  .description('Desc: create the project and download the template from remote repo')
  .action(function(cmd: any) {
    console.log('here');
  })
  .parse(process.argv);
