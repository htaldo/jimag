from rq import get_current_job
from django_rq import job
from .models import Docking
import subprocess
import logging
import tempfile
import shutil
import os

logging.basicConfig(filename='script_output.log', level=logging.INFO)


@job
def run_docking_script(user_id, job_id, docking_id, settings):
    job = get_current_job()  # is this line necessary?

    
    logger = logging.getLogger(__name__)
    logger.info("INFO: run_docking_script task started")

    try:
        script_path = f"{os.environ.get('SCRIPTDIR')}/multi.sh"
        input_dir = f"{os.environ.get('PROJECTDROOT')}/media/user_{user_id}/job_{job_id}/docking_{docking_id}/input"
        output_dir = f"{os.environ.get('PROJECTDROOT')}/media/user_{user_id}/job_{job_id}/docking_{docking_id}/output"

        # Pass preprocessing files to the script
        if settings['preproc_done']:
            os.makedirs(output_dir, exist_ok=True)
            shutil.copy(settings['pockets_filename'], f"{output_dir}/receptor.pdb_predictions.csv")
            shutil.copy(settings['clean_protein_filename'], f"{output_dir}/receptor.pdb")

        script_command = [script_path, "--input", input_dir, "--output", output_dir,
                          "--vinalvl", settings['exhaustiveness'], "--num_modes", settings['num_modes']]
        if settings['chains']:
            script_command.extend(["--chains", settings['chains']])
        if settings['pockets']:
            script_command.extend([settings['pockets']['option'], settings['pockets']['value']])
        if settings['preproc_done'] is True:
            script_command.extend(["--preproc_done"])

        # running and logging
        process = subprocess.Popen(
            script_command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True
        )
        output_lines = []
        for line in process.stdout:
            line = line.strip()
            output_lines.append(line)
            job.meta['progress'] = '\n'.join(output_lines)
            job.save_meta()

            logger.info(line)

        # post-processing - add pockets to the docking instance
        pockets_file = open(f"{output_dir}/pockets", 'r')
        pocket_str = pockets_file.readline()  # pockets are saved in a single line in this file
        pockets_file.close()
        docking_inst = Docking.objects.get(pk=docking_id)
        docking_inst.pockets = pocket_str
        docking_inst.save()

        return_code = process.wait()

        if return_code == 0:
            logger.info("Script completed successfully")
            job.meta['progress'] = "Script completed successfully"
            job.set_status('completed')
        else:
            logger.error(f"Script failed with code {return_code}")
            job.meta['progress'] = f"Script failed with code {return_code}"
            job.set_status('failed')

    except Exception as e:
        logger.error(f"Script failed: {str(e)}")
        job.meta['progress'] = f"Script failed: {str(e)}"
        job.set_status('failed')

    job.save_meta()

    return "Script completed successfully"


@job
def analyze_protein(protein_file):
    return "A,B"


@job
def analyze_ligand(ligand_file):
    return "A,B"


@job
def process_pockets(protein_file, chains):
    logger = logging.getLogger(__name__)
    logger.info("INFO: process_pockets task started")

    try:
        # prepare protein file as tempfile for shell handling
        with tempfile.NamedTemporaryFile(suffix=".pdb", delete=False) as inputpdb:
            inputpdb.write(protein_file.read())
            inputpdb.flush()
        # clean chains
        script_path = f'{os.environ.get('SCRIPTDIR')}/receptor.py'
        chimera_cmd = f'{os.environ.get('HOMEDIR')}/.local/src/chimera/bin/chimera'
        chainspdb = tempfile.NamedTemporaryFile(suffix=".pdb", delete=False)
        clean_chains_cmd = f'export IF={inputpdb.name} OF={chainspdb.name} CHAINS={chains}; {chimera_cmd} --nogui {script_path}'
        subprocess.run(clean_chains_cmd, shell=True)
        # chainspdb.flush()
        # get pockets with p2rank
        prankcmd = f'{os.environ.get('HOMEDIR')}/.local/src/p2rank_2.4/prank'
        prankconf = f'{os.environ.get('SCRIPTDIR')}/configs/blind.groovy'
        # pockets = tempfile.NamedTemporaryFile(suffix=".csv", delete=False)
        # pockets_cmd = f'{prankcmd} predict -c {prankconf} -f {chainspdb.name} -o {pockets.name}'
        pockets_cmd = f'{prankcmd} predict -c {prankconf} -f {chainspdb.name} -o /tmp/'
        subprocess.run(pockets_cmd, shell=True)
        # pockets.flush()
        pockets = f'{chainspdb.name}_predictions.csv'
        clean_protein = chainspdb.name
        # TODO: explicitly delete the tempfiles without affecting their collection for docking

        inputpdb.close()
        chainspdb.close()
        # return pockets.name
        return pockets, clean_protein
    except Exception as e:
        return f"{str(e)}"
