@echo off
setlocal enabledelayedexpansion
:: ============================================================
::  CONFIGURAZIONE - modifica questi percorsi secondo le tue esigenze
:: ============================================================
set "CARTELLA_SORGENTE=C:\Users\fabio\OneDrive\Desktop\Libro Bias\Libro_Bias_Cognitivi_1301"
set "SORGENTE=%CARTELLA_SORGENTE%\main.pdf"
set "DESTINAZIONE=D:\videoteca\Correzione Libro\documents"
set "DEST_SORGENTI=%DESTINAZIONE%\sorgenti"
:: ============================================================
::  Ottieni la data odierna nel formato GGMMAAAA
:: ============================================================
for /f "tokens=1-3 delims=/" %%a in ("%date%") do (
    set "GIORNO=%%a"
    set "MESE=%%b"
    set "ANNO=%%c"
)
:: Rimuove eventuali spazi
set "GIORNO=%GIORNO: =%"
set "MESE=%MESE: =%"
set "ANNO=%ANNO: =%"
:: Aggiunge lo zero iniziale se necessario (es. 1 -> 01)
if %GIORNO% LSS 10 set "GIORNO=0%GIORNO%"
if %MESE%  LSS 10 set "MESE=0%MESE%"
set "DATA_OGGI=%GIORNO%%MESE%%ANNO%"
set "NUOVO_NOME=versione_%DATA_OGGI%.pdf"
:: ============================================================
::  Controlla che il file sorgente (main.pdf) esista
:: ============================================================
if not exist "%SORGENTE%" (
    echo [ERRORE] File sorgente non trovato: %SORGENTE%
    pause
    exit /b 1
)
:: ============================================================
::  Crea le cartelle di destinazione se non esistono
:: ============================================================
if not exist "%DESTINAZIONE%" (
    mkdir "%DESTINAZIONE%"
    echo [INFO] Cartella creata: %DESTINAZIONE%
)
if not exist "%DEST_SORGENTI%" (
    mkdir "%DEST_SORGENTI%"
    echo [INFO] Cartella creata: %DEST_SORGENTI%
)
:: ============================================================
::  Elimina la versione precedente (versione_*.pdf)
:: ============================================================
set "TROVATO=0"
for %%f in ("%DESTINAZIONE%\versione_*.pdf") do (
    echo [INFO] Elimino versione precedente: %%~nxf
    del "%%f"
    set "TROVATO=1"
)
if "!TROVATO!"=="0" (
    echo [INFO] Nessuna versione precedente trovata.
)
:: ============================================================
::  Copia e rinomina il file main.pdf -> versione_DATA.pdf
:: ============================================================
copy "%SORGENTE%" "%DESTINAZIONE%\%NUOVO_NOME%" >nul
if errorlevel 1 (
    echo [ERRORE] Copia di main.pdf fallita!
    pause
    exit /b 1
)
echo [OK] File copiato e rinominato come: %NUOVO_NOME%
echo [OK] Percorso: %DESTINAZIONE%\%NUOVO_NOME%
:: ============================================================
::  Copia TUTTI gli altri file sorgenti nella cartella "sorgenti"
::  (cartelle + file presenti nella cartella del progetto)
:: ============================================================
echo.
echo [INFO] Copio tutti i file sorgenti in: %DEST_SORGENTI%

:: --- Cartelle del progetto ---
for %%d in (appendix content frontmatter images misc parts) do (
    if exist "%CARTELLA_SORGENTE%\%%d" (
        echo [INFO] Copio cartella: %%d
        xcopy "%CARTELLA_SORGENTE%\%%d" "%DEST_SORGENTI%\%%d\" /E /I /Y >nul
    )
)

:: --- File singoli del progetto ---
for %%f in (appunti.txt cognitive.idx copiaerinomina.bat idee.txt latexmkrc main.aux main.idx main.log main.out main.pdf main.synctex.gz main.tex main.toc METODOLOGIE.txt prompt.txt) do (
    if exist "%CARTELLA_SORGENTE%\%%f" (
        echo [INFO] Copio file: %%f
        copy "%CARTELLA_SORGENTE%\%%f" "%DEST_SORGENTI%\%%f" >nul
    )
)

echo.
echo [OK] Tutti i sorgenti copiati in: %DEST_SORGENTI%
endlocal
pause