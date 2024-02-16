//import React, { useState } from 'react';
//import ReactDOM from 'react-dom';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { DefaultPluginUISpec, PluginUISpec } from 'molstar/lib/mol-plugin-ui/spec';
import { createPluginUI } from 'molstar/lib/mol-plugin-ui/index';
import { PluginConfig } from 'molstar/lib/mol-plugin/config';
import { InteractivityManager } from 'molstar/lib/mol-plugin-state/manager/interactivity';

import {
    Structure,
    StructureProperties,
} from "molstar/lib/mol-model/structure"

const MySpec: PluginUISpec = {
    //ref: https://github.com/molstar/molstar/blob/master/src/apps/docking-viewer/index.ts#L80
    ...DefaultPluginUISpec(),
    config: [
        [PluginConfig.VolumeStreaming.Enabled, false],
        [PluginConfig.Viewport.ShowControls, false],
        [PluginConfig.Viewport.ShowSelectionMode, false],
        [PluginConfig.Viewport.ShowExpand, false],
        [PluginConfig.Viewport.ShowSettings, false],
        [PluginConfig.Viewport.ShowTrajectoryControls, false]
    ],
    layout: {
	initial: {
	    regionState: {
		top: "hidden",
		left: "hidden",
		right: "hidden",
		bottom: "hidden",
	    },
	},
    },
}

let loadReceptor;
    
(function() {
    let plugin = null; 

    const MyComponent: React.FC = () => {
	const [selected, setSelected] = React.useState([]);

	React.useEffect(() => {
	    async function initializePlugin() {
		const parent = document.getElementById('chainsviewer')
		if (!parent) return;

		plugin = await createPluginUI(parent, MySpec);


		//const receptor = 'https://files.rcsb.org/download/1a3n.pdb';
		//const data = await plugin.builders.data.download({ url: receptor }, { state: { isGhost: true } });
		//const trajectory = await plugin.builders.structure.parseTrajectory(data, 'pdb');
		//await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default');

		plugin.managers.interactivity.setProps({granularity: 'chain'});
		plugin.selectionMode=true;
		plugin.behaviors.interaction.click.subscribe(
		    (event: InteractivityManager.ClickEvent) => {
			const selections = Array.from(
			  plugin.managers.structure.selection.entries.values()
			);
			//console.log("selections: ", selections);
			// This bit can be customized to record any piece information you want
			const localSelected: any[] = [];
			for (const { structure } of selections) {
			    //console.log("structure: ", structure);
			    if (!structure) continue;
			    Structure.eachAtomicHierarchyElement(structure, {
				chain: (loc) => {
				    const chainid = StructureProperties.chain.auth_asym_id(loc);
				    localSelected.push({ chainid });
				},
			    });
			}
			setSelected(localSelected);
			const chainString = localSelected.map(item => item.chainid).join(',');
			console.log("chainString: ", chainString);
			const stringDiv = document.getElementById('chainstring');
			stringDiv.innerHTML = chainString;
		    }
		);
	    }

	    initializePlugin();
	    return () => {
		//cleanup
	    };
	}, []);

	return null;
    }

    //https://stackoverflow.com/questions/50176213/accessing-exported-functions-from-html-file
    window.loadReceptor = async (receptor) => {
	console.log('loadReceptor call');
	if (!plugin) {
	    const parent = document.getElementById('chainsviewer');
	    if (!parent) return;
	    plugin = await createPluginUI(parent, MySpec);
	     
	} else {
	    const stringDiv = document.getElementById('chainstring');
	    stringDiv.innerHTML = '';
	    plugin.clear();
	    console.log(receptor);
	    //de la definición de loadStructureFromData	(viewer/app.ts)
	    const rawdata = await plugin.builders.data.rawData({ data: receptor });
	    const trajectory = await plugin.builders.structure.parseTrajectory(rawdata, 'pdbqt');
	    await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default');
	}
    }

    ReactDOM.render(
	React.createElement(MyComponent),
	//<MyComponent />,
	document.getElementById('chainsviewer')
    );
})();
