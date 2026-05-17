// Данные по автомойкам Владимирской области
const washBays = [
    {
        id: 1,
        city: "Владимир",
        address: "ул. Добросельская, 123",
        name: "Мойка №1",
        totalBays: 4,
        freeBays: 2
    },
    {
        id: 2,
        city: "Владимир", 
        address: "пр. Строителей, 45",
        name: "Мойка №2",
        totalBays: 3,
        freeBays: 0
    },
    {
        id: 3,
        city: "Ковров",
        address: "ул. Дегтярева, 67",
        name: "Мойка №3",
        totalBays: 2,
        freeBays: 1
    },
    {
        id: 4,
        city: "Муром",
        address: "ул. Московская, 89",
        name: "Мойка №4", 
        totalBays: 3,
        freeBays: 3
    },
    {
        id: 5,
        city: "Гусь-Хрустальный",
        address: "ул. Калинина, 12",
        name: "Мойка №5",
        totalBays: 2,
        freeBays: 1
    }
];

class CarWashApp {
    constructor() {
        this.washList = document.getElementById('washList');
        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        this.refreshBtn = document.getElementById('refreshBtn');
        
        this.init();
    }
    
    init() {
        this.loadSharedData();
        this.renderWashBays();
        this.setupEventListeners();
        this.startAutoRefresh();
        
        // Регистрируем Service Worker для PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(() => console.log('SW registered'))
                .catch(err => console.log('SW registration failed: ', err));
        }
        
        // Слушаем изменения из admin.html
        window.addEventListener('storage', () => {
            this.loadSharedData();
            this.renderWashBays();
        });
    }
    
    loadSharedData() {
        // Загружаем данные из localStorage если они есть
        const savedData = localStorage.getItem('washBaysData');
        if (savedData) {
            const updatedBays = JSON.parse(savedData);
            updatedBays.forEach(updatedBay => {
                const localBay = washBays.find(b => b.id === updatedBay.id);
                if (localBay) {
                    localBay.freeBays = updatedBay.freeBays;
                }
            });
        }
    }
    
    renderWashBays() {
        this.hideError();
        this.showLoading();
        
        // Имитация загрузки данных
        setTimeout(() => {
            this.hideLoading();
            
            if (!washBays || washBays.length === 0) {
                this.showError('Нет данных о мойках');
                return;
            }
            
            this.washList.innerHTML = washBays.map(bay => {
                const status = bay.freeBays > 0 ? 'free' : 'busy';
                const statusText = bay.freeBays > 0 ? 'Свободно 🟢' : 'Занято 🔴';
                
                return `
                    <div class="wash-bay ${status}">
                        <h3>${bay.name}</h3>
                        <div class="address">${bay.city}, ${bay.address}</div>
                        <div class="status">${statusText}</div>
                        <div class="bays">Свободно: ${bay.freeBays} из ${bay.totalBays} боксов</div>
                    </div>
                `;
            }).join('');
            
        }, 1000); // Имитация задержки сети
    }
    
    setupEventListeners() {
        this.refreshBtn.addEventListener('click', () => {
            this.refreshBtn.disabled = true;
            this.renderWashBays();
            setTimeout(() => {
                this.refreshBtn.disabled = false;
            }, 2000);
        });
    }
    
    startAutoRefresh() {
        // Обновляем данные каждые 30 секунд
        setInterval(() => {
            this.loadSharedData();
            this.renderWashBays();
        }, 30000);
    }
    
    showLoading() {
        this.loading.classList.remove('hidden');
        this.washList.classList.add('hidden');
    }
    
    hideLoading() {
        this.loading.classList.add('hidden');
        this.washList.classList.remove('hidden');
    }
    
    showError(message) {
        this.error.textContent = message;
        this.error.classList.remove('hidden');
    }
    
    hideError() {
        this.error.classList.add('hidden');
    }
}

// Запускаем приложение
document.addEventListener('DOMContentLoaded', () => {
    new CarWashApp();
});
