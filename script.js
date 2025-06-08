// Кэширование DOM элементов
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');
const backToTopBtn = document.querySelector('.back-to-top');
const mapMarkers = document.querySelectorAll('.map-marker');
const panoramaTabs = document.querySelectorAll('.panorama-tab');
const panoramaViewers = document.querySelectorAll('.panorama-viewer');

// Переменные для оптимизации
let ticking = false;
let isScrolling = false;
let scrollTimeout;

// Данные для панорам
const panoramaData = {
  'baikal-panorama': {
    title: 'Озеро Байкал - Виртуальный тур',
    description: 'Исследуйте красоту зимнего Байкала с его знаменитым прозрачным льдом и потрясающими видами.',
    imageUrl: 'https://pannellum.org/images/cerro-toco-0.jpg',
    hotSpots: [
      {
        pitch: -0.6,
        yaw: 37.1,
        type: 'info',
        text: 'Прозрачный лед Байкала - можно увидеть на глубину до 40 метров!'
      },
      {
        pitch: 14.1,
        yaw: 1.5,
        type: 'info',
        text: 'Остров Ольхон - крупнейший остров Байкала'
      },
      {
        pitch: -11.4,
        yaw: -23.1,
        type: 'scene',
        text: 'Перейти к мысу Хобой',
        sceneId: 'baikal-hoboi'
      }
    ],
    linkedScenes: {
      'baikal-hoboi': {
        imageUrl: 'https://pannellum.org/images/alma.jpg',
        hotSpots: [
          {
            pitch: 5.3,
            yaw: 15.7,
            type: 'info',
            text: 'Мыс Хобой - самая северная точка острова Ольхон'
          },
          {
            pitch: -3.1,
            yaw: 120.4,
            type: 'scene',
            text: 'Вернуться на основную точку',
            sceneId: 'baikal-panorama'
          }
        ]
      }
    }
  },
  'kamchatka-panorama': {
    title: 'Камчатка - Долина гейзеров',
    description: 'Погрузитесь в уникальную атмосферу Долины гейзеров с ее вулканической активностью и паром.',
    imageUrl: 'https://pannellum.org/images/alma.jpg',
    hotSpots: [
      {
        pitch: 12.3,
        yaw: -27.8,
        type: 'info',
        text: 'Гейзер Великан - один из крупнейших гейзеров Камчатки'
      },
      {
        pitch: -2.1,
        yaw: 67.3,
        type: 'info',
        text: 'Вулкан Карымский - один из самых активных вулканов Камчатки'
      },
      {
        pitch: 5.2,
        yaw: 110.1,
        type: 'scene',
        text: 'Перейти к вулкану Мутновский',
        sceneId: 'kamchatka-mutnovsky'
      }
    ],
    linkedScenes: {
      'kamchatka-mutnovsky': {
        imageUrl: 'https://pannellum.org/images/jfk.jpg',
        hotSpots: [
          {
            pitch: 3.1,
            yaw: 15.1,
            type: 'info',
            text: 'Вулкан Мутновский - действующий вулкан высотой 2323 метра'
          },
          {
            pitch: -5.3,
            yaw: 67.2,
            type: 'scene',
            text: 'Вернуться в Долину гейзеров',
            sceneId: 'kamchatka-panorama'
          }
        ]
      }
    }
  },
  'altai-panorama': {
    title: 'Алтайские горы',
    description: 'Осмотритесь вокруг и насладитесь величественными видами горных хребтов Алтая.',
    imageUrl: 'https://pannellum.org/images/jfk.jpg',
    hotSpots: [
      {
        pitch: 0.3,
        yaw: 43.8,
        type: 'info',
        text: 'Белуха - высочайшая вершина Алтая (4506 м)'
      },
      {
        pitch: -8.1,
        yaw: 21.3,
        type: 'info',
        text: 'Река Катунь - одна из главных рек Алтая'
      },
      {
        pitch: 2.2,
        yaw: 85.5,
        type: 'scene',
        text: 'Перейти к Телецкому озеру',
        sceneId: 'altai-teletskoye'
      }
    ],
    linkedScenes: {
      'altai-teletskoye': {
        imageUrl: 'https://pannellum.org/images/trail.jpg',
        hotSpots: [
          {
            pitch: 1.1,
            yaw: 35.1,
            type: 'info',
            text: 'Телецкое озеро - крупнейшее озеро Алтая, глубиной до 325 метров'
          },
          {
            pitch: -3.3,
            yaw: 127.2,
            type: 'scene',
            text: 'Вернуться к горным хребтам',
            sceneId: 'altai-panorama'
          }
        ]
      }
    }
  },
  'karelia-panorama': {
    title: 'Карельские озера',
    description: 'Виртуальный тур по живописным местам Карелии с ее озерами и лесами.',
    imageUrl: 'https://pannellum.org/images/trail.jpg',
    hotSpots: [
      {
        pitch: 2.3,
        yaw: 37.8,
        type: 'info',
        text: 'Озеро Ладожское - крупнейшее пресноводное озеро в Европе'
      },
      {
        pitch: -5.1,
        yaw: 87.3,
        type: 'info',
        text: 'Рускеальский мраморный каньон - бывший мраморный карьер'
      },
      {
        pitch: 1.2,
        yaw: 150.1,
        type: 'scene',
        text: 'Перейти к водопаду Кивач',
        sceneId: 'karelia-kivach'
      }
    ],
    linkedScenes: {
      'karelia-kivach': {
        imageUrl: 'https://pannellum.org/images/cerro-toco-0.jpg',
        hotSpots: [
          {
            pitch: 3.1,
            yaw: 15.1,
            type: 'info',
            text: 'Водопад Кивач - второй по величине равнинный водопад Европы'
          },
          {
            pitch: -5.3,
            yaw: 67.2,
            type: 'scene',
            text: 'Вернуться к озерам',
            sceneId: 'karelia-panorama'
          }
        ]
      }
    }
  }
};

// Отслеживание активных панорам
let activePanorama = null;
let isInitializing = false;

// Функция для прокрутки к секции, доступная глобально
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (!element) return;
  
  const navHeight = document.querySelector('.navbar').offsetHeight;
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - navHeight;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Делаем все секции видимыми
  sections.forEach(section => {
    section.classList.add('visible');
  });
  
  // Инициализация кнопки "Наверх"
  initBackToTop();
  
  // Инициализация карты
  initMap();
  
  // Инициализация AOS (Animate On Scroll)
  initAOS();
  
  // Инициализация панорам с задержкой для улучшения производительности
  setTimeout(() => {
    initPanoramas();
  }, 1000);
  
  // Инициализация навигации
  initNavigation();
  
  // Вывод отладочной информации
  console.log('Навигационные ссылки:', navLinks.length);
  navLinks.forEach(link => {
    console.log('Ссылка:', link.getAttribute('href'));
  });
  
  console.log('Секции:', sections.length);
  sections.forEach(section => {
    console.log('ID секции:', section.id);
  });
});

// Инициализация AOS (Animate On Scroll)
function initAOS() {
  // Проверяем, загружена ли библиотека AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false,
      mirror: true,
      disable: window.innerWidth < 768 ? true : false, // Отключаем на мобильных устройствах
      offset: 50
    });
  } else {
    // Если библиотека не загружена, пробуем инициализировать через некоторое время
    setTimeout(initAOS, 500);
  }
}

// Инициализация кнопки "Наверх"
function initBackToTop() {
  // Используем throttle для оптимизации обработчика прокрутки
  let lastScrollTime = 0;
  window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScrollTime > 100) { // Проверяем каждые 100мс
      lastScrollTime = now;
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });
  
  // Обработчик клика по кнопке
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Инициализация карты
function initMap() {
  mapMarkers.forEach(marker => {
    marker.addEventListener('click', () => {
      const location = marker.dataset.location;
      const element = document.getElementById(location);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Проверка видимости элемента в области просмотра
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Инициализация панорам
function initPanoramas() {
  // Инициализируем панораму только при необходимости
  const panoramaSection = document.getElementById('panoramas');
  
  // Инициализация обработчиков для вкладок
  panoramaTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (isInitializing) return; // Предотвращаем множественные клики
      isInitializing = true;
      
      // Убираем активный класс у всех вкладок
      panoramaTabs.forEach(t => t.classList.remove('active'));
      // Добавляем активный класс текущей вкладке
      tab.classList.add('active');
      
      // Получаем ID целевой панорамы
      const targetId = tab.dataset.target;
      
      // Скрываем все панорамы
      panoramaViewers.forEach(viewer => {
        // Если это не целевая панорама и у неё есть экземпляр, уничтожаем его для экономии памяти
        if (viewer.id !== targetId && viewer.panoramaInstance) {
          try {
            viewer.panoramaInstance.destroy();
            viewer.panoramaInstance = null;
          } catch (e) {
            console.error('Ошибка при уничтожении панорамы:', e);
          }
        }
        viewer.classList.remove('active');
      });
      
      // Показываем выбранную панораму
      const targetViewer = document.getElementById(targetId);
      if (targetViewer) {
        targetViewer.classList.add('active');
        
        // Инициализируем панораму
        initPanorama(targetId, targetId);
      }
      
      setTimeout(() => {
        isInitializing = false;
      }, 500);
    });
  });
  
  // Добавляем отложенную инициализацию первой панорамы
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !document.getElementById('baikal-panorama').hasAttribute('data-initialized')) {
        initPanorama('baikal-panorama', 'baikal-panorama');
        observer.disconnect();
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(panoramaSection);
}

// Инициализация конкретной панорамы
function initPanorama(viewerId, sceneId) {
  const viewer = document.getElementById(viewerId);
  if (!viewer) return;
  
  // Показываем индикатор загрузки
  viewer.innerHTML = '<div class="panorama-loading">Загрузка панорамы...</div>';
  
  // Очищаем содержимое контейнера, если он уже был инициализирован
  if (viewer.hasAttribute('data-initialized') && viewer.panoramaInstance) {
    try {
      viewer.panoramaInstance.destroy();
      viewer.panoramaInstance = null;
    } catch (e) {
      console.error('Ошибка при уничтожении панорамы:', e);
    }
  }
  
  // Отмечаем, что панорама инициализирована
  viewer.setAttribute('data-initialized', 'true');
  
  // Получаем данные для панорамы
  const data = panoramaData[sceneId];
  if (!data) return;
  
  // Создаем конфигурацию для панорамы с оптимизированными настройками
  const config = {
    default: {
      firstScene: sceneId,
      sceneFadeDuration: 750,
      autoLoad: true,
      compass: false, // Отключаем компас для повышения производительности
      mouseZoom: true,
      draggable: true,
      disableKeyboardCtrl: false,
      showControls: true,
      showFullscreenCtrl: true,
      showZoomCtrl: true,
      keyboardZoom: true,
      hfov: 100, // Оптимальное поле зрения
      minHfov: 50, // Минимальное поле зрения
      maxHfov: 120 // Максимальное поле зрения
    },
    scenes: {}
  };
  
  // Добавляем основную сцену с оптимизированными настройками
  config.scenes[sceneId] = {
    type: 'equirectangular',
    panorama: data.imageUrl,
    hotSpots: data.hotSpots || [],
    autoRotate: -1, // Уменьшаем скорость вращения для снижения нагрузки
    autoLoad: true,
    friction: 0.4, // Увеличиваем трение для более плавного движения
    horizonPitch: 0, // Фиксируем горизонт
    horizonRoll: 0 // Фиксируем горизонт
  };
  
  // Добавляем связанные сцены, если они есть
  if (data.linkedScenes) {
    for (const [linkedId, linkedData] of Object.entries(data.linkedScenes)) {
      config.scenes[linkedId] = {
        type: 'equirectangular',
        panorama: linkedData.imageUrl,
        hotSpots: linkedData.hotSpots || [],
        autoLoad: false // Загружаем связанные сцены только при необходимости
      };
    }
  }
  
  try {
    // Используем setTimeout для предотвращения блокировки UI
    setTimeout(() => {
      // Инициализируем панораму с помощью Pannellum
      const panorama = pannellum.viewer(viewerId, config);
      
      // Минимизируем количество обработчиков событий
      panorama.on('load', function() {
        // Удаляем индикатор загрузки
        const loadingElement = viewer.querySelector('.panorama-loading');
        if (loadingElement) loadingElement.remove();
      });
      
      panorama.on('scenechange', function(sceneId) {
        // Обновляем информацию о панораме при смене сцены
        updatePanoramaInfo(sceneId);
      });
      
      // Сохраняем экземпляр панорамы для возможного использования позже
      viewer.panoramaInstance = panorama;
      activePanorama = panorama;
      
      // Обновляем информацию о панораме
      updatePanoramaInfo(sceneId);
    }, 100);
  } catch (e) {
    console.error('Ошибка при инициализации панорамы:', e);
    viewer.innerHTML = `<div class="panorama-error">
      <p>Не удалось загрузить панораму. Пожалуйста, попробуйте обновить страницу.</p>
      <p>Ошибка: ${e.message}</p>
    </div>`;
  }
}

// Обновление информации о панораме
function updatePanoramaInfo(viewerId) {
  const data = panoramaData[viewerId];
  if (!data) return;
  
  document.getElementById('panorama-title').textContent = data.title;
  document.getElementById('panorama-description').textContent = data.description;
}

// Инициализация навигации
function initNavigation() {
  // Добавляем обработчики для каждой навигационной ссылки
  document.querySelector('a[href="#baikal"]').addEventListener('click', function(e) {
    e.preventDefault();
    scrollToSection('baikal');
  });
  
  document.querySelector('a[href="#kamchatka"]').addEventListener('click', function(e) {
    e.preventDefault();
    scrollToSection('kamchatka');
  });
  
  document.querySelector('a[href="#altai"]').addEventListener('click', function(e) {
    e.preventDefault();
    scrollToSection('altai');
  });
  
  document.querySelector('a[href="#karelia"]').addEventListener('click', function(e) {
    e.preventDefault();
    scrollToSection('karelia');
  });
}

// Оптимизированный обработчик скролла
function handleScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      // Минимальная логика в обработчике скролла
      isScrolling = true;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 150);
      
      ticking = false;
    });
    ticking = true;
  }
}

// Пассивные обработчики событий для лучшей производительности
window.addEventListener('scroll', handleScroll, { passive: true });

// Оптимизация для изменения размера окна
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Пересчет только при необходимости
    AOS.refresh();
  }, 250);
}, { passive: true });

// Оптимизация для мобильных устройств
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Очистка неиспользуемых панорам при прокрутке страницы
window.addEventListener('scroll', () => {
  const panoramaSection = document.getElementById('panoramas');
  if (!panoramaSection) return;
  
  // Если секция панорам не видна, можно уничтожить активную панораму для экономии памяти
  if (!isElementInViewport(panoramaSection) && activePanorama) {
    panoramaViewers.forEach(viewer => {
      if (viewer.panoramaInstance && !viewer.classList.contains('active')) {
        try {
          viewer.panoramaInstance.destroy();
          viewer.panoramaInstance = null;
        } catch (e) {
          console.error('Ошибка при уничтожении панорамы:', e);
        }
      }
    });
  }
  
  // Обновляем анимации AOS при прокрутке
  if (typeof AOS !== 'undefined' && !isScrolling) {
    AOS.refresh();
  }
}, { passive: true });

// Обновляем AOS при изменении размера окна
window.addEventListener('resize', () => {
  if (typeof AOS !== 'undefined') {
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }
}, { passive: true });
