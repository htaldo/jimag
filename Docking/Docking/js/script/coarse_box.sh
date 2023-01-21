#!/bin/bash

OD=/home/aldo/pro/falcon/script/output

echo -e "\e[1m\e[36m>>\e[39m getting gridbox (coarse)...\033[0m"
awk -f coarse_box.awk $OD/receptor.pdbqt | tee $OD/coarse_box.txt

echo num_modes=1 >> $OD/coarse_box.txt #TODO: poner esto en el script de awk
