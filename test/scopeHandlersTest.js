import should from 'should';

import traverse from '../src/verbs/traverse';

import testHandlers from './utils/testHandlers';

const test = testHandlers();

describe('creating scopes', () => {
  it('works', test(`let x = 0;`, function({
    result, done
  }) {
    result.length.should.equal(1);
    done();
  }));
});
