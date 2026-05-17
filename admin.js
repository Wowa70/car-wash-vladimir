// Данные по автомойкам Владимирской области (общие для пользователя и админа)
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

class AdminApp {
    constructor() {
        this.washList = document.getElementById('adminWashList');
        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        this.lastUpdatedEl = document.getElementById('lastUpdated');
        
        this.init();
    }
    
    init() {
        this.renderAdminWashBays();
        this.startAutoRefresh();
    }
    
    renderAdminWashBays() {
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
                    <div class="wash-bay admin-mode ${status}" data-id="${bay.id}">
                        <h3>${bay.name}</h3>
                        <div class="address">${bay.city}, ${bay.address}</div>
                        <div class="status">${statusText}</div>
                        <div class="bays">Всего боксов: ${bay.totalBays}</div>
                        
                        <div class="status-controls">
                            <button class="status-btn free ${bay.freeBays > 0 ? 'active' : ''}" data-action="setFree" data-id="${bay.id}">
                                ✅ Свободно
                            </button>
                            <button class="status-btn busy ${bay.freeBays === 0 ? 'active' : ''}" data-action="setBusy" data-id="${bay.id}">
                                🔴 Занято
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            
            this.setupAdminEventListeners();
            this.updateLastUpdated();
            
        }, 500);
    }
    
    setupAdminEventListeners() {
        // Обработчики кнопок статуса
        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const action = e.target.dataset.action;
                this.updateBayStatus(id, action);
            });
        });
    }
    
    updateBayStatus(id, action) {
        const bay = washBays.find(b => b.id === id);
        if (!bay) return;
        
        if (action === 'setFree') {
            // Устанавливаем все боксы свободными
            bay.freeBays = bay.totalBays;
        } else if (action === 'setBusy') {
            // Устанавливаем все боксы занятыми
            bay.freeBays = 0;
        }
        
        this.renderAdminWashBays();
        this.saveData();
    }
    
    saveData() {
        // Сохраняем данные в localStorage для синхронизации между вкладками
        localStorage.setItem('washBaysData', JSON.stringify(washBays));
        localStorage.setItem('washBaysLastUpdated', new Date().toISOString());
        
        // Отправляем событие другим вкладкам
        window.dispatchEvent(new Event('storage'));
    }
    
    updateLastUpdated() {
        const now = new Date();
        this.lastUpdatedEl.textContent = now.toLocaleTimeString('ru-RU');
    }
    
    startAutoRefresh() {
        // Обновляем данные каждые 5 секунд (проверяем localStorage)
        setInterval(() => {
            const savedData = localStorage.getItem('washBaysData');
            if (savedData) {
                const updatedBays = JSON.parse(savedData);
                // Обновляем локальные данные
                updatedBays.forEach(updatedBay => {
                    const localBay = washBays.find(b => b.id === updatedBay.id);
                    if (localBay) {
                        localBay.freeBays = updatedBay.freeBays;
                    }
                });
                this.renderAdminWashBays();
            }
        }, 5000);
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

// Запускаем приложение администратора
document.addEventListener('DOMContentLoaded', () => {
    new AdminApp();
});

