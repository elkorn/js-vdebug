import should from 'should';

import traverse from '../src/verbs/traverse';
import assignmentHandlers from '../src/node-handlers/assignmentHandlers';

import testHandlers from './utils/testHandlers';
import Loc from './utils/loc';

const test = testHandlers(assignmentHandlers);

describe('identifying assignments', () => {
  it('works in assigning variables', test(`let y = 13; x = y;`, function({
    result, done
  }) {
    result.length.should.equal(1);
    result[0].assignments.length.should.equal(1);
    result[0].assignments[0].should.eql({
      identifier: 'y',
      declaringScopeId: 0,
      referringScopeId: 0,
      to: 'x',
      loc: new Loc(16, 1, 17, 1)
    });
    done();
  }));

    it('works in variable declarations', test(`let y = 1; let x = y;`, function({
      result, done
    }) {
      result.length.should.equal(1);
      result[0].assignments.length.should.equal(1);
      result[0].assignments[0].should.eql({
        identifier: 'y',
        declaringScopeId: 0,
        referringScopeId: 0,
        to: 'x',
        loc: new Loc(19, 1, 20, 1)
      });
      done();
    }));
});
