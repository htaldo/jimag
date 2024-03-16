"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var djangovars = document.currentScript.dataset;
var conformers = djangovars.conformers;
var receptor = djangovars.receptor;
var Wrapper = /** @class */ (function () {
    function Wrapper() {
    }
    return Wrapper;
}());
createPlugin(document.getElementById('pockets')).then(function (plugin) {
    var rec = loadStructureFromUrl(plugin, receptor, 'pdbqt');
    var con = loadStructureFromUrl(plugin, conformers, 'pdbqt');
    var component = plugin.builders.structure.tryCreateComponentStatic(rec, 'polymer');
    var builder = plugin.builders.structure.representation;
    var update = plugin.build();
    if (!rec)
        console.log("this ain't it chief!");
    if (rec)
        builder.buildRepresentation(update, rec, { type: 'gaussian-surface', typeParams: { alpha: 0.51 } }, { tag: 'polymer' });
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
