#!/bin/bash

babel-node writeAST.js
babel-node index.js && cat syntax.json
