@echo off

echo ========================================================
echo   Setting up VodRecovery + Protocol Handler
echo ========================================================
echo.

:: 1. Install all Python dependencies automatically
echo [1/2] Installing Python libraries...
python install_dependencies.py

:: 2. Dynamically create registry entry using current computer folder
echo.
echo [2/2] Registering vodrec:// protocol for this PC...
set "FOLDER=%~dp0"
set "FOLDER=%FOLDER:\=\\%"

(
echo Windows Registry Editor Version 5.00
echo.
echo [HKEY_CLASSES_ROOT\vodrec]
echo @="URL:VodRecovery Protocol"
echo "URL Protocol"=""
echo.
echo [HKEY_CLASSES_ROOT\vodrec\shell]
echo.
echo [HKEY_CLASSES_ROOT\vodrec\shell\open]
echo.
echo [HKEY_CLASSES_ROOT\vodrec\shell\open\command]
echo @="cmd.exe /k \"\"%FOLDER%vod_launcher.bat\" \"%%1\"\""
) > "%~dp0register_temp.reg"

:: Apply the registry entry
regedit.exe "%~dp0register_temp.reg"
del "%~dp0register_temp.reg"

echo.
echo ========================================================
echo   Setup Complete!
echo   Load the "extension" folder into your browser now.
echo ========================================================
pause