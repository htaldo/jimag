#°/bin/bash
WD=~/proyectoAF/app2/script
ID=~/proyectoAF/app2/script/input
OD=~/proyectoAF/app2/script/output
ADFRDIR=~/.local/src/adfr/ADFRsuite-1.0/bin
VINADIR=~/.local/src/autodock_vina_1_1_2_linux_x86/bin
CHIMERA=~/.local/src/chimera/bin

echo -e "\e[1m\e[36m>>\e[39m optimizing geometry for ligand...\033[0m"
obabel $ID/ligand.sdf -O $OD/liganda.mol2 --gen3d
obabel $OD/liganda.mol2 -O $OD/ligand.mol2 --conformer --nconf 100
rm -f $OD/liganda.mol2
echo -e "\e[1m\e[36m>>\e[39m preparing ligand...\033[0m"
cd $ADFRDIR
./prepare_ligand -l $OD/ligand.mol2 -o $OD/ligand.pdbqt 
