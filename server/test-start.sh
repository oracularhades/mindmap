#!/bin/bash

# Start the guard-server program
/mindmap-server/guard/guard-server

# After guard-server exits, keep the container running
tail -f /dev/null
