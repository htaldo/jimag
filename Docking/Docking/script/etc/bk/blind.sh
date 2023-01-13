#!/bin/bash

WD=~/pro/falcon/script
ID=~/pro/falcon/script/input
OD=~/pro/falcon/script/output
ADFRDIR=~/.local/src/adfr/ADFRsuite-1.0/bin
VINADIR=~/.local/src/autodock_vina_1_1_2_linux_x86/bin
CHIMERA=~/.local/src/chimera/bin

./ligand.sh
./receptor.sh
./blindbox.sh

echo -e "\e[1m\e[36m>>\e[39m docking...\033[0m"
cd $VINADIR
./vina --receptor $OD/receptor.pdbqt --ligand $OD/ligand.pdbqt\
	   --config $OD/box.txt --exhaustiveness=32 --out $OD/docking.pdbqt \
	   | tee $OD/scores.txt

cd WD; ./redock.sh

#rm ligand.mol2 ligand.pdbqt receptor.pdb receptorH.pdb box.txt receptor.pdbqt
