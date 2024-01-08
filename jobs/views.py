from django.shortcuts import render, redirect
from django.template import RequestContext
from django.http import HttpResponseRedirect, JsonResponse
from .models import Job, Docking, Profile
from rq.job import Job as rqJob
from django_rq import get_queue
from .tasks import run_docking_script
from django.urls import reverse
import os
import subprocess

from .forms import ProteinForm, LigandForm, DockingForm

# Create your views here.
def jobs(request):
    if request.method == 'POST':
        docking_form = DockingForm(request.POST, request.FILES)
        if docking_form.is_valid():
            # Create and link a new Job instance
            job = Job.objects.create(
                job_type='docking',
                user=request.user,
            )
            job.job_name=f"job_{job.id}"
            job.save()

            # Create and link a new Docking instance
            docking = Docking.objects.create(
                user=request.user,
                job=job,
                protein=None, #initialize protein
                ligand=None #initialize ligand
            )

            if 'protein_file' in request.FILES:
                pform = ProteinForm(request.POST, request.FILES)
                if pform.is_valid():
                    protein = pform.save(commit=False) 
                    protein.user = request.user
                    protein.job = job
                    protein.docking = docking
                    print("BEFORE", protein.protein_file.name)
                    file_ext = os.path.splitext(protein.protein_file.name)[1]
                    protein.protein_file.name = f'receptor{file_ext}'
                    print("AFTER", protein.protein_file.name)
                    protein.save()
                    #docking.protein = protein

            if 'ligand_file' in request.FILES:
                lform = LigandForm(request.POST, request.FILES)
                if lform.is_valid():
                    ligand = lform.save(commit=False)
                    ligand.user = request.user
                    ligand.job = job 
                    ligand.docking = docking
                    print("BEFORE", ligand.ligand_file.name)
                    file_ext = os.path.splitext(ligand.ligand_file.name)[1]
                    ligand.ligand_file.name = f'ligand{file_ext}'
                    print("AFTER", ligand.ligand_file.name)
                    ligand.save()
                    #docking.ligand = ligand
            request.session['job_metadata'] = [request.user.id, job.id, docking.id]
            return redirect('run_docking')
    else:
        if request.user.is_authenticated:
            docking_form = DockingForm()
            return render(request, 'jobs.html', {
                'docking_form': docking_form
            })
        else:
            return render(request, 'notloggedin.html')

def rundocking(request):
    #user, job and docking here are just their IDs
    user, job, docking = request.session.get('job_metadata', [])
    #unique_job_id = f"rqjob_{job}"
    result = run_docking_script.delay(user, job, docking)
    job_id = result.id
    return render(request, 'running.html', {'job_id': job_id})

def check_progress(request):
    queue = get_queue('default')
    job_id = request.GET.get("job_id")
    job = rqJob.fetch(job_id, connection=queue.connection)

    print("JOB META", job.meta)
    progress = job.meta.get('progress', 'Running')

    if progress == "Script completed successfully":
        user_inst, job_inst, docking_inst = request.session.get('job_metadata')

        if hasattr(request.user, 'profile'):
            request.user.profile.latest_job = job_inst
            request.user.profile.save()
        else:
            profile = Profile.objects.create(
                user=request.user,
                latest_job=job_inst,
            )
            profile.save()

        redirect_url = reverse('results')
        return  JsonResponse({'progress': progress, 'redirect_url': redirect_url})

    output = job.meta.get('output', [])
    #current_output = '\n'.join(output)

    print(progress)

    return JsonResponse({'progress': progress, 'output': output})
