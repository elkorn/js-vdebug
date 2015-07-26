export default (...args) => console.log.apply(console, args.map(arg => JSON.stringify(arg, null, ' ')));
