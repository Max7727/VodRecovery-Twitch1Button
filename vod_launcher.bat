@echo off

:: 1. Check if channel argument was passed
if "%~1"=="" (
    echo [ERROR] No channel parameter received.
    pause
    exit /b 1
)

:: 2. Extract and sanitize channel name
set "RAW_ARG=%~1"
set "CHANNEL=%RAW_ARG:vodrec://=%"
set "CHANNEL=%CHANNEL:/=%"

if "%CHANNEL%"=="" (
    echo [ERROR] Failed to parse channel name.
    pause
    exit /b 1
)

:: 3. Jump to VodRecovery folder
cd /d "%~dp0"

echo ========================================================
echo   Launching VodRecovery for: %CHANNEL%
echo   Automating Menu: Option 4 -^> 1 -^> URL -^> from start
echo ========================================================

:: 4. Feed the menu options automatically:
::    4 = Record Live Stream
::    1 = Record Stream
::    https://www.twitch.tv/%CHANNEL% = Target Stream
::    y = Download from start
::    1 = Select Quality 1 (1080p60 / Source if M3U8 search triggers)
(
echo 4
echo 1
echo https://www.twitch.tv/%CHANNEL%
echo y
echo 1
) | python vod_recovery.py

pause