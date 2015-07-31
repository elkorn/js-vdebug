import traverse from '../../src/verbs/traverse';

export
default
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
