#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install it to run the script."
    exit 1
fi

# Run the JavaScript code with arguments
node index.js "$@"