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

export interface LoadStructureOptions {
    representationParams?: StructureRepresentationPresetProvider.CommonParams
}

type LoadParams = { url: string, format?: BuiltInTrajectoryFormat, isBinary?: boolean, assemblyId?: string }


const MySpec: PluginUISpec = {
    ...DefaultPluginUISpec(),
    config: [
        [PluginConfig.VolumeStreaming.Enabled, false]
    ]
}

async function createPlugin(parent: HTMLElement) {
    const plugin = await createPluginUI(parent);

    return plugin;
}


function loadStructureFromUrl(plugin, url: string, format: BuiltInTrajectoryFormat = 'mmcif', isBinary = false, options?: LoadStructureOptions & { label?: string }) {
    const params = DownloadStructure.createDefaultParams(plugin.state.data.root.obj!, plugin);
    return plugin.runTask(plugin.state.data.applyAction(DownloadStructure, {
        source: {
            name: 'url',
            params: {
                url: Asset.Url(url),
                format: format as any,
                isBinary,
                label: options?.label,
                options: { ...params.source.params.options, representationParams: options?.representationParams as any },
            }
        }
    }));
}


/*
function load(plugin, { url, format = 'mmcif', isBinary = false, assemblyId = '' }: LoadParams) {

        const data = plugin.builders.data.download({ url: Asset.Url(url), isBinary }, { state: { isGhost: true } });
        const trajectory = plugin.builders.structure.parseTrajectory(data, format);

        plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default', {
            structure: assemblyId ? {
                name: 'assembly',
                params: { id: assemblyId }
            } : {
                name: 'model',
                params: {}
            },
            showUnitcell: false,
            representationPreset: 'auto'
        });
    }
*/

createPlugin(document.getElementById('pockets')!).then(plugin => {
    let rec = loadStructureFromUrl(plugin, receptor, 'pdbqt');
    let con = loadStructureFromUrl(plugin, conformers, 'pdbqt');
    const component = plugin.builders.structure.tryCreateComponentStatic(rec, 'polymer');

    console.log(rec);
    const builder = plugin.builders.structure.representation;
    const update = plugin.build();
    //builder.buildRepresentation(update, rec, { type: 'gaussian-surface', typeParams: { alpha: 0.51 } }, {tag: 'polymer' });
    //builder.buildRepresentation(update, component, { type: 'cartoon' });


    update.commit();
    builder.addRepresentation(rec, { type: 'cartoon' });
    //TODO: checar la sección *selecting (programmatically) just one chain, molQL?
    //de molstardir (revisar la definición de componente)
    // nos falta agregar representaciones a componentes de receptor y ligando (por crear también)
    /*
	    const rawdata = plugin.builders.data.rawData({ data: receptor });
	    const trajectory = plugin.builders.structure.parseTrajectory(rawdata, 'pdbqt');
	    plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default');
    */
});
