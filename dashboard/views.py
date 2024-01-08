import os
from django.shortcuts import render, redirect
from jobs.models import Job, Docking, Protein, Ligand
from django.http import FileResponse, HttpResponse, HttpResponseForbidden
from django.http import HttpResponse
from django.conf import settings
import shutil
import zipfile

# Create your views here.
def results(request, current_job=None):
    user = request.user
    #wd = f"{settings.MEDIA_ROOT}/user_{user.id}/job_{current_job}/docking_{docking}/output/"
    if not current_job:
        latest_job = user.profile.latest_job
        if not latest_job: #if latest_job is null
        #todo: consider the case where the user has no jobs
            #TODO: This is redundant with delete_job()
            user_job_ids = Job.objects.filter(user=user).values_list('id', flat=True)
            print(f"USER JOB IDS:{user_job_ids}")
            first_job = min(user_job_ids)   
            current_job = first_job
        else: 
            current_job = latest_job
    print(f"CURRENT JOB:{current_job}")
    if Job.objects.get(pk=current_job).user != request.user:
        return HttpResponseForbidden("You don't have permission to access this job.")
    docking = Docking.objects.get(job=current_job).id
    wd = f"user_{user.id}/job_{current_job}/docking_{docking}/"

    current_job_files = {
        'conformers': f"/media/{wd}output/coarse.pdbqt",
        'receptor': f"/media/{wd}output/receptor.pdbqt",
    }
    vina_file = f"{settings.MEDIA_ROOT}/{wd}output/coarse_scores.txt"
    with open(vina_file, 'r') as file:
        vina_results = file.read()

    return render(request, 'dashboard.html', {
        'job_info' : job_info(current_job),
        'current_job_files' : current_job_files,
        'vina_results': vina_results,
        'jobs': [job for job in Job.objects.filter(user=user)],
    })

def download_output(request):
    user = request.user
    current_job = user.profile.current_job
    docking = Docking.objects.get(job=current_job).id
    wd = f"{settings.MEDIA_ROOT}/user_{user.id}/job_{current_job}/docking_{docking}/"

    print(settings.MEDIA_ROOT)
    shutil.make_archive(f"{wd}output", 'zip', f"{wd}output/", verbose=True)
    #create response to send the ZIP file for download
    response = FileResponse(open(f"{wd}output.zip", 'rb'), content_type='application/zip')
    response['Content-Disposition'] = f'attachment; filename="output.zip"'
    return response

def job_info(job_id):
    job_instance = Job.objects.get(pk=job_id)
    info = {}
    info['type'] = job_instance.job_type
    info['created_at'] = job_instance.created_at
    info['receptor'] = Protein.objects.get(job=job_id).protein_name
    info['ligand'] = Ligand.objects.get(job=job_id).ligand_name
    return info

def delete_job(request, job_id):
    user = request.user
    job_instance = Job.objects.get(pk=job_id)
    job_dir = f"{settings.MEDIA_ROOT}/user_{user.id}/job_{job_id}"
    #TODO: remove redundant code
    if (request.method == 'POST') and (user.profile.latest_job == job_id):
        try:
            shutil.rmtree(job_dir)
        except OSError as e:
            print(f"Error deleting directory: {e}")

        job_instance.delete()
        user.profile.latest_job = None
        user.profile.save()
        #user.profile.latest_job.delete()
        user_job_ids = Job.objects.filter(user=user).values_list('id', flat=True)
        first_job = min(user_job_ids)
        return redirect('results', current_job=first_job)
    elif request.method == 'POST':
        try:
            shutil.rmtree(job_dir)
        except OSError as e:
            print(f"Error deleting directory: {e}")

        job_instance.delete()
        return redirect('results')
