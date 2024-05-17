<template>
    <yandex-map
      v-model="map"
      :settings="{
        location: {
        center: defaultMarker ? defaultMarker.coordinates : centerCoord,
        zoom: 17,
        }, 
        behaviors:[
          'drag', 'pinchZoom', 
          'dblClick',

        ],
      }"
       cursor-grab
      :width="width"
      :height="height"
      @map-was-initialized="handleMapInitialized"
    >
        <yandex-map-controls :settings="{ position: 'right' }">
          <yandex-map-zoom-control />
        </yandex-map-controls>
        <yandex-map-default-scheme-layer />
        <yandex-map-default-features-layer />
        <yandex-map-default-marker
          v-model="defaultMarker"
          :settings="{
            coordinates: centerCoord,
            draggable: true,
            onDragMove,
          }"
        />
    </yandex-map>
</template>

<script>
import { YandexMap, YandexMapDefaultSchemeLayer,YandexMapDefaultMarker,
  YandexMapDefaultFeaturesLayer,YandexMapMarker,YandexMapClusterer,
  YandexMapZoomControl,YandexMapControls
} from 'vue-yandex-maps';
import { shallowRef, triggerRef } from 'vue';

export default {
  components: {YandexMap, YandexMapDefaultSchemeLayer,YandexMapDefaultMarker,
    YandexMapDefaultFeaturesLayer,YandexMapMarker,YandexMapClusterer,
    YandexMapZoomControl,YandexMapControls
  },
  data() {
    return {  
      show: null,
      showAddress: false,
      mapSettings: {
        apiKey: '',
        lang: 'ru_RU',
        coordorder: 'latlong',                                              
        version: '2.1',
      },
      defaultMarker:null,
    }
  },

  computed:{
    centerCoord(){
      return this.center ? this.center : [34.169506,44.49741]
    },
  },
  methods:{
    onMapInit(event) {
      this.zoom = event.getZoom();
    },
    handleMapInitialized(ymap) {
      this.map = ymap;

      const layer = new ymaps.layer.storage.get('default#map').getLayer({
        customization:this.customization
      });
      ymap.layers.add(layer);
    },
    onDragMove(){
      this.$emit('markerMoved', this.defaultMarker.coordinates);

      triggerRef(this.defaultMarker);
    },
  },
  props: {
      center: {
        type: Array,
        default: () => ([]),
      },
      height:String,
      width:String,
    },
}
</script>
<style>
.yandex-container {
  height: 300px;
}
.bounds {
  user-select: all;
}

.marker {
  background: #0085BA;
  border-radius: 100%;
  width: 20px;
  height: 20px;
}
.marker:hover {
  background: #04abed;
}

.cluster {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background: #0085BA;
  color: #fff;
  border-radius: 100%;
  cursor: pointer;
  border: 2px solid #0085BA;
  outline: 2px solid #0085BA;
}

.popup {
  position: absolute;
  bottom: calc(100% + 10px);
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  color: black;
  
}
</style>