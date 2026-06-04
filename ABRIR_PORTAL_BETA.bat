@echo off
setlocal
cd /d "%~dp0"

set PORT=8040
set URL=http://127.0.0.1:%PORT%/portal/portal_publico_profesional_v0_6/index.html

echo.
echo Portal beta de cursos
echo ---------------------
echo Carpeta: %CD%
echo URL:     %URL%
echo.
echo Se abrira una ventana separada con el servidor local.
echo Manten esa ventana abierta mientras uses el portal.
echo Para cerrar el servidor, entra a esa ventana y presiona Ctrl+C.
echo.

start "Servidor Portal Beta" cmd /k "cd /d ""%~dp0"" && python -m http.server %PORT% --bind 127.0.0.1"
timeout /t 2 /nobreak >nul
start "" "%URL%"

echo Si Edge no abre automaticamente, copia esta URL:
echo %URL%
echo.
pause
