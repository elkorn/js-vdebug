import cli from 'cli';

export default callback => (err, ...args) => {
  if(err) {
    cli.fatal(err.message);
    return;
  }

  callback(...args);
};
