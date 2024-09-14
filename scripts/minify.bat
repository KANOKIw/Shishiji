@echo off
setlocal


set in="../src/assets/builds/main.js"
set out="../src/assets/builds/main.min.js"


npx terser %in% --mangle -o %out%


set in="../src/assets/builds/editor/editor.js"
set out="../src/assets/builds/editor/editor.min.js"


npx terser %in% --mangle -o %out%

endlocal
