import fs from 'fs';
import traverse from '../traverse';

export
function data(path) {
  return fs.readFileSync(`${__dirname}/data/${path}.js`);
}

export
function testHandlers(...handlers) {
  return (input, callback) => done => {
    traverse({
      input,
      customHandlerGroups: handlers,
      done: ({
        ast, result
      }) => callback({
        ast, result, done, handlers
      })
    });
  };
};
