import {
  nodeHandler
} from './decorators';

export default {
  stackPusher: stack => nodeHandler(({node}) => stack.push(node)),
  stackPopper: stack => nodeHandler(({node}) => stack.pop(node))
};
