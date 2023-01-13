#!/bin/bash

WD=~/pro/falcon/script
ADFRDIR=~/.local/src/adfr/ADFRsuite-1.0/bin
VINADIR=~/.local/src/autodock_vina_1_1_2_linux_x86/bin
CHIMERA=~/.local/src/chimera/bin

echo -e "\033[1m\e[36m>> \e optimizing geometry for ligand...\033[0m"
obabel ligand.sdf -O liganda.mol2 --gen3d
obabel liganda.mol2 -O ligand.mol2 --conformer --nconf 100
echo -e "\033[1m\e[36m>> \e preparing ligand...\033[0m"
cd $ADFRDIR
./prepare_ligand -l $WD/ligand.mol2 -o $WD/ligand.pdbqt 

echo -e "\033[1m\e[36m>> \e cleaning receptor...\033[0m"
cd $CHIMERA; ./chimera --nogui $WD/receptor.py
cd $ADFRDIR
echo -e "\033[1m\e[36m>> \e preparing receptor...\033[0m"
./reduce $WD/receptor.pdb >> $WD/receptorH.pdb
echo -e "\033[1m\e[36m>> \e getting gridbox...\033[0m"
awk /^ATOM/'{ print $7, $8, $9 }' $WD/receptorH.pdb | python3 $WD/box.py \
    | tee $WD/box.txt
./prepare_receptor -r $WD/receptorH.pdb -o $WD/receptor.pdbqt

echo -e "\033[1m\e[36m>> \e docking...\033[0m"
cd $VINADIR
./vina --receptor $WD/receptor.pdbqt --ligand $WD/ligand.pdbqt\
	   --config $WD/box.txt --exhaustiveness=32 --out $WD/docking.pdbqt

#rm ligand.mol2 ligand.pdbqt receptor.pdb receptorH.pdb box.txt receptor.pdbqt
