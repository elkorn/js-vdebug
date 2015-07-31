const privates = new WeakMap();

export default class Stack {
  constructor() {
    privates.set(this, []);
  }

  push(value) {
    privates.get(this).unshift(value);
  }

  pop() {
    return privates.get(this).shift();
  }

  peek() {
    return privates.get(this)[0];
  }
};
