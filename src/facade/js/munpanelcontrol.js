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


    this.map_.on(M.evt.COMPLETED, () => {

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

      buscadorMunicipio.addEventListener('keypress', () => {
        this.muestraBotones();
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


      for (let i = 0; i < this.config.layerList.length; i++) {
        this.config.layerList[i].on(M.evt.SELECT_FEATURES, (features) => {
          if (features[0] instanceof M.ClusteredFeature) {
            return;
          }
          this.config.provinciaSeleccionada = this.quitaAcentos(features[0].getAttribute('provincia'));
          this.config.munSelect = features[0].getAttribute('nombre');
          this.seleccionaMunicipio(this.config.provinciaSeleccionada, this.config.munSelect);
          if (document.querySelectorAll('select#selectProvincias')[0].value == 'Select') {
            console.log(features[0].getAttribute('provincia'));
            console.log(this.config.munSelect);
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
    let cont = this.map_.getLayers().length - 9;
    if (this.map_.getLayers().length > 9) {
      for (let x = 0; x < cont; x++) {
        let capaCargada = this.map_.getLayers()[8];
        this.map_.removeLayers(capaCargada);
        this.config.layerList[x].setStyle(this.config.styleList[x]);
      }

    }
    for (let i = 0; i < document.getElementById('selectProvincias').options.length; i++) {

      if (document.getElementById('selectProvincias').options[i].value == option) {
        this.config.provinciaSeleccionada = document.getElementById('selectProvincias').options[i].value;
        document.getElementById('selectProvincias').options[i].selected = 'selected';
        this.creaSelect(option);
      }
    }

    for (let i = 0; i < this.config.layerList.length; i++) {
      if (option != 'Todas') {
        if (this.config.layerList[i].getImpl().name == option) {
          this.map_.addLayers(this.config.layerList[i]);
          this.map_.setBbox(this.config.layerList[i].getMaxExtent());
        }
      } else {
        for (let t = 0; t < this.config.layerList.length; t++) {
          this.map_.addLayers(this.config.layerList[i]);
          this.map_.setBbox(this.map_.getMaxExtent());
        }

      }
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
    if (provincia != 'Todas') {
      entrada = document.createElement('option');
      entrada.setAttribute('value', 'Select');
      entrada.setAttribute('class', 'opMunicipios');
      entrada.setAttribute('disabled', 'disabled');
      entrada.setAttribute('selected', 'selected');
      entradaTexto = document.createTextNode('Selecciona un municipio');
      entrada.appendChild(entradaTexto);
      select.appendChild(entrada);

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
    select.options[0].selected = 'selected';
  }
  seleccionaMunicipio(Provi, Munic) {

    if (this.map_.getPopup()) {
      this.map_.removePopup();
    }

    this.buscaMunicipio(Munic, Provi);
  }

  buscaMunicipio(mun, prov) {
    let muni;


    for (let i = 0; i < this.config.layerList.length; i++) {
      this.config.layerList[i].setStyle(this.config.styleList[i]);
      if ((this.config.layerList[i].getImpl().name == prov) || (prov == 'Todas')) {
        for (let t = 0; t < this.config.layerList[i].getFeatures().length; t++) {
          if (this.config.layerList[i].getFeatures()[t].getImpl().getAttribute('nombre') == mun) {
            muni = this.config.layerList[i].getFeatures()[t];
            this.config.munSelect = mun;

            muni.setStyle(new M.style.Polygon({
              fill: {
                color: '#ffffff',
                opacity: 1,
              },
              stroke: {
                color: '#ff0000',
                width: 3
              }
            }));

            let param_mun = this.createPopupFeature(this.centroide(muni));

            param_mun[2].addTab(this.popupTabContent(prov, muni));
            this.addPopupFeature(param_mun[2], param_mun[0], param_mun[1]);
            this.map_.setCenter([this.centroide(muni)[0], this.centroide(muni)[1]]);
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
  }

  popupTabContent(layerName, feature) {
    var featureTabOpts = null;
    let nombre = feature.getAttribute('nombre');
    let cod_mun = feature.getAttribute('cod_mun');
    let superficie = this.superficieMunicipio(feature)[0];
    let perimetro = this.superficieMunicipio(feature)[1];
    featureTabOpts = {
      'icon': 'g-cartografia-pin',
      'title': 'Municipio de ' + layerName,
      'content': '<div style="text-align: center"><table class="list_feat"><tr><th> Nombre </th><td>' + nombre + '</td></tr><tr><th>Codigo municipio </th><td>' + cod_mun + '</td></tr><tr><th>Superficie</th><td>' + superficie + '</td></tr></tr><tr><th>Perímetro</th><td>' + perimetro + '</td></tr></table></div>'
    };
    return featureTabOpts

  }

  centroide(municipio) {
    let centro = [0, 0];
    let geometria = [];


    for (let i = 0; i < municipio.getGeometry().coordinates.length; i++) {      //recoge el numero de tramos poligonales
      for (let t = 0; t < municipio.getGeometry().coordinates[i][0].length; t++) {    //recorre el numero de tramos poligonales
        geometria = geometria.concat(municipio.getGeometry().coordinates[i][0][t]);
      }

    }

    for (let i = 0; i < geometria.length / 2; i++) {
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
    superficie = superficie + ' Km²';
    perimetro = Math.round(perimetro) / 1000;
    perimetro = perimetro.toFixed(2);
    perimetro = perimetro + ' Km';


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

    this.config.numeroTablas = parseInt(this.config.reg / 15) + 1;

    this.creaTabla();




    if (this.config.reg > 15) {
      document.getElementById('controlTablas').style.display = 'flex';
      document.getElementById('botonAvance').style.display = 'flex';
      document.getElementById('botonAtras').style.display = 'none';

    }

    if (encontrado == false) {
      document.getElementById('DivTablaResultados').style.display = 'none';
      document.getElementById('resultadosBusqueda').style.display = 'block';
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
    for (let i = (this.config.pag * 15); i < (this.config.pag * 15 + 15); i++) {
      if (i < this.config.reg) {
        document.getElementById('TablaResultados').getElementsByTagName('tbody')[0].insertRow(-1).innerHTML = '<tr><th>' + this.config.result[i * 2] + '</th><th>' + this.config.result[i * 2 + 1] + '</th></tr>';
      }
    }
    document.getElementById('TablaResultados').className = 'TablaResultados';

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
    if (this.map_.getPopup()) {
      this.map_.removePopup();
    }
    for (let i = 0; i < this.config.layerList.length; i++) {
      this.config.layerList[i].setStyle(this.config.styleList[i]);
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

}
