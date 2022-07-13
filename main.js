window.onload = init;

function init(){
    const map = new ol.Map({
        view: new ol.View({
            center: [-26682827.307832535, -192109.52872193168],
            zoom: 6,
            // maxZoom: ,
            minZoom: 4,
            rotation: 0.5
        }),
        target: 'js-map'
    })



    // baseMaps layer
    const openStreetMapStandard = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: false,
        title: 'OSMStandard' 
    })

    // const openStreetMapHumanitarian = new ol.layer.Tile({
    //     source: new ol.source.OSM({
    //         url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
    //     }),
    //     visible: false,
    //     title: 'OSMHumanitarian'
    // })

    // const stamenTerrain = new ol.layer.Tile({
    //     source: new ol.source.XYZ({
    //         url: 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
    //         attributions:  'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    //     }),
    //     visible: false,
    //     title: 'StamenTerrain'
    // })
    // map.addLayer(statemenTerrain);

    // layer group
    const baseLayerGroup = new ol.layer.Group({
        layers: [
            openStreetMapStandard,
            // openStreetMapHumanitarian,
            // stamenTerrain
        ]
    })

    map.addLayer(baseLayerGroup);

    // layers Switcher logic bsase map
    const baseLayerElements = document.querySelectorAll(".sidebar > input[type=radio]")
    // console.log(baseLayerElements);
    for(let baseLayerElement of baseLayerElements){
        // console.log(baseLayerElement);
        baseLayerElement.addEventListener('change', function(){
            // console.log(this.value)
            let baseLayerElementValue = this.value;
            baseLayerGroup.getLayers().forEach(function(element, index, array){
                let baseLayerTitle = element.get('title');
                element.setVisible(baseLayerTitle === baseLayerElementValue );
                // console.log('baseLayerTitle: ' + baseLayerTitle, 'baseLayerElementValue: '+ baseLayerElementValue);
                // console.log(baseLayerTitle === baseLayerElementValue);

                console.log(baseLayerTitle, element.get('visible'));
            })
        })
    }

    // vector layers
     // vector layers
     const fillStyle = new ol.style.Fill({
        color: [84,118,255, 1]
    })

    const strokeStyle = new ol.style.Stroke({
        color: [46, 45, 45, 1],
        width: 1.2
    })

    const circleStyle = new ol.style.Circle({
        fill: new ol.style.Fill({
            color: [245,49,5,1]
        }),
        radius: 7,
        stroke: strokeStyle

    })

    const provinsiSulawesi = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: './data/vector_data/map.geojson',
            format: new ol.format.GeoJSON(),
            // style: new ol.style.Style({
            //     fill: fillStyle,
            //     stroke: strokeStyle,
            //     image: circleStyle
            // })
        }),
        visible: true,
        title: 'provinsiSulawesi',
        style: new ol.style.Style({
            fill: fillStyle,
            stroke: strokeStyle,
            image: circleStyle
        })
    })

    map.addLayer(provinsiSulawesi);

    // Vector Feature Popup Logic
    const overlayContainerElement = document.querySelector('.overlay-container');
    const overlayLayer = new ol.Overlay({
        element: overlayContainerElement
    })
    map.addOverlay(overlayLayer);
    const overlayFeatureName = document.getElementById('feature-name');
    const overlayFeatureTanggal = document.getElementById('feature-tanggal');
    const overlayFeatureTerkonfirmasi = document.getElementById('feature-terkonfirmasi');
    const overlayFeatureKasusBaru = document.getElementById('feature-kasus-baru');
    const overlayFeatureTotalMeninggal = document.getElementById('feature-total-meninggal');
    const overlayFeatureBaruMeninggal = document.getElementById('feature-baru-meninggal');
    const overlayFeatureTotalSembuh = document.getElementById('feature-total-sembuh');
    const overlayFeatureBaruSembuh = document.getElementById('feature-baru-sembuh');
    const overlayFeatureKasusAktif = document.getElementById('feature-kasus-aktif');

    map.on('click', function(e){
        map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
            // console.log(feature);
            let clickCoordinate = e.coordinate;
            let clickedFeatureName = feature.get('Nama Provinsi');
            let clickedFeatureTanggal = feature.get('Tanggal');
            let clickedFeatureKonfirmasi = feature.get('Terkonfirmasi');
            let clickedFeatureKasusBaru = feature.get('Kasus Baru');
            let clickedFeatureTotalMeninggal = feature.get('Total Meninggal');
            let clickedFeatureBaruMeninggal = feature.get('Baru Meninggal');
            let clickedFeatureTotalSembuh = feature.get('Total Sembuh');
            let clickedFeatureBaruSembuh = feature.get('Sembuh Baru');
            let clickedFeatureKasusAktif = feature.get('Kasus Aktif');
            overlayLayer.setPosition(clickCoordinate);
            overlayFeatureName.innerHTML = clickedFeatureName;
            overlayFeatureTanggal.innerHTML = clickedFeatureTanggal;
            overlayFeatureTerkonfirmasi.innerHTML = clickedFeatureKonfirmasi;
            overlayFeatureKasusBaru.innerHTML = clickedFeatureKasusBaru;
            overlayFeatureTotalMeninggal.innerHTML = clickedFeatureTotalMeninggal;
            overlayFeatureBaruMeninggal.innerHTML = clickedFeatureBaruMeninggal;
            overlayFeatureTotalSembuh.innerHTML = clickedFeatureTotalSembuh;
            overlayFeatureBaruSembuh.innerHTML = clickedFeatureBaruSembuh;
            overlayFeatureKasusAktif.innerHTML = clickedFeatureKasusAktif;
        },
        {
            layerFilter: function(layerCandidate){
                return layerCandidate.get('title') === 'provinsiSulawesi'
            }
        })
    })
}
