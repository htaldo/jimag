import os
import chimera
from chimera import runCommand

#MODULE
def print_het(recep):
    freq_table = []
    for r in recep.residues:
        if r.isHet:
            in_table = 0
            for row in freq_table:
                #check if current r.type is in the freq_table
                if row['htype'] == r.type:
                    row['freq'] += 1
                    in_table = 1
                    break
            if in_table == 0:
                #append new entry if not in table
                freq_table.append({'htype': r.type, 'freq': 1})
    print(freq_table)
            
def del_res(recep, residue_list):
    for res_type in residue_list:
        for r in recep.residues:
            if r.type == res_type:
                recep.deleteResidue(r)

def prot_only(recep):
    for r in recep.residues:
        if r.isHet:
            recep.deleteResidue(r)

def chain_names(recep):
    print(recep.sequences(asDict = True).keys())

def chain_only(recep, chain_name):
    chains = recep.sequences(asDict = True)
    for r in recep.residues:
        if r not in chains[chain_name].residues:
            recep.deleteResidue(r)
        
#SCRIPT
#model = chimera.openModels.open("4kg5", type="PDB")
model = chimera.openModels.open('receptor.pdb')
recep = model[0]

#inp = raw_input("Type the residues you want to delete: ")
#del_res(recep, inp.split())

print_het(recep)
#prot_only(recep)
chain_only(recep, 'A')
runCommand("write format pdb 0 receptor.pdb")
