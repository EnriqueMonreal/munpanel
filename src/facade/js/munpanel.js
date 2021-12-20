/**
 * @module M/plugin/Munpanel
 */
import 'assets/css/munpanel';
import MunpanelControl from './munpanelcontrol';
import api from '../../api.json';

export default class Munpanel extends M.Plugin {
  /**
   * @classdesc
   * Main facade plugin object. This class creates a plugin
   * object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @param {Object} impl implementation object
   * @api stable
   */
  constructor(config) {
    super();
    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map_ = null;
    this.config = config;
    

    /**
     * Array of controls
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;
  }

  /**
   * This function adds this plugin into the map
   *
   * @public
   * @function
   * @param {M.Map} map the map to add the plugin
   * @api stable
   */
  addTo(map) {
    this.controls_.push(new MunpanelControl(this.config));
    this.controls_.push(this.control_);
    this.map_ = map;
    
    // panel para agregar control - no obligatorio
    this.panel_ = new M.ui.Panel('panelMunpanel', {
      collapsible: true,
      className: 'm-munpanel',
      position: M.ui.position.TR,
      collapsedButtonClass: 'g-cartografia-prismaticos',
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_); 

  
    
    //añade panel leyenda

    var panelLeyend = new M.ui.Panel('legend', {
      "collapsible": true,      
      "className": 'm-leyenda',
      "collapsedButtonClass": 'g-cartografia-capas2',
      "position": M.ui.position.TR
    });
    
    map.addPanels([panelLeyend]);
  }

  /**
   * This function gets metadata plugin
   *
   * @public
   * @function
   * @api stable
   */
  getMetadata(){
    return this.metadata_;
  }
}
