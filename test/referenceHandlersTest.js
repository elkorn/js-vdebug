import fs from 'fs';
import should from 'should';

import {
  getReferenceHandlers
}
from '../src/node-handlers';

import traverse from '../src/verbs/traverse';

import testHandlers from './utils/testHandlers';

const test = testHandlers(getReferenceHandlers);

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
  it('does not recognize non-computed object property identifiers as references',
     test(`let x = { a: 1, b: 2, c: 3 };`,
          function({
            result, done
          }) {
            result[0].references.should.eql([]);
            done();
          }));

  it('recognizes computed object property identifiers as references',
     test(`let x = { [a]: 1};`,
          function({
            result, done
          }) {
            result[0].references.should.eql([{
              identifier: 'a',
              declaringScopeId: null,
              referringScopeId: 0,
              loc: {
                start: {
                  column: 11,
                  line: 1
                },
                end: {
                  column: 12,
                  line: 1
                }
              }
            }]);
            done();
          }));
});
