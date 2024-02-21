from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Job, Docking, Profile
from rq.job import Job as rqJob
from django_rq import get_queue
from .tasks import run_docking_script, analyze_protein, analyze_ligand
from django.urls import reverse
import os

from .forms import ProteinForm, LigandForm, DockingForm


# Create your views here.
def process_protein(request):
    # currently the processing is being handled by the store functions
    if request.method == "POST":
        # protein_form = ProteinForm(request.POST, request.FILES)
        if 'protein_file' in request.FILES:
            # TODO: we should get rid of the first check in
            # store_protein and store_ligand
            # checks and extra functionality
            protein_file = request.FILES['protein_file']
            analyze_protein.delay(protein_file)

            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                print("REPORT: Got AJAX")
                return JsonResponse(
                    {'status': 'success',
                     'protein_file': protein_file.read().decode()})
            else:
                print("REPORT: Not AJAX")
                return render(request, 'jobs.html')  # process the job
            # return render(request, 'jobs.html',
            # {'protein_form': protein_form, 'message': message})
    elif request.method == "GET":
        protein_form = ProteinForm()
        return render(request, 'jobs.html')


# def process_ligand(request):
#     if request.method == 'POST':
#         ligand_form = LigandForm(request.POST, request.FILES)
#         if ligand_form.is_valid():
#             message = "Ligand uploaded successfully"
#             return (request, 'jobs.html',
#                     {'ligand_form': ligand_form, 'message': message})
#     else:
#         ligand_form = LigandForm()
#     return render(request, 'jobs.html', {'ligand_form': ligand_form})


def process_ligand(request):
    if request.method == "POST":
        if 'ligand_file' in request.FILES:
            ligand_file = request.FILES['ligand_file']
            analyze_ligand.delay(ligand_file)

            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                print("REPORT: Got AJAX")
                return JsonResponse(
                    {'status': 'success',
                     'ligand_file': ligand_file.read().decode()})
            else:
                print("REPORT: Not AJAX")
                return render(request, 'jobs.html')  # process the job
            # return render(request, 'jobs.html',
            # {'protein_form': protein_form, 'message': message})
    elif request.method == "GET":
        ligand_form = LigandForm()
        return render(request, 'jobs.html')


def jobs(request):
    if request.method == 'POST':  # prepare the model instances and run job
        settings = {'exhaustiveness': request.POST.get('exhaustiveness'),
                    'num_modes': request.POST.get('modes'),
                    'chains': request.POST.get('chainString')}
        post_type = request.POST.get('type')
        if post_type == 'process_protein':
            process_protein(request)
        elif post_type == 'process_ligand':
            print('process_ligand')
        # elif post_type == 'run_job':
        else:
            docking_form = DockingForm(request.POST, request.FILES)
            print("POST: ", request.POST)
            print(settings['chains'])

            job, docking = init_docking(request)
            store_protein(request, docking, job)
            store_ligand(request, docking, job)
            request.session['job_metadata'] = [request.user.id,
                                               job.id, docking.id,
                                               settings]
            return redirect('run_docking')                  # RUN!
    else:
        # render the jobs application
        if request.user.is_authenticated:
            docking_form = DockingForm()
            # protein_form = ProteinForm()
            # ligand_form = LigandForm()
            return render(request, 'jobs.html', {
                # 'protein_form': protein_form,
                # 'ligand_form': ligand_form
                'docking_form': docking_form
            })
        else:
            return render(request, 'notloggedin.html')


def init_docking(request):
    # Create and link a new Job instance
    job = Job.objects.create(
        job_type='docking',
        user=request.user,
    )
    job.job_name = f"job_{job.id}"
    job.save()
    # Create and link a new Docking instance
    docking = Docking.objects.create(
        user=request.user,
        job=job,
    )
    return job, docking


def store_protein(request, docking, job):
    # if 'protein_file' in request.FILES:  # will this still be necessary?
    print("request files:")
    print(request.FILES)

    for file_field_name, file_obj in request.FILES.items():
        file_name = file_obj.name
        file_size = file_obj.size
        print("file name: ", file_name)
        print("file size: ", file_size)

    protein_file = request.FILES['protein_file']
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



def rundocking(request):
    # user, job and docking here are just their IDs
    user, job, docking, settings = request.session.get('job_metadata', [])
    # unique_job_id = f"rqjob_{job}"
    result = run_docking_script.delay(user, job, docking, settings)
    job_id = result.id
    return render(request, 'running.html', {'job_id': job_id})


def check_progress(request):
    queue = get_queue('default')
    job_id = request.GET.get("job_id")
    job = rqJob.fetch(job_id, connection=queue.connection)

    print("JOB META", job.meta)
    progress = job.meta.get('progress', 'Running')

    if progress == "Script completed successfully":
        user_inst, job_inst, docking_inst, settings = request.session.get('job_metadata')

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
        return JsonResponse({'progress': progress,
                             'redirect_url': redirect_url})

    output = job.meta.get('output', [])
    # current_output = '\n'.join(output)
    print(progress)
    return JsonResponse({'progress': progress, 'output': output})


def dummy(request):
    return render(request, 'dummy.html')
