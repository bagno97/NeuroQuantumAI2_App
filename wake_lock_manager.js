/**
 * Wake Lock Manager
 * System zarządzania Wake Lock API dla działania przy wygaszonym ekranie
 * - Screen Wake Lock dla utrzymania aktywności
 * - Automatyczne zarządzanie w zależności od stanu aplikacji
 * - Monitoring czasu działania
 * - Fallback dla nieobsługiwanych przeglądarek
 */

class WakeLockManager {
    constructor(config = {}) {
        this.config = {
            autoManage: config.autoManage !== false,
            releaseOnVisibilityChange: config.releaseOnVisibilityChange !== false,
            maxWakeLockDuration: config.maxWakeLockDuration || 3600000, // 1 godzina
            batteryThreshold: config.batteryThreshold || 15, // 15% baterii
            debugMode: config.debugMode || false
        };
        
        // Stan Wake Lock
        this.wakeLock = null;
        this.isWakeLockSupported = 'wakeLock' in navigator;
        this.isActive = false;
        this.activationTime = null;
        this.totalActiveTime = 0;
        
        // Monitoring
        this.monitoringInterval = null;
        this.visibilityChangeHandler = null;
        this.batteryManager = null;
        
        // Statystyki
        this.stats = {
            activationCount: 0,
            totalActiveTime: 0,
            averageSessionDuration: 0,
            batteryOptimizedReleases: 0,
            manualReleases: 0,
            automaticReleases: 0,
            errors: 0
        };
        
        // Historia sesji
        this.sessionHistory = [];
        this.maxHistoryLength = 50;
        
        // Callbacki
        this.eventCallbacks = new Map();
        
        // Fallback dla nieobsługiwanych przeglądarek
        this.fallbackMethods = {
            videoElement: null,
            audioContext: null,
            noSleepEnabled: false
        };
        
        console.log('🔒 Wake Lock Manager zainicjalizowany');
        
        if (!this.isWakeLockSupported) {
            console.warn('⚠️ Wake Lock API nie jest obsługiwane - używam fallback');
            this.initializeFallbackMethods();
        }
    }
    
    // Inicjalizacja managera
    async initialize() {
        try {
            console.log('🔒 Inicjalizacja Wake Lock Manager...');
            
            // Sprawdź dostępność API
            await this.checkWakeLockSupport();
            
            // Inicjalizuj monitoring baterii
            await this.initializeBatteryMonitoring();
            
            // Skonfiguruj automatyczne zarządzanie
            if (this.config.autoManage) {
                this.setupAutoManagement();
            }
            
            console.log('✅ Wake Lock Manager zainicjalizowany');
            this.triggerEvent('initialized', {
                supported: this.isWakeLockSupported,
                autoManage: this.config.autoManage
            });
            
            return true;
            
        } catch (error) {
            console.error('❌ Błąd inicjalizacji Wake Lock Manager:', error);
            this.stats.errors++;
            return false;
        }
    }
    
    // Sprawdzenie obsługi Wake Lock API
    async checkWakeLockSupport() {
        if ('wakeLock' in navigator) {
            try {
                // Test czy można uzyskać wake lock
                const testLock = await navigator.wakeLock.request('screen');
                await testLock.release();
                
                this.isWakeLockSupported = true;
                console.log('✅ Wake Lock API w pełni obsługiwane');
                
            } catch (error) {
                console.warn('⚠️ Wake Lock API dostępne ale ograniczone:', error);
                this.isWakeLockSupported = false;
                this.initializeFallbackMethods();
            }
        } else {
            this.isWakeLockSupported = false;
            this.initializeFallbackMethods();
        }
    }
    
    // Inicjalizacja metod fallback
    initializeFallbackMethods() {
        console.log('🔄 Inicjalizacja metod fallback...');
        
        // Metoda 1: Niewidoczny element video
        this.fallbackMethods.videoElement = document.createElement('video');
        this.fallbackMethods.videoElement.setAttribute('muted', '');
        this.fallbackMethods.videoElement.setAttribute('playsinline', '');
        this.fallbackMethods.videoElement.style.position = 'fixed';
        this.fallbackMethods.videoElement.style.top = '-1px';
        this.fallbackMethods.videoElement.style.left = '-1px';
        this.fallbackMethods.videoElement.style.width = '1px';
        this.fallbackMethods.videoElement.style.height = '1px';
        this.fallbackMethods.videoElement.style.opacity = '0';
        
        // Utwórz pusty plik video (data URL)
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 1, 1);
        
        canvas.toBlob((blob) => {
            const videoURL = URL.createObjectURL(blob);
            this.fallbackMethods.videoElement.src = videoURL;
        });
        
        // Metoda 2: Audio Context (dla niektórych przeglądarek)
        try {
            this.fallbackMethods.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('⚠️ Audio Context niedostępny:', error);
        }
        
        console.log('✅ Metody fallback zainicjalizowane');
    }
    
    // Inicjalizacja monitoringu baterii
    async initializeBatteryMonitoring() {
        if ('getBattery' in navigator) {
            try {
                this.batteryManager = await navigator.getBattery();
                console.log('🔋 Monitoring baterii zainicjalizowany');
            } catch (error) {
                console.warn('⚠️ Monitoring baterii niedostępny:', error);
            }
        }
    }
    
    // Konfiguracja automatycznego zarządzania
    setupAutoManagement() {
        // Nasłuchuj zmiany widoczności strony
        if (this.config.releaseOnVisibilityChange) {
            this.visibilityChangeHandler = () => {
                if (document.hidden) {
                    this.log('📱 Aplikacja w tle - utrzymuję Wake Lock');
                    // Nie zwalniamy wake lock gdy aplikacja idzie w tło
                } else {
                    this.log('📱 Aplikacja na pierwszym planie');
                }
            };
            
            document.addEventListener('visibilitychange', this.visibilityChangeHandler);
        }
        
        // Monitoring czasu aktywności
        this.startActivityMonitoring();
        
        console.log('🤖 Automatyczne zarządzanie Wake Lock włączone');
    }
    
    // Rozpocznij monitoring aktywności
    startActivityMonitoring() {
        if (this.monitoringInterval) return;
        
        this.monitoringInterval = setInterval(() => {
            this.performMonitoringCheck();
        }, 30000); // Co 30 sekund
        
        this.log('📊 Monitoring aktywności rozpoczęty');
    }
    
    // Zatrzymaj monitoring aktywności
    stopActivityMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
            this.log('📊 Monitoring aktywności zatrzymany');
        }
    }
    
    // Sprawdzenie monitoringu
    performMonitoringCheck() {
        if (!this.isActive) return;
        
        const currentTime = Date.now();
        const activeDuration = currentTime - this.activationTime;
        
        // Sprawdź maksymalny czas aktywności
        if (activeDuration > this.config.maxWakeLockDuration) {
            this.log('⏰ Przekroczono maksymalny czas Wake Lock - zwalnianie');
            this.release('max_duration_exceeded');
            return;
        }
        
        // Sprawdź poziom baterii
        if (this.batteryManager) {
            const batteryLevel = Math.round(this.batteryManager.level * 100);
            
            if (batteryLevel <= this.config.batteryThreshold && !this.batteryManager.charging) {
                this.log(`🔋 Niski poziom baterii (${batteryLevel}%) - zwalnianie Wake Lock`);
                this.release('low_battery');
                this.stats.batteryOptimizedReleases++;
                return;
            }
        }
        
        this.log(`🔒 Wake Lock aktywny przez ${Math.round(activeDuration / 1000)}s`);
    }
    
    // Aktywacja Wake Lock
    async request(reason = 'manual') {
        if (this.isActive) {
            this.log('⚠️ Wake Lock już jest aktywny');
            return true;
        }
        
        try {
            this.log(`🔒 Aktywacja Wake Lock (powód: ${reason})...`);
            
            if (this.isWakeLockSupported) {
                await this.requestNativeWakeLock();
            } else {
                await this.requestFallbackWakeLock();
            }
            
            this.isActive = true;
            this.activationTime = Date.now();
            this.stats.activationCount++;
            
            this.log('✅ Wake Lock aktywowany');
            this.triggerEvent('activated', { reason, method: this.isWakeLockSupported ? 'native' : 'fallback' });
            
            return true;
            
        } catch (error) {
            console.error('❌ Błąd aktywacji Wake Lock:', error);
            this.stats.errors++;
            this.triggerEvent('error', { type: 'activation_failed', error: error.message });
            return false;
        }
    }
    
    // Natywny Wake Lock
    async requestNativeWakeLock() {
        this.wakeLock = await navigator.wakeLock.request('screen');
        
        // Nasłuchuj zwolnienia wake lock
        this.wakeLock.addEventListener('release', () => {
            this.log('🔓 Native Wake Lock zwolniony');
            this.handleWakeLockRelease('native_release');
        });
    }
    
    // Fallback Wake Lock
    async requestFallbackWakeLock() {
        // Metoda 1: Odtwarzanie niewidocznego video
        if (this.fallbackMethods.videoElement) {
            document.body.appendChild(this.fallbackMethods.videoElement);
            
            try {
                this.fallbackMethods.videoElement.loop = true;
                await this.fallbackMethods.videoElement.play();
                this.fallbackMethods.noSleepEnabled = true;
                this.log('📹 Fallback Wake Lock (video) aktywowany');
            } catch (error) {
                this.log('⚠️ Fallback video nie powiódł się:', error);
            }
        }
        
        // Metoda 2: Audio Context
        if (this.fallbackMethods.audioContext && this.fallbackMethods.audioContext.state === 'suspended') {
            try {
                await this.fallbackMethods.audioContext.resume();
                this.log('🔊 Fallback Wake Lock (audio) aktywowany');
            } catch (error) {
                this.log('⚠️ Fallback audio nie powiódł się:', error);
            }
        }
    }
    
    // Zwolnienie Wake Lock
    async release(reason = 'manual') {
        if (!this.isActive) {
            this.log('⚠️ Wake Lock nie jest aktywny');
            return true;
        }
        
        try {
            this.log(`🔓 Zwalnianie Wake Lock (powód: ${reason})...`);
            
            if (this.isWakeLockSupported && this.wakeLock) {
                await this.wakeLock.release();
                this.wakeLock = null;
            } else {
                await this.releaseFallbackWakeLock();
            }
            
            this.handleWakeLockRelease(reason);
            
            this.log('✅ Wake Lock zwolniony');
            return true;
            
        } catch (error) {
            console.error('❌ Błąd zwalniania Wake Lock:', error);
            this.stats.errors++;
            this.triggerEvent('error', { type: 'release_failed', error: error.message });
            return false;
        }
    }
    
    // Zwolnienie fallback Wake Lock
    async releaseFallbackWakeLock() {
        // Zatrzymaj video
        if (this.fallbackMethods.videoElement && this.fallbackMethods.noSleepEnabled) {
            this.fallbackMethods.videoElement.pause();
            if (this.fallbackMethods.videoElement.parentNode) {
                this.fallbackMethods.videoElement.parentNode.removeChild(this.fallbackMethods.videoElement);
            }
            this.fallbackMethods.noSleepEnabled = false;
            this.log('📹 Fallback Wake Lock (video) zwolniony');
        }
        
        // Zawieś Audio Context
        if (this.fallbackMethods.audioContext && this.fallbackMethods.audioContext.state === 'running') {
            try {
                await this.fallbackMethods.audioContext.suspend();
                this.log('🔊 Fallback Wake Lock (audio) zwolniony');
            } catch (error) {
                this.log('⚠️ Błąd zawieszania Audio Context:', error);
            }
        }
    }
    
    // Obsługa zwolnienia Wake Lock
    handleWakeLockRelease(reason) {
        if (!this.isActive) return;
        
        // Oblicz czas sesji
        const sessionDuration = Date.now() - this.activationTime;
        this.totalActiveTime += sessionDuration;
        
        // Zapisz sesję do historii
        this.sessionHistory.push({
            startTime: this.activationTime,
            endTime: Date.now(),
            duration: sessionDuration,
            reason: reason
        });
        
        // Ogranicz historię
        if (this.sessionHistory.length > this.maxHistoryLength) {
            this.sessionHistory.shift();
        }
        
        // Aktualizuj statystyki
        this.stats.totalActiveTime += sessionDuration;
        this.stats.averageSessionDuration = this.stats.totalActiveTime / this.stats.activationCount;
        
        if (reason === 'manual') {
            this.stats.manualReleases++;
        } else {
            this.stats.automaticReleases++;
        }
        
        // Reset stanu
        this.isActive = false;
        this.activationTime = null;
        
        this.triggerEvent('released', { 
            reason, 
            duration: sessionDuration,
            totalActiveTime: this.totalActiveTime
        });
    }
    
    // Sprawdź czy Wake Lock jest aktywny
    isWakeLockActive() {
        return this.isActive;
    }
    
    // Pobierz status Wake Lock
    getStatus() {
        return {
            isActive: this.isActive,
            isSupported: this.isWakeLockSupported,
            activationTime: this.activationTime,
            currentSessionDuration: this.isActive ? Date.now() - this.activationTime : 0,
            method: this.isWakeLockSupported ? 'native' : 'fallback',
            autoManage: this.config.autoManage
        };
    }
    
    // Pobierz statystyki
    getStatistics() {
        return {
            ...this.stats,
            currentStatus: this.getStatus(),
            recentSessions: this.sessionHistory.slice(-10),
            config: { ...this.config }
        };
    }
    
    // Automatyczne zarządzanie na podstawie stanu aplikacji
    enableAutoMode() {
        this.config.autoManage = true;
        
        // Aktywuj Wake Lock gdy aplikacja idzie w tło
        const handleVisibilityChange = async () => {
            if (document.hidden && !this.isActive) {
                this.log('📱 Aplikacja w tle - aktywuję Wake Lock');
                await this.request('app_background');
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        this.log('🤖 Tryb automatyczny włączony');
        this.triggerEvent('auto_mode_enabled', {});
    }
    
    // Wyłącz automatyczne zarządzanie
    disableAutoMode() {
        this.config.autoManage = false;
        
        if (this.visibilityChangeHandler) {
            document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
        }
        
        this.stopActivityMonitoring();
        
        this.log('🤖 Tryb automatyczny wyłączony');
        this.triggerEvent('auto_mode_disabled', {});
    }
    
    // Zarządzanie zdarzeniami
    on(eventType, callback) {
        if (!this.eventCallbacks.has(eventType)) {
            this.eventCallbacks.set(eventType, []);
        }
        this.eventCallbacks.get(eventType).push(callback);
    }
    
    off(eventType, callback) {
        if (this.eventCallbacks.has(eventType)) {
            const callbacks = this.eventCallbacks.get(eventType);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    
    triggerEvent(eventType, data) {
        if (this.eventCallbacks.has(eventType)) {
            this.eventCallbacks.get(eventType).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`❌ Błąd w callback ${eventType}:`, error);
                }
            });
        }
    }
    
    // Logowanie z opcjonalnym debug mode
    log(message) {
        if (this.config.debugMode) {
            console.log(`🔒 WakeLock: ${message}`);
        }
    }
    
    // Czyszczenie zasobów
    cleanup() {
        // Zwolnij Wake Lock
        if (this.isActive) {
            this.release('cleanup');
        }
        
        // Zatrzymaj monitoring
        this.stopActivityMonitoring();
        
        // Usuń event listenery
        if (this.visibilityChangeHandler) {
            document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
        }
        
        // Wyczyść fallback elementy
        if (this.fallbackMethods.videoElement && this.fallbackMethods.videoElement.parentNode) {
            this.fallbackMethods.videoElement.parentNode.removeChild(this.fallbackMethods.videoElement);
        }
        
        this.log('🧹 Wake Lock Manager wyczyszczony');
    }
}

// Helper functions
async function requestWakeLock(reason = 'manual') {
    if (!window.wakeLockManager) {
        window.wakeLockManager = new WakeLockManager();
        await window.wakeLockManager.initialize();
    }
    
    return await window.wakeLockManager.request(reason);
}

async function releaseWakeLock(reason = 'manual') {
    if (window.wakeLockManager) {
        return await window.wakeLockManager.release(reason);
    }
    return false;
}

function isWakeLockActive() {
    return window.wakeLockManager ? window.wakeLockManager.isWakeLockActive() : false;
}

function getWakeLockStatus() {
    return window.wakeLockManager ? window.wakeLockManager.getStatus() : null;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        WakeLockManager,
        requestWakeLock,
        releaseWakeLock,
        isWakeLockActive,
        getWakeLockStatus
    };
} else if (typeof window !== 'undefined') {
    window.WakeLockManager = WakeLockManager;
    window.requestWakeLock = requestWakeLock;
    window.releaseWakeLock = releaseWakeLock;
    window.isWakeLockActive = isWakeLockActive;
    window.getWakeLockStatus = getWakeLockStatus;
    
    console.log('🔒 Wake Lock Manager załadowany!');
}