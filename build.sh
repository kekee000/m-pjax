#/bin/bash

edp build -f
if [ -d output ]; then
    cd output
    mv src/main.js .
    ls | grep -v main.js | xargs -I {} rm -rf {}
else
    echo 'build failed'
fi
