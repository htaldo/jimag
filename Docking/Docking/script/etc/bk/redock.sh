#!/bin/bash

WD=~/pro/falcon/script
ID=~/pro/falcon/script/input
OD=~/pro/falcon/script/output
RD=$OD/redock
ADFRDIR=~/.local/src/adfr/ADFRsuite-1.0/bin
VINADIR=~/.local/src/autodock_vina_1_1_2_linux_x86/bin
CHIMERA=~/.local/src/chimera/bin
i=1

mkdir $RD; cd $RD
awk -f rdbox.awk $OD/docking.pdbqt

for file in *; do
	echo -e "\e[1m\e[36m>>\e[39m docking model $file...\033[0m"
	#[ -f "$file" ] || echo "error: $file is not a file!" && exit
	cd $VINADIR
	./vina --receptor $OD/receptor.pdbqt --ligand $OD/ligand.pdbqt\
		   --config $RD/$file --exhaustiveness=32 --out $OD/redock/docking$i.pdbqt \
		   | tee $OD/scores.txt
	i++
done

#rm ligand.mol2 ligand.pdbqt receptor.pdb receptorH.pdb box.txt receptor.pdbqt
