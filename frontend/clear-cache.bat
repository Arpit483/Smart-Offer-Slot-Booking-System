@echo off
cd /d "%~dp0"
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo Deleted node_modules\.vite
)
if exist ".vite" (
    rmdir /s /q ".vite"
    echo Deleted .vite
)
if exist "dist" (
    rmdir /s /q "dist"
    echo Deleted dist
)
echo.
echo Cache cleared successfully!
echo.
echo Now run: npm run dev
pause
