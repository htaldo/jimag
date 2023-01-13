import sys
import chimera

from chimera import runCommand

#MODULE
           
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

def chain_only(recep, chain_names):
    chains = recep.sequences(asDict = True)
    for chain in chains:
        if chain not in chain_names:
            for r in recep.sequence(chain).residues:
                if r is not None:
                    recep.deleteResidue(r)
        
#MAIN
model = chimera.openModels.open('input/receptor.pdb')
recep = model[0]

#can we delete "r"
chain_names = open("input/config","r").read().split()
chain_only(recep, chain_names)
prot_only(recep)
runCommand("write format pdb 0 output/receptor.pdb")
