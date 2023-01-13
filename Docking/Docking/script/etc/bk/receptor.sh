WD=~/pro/falcon/script
ID=~/pro/falcon/script/input
OD=~/pro/falcon/script/output
ADFRDIR=~/.local/src/adfr/ADFRsuite-1.0/bin
CHIMERA=~/.local/src/chimera/bin

echo -e "\e[1m\e[36m>>\e[39m cleaning receptor...\033[0m"
cd $CHIMERA; ./chimera --nogui $WD/receptor.py
cd $ADFRDIR
echo -e "\e[1m\e[36m>>\e[39m preparing receptor...\033[0m"
./reduce $OD/receptor.pdb >> $OD/receptorH.pdb
./prepare_receptor -r $OD/receptorH.pdb -o $OD/receptor.pdbqt
