//request to compute pockets via p2rank
function loadPockets() {
    var pForm = document.getElementById('uploadProteinForm');
    var pFormData = new FormData(pForm);
    //var parsedPFormData = JSON.parse(pFormData);
    var receptor = pFormData.get('protein_file');

    //add selected chains (if any)
    var chainSpan = document.getElementById('chainstring');
    var chainString = chainSpan.textContent;
    pFormData.append('chainString', chainString);

    fetch('/load_pockets/', {
        method: 'POST',
        body: pFormData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
    })
    .then(response => response.json())
    .then(data => {
        retrievePockets(data.job_id);
    })
    .catch(error => {
        console.error('Error:', error)
    });
}

//request to poll pocket job status, and display the pockets when it's done
function retrievePockets(jobId) {
    //console.log("JOBID: ", jobId);
    fetch(`/retrieve_pockets/${jobId}/`)
    .then(response => response.json())
    .then(data => {
        if (data.status === 'pending') {
            setTimeout(() => {
                retrievePockets(jobId);
            }, 5000);
        } else if (data.pockets_file) {
            //var pocketsdiv = document.getElementById('pocketsinfo');
            const parsedPocketsCSV = parsePocketsCSV(data.pockets_file);
            displayPocketsTable(parsedPocketsCSV);
            //console.log(data.pockets_file);
        } else {
            console.log("retrievePockets: Something went wrong")
        }
    })
    .catch(error => {
        console.error('Error:', error)
    });
};

//prepare CSV file for display in pockets table and for actaul pocket parsing
const parsePocketsCSV = (csv) => {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].split(',');
        if (line.length === headers.length) {
            const entry = {};
            for (let j = 0; j < headers.length; j++) {
                entry[headers[j].trim()] = line[j].trim();
            }
            //entry['id'] = i;
            data.push(entry);
        }
    }
    return data;
};

//build pockets from the CSV data
const parsePocket = (rank, prankIds) => {
    let pocket = {
        rank: rank,
        seq: []
    }; 
    pastChain = '';
    //prank ids are auth_seq_ids attached to the name of the chain they belong to (eg A_32)
    prankIds.split(' ').forEach(prankId => {
        let [chain, resId] = prankId.split('_');
        resId = parseInt(resId);
        if (chain !== pastChain) {
            pocket.seq.push({ chain: chain, subSeq: [] });
            pastChain = chain;
        }
        pocket.seq[pocket.seq.length - 1].subSeq.push(resId);
    });

    return pocket;
};

const displayPocketsTable = (data) => {
    //TODO: reset the table if the user presses the 'choose pockets' button again
    const tableBody = document.querySelector('#pocketsTable tbody');
    data.forEach(entry => {
        const row = document.createElement('tr');
        //we can get rid of seq here; it's only for debugging purposes
        //residue_ids is the name given by prank in the csv. resIds used later is a different object
        let pocket = parsePocket(entry['rank'], entry['residue_ids']);
        const pocketString = JSON.stringify(pocket).replace(/"/g, '&quot;'); //escape quotes to avoid syntax errors in the HTML
        //console.log(pocketString);
        row.innerHTML = `
            <td><input type="checkbox" class="pocketcheckbox" value="${entry['rank']}" pocket="${pocketString}" onchange="togglePocket(this)"></td>
            <td>${entry['rank']}</td>
            <td>${entry['score']}</td>
            <td>${entry['probability']}</td>`;
        tableBody.appendChild(row);
    });
};

function togglePocket(checkbox) {
    const value = checkbox.value;
    const pocketString = checkbox.getAttribute('pocket'); //since pocket is not a default HTML attribute
    //console.log(pocketString);
    const pocket = JSON.parse(pocketString);
    const isChecked = checkbox.checked;

    console.log(`Checkbox value: ${value}, Checked: ${isChecked}, Pocket: ${pocketString}`);
    window.togglePocketRepr(pocket, isChecked);
}


