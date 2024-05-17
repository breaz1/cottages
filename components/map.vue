<template>
    <yandex-map
      v-model="map"
      :settings="{
        location: {
        center: center,
        zoom: 15,
        mapsRenderWaitDuration: 5000,
        }, 
        behaviors:[
          'drag', 'pinchZoom', 
          'dblClick',

        ],
      }"
       cursor-grab
      :width="width"
      :height="height"
      :key="mapKey"
      @map-was-initialized="handleMapInitialized"
    >
        <yandex-map-controls :settings="{ position: 'right' }">
          <yandex-map-zoom-control />
        </yandex-map-controls>
        <yandex-map-default-scheme-layer />
        <yandex-map-default-features-layer />

        <yandex-map-clusterer
            v-if="!lat && !lon"
            :key="productsUpdateKey"
            zoom-on-cluster-click
        >
            <yandex-map-marker
            v-for="(product,index) in products"
            :key="product.id"
            :settings="{
                coordinates:[product.lon,product.lat],
                zIndex: show === product._id ? 1 : 0 
              }"
              @click.prevent="togglePopup(product._id, false)">
              <div
                class="marker cursor-pointer">
                <a :href="`products/${product._id}`"
                  v-if="show === product._id"
                  class="popup z-50"
                  @click.prevent="togglePopup(product._id, true)" 
                >
                  <div class="relative flex flex-col gap-3 Gotham text-[6px] md:text-xs w-40 ">
                    <img class="rounded-[10px]" :src="product.photo" :alt="product.name" />
                    <h3 class="gotham">{{product.name}}</h3>
                    <div class=" font-light flex flex-col gap-[5px] font">
                      <span v-if="product.price">Цена: <span class="text-black font-semibold ">{{product.price}}</span></span>
                      <span v-else>Цена: <span class="text-black font-semibold ">Договорная стоимость</span></span>
                    </div>
                  </div>
                </a>
              </div>
            </yandex-map-marker>
            <template #cluster="{ length }">
              <div class="cluster">
                  {{ length }}
              </div>
            </template>
        </yandex-map-clusterer>
        <yandex-map-default-marker
          v-else
          :settings="{ coordinates: coords }" />  
    </yandex-map>
</template>

<script>
import { YandexMap, YandexMapDefaultSchemeLayer,YandexMapDefaultMarker,
  YandexMapDefaultFeaturesLayer,YandexMapMarker,YandexMapClusterer,
  YandexMapZoomControl,YandexMapControls
} from 'vue-yandex-maps';

export default {
  components: {YandexMap, YandexMapDefaultSchemeLayer,YandexMapDefaultMarker,
    YandexMapDefaultFeaturesLayer,YandexMapMarker,YandexMapClusterer,
    YandexMapZoomControl,YandexMapControls
  },
  data() {
    return {  
      query: '',
      addressQuery: '',
      zoom: 16,
      show: null,
      showAddress: false,
      mapSettings: {
        apiKey: '',
        lang: 'ru_RU',
        coordorder: 'latlong',                                              
        version: '2.1',
      },
    }
  },
  computed:{
    center(){
      return this.lat && this.lon ? [this.lon,this.lat]:[34.173530, 44.496746]
    },
    coords(){
      return this.lat && this.lon ? [this.lon,this.lat]:[34.173530, 44.496746]
    },
    productsUpdateKey() {
      const date = new Date().getTime()
      console.log(date)  
      return new Date().getTime();
    },
  },
  watch: {
    '$route'(to, from) {
      // При смене маршрута обновляем ключ, заставляя компонент пересоздаться
      this.mapKey++;
    }
  },
  methods:{
    togglePopup(productId, card){
      this.show = this.show === productId ? card ? document.location.href=`products/${productId}`: null : productId; 
    },
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
  },
  props: {
        lat: {
            type: Number,
            default: () => (null),
        },
        lon: {
            type: Number,
            default: () => (null),
        },
        products: {
            type: Array,
            default: () => (null),
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