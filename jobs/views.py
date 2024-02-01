from django.shortcuts import render, redirect
from django.template import RequestContext
from django.http import HttpResponseRedirect, JsonResponse
from .models import Job, Docking, Profile
from rq.job import Job as rqJob
from django_rq import get_queue
from .tasks import run_docking_script, analyze_protein
from django.urls import reverse
import os
import subprocess

from .forms import ProteinForm, LigandForm

# Create your views here.
def process_protein(request): #currently the processing is being handled by the store functions
    if request.method == "POST":
        protein_form = ProteinForm(request.POST, request.FILES)
        if protein_form.is_valid():
            #checks and extra functionality
            cheq = analyze_protein.delay(request.FILES['protein_file'])
            print("REPORT: ", cheq)

            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                print("REPORT: Got AJAX")
                return JsonResponse({'status': 'success'})
            else:
                print("REPORT: Not AJAX")
                return render(request, 'jobs.html')
            #return render(request, 'jobs.html', {'protein_form': protein_form, 'message': message})
    else:
        protein_form = ProteinForm()
    return render(request, 'jobs.html')


def jobs(request):
    if request.method == 'POST': #prepare the model instances and run job
    #    job, docking = init_docking(request)
    #    store_protein(request, docking, job)
    #    store_ligand(request, docking, job)

    #    request.session['job_metadata'] = [request.user.id, job.id, docking.id]
    #    return redirect('run_docking')                  #RUN!
        process_protein(request)
    else:
        if request.user.is_authenticated:
            protein_form = ProteinForm()
            ligand_form = LigandForm()
            return render(request, 'jobs.html', {
                'protein_form': protein_form,
                'ligand_form': ligand_form
            })
        else:
            return render(request, 'notloggedin.html')

def init_docking(request):
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
    )
    return job, docking

def store_protein(request, docking, job):
    if 'protein_file' in request.FILES: #will this still be necessary?
        protein_form = ProteinForm(request.POST, request.FILES)
        if protein_form.is_valid():
            protein = protein_form.save(commit=False) 
            protein.user = request.user
            protein.job = job
            protein.docking = docking
            file_ext = os.path.splitext(protein.protein_file.name)[1]
            protein.protein_file.name = f'receptor{file_ext}'
            protein.save()

def store_ligand(request, docking, job):
    if 'ligand_file' in request.FILES:
        ligand_form = LigandForm(request.POST, request.FILES)
        if ligand_form.is_valid():
            ligand = ligand_form.save(commit=False)
            ligand.user = request.user
            ligand.job = job 
            ligand.docking = docking
            file_ext = os.path.splitext(ligand.ligand_file.name)[1]
            ligand.ligand_file.name = f'ligand{file_ext}'
            ligand.save()
    
def process_ligand(request):
    if request.method == 'POST':
        ligand_form = LigandForm(request.POST, request.FILES)
        if ligand_form.is_valid():
            message = "Ligand uploaded successfully"
            return(request, 'jobs.html', {'ligand_form': ligand_form, 'message': message})
    else:
        ligand_form = LigandForm()
    return render(request, 'jobs.html', {'ligand_form': ligand_form})

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
