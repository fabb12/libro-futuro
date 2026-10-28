# Indici analitici: upmendex (incluso in TeX Live, UTF-8 nativo).
# Non servono xindy/texindy ne' -shell-escape: imakeidx e' in modalita'
# 'noautomatic' (vedi misc/options.tex) e scrive soltanto i file .idx;
# li ordina latexmk con questo comando, per entrambi gli indici
# (main = indice analitico, cognitive = indice dei bias cognitivi).
$makeindex = 'upmendex -s misc/italian_index.ist %O -o %D %S';
