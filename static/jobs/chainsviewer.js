let viewer;
let receptor;

function loadReceptor(receptor) {
    //code that will be loaded with jobs.html
    if (!viewer) {
	molstar.Viewer.create('app2', {
	    layoutIsExpanded: true,
	    layoutShowControls: true,
	    layoutShowRemoteState: false,
	    layoutShowSequence: false,
	    layoutShowLog: true,
	    layoutShowLeftPanel: true,

	    viewportShowExpand: true,
	    viewportShowSelectionMode: false,
	    viewportShowAnimation: false,

	    pdbProvider: 'rcsb',
	    emdbProvider: 'rcsb',
	}).then(newViewer => {
	    viewer = newViewer;
	    viewer.plugin.selectionMode=true //al hacer esto true se agrega el div con los botones automáticamente
	    viewer.plugin.managers.interactivity.setProps({granularity: 'chain'})	    
	    
	    
	    //var control = document.getElementsByClassName('msp-selection-viewport-controls')[0];
            //control.remove();

	    //var controls = document.getElementsByClassName('msp-selection-viewport-controls');
	    //console.log("controls:");
	    //controls[0].style.visibility = 'hidden';
	});
    } else {
	//code that will be executed every time a new protein is chosen
	viewer.plugin.clear();
	viewer.loadStructureFromData(receptor, format='pdbqt');
        console.log(receptor);
    }
}

loadReceptor(receptor);
//console.log(controls);
//for (var i = 0; i < controls.length; i++) {
//  controls[i].style.visibility = 'hidden';
//}
