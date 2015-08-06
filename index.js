import cli from 'cli';

import programs from './programs';

cli.parse({
  run: ['r', 'Run a program', 'string'],
  list: ['l', 'List available programs']
});

const when = val => !!val;
const tabify = arr => arr.map(str => '\n\t' + str).join('');
const programWithArgs = programName => `${programName}(${programs[programName].args().join(', ')})`;

cli.main((args, options) => {
  switch (true) {
  case when(options.run):
    if (programs.hasOwnProperty(options.run)) {
      programs[options.run].run(...args);
    } else {
      cli.fatal(`Program ${options.run} doesn't exist. Use \`js-vdebug -list\` to see all available programs. Or create one yourself. :)`);
    }
    break;

  case when(options.list):
    cli.info(`List of available programs: ${tabify(Object.keys(programs).map(programWithArgs))}`);
    break;

  default:
    cli.info('Nothing to do! Use `js-vdebug -help` to see available commands.');
  }
});
