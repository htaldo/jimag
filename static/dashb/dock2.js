"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginExtensions = exports.ViewerAutoPreset = exports.Viewer = exports.ExtensionMap = exports.consoleStats = exports.setTimingMode = exports.setProductionMode = exports.setDebugMode = exports.version = void 0;
/*+
 * Copyright (c) 2018-2023 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
var tslib_1 = require("tslib");
var behavior_1 = require("molstar/lib/extensions/anvil/behavior");
var cellpack_1 = require("molstar/lib/extensions/cellpack");
var dnatco_1 = require("molstar/lib/extensions/dnatco");
var format_1 = require("molstar/lib/extensions/g3d/format");
var volumes_and_segmentations_1 = require("molstar/lib/extensions/volumes-and-segmentations");
var geo_export_1 = require("molstar/lib/extensions/geo-export");
var behavior_2 = require("molstar/lib/extensions/model-archive/quality-assessment/behavior");
var behavior_3 = require("molstar/lib/extensions/model-archive/quality-assessment/behavior");
var prop_1 = require("molstar/lib/extensions/model-archive/quality-assessment/prop");
var model_export_1 = require("molstar/lib/extensions/model-export");
var mp4_export_1 = require("molstar/lib/extensions/mp4-export");
var pdbe_1 = require("molstar/lib/extensions/pdbe");
var rcsb_1 = require("molstar/lib/extensions/rcsb");
var zenodo_1 = require("molstar/lib/extensions/zenodo");
var volume_1 = require("molstar/lib/mol-model/volume");
var structure_1 = require("molstar/lib/mol-plugin-state/actions/structure");
var volume_2 = require("molstar/lib/mol-plugin-state/actions/volume");
var representation_preset_1 = require("molstar/lib/mol-plugin-state/builder/structure/representation-preset");
var volume_representation_params_1 = require("molstar/lib/mol-plugin-state/helpers/volume-representation-params");
var transforms_1 = require("molstar/lib/mol-plugin-state/transforms");
var model_1 = require("molstar/lib/mol-plugin-state/transforms/model");
var react18_1 = require("molstar/lib/mol-plugin-ui/react18");
var spec_1 = require("molstar/lib/mol-plugin-ui/spec");
var commands_1 = require("molstar/lib/mol-plugin/commands");
var config_1 = require("molstar/lib/mol-plugin/config");
var spec_2 = require("molstar/lib/mol-plugin/spec");
var mol_state_1 = require("molstar/lib/mol-state");
var assets_1 = require("molstar/lib/mol-util/assets");
require("molstar/lib/mol-util/polyfill");
var type_helpers_1 = require("molstar/lib/mol-util/type-helpers");
var backgrounds_1 = require("molstar/lib/extensions/backgrounds");
var sb_ncbr_1 = require("molstar/lib/extensions/sb-ncbr");
var struct_conn_1 = require("molstar/lib/extensions/wwpdb/struct-conn");
var behavior_4 = require("molstar/lib/extensions/wwpdb/ccd/behavior");
var behavior_5 = require("molstar/lib/extensions/rcsb/assembly-symmetry/behavior");
var version_1 = require("molstar/lib/mol-plugin/version");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return version_1.PLUGIN_VERSION; } });
var debug_1 = require("molstar/lib/mol-util/debug");
Object.defineProperty(exports, "setDebugMode", { enumerable: true, get: function () { return debug_1.setDebugMode; } });
Object.defineProperty(exports, "setProductionMode", { enumerable: true, get: function () { return debug_1.setProductionMode; } });
Object.defineProperty(exports, "setTimingMode", { enumerable: true, get: function () { return debug_1.setTimingMode; } });
Object.defineProperty(exports, "consoleStats", { enumerable: true, get: function () { return debug_1.consoleStats; } });
var CustomFormats = [
    ['g3d', format_1.G3dProvider]
];
exports.ExtensionMap = {
    'volseg': spec_2.PluginSpec.Behavior(volumes_and_segmentations_1.Volseg),
    'backgrounds': spec_2.PluginSpec.Behavior(backgrounds_1.Backgrounds),
    'cellpack': spec_2.PluginSpec.Behavior(cellpack_1.CellPack),
    'dnatco-ntcs': spec_2.PluginSpec.Behavior(dnatco_1.DnatcoNtCs),
    'pdbe-structure-quality-report': spec_2.PluginSpec.Behavior(pdbe_1.PDBeStructureQualityReport),
    'rcsb-assembly-symmetry': spec_2.PluginSpec.Behavior(rcsb_1.RCSBAssemblySymmetry),
    'rcsb-validation-report': spec_2.PluginSpec.Behavior(rcsb_1.RCSBValidationReport),
    'anvil-membrane-orientation': spec_2.PluginSpec.Behavior(behavior_1.ANVILMembraneOrientation),
    'g3d': spec_2.PluginSpec.Behavior(format_1.G3DFormat),
    'model-export': spec_2.PluginSpec.Behavior(model_export_1.ModelExport),
    'mp4-export': spec_2.PluginSpec.Behavior(mp4_export_1.Mp4Export),
    'geo-export': spec_2.PluginSpec.Behavior(geo_export_1.GeometryExport),
    'ma-quality-assessment': spec_2.PluginSpec.Behavior(behavior_2.MAQualityAssessment),
    'zenodo-import': spec_2.PluginSpec.Behavior(zenodo_1.ZenodoImport),
    'sb-ncbr-partial-charges': spec_2.PluginSpec.Behavior(sb_ncbr_1.SbNcbrPartialCharges),
    'wwpdb-chemical-component-dictionary': spec_2.PluginSpec.Behavior(behavior_4.wwPDBChemicalComponentDictionary),
};
var DefaultViewerOptions = {
    customFormats: CustomFormats,
    extensions: (0, type_helpers_1.ObjectKeys)(exports.ExtensionMap),
    disabledExtensions: [],
    layoutIsExpanded: true,
    layoutShowControls: true,
    layoutShowRemoteState: true,
    layoutControlsDisplay: 'reactive',
    layoutShowSequence: true,
    layoutShowLog: true,
    layoutShowLeftPanel: true,
    collapseLeftPanel: false,
    collapseRightPanel: false,
    disableAntialiasing: config_1.PluginConfig.General.DisableAntialiasing.defaultValue,
    pixelScale: config_1.PluginConfig.General.PixelScale.defaultValue,
    pickScale: config_1.PluginConfig.General.PickScale.defaultValue,
    pickPadding: config_1.PluginConfig.General.PickPadding.defaultValue,
    enableWboit: config_1.PluginConfig.General.EnableWboit.defaultValue,
    enableDpoit: config_1.PluginConfig.General.EnableDpoit.defaultValue,
    preferWebgl1: config_1.PluginConfig.General.PreferWebGl1.defaultValue,
    allowMajorPerformanceCaveat: config_1.PluginConfig.General.AllowMajorPerformanceCaveat.defaultValue,
    powerPreference: config_1.PluginConfig.General.PowerPreference.defaultValue,
    viewportShowExpand: config_1.PluginConfig.Viewport.ShowExpand.defaultValue,
    viewportShowControls: config_1.PluginConfig.Viewport.ShowControls.defaultValue,
    viewportShowSettings: config_1.PluginConfig.Viewport.ShowSettings.defaultValue,
    viewportShowSelectionMode: config_1.PluginConfig.Viewport.ShowSelectionMode.defaultValue,
    viewportShowAnimation: config_1.PluginConfig.Viewport.ShowAnimation.defaultValue,
    viewportShowTrajectoryControls: config_1.PluginConfig.Viewport.ShowTrajectoryControls.defaultValue,
    pluginStateServer: config_1.PluginConfig.State.DefaultServer.defaultValue,
    volumeStreamingServer: config_1.PluginConfig.VolumeStreaming.DefaultServer.defaultValue,
    volumeStreamingDisabled: !config_1.PluginConfig.VolumeStreaming.Enabled.defaultValue,
    pdbProvider: config_1.PluginConfig.Download.DefaultPdbProvider.defaultValue,
    emdbProvider: config_1.PluginConfig.Download.DefaultEmdbProvider.defaultValue,
    saccharideCompIdMapType: 'default',
    volumesAndSegmentationsDefaultServer: volumes_and_segmentations_1.VolsegVolumeServerConfig.DefaultServer.defaultValue,
    rcsbAssemblySymmetryDefaultServerType: behavior_5.RCSBAssemblySymmetryConfig.DefaultServerType.defaultValue,
    rcsbAssemblySymmetryDefaultServerUrl: behavior_5.RCSBAssemblySymmetryConfig.DefaultServerUrl.defaultValue,
    rcsbAssemblySymmetryApplyColors: behavior_5.RCSBAssemblySymmetryConfig.ApplyColors.defaultValue,
};
var Viewer = /** @class */ (function () {
    function Viewer(plugin) {
        this.plugin = plugin;
    }
    Viewer.create = function (elementOrId, options) {
        var _a, _b;
        if (options === void 0) {
            options = {};
        }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var definedOptions, _i, _c, p, o, defaultSpec, disabledExtension, spec, element, plugin;
            return (0, tslib_1.__generator)(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        definedOptions = {};
                        // filter for defined properies only so the default values
                        // are property applied
                        for (_i = 0, _c = Object.keys(options); _i < _c.length; _i++) {
                            p = _c[_i];
                            if (options[p] !== void 0)
                                definedOptions[p] = options[p];
                        }
                        o = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, DefaultViewerOptions), definedOptions);
                        defaultSpec = (0, spec_1.DefaultPluginUISpec)();
                        disabledExtension = new Set((_a = o.disabledExtensions) !== null && _a !== void 0 ? _a : []);
                        spec = {
                            actions: defaultSpec.actions,
                            behaviors: (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], defaultSpec.behaviors, true), o.extensions.filter(function (e) { return !disabledExtension.has(e); }).map(function (e) { return exports.ExtensionMap[e]; }), true),
                            animations: (0, tslib_1.__spreadArray)([], defaultSpec.animations || [], true),
                            customParamEditors: defaultSpec.customParamEditors,
                            customFormats: o === null || o === void 0 ? void 0 : o.customFormats,
                            layout: {
                                initial: {
                                    isExpanded: o.layoutIsExpanded,
                                    showControls: o.layoutShowControls,
                                    controlsDisplay: o.layoutControlsDisplay,
                                    regionState: {
                                        bottom: 'full',
                                        left: o.collapseLeftPanel ? 'collapsed' : 'full',
                                        right: o.collapseRightPanel ? 'hidden' : 'full',
                                        top: 'full',
                                    }
                                },
                            },
                            components: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, defaultSpec.components), { controls: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, (_b = defaultSpec.components) === null || _b === void 0 ? void 0 : _b.controls), { top: o.layoutShowSequence ? undefined : 'none', bottom: o.layoutShowLog ? undefined : 'none', left: o.layoutShowLeftPanel ? undefined : 'none' }), remoteState: o.layoutShowRemoteState ? 'default' : 'none' }),
                            config: [
                                [config_1.PluginConfig.General.DisableAntialiasing, o.disableAntialiasing],
                                [config_1.PluginConfig.General.PixelScale, o.pixelScale],
                                [config_1.PluginConfig.General.PickScale, o.pickScale],
                                [config_1.PluginConfig.General.PickPadding, o.pickPadding],
                                [config_1.PluginConfig.General.EnableWboit, o.enableWboit],
                                [config_1.PluginConfig.General.EnableDpoit, o.enableDpoit],
                                [config_1.PluginConfig.General.PreferWebGl1, o.preferWebgl1],
                                [config_1.PluginConfig.General.AllowMajorPerformanceCaveat, o.allowMajorPerformanceCaveat],
                                [config_1.PluginConfig.General.PowerPreference, o.powerPreference],
                                [config_1.PluginConfig.Viewport.ShowExpand, o.viewportShowExpand],
                                [config_1.PluginConfig.Viewport.ShowControls, o.viewportShowControls],
                                [config_1.PluginConfig.Viewport.ShowSettings, o.viewportShowSettings],
                                [config_1.PluginConfig.Viewport.ShowSelectionMode, o.viewportShowSelectionMode],
                                [config_1.PluginConfig.Viewport.ShowAnimation, o.viewportShowAnimation],
                                [config_1.PluginConfig.Viewport.ShowTrajectoryControls, o.viewportShowTrajectoryControls],
                                [config_1.PluginConfig.State.DefaultServer, o.pluginStateServer],
                                [config_1.PluginConfig.State.CurrentServer, o.pluginStateServer],
                                [config_1.PluginConfig.VolumeStreaming.DefaultServer, o.volumeStreamingServer],
                                [config_1.PluginConfig.VolumeStreaming.Enabled, !o.volumeStreamingDisabled],
                                [config_1.PluginConfig.Download.DefaultPdbProvider, o.pdbProvider],
                                [config_1.PluginConfig.Download.DefaultEmdbProvider, o.emdbProvider],
                                [config_1.PluginConfig.Structure.DefaultRepresentationPreset, exports.ViewerAutoPreset.id],
                                [config_1.PluginConfig.Structure.SaccharideCompIdMapType, o.saccharideCompIdMapType],
                                [volumes_and_segmentations_1.VolsegVolumeServerConfig.DefaultServer, o.volumesAndSegmentationsDefaultServer],
                                [behavior_5.RCSBAssemblySymmetryConfig.DefaultServerType, o.rcsbAssemblySymmetryDefaultServerType],
                                [behavior_5.RCSBAssemblySymmetryConfig.DefaultServerUrl, o.rcsbAssemblySymmetryDefaultServerUrl],
                                [behavior_5.RCSBAssemblySymmetryConfig.ApplyColors, o.rcsbAssemblySymmetryApplyColors],
                            ]
                        };
                        element = typeof elementOrId === 'string'
                            ? document.getElementById(elementOrId)
                            : elementOrId;
                        if (!element)
                            throw new Error("Could not get element with id '".concat(elementOrId, "'"));
                        return [4 /*yield*/, (0, react18_1.createPluginUI)(element, spec, {
                                onBeforeUIRender: function (plugin) {
                                    // the preset needs to be added before the UI renders otherwise
                                    // "Download Structure" wont be able to pick it up
                                    plugin.builders.structure.representation.registerPreset(exports.ViewerAutoPreset);
                                }
                            })];
                    case 1:
                        plugin = _d.sent();
                        return [2 /*return*/, new Viewer(plugin)];
                }
            });
        });
    };
    Viewer.prototype.setRemoteSnapshot = function (id) {
        var url = "".concat(this.plugin.config.get(config_1.PluginConfig.State.CurrentServer), "/get/").concat(id);
        return commands_1.PluginCommands.State.Snapshots.Fetch(this.plugin, { url: url });
    };
    Viewer.prototype.loadSnapshotFromUrl = function (url, type) {
        return commands_1.PluginCommands.State.Snapshots.OpenUrl(this.plugin, { url: url, type: type });
    };
    Viewer.prototype.loadStructureFromUrl = function (url, format, isBinary, options) {
        if (format === void 0) {
            format = 'mmcif';
        }
        if (isBinary === void 0) {
            isBinary = false;
        }
        var params = structure_1.DownloadStructure.createDefaultParams(this.plugin.state.data.root.obj, this.plugin);
        return this.plugin.runTask(this.plugin.state.data.applyAction(structure_1.DownloadStructure, {
            source: {
                name: 'url',
                params: {
                    url: assets_1.Asset.Url(url),
                    format: format,
                    isBinary: isBinary,
                    label: options === null || options === void 0 ? void 0 : options.label,
                    options: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, params.source.params.options), { representationParams: options === null || options === void 0 ? void 0 : options.representationParams }),
                }
            }
        }));
    };
    Viewer.prototype.loadAllModelsOrAssemblyFromUrl = function (url, format, isBinary, options) {
        if (format === void 0) {
            format = 'mmcif';
        }
        if (isBinary === void 0) {
            isBinary = false;
        }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var plugin, data, trajectory;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        plugin = this.plugin;
                        return [4 /*yield*/, plugin.builders.data.download({ url: url, isBinary: isBinary }, { state: { isGhost: true } })];
                    case 1:
                        data = _a.sent();
                        return [4 /*yield*/, plugin.builders.structure.parseTrajectory(data, format)];
                    case 2:
                        trajectory = _a.sent();
                        return [4 /*yield*/, this.plugin.builders.structure.hierarchy.applyPreset(trajectory, 'all-models', { useDefaultIfSingleModel: true, representationPresetParams: options === null || options === void 0 ? void 0 : options.representationParams })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Viewer.prototype.loadStructureFromData = function (data, format, options) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _data, trajectory;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.plugin.builders.data.rawData({ data: data, label: options === null || options === void 0 ? void 0 : options.dataLabel })];
                    case 1:
                        _data = _a.sent();
                        return [4 /*yield*/, this.plugin.builders.structure.parseTrajectory(_data, format)];
                    case 2:
                        trajectory = _a.sent();
                        return [4 /*yield*/, this.plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Viewer.prototype.loadPdb = function (pdb, options) {
        var params = structure_1.DownloadStructure.createDefaultParams(this.plugin.state.data.root.obj, this.plugin);
        var provider = this.plugin.config.get(config_1.PluginConfig.Download.DefaultPdbProvider);
        return this.plugin.runTask(this.plugin.state.data.applyAction(structure_1.DownloadStructure, {
            source: {
                name: 'pdb',
                params: {
                    provider: {
                        id: pdb,
                        server: {
                            name: provider,
                            params: structure_1.PdbDownloadProvider[provider].defaultValue
                        }
                    },
                    options: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, params.source.params.options), { representationParams: options === null || options === void 0 ? void 0 : options.representationParams }),
                }
            }
        }));
    };
    Viewer.prototype.loadPdbDev = function (pdbDev) {
        var params = structure_1.DownloadStructure.createDefaultParams(this.plugin.state.data.root.obj, this.plugin);
        return this.plugin.runTask(this.plugin.state.data.applyAction(structure_1.DownloadStructure, {
            source: {
                name: 'pdb-dev',
                params: {
                    provider: {
                        id: pdbDev,
                        encoding: 'bcif',
                    },
                    options: params.source.params.options,
                }
            }
        }));
    };
    Viewer.prototype.loadEmdb = function (emdb, options) {
        var _a;
        var provider = this.plugin.config.get(config_1.PluginConfig.Download.DefaultEmdbProvider);
        return this.plugin.runTask(this.plugin.state.data.applyAction(volume_2.DownloadDensity, {
            source: {
                name: 'pdb-emd-ds',
                params: {
                    provider: {
                        id: emdb,
                        server: provider,
                    },
                    detail: (_a = options === null || options === void 0 ? void 0 : options.detail) !== null && _a !== void 0 ? _a : 3,
                }
            }
        }));
    };
    Viewer.prototype.loadAlphaFoldDb = function (afdb) {
        var params = structure_1.DownloadStructure.createDefaultParams(this.plugin.state.data.root.obj, this.plugin);
        return this.plugin.runTask(this.plugin.state.data.applyAction(structure_1.DownloadStructure, {
            source: {
                name: 'alphafolddb',
                params: {
                    id: afdb,
                    options: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, params.source.params.options), { representation: 'preset-structure-representation-ma-quality-assessment-plddt' }),
                }
            }
        }));
    };
    Viewer.prototype.loadModelArchive = function (id) {
        var params = structure_1.DownloadStructure.createDefaultParams(this.plugin.state.data.root.obj, this.plugin);
        return this.plugin.runTask(this.plugin.state.data.applyAction(structure_1.DownloadStructure, {
            source: {
                name: 'modelarchive',
                params: {
                    id: id,
                    options: params.source.params.options,
                }
            }
        }));
    };
    /**
     * @example Load X-ray density from volume server
        viewer.loadVolumeFromUrl({
            url: 'https://www.ebi.ac.uk/pdbe/densities/x-ray/1tqn/cell?detail=3',
            format: 'dscif',
            isBinary: true
        }, [{
            type: 'relative',
            value: 1.5,
            color: 0x3362B2
        }, {
            type: 'relative',
            value: 3,
            color: 0x33BB33,
            volumeIndex: 1
        }, {
            type: 'relative',
            value: -3,
            color: 0xBB3333,
            volumeIndex: 1
        }], {
            entryId: ['2FO-FC', 'FO-FC'],
            isLazy: true
        });
     * *********************
     * @example Load EM density from volume server
        viewer.loadVolumeFromUrl({
            url: 'https://maps.rcsb.org/em/emd-30210/cell?detail=6',
            format: 'dscif',
            isBinary: true
        }, [{
            type: 'relative',
            value: 1,
            color: 0x3377aa
        }], {
            entryId: 'EMD-30210',
            isLazy: true
        });
     */
    Viewer.prototype.loadVolumeFromUrl = function (_a, isovalues, options) {
        var url = _a.url, format = _a.format, isBinary = _a.isBinary;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var plugin, update;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_b) {
                plugin = this.plugin;
                if (!plugin.dataFormats.get(format)) {
                    throw new Error("Unknown density format: ".concat(format));
                }
                if (options === null || options === void 0 ? void 0 : options.isLazy) {
                    update = this.plugin.build();
                    update.toRoot().apply(transforms_1.StateTransforms.Data.LazyVolume, {
                        url: url,
                        format: format,
                        entryId: options === null || options === void 0 ? void 0 : options.entryId,
                        isBinary: isBinary,
                        isovalues: isovalues.map(function (v) { return ((0, tslib_1.__assign)({ alpha: 1, volumeIndex: 0 }, v)); })
                    });
                    return [2 /*return*/, update.commit()];
                }
                return [2 /*return*/, plugin.dataTransaction(function () {
                        return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                            var data, parsed, firstVolume, repr, _i, isovalues_1, iso, volume, volumeData;
                            var _a, _b, _c, _d;
                            return (0, tslib_1.__generator)(this, function (_e) {
                                switch (_e.label) {
                                    case 0: return [4 /*yield*/, plugin.builders.data.download({ url: url, isBinary: isBinary }, { state: { isGhost: true } })];
                                    case 1:
                                        data = _e.sent();
                                        return [4 /*yield*/, plugin.dataFormats.get(format).parse(plugin, data, { entryId: options === null || options === void 0 ? void 0 : options.entryId })];
                                    case 2:
                                        parsed = _e.sent();
                                        firstVolume = (parsed.volume || parsed.volumes[0]);
                                        if (!(firstVolume === null || firstVolume === void 0 ? void 0 : firstVolume.isOk))
                                            throw new Error('Failed to parse any volume.');
                                        repr = plugin.build();
                                        for (_i = 0, isovalues_1 = isovalues; _i < isovalues_1.length; _i++) {
                                            iso = isovalues_1[_i];
                                            volume = (_c = (_a = parsed.volumes) === null || _a === void 0 ? void 0 : _a[(_b = iso.volumeIndex) !== null && _b !== void 0 ? _b : 0]) !== null && _c !== void 0 ? _c : parsed.volume;
                                            volumeData = volume.cell.obj.data;
                                            repr
                                                .to(volume)
                                                .apply(transforms_1.StateTransforms.Representation.VolumeRepresentation3D, (0, volume_representation_params_1.createVolumeRepresentationParams)(this.plugin, firstVolume.data, {
                                                type: 'isosurface',
                                                typeParams: { alpha: (_d = iso.alpha) !== null && _d !== void 0 ? _d : 1, isoValue: volume_1.Volume.adjustedIsoValue(volumeData, iso.value, iso.type) },
                                                color: 'uniform',
                                                colorParams: { value: iso.color }
                                            }));
                                        }
                                        return [4 /*yield*/, repr.commit()];
                                    case 3:
                                        _e.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    })];
            });
        });
    };
    /**
     * @example
     *  viewer.loadTrajectory({
     *      model: { kind: 'model-url', url: 'villin.gro', format: 'gro' },
     *      coordinates: { kind: 'coordinates-url', url: 'villin.xtc', format: 'xtc', isBinary: true },
     *      preset: 'all-models' // or 'default'
     *  });
     */
    Viewer.prototype.loadTrajectory = function (params) {
        var _a, _b;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var plugin, model, data_1, _c, trajectory_1, data_2, _d, provider_1, data, _e, provider, coords, trajectory, preset;
            return (0, tslib_1.__generator)(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        plugin = this.plugin;
                        if (!(params.model.kind === 'model-data' || params.model.kind === 'model-url'))
                            return [3 /*break*/, 7];
                        if (!(params.model.kind === 'model-data'))
                            return [3 /*break*/, 2];
                        return [4 /*yield*/, plugin.builders.data.rawData({ data: params.model.data, label: params.modelLabel })];
                    case 1:
                        _c = _f.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, plugin.builders.data.download({ url: params.model.url, isBinary: params.model.isBinary, label: params.modelLabel })];
                    case 3:
                        _c = _f.sent();
                        _f.label = 4;
                    case 4:
                        data_1 = _c;
                        return [4 /*yield*/, plugin.builders.structure.parseTrajectory(data_1, (_a = params.model.format) !== null && _a !== void 0 ? _a : 'mmcif')];
                    case 5:
                        trajectory_1 = _f.sent();
                        return [4 /*yield*/, plugin.builders.structure.createModel(trajectory_1)];
                    case 6:
                        model = _f.sent();
                        return [3 /*break*/, 13];
                    case 7:
                        if (!(params.model.kind === 'topology-data'))
                            return [3 /*break*/, 9];
                        return [4 /*yield*/, plugin.builders.data.rawData({ data: params.model.data, label: params.modelLabel })];
                    case 8:
                        _d = _f.sent();
                        return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, plugin.builders.data.download({ url: params.model.url, isBinary: params.model.isBinary, label: params.modelLabel })];
                    case 10:
                        _d = _f.sent();
                        _f.label = 11;
                    case 11:
                        data_2 = _d;
                        provider_1 = plugin.dataFormats.get(params.model.format);
                        return [4 /*yield*/, provider_1.parse(plugin, data_2)];
                    case 12:
                        model = _f.sent();
                        _f.label = 13;
                    case 13:
                        if (!(params.coordinates.kind === 'coordinates-data'))
                            return [3 /*break*/, 15];
                        return [4 /*yield*/, plugin.builders.data.rawData({ data: params.coordinates.data, label: params.coordinatesLabel })];
                    case 14:
                        _e = _f.sent();
                        return [3 /*break*/, 17];
                    case 15: return [4 /*yield*/, plugin.builders.data.download({ url: params.coordinates.url, isBinary: params.coordinates.isBinary, label: params.coordinatesLabel })];
                    case 16:
                        _e = _f.sent();
                        _f.label = 17;
                    case 17:
                        data = _e;
                        provider = plugin.dataFormats.get(params.coordinates.format);
                        return [4 /*yield*/, provider.parse(plugin, data)];
                    case 18:
                        coords = _f.sent();
                        return [4 /*yield*/, plugin.build().toRoot()
                                .apply(model_1.TrajectoryFromModelAndCoordinates, {
                                modelRef: model.ref,
                                coordinatesRef: coords.ref
                            }, { dependsOn: [model.ref, coords.ref] })
                                .commit()];
                    case 19:
                        trajectory = _f.sent();
                        return [4 /*yield*/, plugin.builders.structure.hierarchy.applyPreset(trajectory, (_b = params.preset) !== null && _b !== void 0 ? _b : 'default')];
                    case 20:
                        preset = _f.sent();
                        return [2 /*return*/, { model: model, coords: coords, preset: preset }];
                }
            });
        });
    };
    Viewer.prototype.handleResize = function () {
        this.plugin.layout.events.updated.next(void 0);
    };
    return Viewer;
}());
exports.Viewer = Viewer;
exports.ViewerAutoPreset = (0, representation_preset_1.StructureRepresentationPresetProvider)({
    id: 'preset-structure-representation-viewer-auto',
    display: {
        name: 'Automatic (w/ Annotation)', group: 'Annotation',
        description: 'Show standard automatic representation but colored by quality assessment (if available in the model).'
    },
    isApplicable: function (a) {
        return (!!a.data.models.some(function (m) { return prop_1.QualityAssessment.isApplicable(m, 'pLDDT'); }) ||
            !!a.data.models.some(function (m) { return prop_1.QualityAssessment.isApplicable(m, 'qmean'); }));
    },
    params: function () { return representation_preset_1.StructureRepresentationPresetProvider.CommonParams; },
    apply: function (ref, params, plugin) {
        var _a;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var structureCell, structure;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        structureCell = mol_state_1.StateObjectRef.resolveAndCheck(plugin.state.data, ref);
                        structure = (_a = structureCell === null || structureCell === void 0 ? void 0 : structureCell.obj) === null || _a === void 0 ? void 0 : _a.data;
                        if (!structureCell || !structure)
                            return [2 /*return*/, {}];
                        if (!!!structure.models.some(function (m) { return prop_1.QualityAssessment.isApplicable(m, 'pLDDT'); }))
                            return [3 /*break*/, 2];
                        return [4 /*yield*/, behavior_3.QualityAssessmentPLDDTPreset.apply(ref, params, plugin)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        if (!!!structure.models.some(function (m) { return prop_1.QualityAssessment.isApplicable(m, 'qmean'); }))
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, behavior_3.QualityAssessmentQmeanPreset.apply(ref, params, plugin)];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4:
                        if (!!!structure.models.some(function (m) { return sb_ncbr_1.SbNcbrPartialChargesPropertyProvider.isApplicable(m); }))
                            return [3 /*break*/, 6];
                        return [4 /*yield*/, sb_ncbr_1.SbNcbrPartialChargesPreset.apply(ref, params, plugin)];
                    case 5: return [2 /*return*/, _b.sent()];
                    case 6: return [4 /*yield*/, representation_preset_1.PresetStructureRepresentations.auto.apply(ref, params, plugin)];
                    case 7: return [2 /*return*/, _b.sent()];
                }
            });
        });
    }
});
exports.PluginExtensions = {
    wwPDBStructConn: struct_conn_1.wwPDBStructConnExtensionFunctions,
};
