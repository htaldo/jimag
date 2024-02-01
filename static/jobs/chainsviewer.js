//import { Viewer } from 'molstar/lib/apps/docking-viewer';
//import { ColorNames } from 'molstar/lib/mol-util/color/names';
//import { PluginCommands } from 'molstar/lib/mol-plugin/commands';

const djangovars = document.currentScript.dataset;
const conformers = djangovars.conformers;
const receptor = djangovars.receptor;
console.log(conformers, receptor);
molstar.Viewer.create('app2', {
    layoutIsExpanded: false,
    layoutShowControls: false,
    layoutShowRemoteState: false,
    layoutShowSequence: true,
    layoutShowLog: false,
    layoutShowLeftPanel: false,

    viewportShowExpand: false,
    viewportShowSelectionMode: true,
    viewportShowAnimation: false,

    pdbProvider: 'rcsb',
    emdbProvider: 'rcsb',
}).then(viewer => {
	/*viewer.loadPdb('7bv2');*/
    viewer.loadStructureFromUrl(receptor, format='pdbqt')
    viewer.loadStructureFromUrl(conformers, format='pdbqt')
});
//const renderer = plugin.canvas3d!.props.renderer;
//PluginCommands.Canvas3D.SetSettings(plugin, { settings: { renderer: { ...renderer, backgroundColor: ColorNames.red /* or: 0xff0000 as Color */ } } });

