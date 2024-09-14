@echo off
setlocal enabledelayedexpansion

set "py_dir=.\.runtime"

for %%F in ("%py_dir%*") do (
    set "filename=%%~nF"
    set "ext=%%~xF"
    if "!ext!"==".py" (
        set "uuid=!filename!"
        call :isUUID !uuid!
        if !result!==true (
            del "%%F"
        )
    )
)

set "cache_dir=%py_dir%cache"
if exist "%cache_dir%" (
    rmdir /s /q "%cache_dir%"
)
mkdir "%cache_dir%"

:end
exit /b

:isUUID
set "result=false"
set "input=%~1"
set "pattern=[0-9a-fA-F]\{8\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{12\}"
echo %input% | findstr /r /c:"%pattern%" >nul && set "result=true"
exit /b
