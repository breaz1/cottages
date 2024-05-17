<script setup>
import Steps from '~/components/steps.vue';
import Employee from '~/components/employe.vue';
import PhotoSlider from '~/components/photoSlider.vue';
import { onMounted, ref } from 'vue';

const productStore = useProductStore();
const categoryStore = useCategoryStore()
const userStore = useUserStore()

const categories = computed(() => {
  return categoryStore.categories;
});

const users = computed(() => {
  return userStore.users;
});

const products = computed(() => {
  return productStore.products;
});

useAsyncData('categories', () => {
  return categoryStore.fetchCategories()
}, { server: true })

useAsyncData('users', () => {
  return userStore.getManagers()
}, { server: true })

useAsyncData('products', () => {
  return productStore.fetchProducts()
}, { server: true })

const sliderContainer = ref(null);
const scrollRight = () => {
  if (sliderContainer.value) {
    sliderContainer.value.scrollLeft += 100;
  }
};

// Функция для прокрутки влево
const scrollLeft = () => {
  if (sliderContainer.value) {
    sliderContainer.value.scrollLeft -= 100;
  }
};

// Обработчик событий нажатий клавиш
const handleKeydown = (event) => {
  if (event.key === "ArrowRight") {
    scrollRight();
  } else if (event.key === "ArrowLeft") {
    scrollLeft();
  }
};

// Инициализация функциональности перетаскивания
const initDragToScroll = () => {
  let isDown = false;
  let startX;
  let scrollLeft;

  const startDragging = (e) => {
    isDown = true;
    startX = e.pageX - sliderContainer.value.getBoundingClientRect().left;
    scrollLeft = sliderContainer.value.scrollLeft;
  };

  const stopDragging = () => {
    isDown = false;
  };

  const doDrag = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - sliderContainer.value.getBoundingClientRect().left;
    const walk = (x - startX) * 1; // умножаем на 3 для ускорения прокрутки
    sliderContainer.value.scrollLeft = scrollLeft - walk;
  };  

  sliderContainer.value.addEventListener('mousedown', startDragging);
  sliderContainer.value.addEventListener('mouseleave', stopDragging);
  sliderContainer.value.addEventListener('mouseup', stopDragging);
  sliderContainer.value.addEventListener('mousemove', doDrag);
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  if (sliderContainer.value) {
    initDragToScroll();
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

const getProductsByCategoryId = (categoryId) => {
  const product = products.value.filter(product =>product.category==categoryId)
  return product
};

</script>

<template>
  <section class="px-4 md:px-12 lg:px-24 xl:px-36 2xl:px-48">
    <Title>Берег | Строительство в крыму</Title>
    <Meta name="description" content="Выполненные объекты строительной компании Берег | СК Берег." />
    <Meta name="og:title" content="Берег | Строительство в крыму" />
    <Meta name="og:type" content="website" />
    <Meta name="og:description" content="Выполненные объекты строительной компании Берег | СК Берег." />
    <Meta name="og:image" content="~/assets/img/logo.png" />
    <Meta name="og:url" content="https://xn--90aefamahghv2bgk4p.xn--p1ai/" />
    <Steps />
    <section v-if="categories" :id="category._id" v-for="category in categories" class="py-10 md:py-14 lg:py-20 box-border">
      <h2 :id="getProductsByCategoryId(category._id)" class="text-xl xl:text-2xl 2xl:text-[36px] Gotham-light pb-5 lg:pb-8">{{category.name}}</h2>
      <PhotoSlider :products="getProductsByCategoryId(category._id)" />
    </section>
    <section id="employees" class="py-10 md:py-14 lg:py-20 overflow-hidden">
      <h2 class="text-xl xl:text-2xl 2xl:text-[36px] Gotham-light pb-8">Сотрудники</h2>
      <div class="slider-container relative w-full">
        <ul class="flex gap-6 scroll overflow-auto pb-2" ref="sliderContainer">
          <li
            v-for="user in users"
            :key="users._id">
            <Employee :user="user" />
          </li>
        </ul>
      </div>
    </section>
  </section>
</template>

<style scoped>

ul {
  display: flex;
  gap: 24px; /* Расстояние между карточками */
}

li {
  flex: 0 0 auto; /* Элементы не растягиваются и не сжимаются */
}

.slider-container {
  -webkit-overflow-scrolling: touch; /* Плавная прокрутка для iOS */
}

/* Стилизация скроллбара для Chrome, Edge и Safari */
.scroll::-webkit-scrollbar {
  height: 7px; /* Высота скроллбара */
  width: 250px;
}

.scroll::-webkit-scrollbar-track {
  background: #dddddd; /* Цвет дорожки */
  border-radius: 10px;
}

.scroll::-webkit-scrollbar-thumb {
  background-color: #0085BA; /* Цвет ползунка */
  border-radius: 10px; /* Скругление углов ползунка */
  width: 50px;
}
.slider-container.active {
  cursor: grabbing; /* Курсор в виде захвата */
}

.slider-container {
  user-select: none; /* Предотвращает выделение текста при перетаскивании */
  cursor: grab; /* Курсор в виде руки */
}
</style>
