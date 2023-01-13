#!/bin/bash

WD=~/proyectoAF/app2/script
ID=~/proyectoAF/app2/script/input
OD=~/proyectoAF/app2/script/output

echo -e "\e[1m\e[36m>>\e[39m getting gridbox...\033[0m"
awk -f box.awk $OD/receptorH.pdb | tee $OD/box.txt
