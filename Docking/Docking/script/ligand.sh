#!/bin/bash

ID=/home/aldo/pro/falcon/script/input
OD=/home/aldo/pro/falcon/script/output
ADFRDIR=/home/aldo/.local/src/adfr/ADFRsuite-1.0/bin

echo -e "\e[1m\e[36m>>\e[39m optimizing geometry for ligand...\033[0m"
obabel $ID/ligand.sdf -O $OD/ligand_aux.mol2 --gen3d
obabel $OD/ligand_aux.mol2 -O $OD/ligand.mol2 --conformer --nconf 100
rm -f $OD/ligand_aux.mol2
echo -e "\e[1m\e[36m>>\e[39m preparing ligand...\033[0m"
cd $ADFRDIR
./prepare_ligand -l $OD/ligand.mol2 -o $OD/ligand.pdbqt 
