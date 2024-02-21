from rq import get_current_job
from django_rq import job
import subprocess
import logging

logging.basicConfig(filename='script_output.log', level=logging.INFO)


@job
# TODO: maybe we can change _inst to _id,
# but making clear that the id refers to the model isntancss
def run_docking_script(user_inst, job_inst, docking_inst, settings):
    job = get_current_job()  # is this line necessary?

    logger = logging.getLogger(__name__)
    logger.info("INFO: run_docking_script task started")
    logger.info("INFO: ", settings['chains'])

    try:
        script_path = '/home/aldo/pro/falcon/script4/blind.sh'
        input_dir = f"/home/aldo/pro/A/media/user_{user_inst}/job_{job_inst}/docking_{docking_inst}/input"
        output_dir = f"/home/aldo/pro/A/media/user_{user_inst}/job_{job_inst}/docking_{docking_inst}/output"
        script_command = [script_path, "--input", input_dir, "--output", output_dir,
                          "--vinalvl", settings['exhaustiveness'], "--num_modes", settings['num_modes']]
        if settings['chains']:
            script_command.extend(["--chains", settings['chains']])
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
            logger.error(f"Script failed with return code {return_code}")
            job.meta['progress'] = f"Script failed with return code {return_code}"
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
