@echo off
setlocal
title Prototipo dorcronica.org
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 goto semnode

if exist node_modules goto build
echo Instalando dependencias - so na primeira vez, leva 1 a 2 minutos...
call npm install
if errorlevel 1 goto erro

:build
echo Gerando o site...
call npm run build
if errorlevel 1 goto erro

echo.
echo Abrindo o site no navegador (o endereco aparece abaixo).
echo Deixe esta janela aberta enquanto estiver vendo o site. Para encerrar, feche-a.
echo.
call npx astro preview --port 4321 --open
goto fim

:semnode
echo Node.js nao encontrado neste computador.
echo Para ver o site sem instalar nada, abra a pasta "prototipo-offline" e de dois cliques em index.html.
goto fim

:erro
echo.
echo Algo deu errado (mensagem acima). Para ver o site mesmo assim, abra "prototipo-offline\index.html".

:fim
echo.
pause
