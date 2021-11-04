import Munpanel from 'facade/munpanel';

const map = M.map({
  container: 'mapjs',
});



// const terminoMunicipal = new M.layer.GeoJSON(
//   {
//       name: "Andalucia",
//       url: "http://www.ideandalucia.es/services/DERA_g13_limites_administrativos/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=DERA_g13_limites_administrativos%3Ag13_01_TerminoMunicipal&outputFormat=json&srsname=EPSG%3A25830&CQL_FILTER=provincia%20%3D%20'C%C3%A1diz'%20OR%20provincia%20%3D%20'M%C3%A1laga'%20OR%20provincia%20%3D%20'Granada'%20OR%20provincia%20%3D%20'Almer%C3%I1a'%20OR%20provincia%20%3D%20'Ja%C3%E1n'%20OR%20provincia%20%3D%20'C%C3%O1rdoba'%20OR%20provincia%20%3D%20'Sevilla'%20OR%20provincia%20%3D%20'Huelva'&propertyName=nombre,cod_mun,provincia,geom",
//       extract: false
//   }
// );

const Almeria = new M.layer.GeoJSON(
  {
    name: "Almeria",
    url: "http://www.ideandalucia.es/services/DERA_g13_limites_administrativos/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=DERA_g13_limites_administrativos%3Ag13_01_TerminoMunicipal&outputFormat=json&srsname=EPSG%3A25830&CQL_FILTER=provincia%3D'Almer%C3%ADa'&propertyName=nombre,cod_mun,provincia,geom",
    extract: false
  }
);
const Cadiz = new M.layer.GeoJSON(
  {
    name: "Cadiz",
    url: "http://www.ideandalucia.es/services/DERA_g13_limites_administrativos/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=DERA_g13_limites_administrativos%3Ag13_01_TerminoMunicipal&outputFormat=json&srsname=EPSG%3A25830&CQL_FILTER=provincia%3D'C%C3%A1diz'&propertyName=nombre,cod_mun,provincia,geom",
    extract: false
  }
);

const Cordoba = new M.layer.GeoJSON(
  {
    name: "Cordoba",
    url: "http://www.ideandalucia.es/services/DERA_g13_limites_administrativos/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=DERA_g13_limites_administrativos%3Ag13_01_TerminoMunicipal&outputFormat=json&srsname=EPSG%3A25830&CQL_FILTER=provincia%3D'C%C3%B3rdoba'&propertyName=nombre,cod_mun,provincia,geom",
    extract: false
  }
);

const Granada = new M.layer.GeoJSON(
  {
    name: "Granada",
    url: "http://www.ideandalucia.es/services/DERA_g13_limites_administrativos/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=DERA_g13_limites_administrativos%3Ag13_01_TerminoMunicipal&outputFormat=json&srsname=EPSG%3A25830&CQL_FILTER=provincia%3D'Granada'&propertyName=nombre,cod_mun,provincia,geom",
    extract: false
  }
);

const Huelva = new M.layer.GeoJSON(
  {
    name: "Huelva",
    url: "http://www.ideandalucia.es/services/DERA_g13_limites_administrativos/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=DERA_g13_limites_administrativos%3Ag13_01_TerminoMunicipal&outputFormat=json&srsname=EPSG%3A25830&CQL_FILTER=provincia%3D'Huelva'&propertyName=nombre,cod_mun,provincia,geom",
    extract: false
  }
);

const Jaen = new M.layer.GeoJSON(
  {
    name: "Jaen",
    url: "http://www.ideandalucia.es/services/DERA_g13_limites_administrativos/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=DERA_g13_limites_administrativos%3Ag13_01_TerminoMunicipal&outputFormat=json&srsname=EPSG%3A25830&CQL_FILTER=provincia%3D'Ja%C3%A9n'&propertyName=nombre,cod_mun,provincia,geom",
    extract: false
  }
);

const Malaga = new M.layer.GeoJSON(
  {
    name: "Malaga",
    url: "http://www.ideandalucia.es/services/DERA_g13_limites_administrativos/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=DERA_g13_limites_administrativos%3Ag13_01_TerminoMunicipal&outputFormat=json&srsname=EPSG%3A25830&CQL_FILTER=provincia%3D'M%C3%A1laga'&propertyName=nombre,cod_mun,provincia,geom",
    extract: false
  }
);

const Sevilla = new M.layer.GeoJSON(
  {
    name: "Sevilla",
    url: "http://www.ideandalucia.es/services/DERA_g13_limites_administrativos/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=DERA_g13_limites_administrativos%3Ag13_01_TerminoMunicipal&outputFormat=json&srsname=EPSG%3A25830&CQL_FILTER=provincia%3D'Sevilla'&propertyName=nombre,cod_mun,provincia,geom",
    extract: false
  }
);



const estiloCadiz = new M.style.Polygon({
  fill: {
    color: '#e22c2c',
    opacity: 0.5,
  },
  stroke: {
    color: '#0c0c0c',
    width: 1
  }
});

const estiloMalaga = new M.style.Polygon({
  fill: {
    color: '#e26f2c',
    opacity: 0.5,
  },
  stroke: {
    color: '#0c0c0c',
    width: 1
  }
});

const estiloGranada = new M.style.Polygon({
  fill: {
    color: '#e2c12c',
    opacity: 0.5,
  },
  stroke: {
    color: '#0c0c0c',
    width: 1
  }
});

const estiloAlmeria = new M.style.Polygon({
  fill: {
    color: '#9ce22c',
    opacity: 0.5,
  },
  stroke: {
    color: '#0c0c0c',
    width: 1
  }
});

const estiloJaen = new M.style.Polygon({
  fill: {
    color: '#2ce244',
    opacity: 0.5,
  },
  stroke: {
    color: '#0c0c0c',
    width: 1
  }
});

const estiloCordoba = new M.style.Polygon({
  fill: {
    color: '#2cb7e2',
    opacity: 0.5,
  },
  stroke: {
    color: '#0c0c0c',
    width: 1
  }
});

const estiloSevilla = new M.style.Polygon({
  fill: {
    color: '#382ce2',
    opacity: 0.5,
  },
  stroke: {
    color: '#0c0c0c',
    width: 1
  }
});

const estiloHuelva = new M.style.Polygon({
  fill: {
    color: '#c42ce2',
    opacity: 0.5,
  },
  stroke: {
    color: '#0c0c0c',
    width: 1
  }
});

const categoriaTerminoMunicipal = new M.style.Category("provincia", {
  "Cádiz": estiloCadiz,
  "Málaga": estiloMalaga,
  "Granada": estiloGranada,
  "Almería": estiloAlmeria,
  "Jaén": estiloJaen,
  "Córdoba": estiloCordoba,
  "Sevilla": estiloSevilla,
  "Huelva": estiloHuelva
});

const categoriaCadiz = new M.style.Category("provincia", {
  "Cádiz": estiloCadiz
});

const categoriaMalaga = new M.style.Category("provincia", {
  "Málaga": estiloMalaga
});

const categoriaGranada = new M.style.Category("provincia", {
  "Granada": estiloGranada
});

const categoriaAlmeria = new M.style.Category("provincia", {
  "Almería": estiloAlmeria
});

const categoriaJaen = new M.style.Category("provincia", {
  "Jaén": estiloJaen
});

const categoriaCordoba = new M.style.Category("provincia", {
  "Córdoba": estiloCordoba
});

const categoriaSevilla = new M.style.Category("provincia", {
  "Sevilla": estiloSevilla
});

const categoriaHuelva = new M.style.Category("provincia", {
  "Huelva": estiloHuelva
});

const munSelect = '';
const provinciaSeleccionada = 'Select';
const numeroTablas = 0;
const pag = 0;
const reg = 0;
const result = [];

Almeria.setStyle(categoriaAlmeria);
Granada.setStyle(categoriaGranada);
Jaen.setStyle(categoriaJaen);
Cordoba.setStyle(categoriaCordoba);
Sevilla.setStyle(categoriaSevilla);
Huelva.setStyle(categoriaHuelva);
Cadiz.setStyle(categoriaCadiz);
Malaga.setStyle(categoriaMalaga);



map.addLayers([Almeria, Granada, Jaen, Cordoba, Sevilla, Huelva, Cadiz, Malaga]);

const vistaInicial = map.getMaxExtent();

map.addControls(['scaleline', 'mouse', 'OverviewMap', 'panzoombar', 'layerswitcher']);

const configMunpanel = {
  layerList: [
    Almeria,
    Granada,
    Jaen,
    Cordoba,
    Sevilla,
    Huelva,
    Cadiz,
    Malaga
  ],
  styleList: [
    categoriaAlmeria,
    categoriaGranada,
    categoriaJaen,
    categoriaCordoba,
    categoriaSevilla,
    categoriaHuelva,
    categoriaCadiz,
    categoriaMalaga,    
  ],
  provinciaSeleccionada: provinciaSeleccionada,
  munSelect: munSelect,  
  numeroTablas: numeroTablas,
  pag: pag,
  reg: reg,
  result: result
}

const mp_munpanel = new Munpanel(configMunpanel);

map.addPlugin(mp_munpanel);




mp_munpanel.on(M.evt.ADDED_TO_MAP, () => {
  console.log('se cargo el plugin munpanel')
});
