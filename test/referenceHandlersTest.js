import fs from 'fs';
import should from 'should';
import getReferenceHandlers from '../getReferenceHandlers';
import traverse from '../traverse';

const data = path => fs.readFileSync(`${__dirname}/data/${path}.js`);

const test = (input, callback) => done => {
  traverse({
    input,
    customHandlerGroups: [
      getReferenceHandlers
    ],
    done: ({
      ast, result
    }) => callback({
      ast, result, done
    })
  });
};

describe('getting references', () => {
  it('recognizes references to the enclosing function in IIFE',
     test(`(function test() {
             return test();
           })();`,
          function({
            result, done
          }) {
            result[1].references.should.eql([]);
            done();
            // TODO decide whether displaying the variables that are declared and referenced in the same scope is something that we want.
            // result[1].references.should.eql([{
            //   identifier: 'test',
            //   referringScopeId: 1,
            //   declaringScopeId: 1
            // }]);
          }));
});
