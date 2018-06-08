#!/bin/bash
FRAMEWORK=$1
cd examples/todomvc-$FRAMEWORK
for i in {1..10}; do npm test; done
cd ..