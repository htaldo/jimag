#!/bin/bash

WD=/home/aldo/pro/falcon/script
OD=/home/aldo/pro/falcon/script/output
VINADIR=/home/aldo/.local/src/autodock_vina_1_1_2_linux_x86/bin

echo -e "\e[1m\e[36m>>\e[39m docking (coarse)...\033[0m"
cd $VINADIR
./vina --receptor $OD/receptor.pdbqt --ligand $OD/ligand.pdbqt\
	   --config $OD/coarse_box.txt --exhaustiveness=4 --out $OD/coarse.pdbqt \
	   | tee $OD/coarse_scores.txt
cd $WD
