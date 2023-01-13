#!/bin/bash

WD=/home/aldo/pro/falcon/script
OD=/home/aldo/pro/falcon/script/output

./sanitize
./ligand.sh
./receptor.sh
./pocket.sh
./coarse_box.sh
./coarse_dock.sh
./box.sh
./dock.sh

awk -f $WD/pocketindices.awk $OD/receptor.pdbqt_predictions.csv > $OD/resfile
