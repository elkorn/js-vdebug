import testHandlers from './utils/testHandlers';
import should from 'should';
import sinon from 'sinon';
import scopeHandlers from '../src/node-handlers/scopeHandlers';
import variableHandlers from '../src/node-handlers/variableHandlers';
import getReferenceHandlers from '../src/node-handlers/getReferenceHandlers';
import traverse from '../src/verbs/traverse';

const SRC = `   `;
const makeHandlers = () => [{
  enter: {
    always: sinon.spy()
  },
  leave: {
    always: sinon.spy()
  }
}, {
  enter: {
    always: sinon.spy()
  },
  leave: {
    always: sinon.spy()
  }
}];

describe('node handlers are called in correct order -', () => {
  it('enter handlers', testHandlers(...makeHandlers())(SRC, function({
    done, handlers
  }) {
    const [firstHandlers, secondHandlers] = handlers;

    sinon.assert.callOrder(
      firstHandlers.enter.always,
      secondHandlers.enter.always);

    done();
  }));

  it('leave handlers', testHandlers(...makeHandlers())(SRC, function({
    done, handlers
  }) {
    const [firstHandlers, secondHandlers] = handlers;
    sinon.assert.callOrder(
      secondHandlers.leave.always,
      firstHandlers.leave.always);
    done();
  }));
});
