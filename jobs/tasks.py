from rq import get_current_job
from django_rq import job
import subprocess
import logging
import tempfile
import shutil
import os

logging.basicConfig(filename='script_output.log', level=logging.INFO)


@job
# TODO: maybe we can change _inst to _id,
# but making clear that the id refers to the model isntancss
def run_docking_script(user_inst, job_inst, docking_inst, settings):
    job = get_current_job()  # is this line necessary?

    logger = logging.getLogger(__name__)
    logger.info("INFO: run_docking_script task started")
    #logger.info("INFO: ", settings['chains'])

    try:
        script_path = '/home/aldo/pro/falcon/script4/multi.sh'
        input_dir = f"/home/aldo/pro/A/media/user_{user_inst}/job_{job_inst}/docking_{docking_inst}/input"
        output_dir = f"/home/aldo/pro/A/media/user_{user_inst}/job_{job_inst}/docking_{docking_inst}/output"

        # Pass preprocessing files to the script
        if settings['preproc_done']:
            os.makedirs(output_dir, exist_ok=True)
            shutil.copy(settings['pockets_filename'], f"{output_dir}/receptor.pdb_predictions.csv")
            shutil.copy(settings['clean_protein_filename'], f"{output_dir}/receptor.pdb")
            # apparently we don't need to remove the files, why?
            # os.remove(settings['pockets_filename'])
            # os.remove(settings['clean_protein_filename'])

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

        # job.meta['progress'] = '\n'.join(output_lines)
        job.meta['progress'] = 'test string'

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
        script_path = '/home/aldo/pro/falcon/script4/receptor_pre.py'
        chimera_cmd = '/home/aldo/.local/src/chimera/bin/chimera'
        chainspdb = tempfile.NamedTemporaryFile(suffix=".pdb", delete=False)
        clean_chains_cmd = f'export IF={inputpdb.name} OF={chainspdb.name} CHAINS={chains}; {chimera_cmd} --nogui {script_path}'
        subprocess.run(clean_chains_cmd, shell=True)
        # chainspdb.flush()
        # get pockets with p2rank
        prankcmd = '/home/aldo/.local/src/p2rank_2.4/prank'
        prankconf = '/home/aldo/pro/falcon/script4/configs/blind.groovy'
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
