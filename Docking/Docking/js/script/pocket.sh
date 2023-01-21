#!/bin/bash

OD=/home/aldo/pro/falcon/script/output
PRANK=/home/aldo/.local/src/p2rank_2.4

echo -e "\e[1m\e[36m>>\e[39m looking for pockets...\033[0m"
$PRANK/prank predict -c configs/blind.groovy -f $OD/receptor.pdbqt -o $OD
