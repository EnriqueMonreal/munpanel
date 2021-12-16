/* eslint-disable no-console */

/**
 * @module M/control/MunpanelControl
 */


import MunpanelImplControl from 'impl/munpanelcontrol';
import template from 'templates/munpanel';

export default class MunpanelControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(config) {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(MunpanelImplControl)) {
      M.exception('La implementación usada no puede crear controles MunpanelControl');
    }
    // 2. implementation of this control
    const impl = new MunpanelImplControl();
    super(impl, 'Munpanel');
    this.config = config;


    //



  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  createView(map) {

    return new Promise((success, fail) => {
      const html = M.template.compileSync(template);
      // Añadir código dependiente del DOM      

      this.addEvents(html);
      success(html);

    });


  }

  addEvents(html) {

    const selectorProvincia = html.querySelectorAll('select#selectProvincias')[0];
    const selectorMunicipio = html.querySelectorAll('select#selectMunicipios')[0];
    const buscadorMunicipio = html.querySelectorAll('form#buscaMunicipio')[0];
    const botonBuscaMunicipio = html.querySelectorAll('button#botonBusca')[0];
    const botonLimpiaMunicipio = html.querySelectorAll('button#botonLimpia')[0];
    const botonAtras = html.querySelectorAll('button#botonAtras')[0];
    const botonAvance = html.querySelectorAll('button#botonAvance')[0];
    const tablaResultados = html.querySelectorAll('table#TablaResultados')[0];
    const selectorYear = html.querySelectorAll('select#selectPoblacion')[0];
    const selectorRegimen = html.querySelectorAll('select#selectRegimenAfiliacion')[0];
    const selectorSexo = html.querySelectorAll('select#selectSexoAfiliacion')[0];
    const selectorSuperavit = html.querySelectorAll('input#checkSuperavit')[0];
    const selectorRepresentacion = html.querySelectorAll('select#selectRepresentacion')[0];



    this.map_.on(M.evt.COMPLETED, () => {

      document.querySelectorAll('div.m-panel.m-leyenda>div.m-panel-controls')[0].innerHTML = "<div id='leyenda-title'></div><div class='leyenda'></div>";

      document.querySelectorAll('div.m-panel.m-leyenda>div.m-panel-controls>div#leyenda-title')[0].innerHTML = 'Municipios por Provincias';

      document.querySelectorAll('div.m-panel.m-leyenda>div.m-panel-controls>div.leyenda')[0].innerHTML = '<img src="../../../leyendas/provincias.png" alt="Leyenda Provincias" title ="Leyenda Provincias" >';

     

      selectorProvincia.addEventListener('change', () => {
        const Provi = selectorProvincia.value;
        this.limpia();
        this.muestraProvincia(Provi);

      });

      selectorMunicipio.addEventListener('change', () => {
        const Provi = selectorProvincia.value;
        const Munic = selectorMunicipio.value;
        this.seleccionaMunicipio(Provi, Munic);
      });

      selectorRepresentacion.addEventListener('change', () => {

        if (this.config.selectedFeature != '') {
          this.map_.getFeatureHandler().unselectFeatures([this.config.selectedFeature], this.config.selectedProv, {});
        }

        if (this.map_.getPopup()) {
          this.map_.removePopup();
        }

        if (selectorRepresentacion.value == 'Provincias') {


          this.config.stAnterior = false;   // INICIALIZAMOS VALORES
          this.config.munAnterior = false;

          this.config.status.stPoblacion = false;
          this.config.status.stSuperavit = false;
          this.config.status.stSegsocial = false;
          this.config.status.opcPoblacion = false;
          this.config.status.opcSuperavit = false;
          this.config.status.opcSegsocial = false;

          for (let i = 0; i < this.config.layerList.length; i++) {
            this.config.layerList[i].setStyle(this.config.styleList[i]);
          }


          document.querySelectorAll('div.m-panel.m-leyenda>div.m-panel-controls')[0].innerHTML = "<div id='leyenda-title'></div><div class='leyenda'></div>";

          document.querySelectorAll('div.m-panel.m-leyenda>div.m-panel-controls>div#leyenda-title')[0].innerHTML = 'Municipios por Provincias';

          document.querySelectorAll('div.m-panel.m-leyenda>div.m-panel-controls>div.leyenda')[0].innerHTML = '<img src="../../../leyendas/provincias.png" alt="Leyenda Provincias" title ="Leyenda Provincias" >';


        }

        if (selectorRepresentacion.value == 'Poblacion') {
          if (selectorYear.value == '') {
            selectorYear.item(1).selected = 'selected';
          }


          this.config.stAnterior = false;   // INICIALIZAMOS VALORES
          this.config.munAnterior = false;

          this.config.pobYear = selectorYear.value;

          this.config.status.stPoblacion = false;
          this.config.status.stSuperavit = false;
          this.config.status.stSegsocial = false;
          this.config.status.opcPoblacion = true;
          this.config.status.opcSuperavit = false;
          this.config.status.opcSegsocial = false;



          if (this.config.status.PoblacionJson == '') {
            document.getElementById('controlCarga').style.display = 'block';
            selectorSexo.style.marginBottom = '0px';
            this.consultaPoblacion(this.config.pobYear);
          } else {
            let t = 0;
            for (let i = 0; i < this.config.status.PoblacionJson.data.length; i++) {

              if (this.config.status.PoblacionJson.data[i][1].des == this.config.pobYear) {
                this.config.listPoblacion[2 * t] = this.config.status.PoblacionJson.data[i][0].des;
                this.config.listPoblacion[2 * t + 1] = this.config.status.PoblacionJson.data[i][3].format;
                t = t + 1;
              }
            }

            this.config.listPoblacion = this.normalizaMunicipio(this.config.listPoblacion);
            if (document.getElementById('selectRepresentacion').value == 'Poblacion') {
              this.representaPoblacion();
            }
            this.config.status.stPoblacion = true;

          }
        }

        if (selectorRepresentacion.value == 'Deficit_Superavit') {
          selectorSuperavit.checked = true;


          this.config.stAnterior = false;   // INICIALIZAMOS VALORES
          this.config.munAnterior = false;

          this.config.status.stPoblacion = false;
          this.config.status.stSuperavit = false;
          this.config.status.stSegsocial = false;
          this.config.status.opcPoblacion = false;
          this.config.status.opcSuperavit = true;
          this.config.status.opcSegsocial = false;



          if (this.config.status.SuperavitJson == '') {
            document.getElementById('controlCarga').style.display = 'block';
            selectorSexo.style.marginBottom = '0px';
            this.consultaSuperavit();
          } else {

            for (let i = 0; i < this.config.status.SuperavitJson.data.length; i++) {
              this.config.listSuperavit[2 * i] = this.config.status.SuperavitJson.data[i][0].des;
              this.config.listSuperavit[2 * i + 1] = parseFloat(this.config.status.SuperavitJson.data[i][2].val).toFixed(2);
            }
            this.config.listSuperavit = this.normalizaMunicipio(this.config.listSuperavit);
            if (document.getElementById('selectRepresentacion').value == 'Deficit_Superavit') {
              this.representaSuperavit();
            }
          }

        }

        if (selectorRepresentacion.value == 'Afiliacion') {
          if (selectorRegimen.value == '') {
            selectorRegimen.item(1).selected = 'selected';
          }
          if (selectorSexo.value == '') {
            selectorSexo.item(1).selected = 'selected';
          }

          this.config.stAnterior = false;   // INICIALIZAMOS VALORES
          this.config.munAnterior = false;

          this.config.ssRegimen = selectorRegimen.value;
          this.config.ssSexo = selectorSexo.value;
          this.config.status.stPoblacion = false;
          this.config.status.stSuperavit = false;
          this.config.status.stSegsocial = false;
          this.config.status.opcPoblacion = false;
          this.config.status.opcSuperavit = false;
          this.config.status.opcSegsocial = true;

          if (this.config.status.SegsocialJson == '') {
            document.getElementById('controlCarga').style.display = 'block';
            selectorSexo.style.marginBottom = '0px';

            this.consultaSegSocial(this.config.ssRegimen, this.config.ssSexo);
          } else {
            let t = 0;

            this.config.ssYear = this.config.status.SegsocialJson.data[0][3].des;

            document.getElementById('tituloSS').innerHTML = 'Afiliación Seg. Social ' + this.config.ssYear;



            if (this.config.ssSexo != 'Ambos sexos disgregados') {
              for (let i = 0; i < this.config.status.SegsocialJson.data.length; i++) {
                if ((this.config.status.SegsocialJson.data[i][1].des == this.config.ssRegimen) && (this.config.status.SegsocialJson.data[i][2].des == this.config.ssSexo)) {
                  this.config.listSegsocial[2 * t] = this.config.status.SegsocialJson.data[i][0].des;
                  if ((this.config.status.SegsocialJson.data[i][4].format != '*') && (this.config.status.SegsocialJson.data[i][4].format != '')) {
                    this.config.listSegsocial[2 * t + 1] = this.config.status.SegsocialJson.data[i][4].format;
                  }
                  if (this.config.status.SegsocialJson.data[i][4].format == '*') {
                    this.config.listSegsocial[2 * t + 1] = '< 5'
                  }
                  if (this.config.status.SegsocialJson.data[i][4].format == '') {
                    this.config.listSegsocial[2 * t + 1] = '---';
                  }
                  t = t + 1;
                }
              }
            }

            if (this.config.ssSexo == 'Ambos sexos disgregados') {
              t = 0;

              for (let i = 0; i < this.config.status.SegsocialJson.data.length; i++) {

                if ((this.config.status.SegsocialJson.data[i][1].des == this.config.ssRegimen) && (this.config.status.SegsocialJson.data[i][2].des == 'Hombres')) {
                  this.config.listSegsocial[t] = this.config.status.SegsocialJson.data[i][0].des; // municipio
                  t = t + 1;

                  this.config.listSegsocial[t] = this.config.status.SegsocialJson.data[i][4].format;  //hombres
                  if (this.config.listSegsocial[t] == '*') { this.config.listSegsocial[t] = '< 5' }
                  if (this.config.listSegsocial[t] == '') { this.config.listSegsocial[t] = '---' }
                  t = t + 1;

                  this.config.listSegsocial[t] = this.config.status.SegsocialJson.data[i + 1][4].format;   //mujeres
                  if (this.config.listSegsocial[t] == '*') { this.config.listSegsocial[t] = '< 5' }
                  if (this.config.listSegsocial[t] == '') { this.config.listSegsocial[t] = '---' }
                  t = t + 1;

                  this.config.listSegsocial[t] = this.config.status.SegsocialJson.data[i + 2][4].format;   //ambos
                  if (this.config.listSegsocial[t] == '*') { this.config.listSegsocial[t] = '< 5' }
                  if (this.config.listSegsocial[t] == '') { this.config.listSegsocial[t] = '---' }
                  t = t + 1;

                }
              }

            }
            this.config.listSegsocial = this.normalizaMunicipio(this.config.listSegsocial);
            if (document.getElementById('selectRepresentacion').value == 'Afiliacion') {
              this.representaSegSocial();
            }

          }

        }

      });

      selectorYear.addEventListener('change', () => {
        if (this.config.selectedFeature != '') {
          this.map_.getFeatureHandler().unselectFeatures([this.config.selectedFeature], this.config.selectedProv, {});
        }

        if (this.map_.getPopup()) {
          this.map_.removePopup();
        }

        selectorMunicipio.item(0).selected = 'selected';

        if (this.config.munAnterior != false) {
          this.config.munAnterior.setStyle(this.config.stAnterior);
        }


        selectorSexo.style.marginBottom = '0px';

        this.config.stAnterior = false;   // INICIALIZAMOS VALORES
        this.config.munAnterior = false;
        selectorMunicipio.item(0).selected = 'selected';


        if (selectorYear.value != '') {
          this.config.status.opcPoblacion = false;
          document.getElementById('controlCarga').style.display = 'block';
          this.config.pobYear = selectorYear.value;

          this.consultaPoblacion(this.config.pobYear);


        } else {
          this.config.status.opcPoblacion = true;
          document.getElementById('selectSexoAfiliacion').style.marginBottom = '27px';
          this.config.pobYear = selectorYear.value;

        }

      });

      selectorRegimen.addEventListener('change', () => {
        if (this.config.selectedFeature != '') {
          this.map_.getFeatureHandler().unselectFeatures([this.config.selectedFeature], this.config.selectedProv, {});
        }

        if (this.map_.getPopup()) {
          this.map_.removePopup();
        }

        selectorMunicipio.item(0).selected = 'selected';

        if (this.config.munAnterior != false) {
          this.config.munAnterior.setStyle(this.config.stAnterior);
        }





        if (selectorRegimen.value != '') {
          selectorSexo.style.marginBottom = '0px';
          document.getElementById('controlCarga').style.display = 'block';
          if (selectorSexo.value == '') {
            selectorSexo.item(1).selected = 'selected';
          }
        } else {
          selectorSexo.item(0).selected = 'selected';
        }

        if ((selectorRegimen.value != '') && (selectorSexo.value != '')) {
          this.config.status.opcSegsocial = 'false';
        } else {
          this.config.status.opcSegsocial = 'true';
        }
        this.config.ssRegimen = selectorRegimen.value;
        this.config.ssSexo = selectorSexo.value;
        this.config.listSegsocial = [];


        this.consultaSegSocial(this.config.ssRegimen, this.config.ssSexo);


      });

      selectorSexo.addEventListener('change', () => {

        if (this.config.selectedFeature != '') {
          this.map_.getFeatureHandler().unselectFeatures([this.config.selectedFeature], this.config.selectedProv, {});
        }

        if (this.map_.getPopup()) {
          this.map_.removePopup();
        }

        selectorMunicipio.item(0).selected = 'selected';

        if (this.config.munAnterior != false) {
          this.config.munAnterior.setStyle(this.config.stAnterior);
        }





        if (selectorSexo.value != '') {
          selectorSexo.style.marginBottom = '0px';
          document.getElementById('controlCarga').style.display = 'block';
          if (selectorRegimen.value == '') {
            selectorRegimen.item(1).selected = 'selected';
          }
        } else {
          selectorRegimen.item(0).selected = 'selected';
        }

        if ((selectorRegimen.value != '') && (selectorSexo.value != '')) {
          this.config.status.opcSegsocial = 'false';
        } else {
          this.config.status.opcSegsocial = 'true';
        }

        this.config.ssRegimen = selectorRegimen.value;
        this.config.ssSexo = selectorSexo.value;
        this.config.listSegsocial = [];


        this.consultaSegSocial(this.config.ssRegimen, this.config.ssSexo);

      });

      selectorSuperavit.addEventListener('change', () => {
        if (this.config.selectedFeature != '') {
          this.map_.getFeatureHandler().unselectFeatures([this.config.selectedFeature], this.config.selectedProv, {});
        }

        if (this.map_.getPopup()) {
          this.map_.removePopup();
        }

        selectorMunicipio.item(0).selected = 'selected';

        if (this.config.munAnterior != false) {
          this.config.munAnterior.setStyle(this.config.stAnterior);
        }




        if (selectorSuperavit.checked) {
          if (this.config.status.SuperavitJson == '') {
            selectorSexo.style.marginBottom = '0px';
            document.getElementById('controlCarga').style.display = 'block';
            this.config.status.opcSuperavit = true;

            this.consultaSuperavit();
          } else {

            for (let i = 0; i < this.config.status.SuperavitJson.data.length; i++) {
              this.config.listSuperavit[2 * i] = this.config.status.SuperavitJson.data[i][0].des;
              this.config.listSuperavit[2 * i + 1] = parseFloat(this.config.status.SuperavitJson.data[i][2].val).toFixed(2);
            }
            this.config.listSuperavit = this.normalizaMunicipio(this.config.listSuperavit);
            if (document.getElementById('selectRepresentacion').value == 'Deficit_Superavit') {
              this.representaSuperavit();
            }
          }

        } else {
          this.config.status.opcSuperavit = false;
        }

      });

      buscadorMunicipio.addEventListener('keydown', (e) => {
        this.muestraBotones();
        if (e.keyCode === 13) {  //chequea que la tecla presionada es "Enter"
          document.getElementById('botonBusca').focus();
        }

      });

      botonBuscaMunicipio.addEventListener('click', () => {
        this.listaMunicipios();
      });
      botonLimpiaMunicipio.addEventListener('click', () => {
        this.limpia();
      });

      botonAtras.addEventListener('click', () => {
        this.retrocedeTabla();
      });

      botonAvance.addEventListener('click', () => {
        this.avanzaTabla();
      });

      tablaResultados.addEventListener('click', (ev) => {
        let index = ev.target.parentElement.rowIndex;



        let m = document.getElementById('TablaResultados').rows[index].cells[0].innerText;
        let p = document.getElementById('TablaResultados').rows[index].cells[1].innerText;
        this.muestraProvincia(p);
        this.buscaMunicipio(m, p);

      });

       this.map_.getPanels('legend')[0].on(M.evt.SHOW,()=>{
         if(this.map_.getPanels('panelMunpanel')[0]._collapsed==false){
           this.map_.getPanels('panelMunpanel')[0].collapse();
         }

       });

       this.map_.getPanels('panelMunpanel')[0].on(M.evt.SHOW,()=>{
        if(this.map_.getPanels('legend')[0]._collapsed==false){
          this.map_.getPanels('legend')[0].collapse();
        }

      });

      for (let i = 0; i < this.config.layerList.length; i++) {
        this.config.layerList[i].on(M.evt.SELECT_FEATURES, (features) => {
          if (features[0] instanceof M.ClusteredFeature) {
            return;
          }


          if (this.config.munAnterior != false) {
            this.config.munAnterior.setStyle(this.config.stAnterior);
          }
          this.config.selectedFeature = features[0];
          this.config.selectedProv = this.config.layerList[i];
          this.config.munAnterior = this.config.selectedFeature;
          this.config.stAnterior = this.config.munAnterior.getStyle();

          document.getElementById('paginado').style.display = 'none';

          this.borraTablas();
          this.config.pag = 0;
          this.config.reg = 0;
          this.config.result = [];
          document.getElementById('busMuni').value = '';
          document.getElementById('divBotones').style.display = 'none';
          document.getElementById('resultadosBusqueda').style.display = 'none';
          document.getElementById('controlTablas').style.display = 'none';
          document.getElementById('resulBus').innerHTML = '';
          document.getElementById('selectMunicipios').options.item(0).selected = 'selected';

          this.config.provinciaSeleccionada = this.quitaAcentos(features[0].getAttribute('provincia'));
          this.config.munSelect = features[0].getAttribute('nombre');
          this.seleccionaMunicipio(this.config.provinciaSeleccionada, this.config.munSelect);
          if (document.querySelectorAll('select#selectProvincias')[0].value == 'Select') {
            document.querySelectorAll('select#selectProvincias')[0].value = 'Todas';
            this.creaSelect('Todas');
            this.cambiaSelect(this.config.munSelect);
          }

        });
      }

    });
  }

  /**
   * This function is called on the control activation
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    // calls super to manage de/activation
    super.activate();

  }
  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    // calls super to manage de/activation
    super.deactivate();

  }
  /**
   * This function gets activation button
   *
   * @public
   * @function
   * @param {HTML} html of control
   * @api stable
   */
  getActivationButton(html) {
    return html.querySelector('.m-munpanel button');
  }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api stable
   */
  equals(control) {
    return control instanceof MunpanelControl;
  }

  // Add your own functions
  muestraProvincia(option) {

    if (this.map_.getPopup()) {
      this.map_.removePopup();
    }

    
    let layer= this.map_.getLayers();
    for(let i=0; i< layer.length;i++){
      
      if((layer[i].zindex_>10000)&&(layer[i].zindex_<10990)){
       
        this.map_.removeLayers(layer[i]);
      }
    }

    console.log(this.map_.getLayers());
    


    for (let i = 0; i < document.getElementById('selectProvincias').options.length; i++) {

      if (document.getElementById('selectProvincias').options[i].value == option) {
        this.config.provinciaSeleccionada = document.getElementById('selectProvincias').options[i].value;
        document.getElementById('selectProvincias').options[i].selected = 'selected';
        this.creaSelect(option);
      }
    }

    for (let i = 0; i < this.config.layerList.length; i++) {
      this.config.layerList[i].getImpl().displayInLayerSwitcher = false;
      if (option != 'Todas') {
        if (this.config.layerList[i].getImpl().name == option) {
          this.config.layerList[i].getImpl().displayInLayerSwitcher = true;
          this.map_.addLayers(this.config.layerList[i]);
          this.map_.setBbox(this.config.layerList[i].getMaxExtent());
        }
      } else {
        for (let t = 0; t < this.config.layerList.length; t++) {
          this.config.layerList[i].getImpl().displayInLayerSwitcher = true;
          this.map_.addLayers(this.config.layerList[i]);
          this.map_.setBbox(this.map_.getMaxExtent());
        }

      }
    }
    if (document.getElementById('selectRepresentacion').value == 'Poblacion') {
      this.representaPoblacion();
    }

    if (document.getElementById('selectRepresentacion').value == 'Deficit_Superavit') {
      this.representaSuperavit();
    }
    if (document.getElementById('selectRepresentacion').value == 'Afiliacion') {
      this.representaSegSocial();
    }

  }

  creaSelect(provincia) {

    let numMunicipios = document.querySelectorAll('.opMunicipios');
    let numProvincias = document.querySelectorAll('.opMunicipiosProv');
    let select = document.getElementById('selectMunicipios');
    let entrada = document.createElement('option');
    let entradaTexto = document.createTextNode('Selecciona un municipio');


    for (let i = 0; i < numMunicipios.length; i++) {
      select.removeChild(numMunicipios[i]);
    }
    for (let i = 0; i < numProvincias.length; i++) {
      select.removeChild(numProvincias[i]);
    }
    entrada = document.createElement('option');
    entrada.setAttribute('value', 'Select');
    entrada.setAttribute('class', 'opMunicipios');
    entrada.setAttribute('disabled', 'disabled');
    entrada.setAttribute('selected', 'selected');
    entradaTexto = document.createTextNode('Selecciona un municipio');
    entrada.appendChild(entradaTexto);
    select.appendChild(entrada);
    if (provincia != 'Todas') {
      for (let i = 0; i < this.config.layerList.length; i++) {
        if (provincia == this.config.layerList[i].getImpl().name) {
          for (let t = 0; t < this.config.layerList[i].getFeatures().length; t++) {
            entrada = document.createElement('option');
            entrada.setAttribute('value', this.config.layerList[i].getFeatures()[t].impl_.olFeature_.values_.nombre);
            entrada.setAttribute('class', 'opMunicipios');
            entradaTexto = document.createTextNode(this.config.layerList[i].getFeatures()[t].impl_.olFeature_.values_.nombre);
            entrada.appendChild(entradaTexto);
            select.appendChild(entrada);

          }
        }
      }
    } else {
      for (let i = 0; i < this.config.layerList.length; i++) {
        entrada = document.createElement('option');
        entrada.setAttribute('value', this.config.layerList[i].getImpl().name);
        entrada.setAttribute('class', 'opMunicipiosProv');
        entrada.setAttribute('disabled', 'disabled');
        entradaTexto = document.createTextNode('          ------' + this.config.layerList[i].getImpl().name.toUpperCase() + '------');
        entrada.appendChild(entradaTexto);
        select.appendChild(entrada);
        for (let t = 0; t < this.config.layerList[i].getFeatures().length; t++) {
          entrada = document.createElement('option');
          entrada.setAttribute('value', this.config.layerList[i].getFeatures()[t].impl_.olFeature_.values_.nombre);
          entrada.setAttribute('class', 'opMunicipios');
          entradaTexto = document.createTextNode(this.config.layerList[i].getFeatures()[t].impl_.olFeature_.values_.nombre);
          entrada.appendChild(entradaTexto);
          select.appendChild(entrada);
        }
      }
    }

    select.value = 'Select';
  }
  seleccionaMunicipio(Provi, Munic) {

    if (this.map_.getPopup()) {
      this.map_.removePopup();
    }
    let go = true;

    if (this.config.status.opcPoblacion) {
      if (!this.config.status.stPoblacion) {
        go = false;
      }
    }
    if (this.config.status.opcSuperavit) {
      if (!this.config.status.stSuperavit) {
        go = false;
      }
    }
    if (this.config.status.opcSegsocial) {
      if (!this.config.status.stSegsocial) {
        go = false;
      }
    }


    if (go) {

      this.buscaMunicipio(Munic, Provi);
    }
  }

  buscaMunicipio(mun, prov) {
    let muni;
    let encontrado = false;

    for (let i = 0; i < this.config.listPoblacion.length; i++) {
      if (this.config.listPoblacion[i] == mun) {
        this.config.pobSelect = this.config.listPoblacion[i + 1] + ' hab.';
        encontrado = true;
      }
    }
    if ((encontrado == false) || (this.config.pobSelect.length < 6)) {
      this.config.pobSelect = '---';
    }

    encontrado = false;

    for (let i = 0; i < this.config.listSuperavit.length; i++) {
      if (this.config.listSuperavit[i] == mun) {
        this.config.superavit = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(this.config.listSuperavit[i + 1]);
        encontrado = true;
      }
    }
    if ((encontrado == false) || (this.config.superavit.length < 3)) {
      this.config.superavit = '---';
    }

    encontrado = false;
    if (this.config.ssSexo == 'Hombres') {
      for (let i = 0; i < this.config.listSegsocial.length; i++) {
        if (this.config.listSegsocial[i] == mun) {
          this.config.ssHombres = this.config.listSegsocial[i + 1];
          encontrado = true;
        }
      }
      if (encontrado == false) {
        this.config.ssHombres = '---';
      }
    }
    if (this.config.ssSexo == 'Mujeres') {
      for (let i = 0; i < this.config.listSegsocial.length; i++) {
        if (this.config.listSegsocial[i] == mun) {
          this.config.ssMujeres = this.config.listSegsocial[i + 1];
          encontrado = true;
        }
      }
      if (encontrado == false) {
        this.config.ssMujeres = '---';
      }
    }
    if (this.config.ssSexo == 'Ambos sexos') {
      for (let i = 0; i < this.config.listSegsocial.length; i++) {
        if (this.config.listSegsocial[i] == mun) {
          this.config.ssAmbos = this.config.listSegsocial[i + 1];
          encontrado = true;
        }
      }
      if (encontrado == false) {
        this.config.ssAmbos = '---';
      }
    }
    if (this.config.ssSexo == 'Ambos sexos disgregados') {
      for (let i = 0; i < this.config.listSegsocial.length; i++) {
        if (this.config.listSegsocial[i] == mun) {
          this.config.ssHombres = this.config.listSegsocial[i + 1];
          this.config.ssMujeres = this.config.listSegsocial[i + 2];
          this.config.ssAmbos = this.config.listSegsocial[i + 3];
          encontrado = true;
        }
      }
      if (encontrado == false) {
        this.config.ssHombres = '---';
        this.config.ssMujeres = '---';
        this.config.ssAmbos = '---';
      }
    }


    for (let i = 0; i < this.config.layerList.length; i++) {

      if ((this.config.layerList[i].getImpl().name == prov) || (prov == 'Todas')) {
        for (let t = 0; t < this.config.layerList[i].getFeatures().length; t++) {
          if (this.config.layerList[i].getFeatures()[t].getImpl().getAttribute('nombre') == mun) {
            muni = this.config.layerList[i].getFeatures()[t];
            this.config.munSelect = mun;
            if (this.config.munAnterior != false) {
              this.config.munAnterior.setStyle(this.config.stAnterior);
            }
            this.config.selectedFeature = muni;
            this.config.selectedProv = this.config.layerList[i];

            this.config.munAnterior = muni;
            this.config.stAnterior = muni.getStyle();

            muni.setStyle(new M.style.Polygon({
              fill: {
                color: '#8d8d8d',
                opacity: 0.5,
              },
              stroke: {
                color: '#ff0000',
                width: 3
              }
            }));

            let param_mun = this.createPopupFeature(this.centroide(muni));

            param_mun[2].addTab(this.popupTabContent(prov, muni));
            this.addPopupFeature(param_mun[2], param_mun[0], param_mun[1]);
            this.map_.setCenter({ x: this.centroide(muni)[0], y: this.centroide(muni)[1], draw: false });

            this.cambiaSelect(mun);
          }
        }
      }
    }

  }

  createPopupFeature(posicion) {

    var zoom = this.map_.getZoom();
    var popup = new M.Popup();




    return [posicion, zoom, popup];
  }

  addPopupFeature(popup, posicion, zoom) {
    this.map_.addPopup(popup, posicion);
    this.map_.setZoom(zoom);
    var popup_rec = document.querySelectorAll('div.m-content')[0];
    popup_rec.className = 'pop_feat';

    document.querySelectorAll('a.m-popup-closer')[0].addEventListener('click', () => {
      this.config.munAnterior.setStyle(this.config.stAnterior);
      document.querySelectorAll('select#selectMunicipios')[0].value = 'Select';
      this.map_.getFeatureHandler().unselectFeatures([this.config.selectedFeature], this.config.selectedProv, {});
      this.config.selectedFeature = '';
      this.config.selectedProv = '';
    });
  }

  popupTabContent(layerName, feature) {
    var featureTabOpts = null;
    let nombre = feature.getAttribute('nombre');
    let cod_mun = feature.getAttribute('cod_mun');
    let superficie = this.superficieMunicipio(feature)[0];
    let perimetro = this.superficieMunicipio(feature)[1];
    let densidad = '---';
    let ss = '';
    let pob = '';
    let superavit = '';
    if (this.config.pobSelect != '---') {
      densidad = (parseFloat(this.config.pobSelect) / superficie).toFixed(2);

      densidad = densidad.replace('.', ',') + ' hab./Km²';
    }

    if (this.config.ssSexo == 'Hombres') {
      ss = '<table class="list_feat"><caption>Afiliación Seg. Social ' + this.config.ssYear + '</caption><tr><th colspan="2">' + this.config.ssRegimen.replace("*", "") + '</th></tr><tr><th>Hombres</th><td>' + this.config.ssHombres + '</td></tr></table>';
    }
    if (this.config.ssSexo == 'Mujeres') {
      ss = '<table class="list_feat"><caption>Afiliación Seg. Social ' + this.config.ssYear + '</caption><tr><th colspan="2">' + this.config.ssRegimen.replace("*", "") + '</th></tr><tr><th>Mujeres</th><td>' + this.config.ssMujeres + '</td></tr></table>';
    }
    if (this.config.ssSexo == 'Ambos sexos') {
      ss = '<table class="list_feat"><caption>Afiliación Seg. Social ' + this.config.ssYear + '</caption><tr><th colspan="2">' + this.config.ssRegimen.replace("*", "") + '</th></tr><tr><th>Ambos sexos</th><td>' + this.config.ssAmbos + '</td></tr></table>';
    }
    if (this.config.ssSexo == 'Ambos sexos disgregados') {
      ss = '<table class="list_feat"><caption>Afiliación Seg. Social ' + this.config.ssYear + '</caption><tr><th colspan="2">' + this.config.ssRegimen.replace("*", "") + '</th></tr><tr><th>Hombres</th><td>' + this.config.ssHombres + '</td></tr><tr><th>Mujeres</th><td>' + this.config.ssMujeres + '</td></tr><tr><th>Ambos sexos</th><td>' + this.config.ssAmbos + '</td></tr></table>';
    }

    if (this.config.pobYear != '') {
      pob = '<tr><th>Población año ' + this.config.pobYear + ' </th><td>' + this.config.pobSelect + '</td></tr><tr><th>Densidad de población año ' + this.config.pobYear + ' </th><td>' + densidad + '</td></tr><tr></tr>';
    }


    if (document.getElementById('checkSuperavit').checked) {
      superavit = '<tr><th>Superávit/Déficit <br> último ejercicio</th><td>' + this.config.superavit + '</td></tr>'
    }


    featureTabOpts = {
      'icon': 'g-cartografia-pin',
      'title': 'Municipio de ' + layerName,
      'content': '<div style="text-align: center"><table class="list_feat"><tr><th> Nombre </th><td>' + nombre + '</td></tr><tr><th>Codigo municipio </th><td>' + cod_mun + '</td></tr><tr><th>Superficie</th><td>' + superficie + ' Km²</td></tr></tr><tr><th>Perímetro</th><td>' + perimetro + ' Km</td></tr>' + pob + '</td></tr>' + superavit + '</table>' + ss + '</div>'
    };
    return featureTabOpts

  }

  centroide(municipio) {
    let centro = [0, 0];
    let geometria = [];



    for (let i = 0; i < municipio.getGeometry().coordinates.length; i++) {      //recoge el numero de tramos poligonales
      for (let t = 0; t < (municipio.getGeometry().coordinates[i][0].length - 1); t++) {    //recorre el numero de tramos poligonales ( poligonal cerrada por eso -1 )
        geometria = geometria.concat(municipio.getGeometry().coordinates[i][0][t]);
      }

    }

    for (let i = 0; i < (geometria.length / 2); i++) {
      centro[0] = centro[0] + geometria[i * 2];
      centro[1] = centro[1] + geometria[i * 2 + 1];
    }
    centro[0] = centro[0] / (geometria.length / 2);
    centro[1] = centro[1] / (geometria.length / 2);

    return centro;

  }

  superficieMunicipio(municipio) {

    let superficie = 0;
    let perimetro = 0;
    for (let i = 0; i < municipio.getGeometry().coordinates.length; i++) { //recoge el numero de tramos poligonales
      let geometria = [];
      for (let t = 0; t < municipio.getGeometry().coordinates[i][0].length; t++) {    //recorre el numero de tramos poligonales
        geometria = geometria.concat(municipio.getGeometry().coordinates[i][0][t]);

      }
      for (let t = 0; t < ((geometria.length) / 2) - 1; t++) {
        superficie = superficie + ((geometria[t * 2 + 2] - geometria[t * 2]) * geometria[t * 2 + 1]) + ((geometria[t * 2 + 2] - geometria[t * 2]) * (geometria[t * 2 + 3] - geometria[t * 2 + 1])) / 2;
        perimetro = perimetro + Math.sqrt((geometria[t * 2 + 2] - geometria[t * 2]) * (geometria[t * 2 + 2] - geometria[t * 2]) + (geometria[t * 2 + 3] - geometria[t * 2 + 1]) * (geometria[t * 2 + 3] - geometria[t * 2 + 1]));
      }

    }
    superficie = Math.round(superficie) / 1000000;
    superficie = superficie.toFixed(2);

    perimetro = Math.round(perimetro) / 1000;
    perimetro = perimetro.toFixed(2);



    return [superficie, perimetro];

  }

  cambiaSelect(nombre) {

    for (let i = 0; i < document.getElementById('selectMunicipios').length; i++) {
      if (document.getElementById('selectMunicipios').options[i].innerText == nombre) {
        document.getElementById('selectMunicipios').options.item(i).selected = 'selected';

      }
    }

  }

  muestraBotones() {
    document.getElementById('divBotones').style.display = 'flex';
  }

  listaMunicipios() {
    this.borraTablas();
    let busqueda = document.getElementById('busMuni').value;
    let busquedaInicial = busqueda;
    let encontrado = false;
    document.getElementById('resultadosBusqueda').style.display = 'none';
    document.getElementById('resulBus').innerHTML = '';
    this.config.provinciaSeleccionada = document.getElementById('selectProvincias').value;

    // NORMALIZAMOS EL NOMBRE DEL MUNICIPIO

    document.getElementById('DivTablaResultados').style.display = 'block';
    busqueda = busqueda.toLowerCase();
    busqueda = this.quitaAcentos(busqueda);

    let arraybusqueda = busqueda.split(' ');
    for (let i = 0; i < arraybusqueda.length; i++) {
      if (arraybusqueda[i] != 'de' && arraybusqueda[i] != 'del' && arraybusqueda[i] != 'la' && arraybusqueda[i] != 'los' && arraybusqueda[i] != 'las') {
        arraybusqueda[i] = arraybusqueda[i][0].toUpperCase() + arraybusqueda[i].slice(1);
      }
    }
    busqueda = '';
    for (let i = 0; i < arraybusqueda.length; i++) {
      busqueda = busqueda + arraybusqueda[i];
      if (i < arraybusqueda.length - 1) {
        busqueda = busqueda + ' ';
      }
    }

    busqueda = busqueda[0].toUpperCase() + busqueda.slice(1);
    arraybusqueda = busqueda.split(' ');
    for (let i = 0; i < arraybusqueda.length; i++) {
      if (arraybusqueda[i] == 'de' || arraybusqueda[i] == 'del' || arraybusqueda[i] == 'la' || arraybusqueda[i] == 'los' || arraybusqueda[i] == 'las') {
        arraybusqueda[i].splice(i, 1);
      }
    }





    for (let t = 0; t < arraybusqueda.length; t++) {

      for (let i = 0; i < this.config.layerList.length; i++) {
        if ((this.config.provinciaSeleccionada == 'Select') || (this.config.provinciaSeleccionada == 'Todas') || (this.config.provinciaSeleccionada == this.config.layerList[i].getImpl().name)) {
          for (let s = 0; s < this.config.layerList[i].getFeatures().length; s++) {
            let mun = this.config.layerList[i].getFeatures()[s].getImpl().getAttribute('nombre');
            mun = this.quitaAcentos(mun);
            if (mun.includes(arraybusqueda[t])) {
              this.config.result[this.config.reg * 2] = this.config.layerList[i].getFeatures()[s].getImpl().getAttribute('nombre');
              this.config.result[this.config.reg * 2 + 1] = this.config.layerList[i].getImpl().name;
              this.config.reg = this.config.reg + 1;

              encontrado = true;
            }
          }
        }
      }
    }


    this.config.pag = 0;

    this.config.numeroTablas = parseInt(this.config.reg / this.config.num_results) + 1;

    this.creaTabla();




    if (this.config.reg > 15) {
      document.getElementById('controlTablas').style.display = 'flex';
      document.getElementById('botonAvance').style.display = 'flex';
      document.getElementById('botonAtras').style.display = 'none';

    }

    if (encontrado == false) {
      document.getElementById('DivTablaResultados').style.display = 'none';
      document.getElementById('resultadosBusqueda').style.display = 'block';
      document.getElementById('paginado').style.display = 'none';
      if ((this.config.provinciaSeleccionada != 'Todas') && (this.config.provinciaSeleccionada != 'Select')) {
        document.getElementById('resulBus').innerHTML = '"' + busquedaInicial + '"' + ' no muestra ningún resultado en la lista de municipios de ' + this.config.provinciaSeleccionada;
      } else {
        document.getElementById('resulBus').innerHTML = '"' + busquedaInicial + '"' + ' no muestra ningún resultado en la lista de municipios';
      }
    }

  }

  borraTablas() {
    let tabla = document.getElementById('TablaResultados');
    tabla.innerHTML = '<thead><tr><td>MUNICIPIO</td><td>PROVINCIA</td></tr></thead><tbody></tbody>';
    document.getElementById('TablaResultados').className = 'TablaOculta';

  }

  quitaAcentos(nombre) {
    nombre = nombre.replace('á', 'a');
    nombre = nombre.replace('é', 'e');
    nombre = nombre.replace('í', 'i');
    nombre = nombre.replace('ó', 'o');
    nombre = nombre.replace('ú', 'u');
    nombre = nombre.replace('Á', 'A');
    nombre = nombre.replace('É', 'E');
    nombre = nombre.replace('Í', 'I');
    nombre = nombre.replace('Ó', 'O');
    nombre = nombre.replace('Ú', 'U');
    return nombre;
  }

  creaTabla() {
    for (let i = (this.config.pag * this.config.num_results); i < (this.config.pag * this.config.num_results + this.config.num_results); i++) {
      if (i < this.config.reg) {
        document.getElementById('TablaResultados').getElementsByTagName('tbody')[0].insertRow(-1).innerHTML = '<tr><th>' + this.config.result[i * 2] + '</th><th>' + this.config.result[i * 2 + 1] + '</th></tr>';
      }
    }

    document.getElementById('TablaResultados').className = 'TablaResultados';
    document.getElementById('paginado').style.display = 'block';
    if ((this.config.pag * this.config.num_results + this.config.num_results) < this.config.reg) {
      document.getElementById('paginado').innerHTML = 'Resultados ' + (this.config.pag * this.config.num_results + 1) + ' a ' + (this.config.pag * this.config.num_results + this.config.num_results) + ' de ' + this.config.reg + '';
    } else {
      document.getElementById('paginado').innerHTML = 'Resultados ' + (this.config.pag * this.config.num_results + 1) + ' a ' + this.config.reg + ' de ' + this.config.reg + '';
    }
  }

  retrocedeTabla() {
    if (this.config.pag > 0) {
      this.config.pag = this.config.pag - 1;
      this.borraTablas();
      this.creaTabla();
    }
    if (this.config.pag == 0) {
      document.getElementById('botonAtras').style.display = 'none';
    }
    if (this.config.pag == this.config.numeroTablas - 2) {
      document.getElementById('botonAvance').style.display = 'flex';
    }
  }

  avanzaTabla() {
    if (this.config.pag < this.config.numeroTablas - 1) {
      this.config.pag = this.config.pag + 1;
      this.borraTablas();
      this.creaTabla();
    }
    if (this.config.pag == this.config.numeroTablas - 1) {
      document.getElementById('botonAvance').style.display = 'none';
    }
    if (this.config.pag == 1) {
      document.getElementById('botonAtras').style.display = 'flex';
    }

  }

  limpia() {
    document.getElementById('busMuni').value = '';
    document.getElementById('divBotones').style.display = 'none';
    document.getElementById('resultadosBusqueda').style.display = 'none';
    document.getElementById('controlTablas').style.display = 'none';
    document.getElementById('resulBus').innerHTML = '';
    document.getElementById('selectMunicipios').options.item(0).selected = 'selected';
    document.getElementById('paginado').style.display = 'none';

    if (this.map_.getPopup()) {
      this.map_.removePopup();
    }


    if (this.config.munAnterior != false) {
      this.config.munAnterior.setStyle(this.config.stAnterior);
    }


    this.borraTablas();


    let cont = this.map_.getLayers().length - 9;
    if ((this.config.provinciaSeleccionada != 'Select') && (this.config.provinciaSeleccionada != 'Todas')) {
      if (this.map_.getLayers().length > 9) {
        for (let x = 0; x < cont; x++) {
          let capaCargada = this.map_.getLayers()[8];
          if (this.config.provinciaSeleccionada != capaCargada.impl_.name) {
            this.map_.removeLayers(capaCargada);
          }
        }
      }
    }

    this.config.pag = 0;
    this.config.reg = 0;
    this.config.result = [];
  }


  normalizaMunicipio(listaPoblacion) {
    for (let i = 0; i < listaPoblacion.length; i++) {
      if (listaPoblacion[i].indexOf('(El)') !== -1) {
        listaPoblacion[i] = 'El ' + listaPoblacion[i].slice(0, listaPoblacion[i].indexOf(' (El)'));
      }
      if (listaPoblacion[i].indexOf('(Los)') !== -1) {
        listaPoblacion[i] = 'Los ' + listaPoblacion[i].slice(0, listaPoblacion[i].indexOf(' (Los)'));
      }
      if (listaPoblacion[i].indexOf('(La)') !== -1) {
        listaPoblacion[i] = 'La ' + listaPoblacion[i].slice(0, listaPoblacion[i].indexOf(' (La)'));
      }
      if (listaPoblacion[i].indexOf('(Las)') !== -1) {
        listaPoblacion[i] = 'Las ' + listaPoblacion[i].slice(0, listaPoblacion[i].indexOf(' (Las)'));
      }
      if (listaPoblacion[i].indexOf('(capital)') !== -1) {
        listaPoblacion[i] = listaPoblacion[i].slice(0, listaPoblacion[i].indexOf(' (capital)'));
      }
    }
    return listaPoblacion;
  }

  consultaPoblacion(year) {
    this.config.status.stPoblacion = false;
    const requestPoblacion = new XMLHttpRequest();
    requestPoblacion.open('GET', 'https://www.ieca.junta-andalucia.es/intranet/admin/rest/v1.0/consulta/6780');
    requestPoblacion.responseType = 'json';
    requestPoblacion.send();

    requestPoblacion.onload = () => {
      this.config.status.PoblacionJson = requestPoblacion.response;
      let t = 0;
      for (let i = 0; i < this.config.status.PoblacionJson.data.length; i++) {

        if (this.config.status.PoblacionJson.data[i][1].des == year) {
          this.config.listPoblacion[2 * t] = this.config.status.PoblacionJson.data[i][0].des;
          this.config.listPoblacion[2 * t + 1] = this.config.status.PoblacionJson.data[i][3].format;
          t = t + 1;
        }
      }

      this.config.listPoblacion = this.normalizaMunicipio(this.config.listPoblacion);
      if (requestPoblacion.status == 200) {
        document.getElementById('selectSexoAfiliacion').style.marginBottom = '27px';
        document.getElementById('controlCarga').style.display = 'none';
        if (document.getElementById('selectRepresentacion').value == 'Poblacion') {
          this.representaPoblacion();
        }
        this.config.status.stPoblacion = true;
      }

      requestPoblacion.abort();

    }

  }

  consultaSuperavit() {
    this.config.status.stSuperavit = false;
    const requestSuperavit = new XMLHttpRequest();
    requestSuperavit.open('GET', 'https://www.ieca.junta-andalucia.es/intranet/admin/rest/v1.0/consulta/1342');
    requestSuperavit.responseType = 'json';
    requestSuperavit.send();

    requestSuperavit.onload = () => {
      this.config.status.SuperavitJson = requestSuperavit.response;


      for (let i = 0; i < this.config.status.SuperavitJson.data.length; i++) {
        this.config.listSuperavit[2 * i] = this.config.status.SuperavitJson.data[i][0].des;
        this.config.listSuperavit[2 * i + 1] = parseFloat(this.config.status.SuperavitJson.data[i][2].val).toFixed(2);
      }
      this.config.listSuperavit = this.normalizaMunicipio(this.config.listSuperavit);
      if (requestSuperavit.status == 200) {
        document.getElementById('selectSexoAfiliacion').style.marginBottom = '27px';
        document.getElementById('controlCarga').style.display = 'none';
        if (document.getElementById('selectRepresentacion').value == 'Deficit_Superavit') {
          this.representaSuperavit();
        }
        this.config.status.stSuperavit = true;
      }
      requestSuperavit.abort();
    }

  }

  consultaSegSocial(regimen, sexo) {

    this.config.status.stSegsocial = false;

    const requestSegsocial = new XMLHttpRequest();
    requestSegsocial.open('GET', 'https://www.ieca.junta-andalucia.es/intranet/admin/rest/v1.0/consulta/49400');
    requestSegsocial.responseType = 'json';
    requestSegsocial.send();


    requestSegsocial.onload = () => {
      this.config.status.SegsocialJson = requestSegsocial.response;
      let t = 0;

      this.config.ssYear = this.config.status.SegsocialJson.data[0][3].des;

      document.getElementById('tituloSS').innerHTML = 'Afiliación Seg. Social ' + this.config.ssYear;



      if (sexo != 'Ambos sexos disgregados') {
        for (let i = 0; i < this.config.status.SegsocialJson.data.length; i++) {
          if ((this.config.status.SegsocialJson.data[i][1].des == regimen) && (this.config.status.SegsocialJson.data[i][2].des == sexo)) {
            this.config.listSegsocial[2 * t] = this.config.status.SegsocialJson.data[i][0].des;
            if ((this.config.status.SegsocialJson.data[i][4].format != '*') && (this.config.status.SegsocialJson.data[i][4].format != '')) {
              this.config.listSegsocial[2 * t + 1] = this.config.status.SegsocialJson.data[i][4].format;
            }
            if (this.config.status.SegsocialJson.data[i][4].format == '*') {
              this.config.listSegsocial[2 * t + 1] = '< 5'
            }
            if (this.config.status.SegsocialJson.data[i][4].format == '') {
              this.config.listSegsocial[2 * t + 1] = '---';
            }
            t = t + 1;
          }
        }
      }

      if (sexo == 'Ambos sexos disgregados') {
        t = 0;

        for (let i = 0; i < this.config.status.SegsocialJson.data.length; i++) {

          if ((this.config.status.SegsocialJson.data[i][1].des == regimen) && (this.config.status.SegsocialJson.data[i][2].des == 'Hombres')) {
            this.config.listSegsocial[t] = this.config.status.SegsocialJson.data[i][0].des; // municipio
            t = t + 1;

            this.config.listSegsocial[t] = this.config.status.SegsocialJson.data[i][4].format;  //hombres
            if (this.config.listSegsocial[t] == '*') { this.config.listSegsocial[t] = '< 5' }
            if (this.config.listSegsocial[t] == '') { this.config.listSegsocial[t] = '---' }
            t = t + 1;

            this.config.listSegsocial[t] = this.config.status.SegsocialJson.data[i + 1][4].format;   //mujeres
            if (this.config.listSegsocial[t] == '*') { this.config.listSegsocial[t] = '< 5' }
            if (this.config.listSegsocial[t] == '') { this.config.listSegsocial[t] = '---' }
            t = t + 1;

            this.config.listSegsocial[t] = this.config.status.SegsocialJson.data[i + 2][4].format;   //ambos
            if (this.config.listSegsocial[t] == '*') { this.config.listSegsocial[t] = '< 5' }
            if (this.config.listSegsocial[t] == '') { this.config.listSegsocial[t] = '---' }
            t = t + 1;

          }
        }

      }
      this.config.listSegsocial = this.normalizaMunicipio(this.config.listSegsocial);

      if (requestSegsocial.status == 200) {
        document.getElementById('selectSexoAfiliacion').style.marginBottom = '27px';
        document.getElementById('controlCarga').style.display = 'none';
        if (document.getElementById('selectRepresentacion').value == 'Afiliacion') {
          this.representaSegSocial();
        }
        this.config.status.stSegsocial = true;
      }

      requestSegsocial.abort();

    }

  }

  representaPoblacion() {
    for (let i = 0; i < this.config.layerList.length; i++) {
      for (let t = 0; t < this.config.layerList[i].getFeatures().length; t++) {
        this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({  // REPRESENTA DE ESTE MODO EN EL CASO DE NO ENCONTRAR LOS DATOS DE POBLACION
          fill: {
            color: '#d8d8d8',
            opacity: 0.7,
          },
          stroke: {
            color: '#0c0c0c',
            width: 1
          }
        }));
        for (let j = 0; j < this.config.listPoblacion.length; j = j + 2) {
          if (this.config.layerList[i].getFeatures()[t].getAttribute('nombre') == this.config.listPoblacion[j]) {
            let pob = Number(this.config.listPoblacion[j + 1].replace('.', ''));

            if (pob <= 1000) {
              this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                fill: {
                  color: '#d8d8d8',
                  opacity: 0.7,
                },
                stroke: {
                  color: '#0c0c0c',
                  width: 1
                }
              }));
            }
            if ((pob > 1000) && (pob <= 5000)) {
              this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                fill: {
                  color: '#e0adad',
                  opacity: 0.7,
                },
                stroke: {
                  color: '#0c0c0c',
                  width: 1
                }
              }));
            }
            if ((pob > 5000) && (pob <= 10000)) {
              this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                fill: {
                  color: '#e88282',
                  opacity: 0.7,
                },
                stroke: {
                  color: '#0c0c0c',
                  width: 1
                }
              }));
            }
            if ((pob > 10000) && (pob <= 50000)) {
              this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                fill: {
                  color: '#f05656',
                  opacity: 0.7,
                },
                stroke: {
                  color: '#0c0c0c',
                  width: 1
                }
              }));
            }
            if ((pob > 50000) && (pob <= 100000)) {
              this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                fill: {
                  color: '#f82b2b',
                  opacity: 0.7,
                },
                stroke: {
                  color: '#0c0c0c',
                  width: 1
                }
              }));
            }
            if (pob > 100000) {
              this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                fill: {
                  color: '#ff0000',
                  opacity: 0.7,
                },
                stroke: {
                  color: '#0c0c0c',
                  width: 1
                }
              }));
            }
          }
        }
      }
    }

    document.querySelectorAll('div.m-panel.m-leyenda>div.m-panel-controls>div#leyenda-title')[0].innerHTML = 'Población por municipios año ' + this.config.pobYear + '';

    document.querySelectorAll('div.m-panel.m-leyenda>div.m-panel-controls>div.leyenda')[0].innerHTML = '<img src="../../../leyendas/poblacion.png" alt="Leyenda Poblacion" title ="Leyenda Población" >';

  }

  representaSuperavit() {
    for (let i = 0; i < this.config.layerList.length; i++) {
      for (let t = 0; t < this.config.layerList[i].getFeatures().length; t++) {
        this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({  // REPRESENTA DE ESTE MODO EN EL CASO DE NO ENCONTRAR LOS DATOS DE POBLACION
          fill: {
            color: '#ffffff',
            opacity: 0.7,
          },
          stroke: {
            color: '#0c0c0c',
            width: 1
          }
        }));
        for (let j = 0; j < this.config.listSuperavit.length; j = j + 2) {
          if (this.config.layerList[i].getFeatures()[t].getAttribute('nombre') == this.config.listSuperavit[j]) {
            let sup = Number(this.config.listSuperavit[j + 1]);

            if ((sup >= 0) && (sup <= 500000)) {
              this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                fill: {
                  color: '#b0eeb5',
                  opacity: 0.7,
                },
                stroke: {
                  color: '#0c0c0c',
                  width: 1
                }
              }));
            }
            if ((sup > 500000) && (sup <= 1000000)) {
              this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                fill: {
                  color: '#81da88',
                  opacity: 0.7,
                },
                stroke: {
                  color: '#0c0c0c',
                  width: 1
                }
              }));
            }
            if ((sup > 1000000) && (sup <= 5000000)) {
              this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                fill: {
                  color: '#4aca54',
                  opacity: 0.7,
                },
                stroke: {
                  color: '#0c0c0c',
                  width: 1
                }
              }));
            }
            if (sup > 5000000) {
              this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                fill: {
                  color: '#11a51e',
                  opacity: 0.7,
                },
                stroke: {
                  color: '#0c0c0c',
                  width: 1
                }
              }));
            }
            if ((sup < 0) && (sup >= -500000)) {
              this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                fill: {
                  color: '#eccbcb',
                  opacity: 0.7,
                },
                stroke: {
                  color: '#0c0c0c',
                  width: 1
                }
              }));
            }
            if ((sup < -500000) && (sup >= -1000000)) {
              this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                fill: {
                  color: '#e5a0a0',
                  opacity: 0.7,
                },
                stroke: {
                  color: '#0c0c0c',
                  width: 1
                }
              }));
            }
            if ((sup < -1000000) && (sup >= -5000000)) {
              this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                fill: {
                  color: '#f35757',
                  opacity: 0.7,
                },
                stroke: {
                  color: '#0c0c0c',
                  width: 1
                }
              }));
            }
            if (sup < -5000000) {
              this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                fill: {
                  color: '#f31313',
                  opacity: 0.7,
                },
                stroke: {
                  color: '#0c0c0c',
                  width: 1
                }
              }));
            }
          }
        }
      }
    }

    document.querySelectorAll('div.m-panel.m-leyenda>div.m-panel-controls>div#leyenda-title')[0].innerHTML = 'Superávit/Déficit del último ejercicio';

    document.querySelectorAll('div.m-panel.m-leyenda>div.m-panel-controls>div.leyenda')[0].innerHTML = '<img src="../../../leyendas/deficit_superavit.png" alt="Leyenda Déficit/Superávit" title ="Leyenda Déficit/Superávit" >';

  }

  representaSegSocial() {

    for (let i = 0; i < this.config.layerList.length; i++) {
      for (let t = 0; t < this.config.layerList[i].getFeatures().length; t++) {
        this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({  // REPRESENTA DE ESTE MODO EN EL CASO DE NO ENCONTRAR LOS DATOS DE POBLACION
          fill: {
            color: '#ffffff',
            opacity: 0.7,
          },
          stroke: {
            color: '#0c0c0c',
            width: 1
          }
        }));
        if (this.config.ssSexo != 'Ambos sexos disgregados') {
          for (let j = 0; j < this.config.listSegsocial.length; j = j + 2) {
            if (this.config.layerList[i].getFeatures()[t].getAttribute('nombre') == this.config.listSegsocial[j]) {
              let ss = 0;
              if (this.config.listSegsocial[j + 1] != '< 5') {
                ss = Number(this.config.listSegsocial[j + 1].replace('.', ''));
              }
              if ((ss >= 0) && (ss <= 100)) {
                this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                  fill: {
                    color: '#d0d0e6',
                    opacity: 0.7,
                  },
                  stroke: {
                    color: '#0c0c0c',
                    width: 1
                  }
                }));
              }
              if ((ss > 100) && (ss <= 1000)) {
                this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                  fill: {
                    color: '#ababe7',
                    opacity: 0.7,
                  },
                  stroke: {
                    color: '#0c0c0c',
                    width: 1
                  }
                }));
              }
              if ((ss > 1000) && (ss <= 5000)) {
                this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                  fill: {
                    color: '#7e7eda',
                    opacity: 0.7,
                  },
                  stroke: {
                    color: '#0c0c0c',
                    width: 1
                  }
                }));
              }
              if ((ss > 5000) && (ss <= 10000)) {
                this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                  fill: {
                    color: '#5050d6',
                    opacity: 0.7,
                  },
                  stroke: {
                    color: '#0c0c0c',
                    width: 1
                  }
                }));
              }
              if (ss > 10000) {
                this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                  fill: {
                    color: '#1919e2',
                    opacity: 0.7,
                  },
                  stroke: {
                    color: '#0c0c0c',
                    width: 1
                  }
                }));
              }
            }
          }
        } else {
          for (let j = 0; j < this.config.listSegsocial.length; j = j + 4) {
            if (this.config.layerList[i].getFeatures()[t].getAttribute('nombre') == this.config.listSegsocial[j]) {
              let ss = 0;
              if (this.config.listSegsocial[j + 3] != '< 5') {
                ss = Number(this.config.listSegsocial[j + 3].replace('.', ''));
              }
              if ((ss >= 0) && (ss <= 100)) {
                this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                  fill: {
                    color: '#d0d0e6',
                    opacity: 0.7,
                  },
                  stroke: {
                    color: '#0c0c0c',
                    width: 1
                  }
                }));
              }
              if ((ss > 100) && (ss <= 1000)) {
                this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                  fill: {
                    color: '#ababe7',
                    opacity: 0.7,
                  },
                  stroke: {
                    color: '#0c0c0c',
                    width: 1
                  }
                }));
              }
              if ((ss > 1000) && (ss <= 5000)) {
                this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                  fill: {
                    color: '#7e7eda',
                    opacity: 0.7,
                  },
                  stroke: {
                    color: '#0c0c0c',
                    width: 1
                  }
                }));
              }
              if ((ss > 5000) && (ss <= 10000)) {
                this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                  fill: {
                    color: '#5050d6',
                    opacity: 0.7,
                  },
                  stroke: {
                    color: '#0c0c0c',
                    width: 1
                  }
                }));
              }
              if (ss > 10000) {
                this.config.layerList[i].getFeatures()[t].setStyle(new M.style.Polygon({
                  fill: {
                    color: '#1919e2',
                    opacity: 0.7,
                  },
                  stroke: {
                    color: '#0c0c0c',
                    width: 1
                  }
                }));
              }
            }
          }
        }


      }
    }



    let cabecera = '';
    if ((this.config.ssSexo != 'Ambos sexos disgregados') && (this.config.ssSexo != 'Ambos sexos')) {
      cabecera = this.config.ssSexo + ' afiliados al ' + this.config.ssRegimen.replace('*', '') + ' en ' + this.config.ssYear;
    } else {
      cabecera = 'Total afiliados al ' + this.config.ssRegimen.replace('*', '') + ' en ' + this.config.ssYear;

    }

    document.querySelectorAll('div.m-panel.m-leyenda>div.m-panel-controls>div#leyenda-title')[0].innerHTML = cabecera;

    document.querySelectorAll('div.m-panel.m-leyenda>div.m-panel-controls>div.leyenda')[0].innerHTML = '<img src="../../../leyendas/segsocial.png" alt="Leyenda Afiliados ' + this.config.ssRegimen + ' año ' + this.config.ssYear + '" title ="Leyenda Afiliados ' + this.config.ssRegimen + ' año ' + this.config.ssYear + '" >';


  }

}
