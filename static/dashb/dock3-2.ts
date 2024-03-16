
import { DefaultPluginUISpec, PluginUISpec } from 'molstar/lib/mol-plugin-ui/spec';
import { createPluginUI } from 'molstar/lib/mol-plugin-ui';
import { renderReact18 } from 'molstar/lib/mol-plugin-ui/react18';
import { PluginConfig } from 'molstar/lib/mol-plugin/config';
//added to the reactUI example in https://molstar.org/docs/plugin/
import { DownloadStructure } from 'molstar/lib/mol-plugin-state/actions/structure';
import { BuiltInTrajectoryFormat } from 'molstar/lib/mol-plugin-state/formats/trajectory';
import { StructureRepresentationPresetProvider } from 'molstar/lib/mol-plugin-state/builder/structure/representation-preset';
import { Asset } from 'molstar/lib/mol-util/assets';

const djangovars = document.currentScript.dataset;
const conformers = djangovars.conformers;
const receptor = djangovars.receptor;

class Wrapper {
    plugin: PluginUIContext;

    async init()
}
createPlugin(document.getElementById('pockets')!).then(plugin => {
    let rec = loadStructureFromUrl(plugin, receptor, 'pdbqt');
    let con = loadStructureFromUrl(plugin, conformers, 'pdbqt');
    const component = plugin.builders.structure.tryCreateComponentStatic(rec, 'polymer');

    const builder = plugin.builders.structure.representation;
    const update = plugin.build();
    if (!rec) console.log("this ain't it chief!");
    if (rec) builder.buildRepresentation(update, rec, { type: 'gaussian-surface', typeParams: { alpha: 0.51 } }, {tag: 'polymer' });
    update.commit();
    //TODO: checar la sección *selecting (programmatically) just one chain, molQL?
    //de molstardir (revisar la definición de componente)
    // nos falta agregar representaciones a componentes de receptor y ligando (por crear también)
    /*
	    const rawdata = plugin.builders.data.rawData({ data: receptor });
	    const trajectory = plugin.builders.structure.parseTrajectory(rawdata, 'pdbqt');
	    plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default');
    */
});
