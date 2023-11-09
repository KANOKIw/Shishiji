@echo off
setlocal


set in="../src/assets/builds/main.js"
set out="../src/assets/builds/main.js"


npx terser %in% --mangle -o %out%

endlocal
