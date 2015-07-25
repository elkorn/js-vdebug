export const nodeHandler = fn => ({
    scopeChain, node
}) => {
    fn({
        scopeChain, node
    });
    return {
        scopeChain, node
    };
};

export const inCurrentScope = fn => ({
    scopeChain, node
}) => {
    fn({
        scope: scopeChain.current(),
        node
    });
    return {
        scopeChain, node
    };
};
