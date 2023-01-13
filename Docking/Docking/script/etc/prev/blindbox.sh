#!/bin/bash

WD=~/pro/falcon/script
ID=~/pro/falcon/script/input
OD=~/pro/falcon/script/output

echo -e "\e[1m\e[36m>>\e[39m getting gridbox...\033[0m"
awk /^ATOM/'{ print $7, $8, $9 }' $OD/receptorH.pdb | python3 $WD/box.py \
    | tee $OD/box.txt
