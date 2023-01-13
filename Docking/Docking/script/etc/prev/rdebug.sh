#!/bin/bash

WD=~/pro/falcon/script
ID=~/pro/falcon/script/input
OD=~/pro/falcon/script/output
RD=$OD/redock
ADFRDIR=~/.local/src/adfr/ADFRsuite-1.0/bin
VINADIR=~/.local/src/autodock_vina_1_1_2_linux_x86/bin
CHIMERA=~/.local/src/chimera/bin
i=1

cd $RD
awk -f $WD/rdbox.awk $OD/docking.pdbqt

#rm ligand.mol2 ligand.pdbqt receptor.pdb receptorH.pdb box.txt receptor.pdbqt
