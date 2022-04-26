module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "mocha": true,
    },
    "extends": [
        "eslint:recommended",
        "prettier",
    ],
    "parserOptions": {
        "ecmaVersion": 13,
        "sourceType": "module",
    },
    "plugins": [
        "prettier",
    ],
    "rules": {
        "prettier/prettier": "error",
    }
};
