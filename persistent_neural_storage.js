/**
 * Persistent Neural Storage System
 * System trwałego przechowywania stanów sieci neuronowej
 * - IndexedDB dla dużych danych neuronowych
 * - LocalStorage dla konfiguracji
 * - Kompresja i optymalizacja danych
 * - Automatyczne backupy i synchronizacja
 */

class PersistentNeuralStorage {
    constructor(config = {}) {
        this.config = {
            dbName: config.dbName || 'NeuroQuantumAI_Storage',
            dbVersion: config.dbVersion || 1,
            maxStorageSize: config.maxStorageSize || 100 * 1024 * 1024, // 100MB
            compressionEnabled: config.compressionEnabled !== false,
            autoBackup: config.autoBackup !== false,
            backupInterval: config.backupInterval || 300000, // 5 minut
            maxBackups: config.maxBackups || 10
        };
        
        // Database connection
        this.db = null;
        this.isInitialized = false;
        
        // Storage stores
        this.stores = {
            neural_networks: 'neural_networks',
            neural_states: 'neural_states',
            learning_history: 'learning_history',
            configurations: 'configurations',
            backups: 'backups',
            metadata: 'metadata'
        };
        
        // Kompresja
        this.compressionWorker = null;
        
        // Statystyki
        this.stats = {
            totalSaves: 0,
            totalLoads: 0,
            totalSize: 0,
            compressionRatio: 0,
            backupCount: 0,
            errors: 0
        };
        
        // Kolejka operacji
        this.operationQueue = [];
        this.isProcessingQueue = false;
        
        // Auto backup
        this.backupTimer = null;
        
        console.log('💾 Persistent Neural Storage zainicjalizowany');
    }
    
    // Inicjalizacja systemu storage
    async initialize() {
        try {
            console.log('💾 Inicjalizacja persistent storage...');
            
            // Otwórz bazę danych
            await this.openDatabase();
            
            // Sprawdź dostępną przestrzeń
            await this.checkStorageQuota();
            
            // Inicjalizuj kompresję
            this.initializeCompression();
            
            // Uruchom auto backup
            if (this.config.autoBackup) {
                this.startAutoBackup();
            }
            
            this.isInitialized = true;
            console.log('✅ Persistent storage zainicjalizowany');
            
            return true;
            
        } catch (error) {
            console.error('❌ Błąd inicjalizacji storage:', error);
            this.stats.errors++;
            return false;
        }
    }
    
    // Otwieranie bazy danych
    openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.config.dbName, this.config.dbVersion);
            
            request.onerror = () => {
                reject(new Error('Nie można otworzyć bazy danych'));
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('📂 Baza danych otwarta');
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                console.log('🔧 Aktualizacja schematu bazy danych...');
                
                // Utwórz object stores
                Object.values(this.stores).forEach(storeName => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        const store = db.createObjectStore(storeName, { keyPath: 'id' });
                        
                        // Dodaj indeksy
                        if (storeName === 'neural_networks') {
                            store.createIndex('timestamp', 'timestamp');
                            store.createIndex('type', 'type');
                        } else if (storeName === 'neural_states') {
                            store.createIndex('networkId', 'networkId');
                            store.createIndex('timestamp', 'timestamp');
                        } else if (storeName === 'learning_history') {
                            store.createIndex('networkId', 'networkId');
                            store.createIndex('timestamp', 'timestamp');
                        } else if (storeName === 'backups') {
                            store.createIndex('timestamp', 'timestamp');
                            store.createIndex('type', 'type');
                        }
                        
                        console.log(`📁 Utworzono store: ${storeName}`);
                    }
                });
            };
        });
    }
    
    // Sprawdzenie dostępnej przestrzeni
    async checkStorageQuota() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            try {
                const estimate = await navigator.storage.estimate();
                const usedMB = Math.round(estimate.usage / 1024 / 1024);
                const quotaMB = Math.round(estimate.quota / 1024 / 1024);
                
                console.log(`💾 Używane: ${usedMB}MB / ${quotaMB}MB`);
                
                if (estimate.usage > this.config.maxStorageSize) {
                    console.warn('⚠️ Przekroczono limit storage - uruchamiam czyszczenie');
                    await this.performStorageCleanup();
                }
                
                return { used: estimate.usage, quota: estimate.quota };
                
            } catch (error) {
                console.warn('⚠️ Nie można sprawdzić storage quota:', error);
                return null;
            }
        }
        
        return null;
    }
    
    // Inicjalizacja kompresji
    initializeCompression() {
        if (!this.config.compressionEnabled) return;
        
        try {
            // Prosta kompresja JSON (można rozszerzyć o LZ-string lub inne)
            this.compressionWorker = {
                compress: (data) => {
                    const jsonString = JSON.stringify(data);
                    // Tutaj można dodać prawdziwą kompresję
                    return jsonString;
                },
                decompress: (compressedData) => {
                    // Tutaj można dodać prawdziwą dekompresję
                    return JSON.parse(compressedData);
                }
            };
            
            console.log('🗜️ Kompresja zainicjalizowana');
            
        } catch (error) {
            console.warn('⚠️ Błąd inicjalizacji kompresji:', error);
            this.config.compressionEnabled = false;
        }
    }
    
    // Zapisywanie sieci neuronowej
    async saveNeuralNetwork(networkId, networkData) {
        if (!this.isInitialized) {
            throw new Error('Storage nie jest zainicjalizowany');
        }
        
        try {
            const saveData = {
                id: networkId,
                data: networkData,
                timestamp: Date.now(),
                type: 'neural_network',
                version: '2.0',
                compressed: this.config.compressionEnabled
            };
            
            // Kompresja jeśli włączona
            if (this.config.compressionEnabled && this.compressionWorker) {
                const originalSize = JSON.stringify(networkData).length;
                saveData.data = this.compressionWorker.compress(networkData);
                const compressedSize = saveData.data.length;
                
                this.stats.compressionRatio = compressedSize / originalSize;
                console.log(`🗜️ Kompresja: ${originalSize} → ${compressedSize} (${(this.stats.compressionRatio * 100).toFixed(1)}%)`);
            }
            
            await this.putData(this.stores.neural_networks, saveData);
            
            this.stats.totalSaves++;
            this.stats.totalSize += JSON.stringify(saveData).length;
            
            console.log(`💾 Zapisano sieć neuronową: ${networkId}`);
            return true;
            
        } catch (error) {
            console.error('❌ Błąd zapisu sieci:', error);
            this.stats.errors++;
            throw error;
        }
    }
    
    // Ładowanie sieci neuronowej
    async loadNeuralNetwork(networkId) {
        if (!this.isInitialized) {
            throw new Error('Storage nie jest zainicjalizowany');
        }
        
        try {
            const savedData = await this.getData(this.stores.neural_networks, networkId);
            
            if (!savedData) {
                return null;
            }
            
            let networkData = savedData.data;
            
            // Dekompresja jeśli potrzebna
            if (savedData.compressed && this.compressionWorker) {
                networkData = this.compressionWorker.decompress(savedData.data);
                console.log('🗜️ Dane zdekompresowane');
            }
            
            this.stats.totalLoads++;
            
            console.log(`📥 Załadowano sieć neuronową: ${networkId}`);
            return {
                data: networkData,
                timestamp: savedData.timestamp,
                version: savedData.version
            };
            
        } catch (error) {
            console.error('❌ Błąd ładowania sieci:', error);
            this.stats.errors++;
            throw error;
        }
    }
    
    // Zapisywanie stanu sieci
    async saveNeuralState(networkId, stateData) {
        try {
            const stateId = `${networkId}_state_${Date.now()}`;
            
            const saveData = {
                id: stateId,
                networkId: networkId,
                state: stateData,
                timestamp: Date.now(),
                type: 'neural_state'
            };
            
            await this.putData(this.stores.neural_states, saveData);
            
            // Ogranicz liczbę stanów na sieć
            await this.limitStatesPerNetwork(networkId, 20);
            
            console.log(`💾 Zapisano stan sieci: ${stateId}`);
            return stateId;
            
        } catch (error) {
            console.error('❌ Błąd zapisu stanu:', error);
            this.stats.errors++;
            throw error;
        }
    }
    
    // Ładowanie najnowszego stanu sieci
    async loadLatestNeuralState(networkId) {
        try {
            const states = await this.getDataByIndex(
                this.stores.neural_states, 
                'networkId', 
                networkId
            );
            
            if (states.length === 0) {
                return null;
            }
            
            // Sortuj według timestamp i weź najnowszy
            states.sort((a, b) => b.timestamp - a.timestamp);
            
            console.log(`📥 Załadowano najnowszy stan sieci: ${networkId}`);
            return states[0];
            
        } catch (error) {
            console.error('❌ Błąd ładowania stanu:', error);
            this.stats.errors++;
            throw error;
        }
    }
    
    // Zapisywanie historii uczenia się
    async saveLearningHistory(networkId, historyData) {
        try {
            const historyId = `${networkId}_history_${Date.now()}`;
            
            const saveData = {
                id: historyId,
                networkId: networkId,
                history: historyData,
                timestamp: Date.now(),
                type: 'learning_history'
            };
            
            await this.putData(this.stores.learning_history, saveData);
            
            // Ogranicz historię
            await this.limitHistoryPerNetwork(networkId, 50);
            
            console.log(`📚 Zapisano historię uczenia: ${historyId}`);
            return historyId;
            
        } catch (error) {
            console.error('❌ Błąd zapisu historii:', error);
            this.stats.errors++;
            throw error;
        }
    }
    
    // Zapisywanie konfiguracji
    async saveConfiguration(configId, configData) {
        try {
            const saveData = {
                id: configId,
                config: configData,
                timestamp: Date.now(),
                type: 'configuration'
            };
            
            await this.putData(this.stores.configurations, saveData);
            
            console.log(`⚙️ Zapisano konfigurację: ${configId}`);
            return true;
            
        } catch (error) {
            console.error('❌ Błąd zapisu konfiguracji:', error);
            this.stats.errors++;
            throw error;
        }
    }
    
    // Ładowanie konfiguracji
    async loadConfiguration(configId) {
        try {
            const configData = await this.getData(this.stores.configurations, configId);
            
            if (configData) {
                console.log(`⚙️ Załadowano konfigurację: ${configId}`);
                return configData.config;
            }
            
            return null;
            
        } catch (error) {
            console.error('❌ Błąd ładowania konfiguracji:', error);
            this.stats.errors++;
            throw error;
        }
    }
    
    // Tworzenie backupu
    async createBackup(backupId, data) {
        try {
            const backupData = {
                id: backupId || `backup_${Date.now()}`,
                data: data,
                timestamp: Date.now(),
                type: 'full_backup',
                size: JSON.stringify(data).length
            };
            
            await this.putData(this.stores.backups, backupData);
            
            this.stats.backupCount++;
            
            // Ogranicz liczbę backupów
            await this.limitBackups(this.config.maxBackups);
            
            console.log(`💾 Utworzono backup: ${backupData.id}`);
            return backupData.id;
            
        } catch (error) {
            console.error('❌ Błąd tworzenia backupu:', error);
            this.stats.errors++;
            throw error;
        }
    }
    
    // Przywracanie z backupu
    async restoreFromBackup(backupId) {
        try {
            const backupData = await this.getData(this.stores.backups, backupId);
            
            if (!backupData) {
                throw new Error(`Backup ${backupId} nie istnieje`);
            }
            
            console.log(`🔄 Przywracanie z backupu: ${backupId}`);
            return backupData.data;
            
        } catch (error) {
            console.error('❌ Błąd przywracania backupu:', error);
            this.stats.errors++;
            throw error;
        }
    }
    
    // Automatyczne backupy
    startAutoBackup() {
        if (this.backupTimer) return;
        
        this.backupTimer = setInterval(async () => {
            try {
                await this.performAutoBackup();
            } catch (error) {
                console.error('❌ Błąd auto backup:', error);
            }
        }, this.config.backupInterval);
        
        console.log('🔄 Auto backup uruchomiony');
    }
    
    stopAutoBackup() {
        if (this.backupTimer) {
            clearInterval(this.backupTimer);
            this.backupTimer = null;
            console.log('⏹️ Auto backup zatrzymany');
        }
    }
    
    // Wykonanie automatycznego backupu
    async performAutoBackup() {
        try {
            // Zbierz wszystkie dane do backupu
            const allNetworks = await this.getAllData(this.stores.neural_networks);
            const allConfigs = await this.getAllData(this.stores.configurations);
            
            const backupData = {
                networks: allNetworks,
                configurations: allConfigs,
                timestamp: Date.now(),
                version: '2.0'
            };
            
            const backupId = `auto_backup_${Date.now()}`;
            await this.createBackup(backupId, backupData);
            
            console.log('✅ Auto backup wykonany');
            
        } catch (error) {
            console.error('❌ Błąd auto backup:', error);
        }
    }
    
    // Podstawowe operacje na danych
    async putData(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    async getData(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    async getAllData(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    async getDataByIndex(storeName, indexName, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.getAll(value);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    async deleteData(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
    
    // Ograniczanie liczby stanów na sieć
    async limitStatesPerNetwork(networkId, maxStates) {
        try {
            const states = await this.getDataByIndex(
                this.stores.neural_states, 
                'networkId', 
                networkId
            );
            
            if (states.length > maxStates) {
                // Sortuj według timestamp i usuń najstarsze
                states.sort((a, b) => a.timestamp - b.timestamp);
                const toDelete = states.slice(0, states.length - maxStates);
                
                for (const state of toDelete) {
                    await this.deleteData(this.stores.neural_states, state.id);
                }
                
                console.log(`🗑️ Usunięto ${toDelete.length} starych stanów sieci ${networkId}`);
            }
            
        } catch (error) {
            console.error('❌ Błąd ograniczania stanów:', error);
        }
    }
    
    // Ograniczanie historii uczenia się
    async limitHistoryPerNetwork(networkId, maxHistory) {
        try {
            const histories = await this.getDataByIndex(
                this.stores.learning_history, 
                'networkId', 
                networkId
            );
            
            if (histories.length > maxHistory) {
                histories.sort((a, b) => a.timestamp - b.timestamp);
                const toDelete = histories.slice(0, histories.length - maxHistory);
                
                for (const history of toDelete) {
                    await this.deleteData(this.stores.learning_history, history.id);
                }
                
                console.log(`🗑️ Usunięto ${toDelete.length} starych historii sieci ${networkId}`);
            }
            
        } catch (error) {
            console.error('❌ Błąd ograniczania historii:', error);
        }
    }
    
    // Ograniczanie liczby backupów
    async limitBackups(maxBackups) {
        try {
            const backups = await this.getAllData(this.stores.backups);
            
            if (backups.length > maxBackups) {
                backups.sort((a, b) => a.timestamp - b.timestamp);
                const toDelete = backups.slice(0, backups.length - maxBackups);
                
                for (const backup of toDelete) {
                    await this.deleteData(this.stores.backups, backup.id);
                }
                
                console.log(`🗑️ Usunięto ${toDelete.length} starych backupów`);
            }
            
        } catch (error) {
            console.error('❌ Błąd ograniczania backupów:', error);
        }
    }
    
    // Czyszczenie storage
    async performStorageCleanup() {
        try {
            console.log('🧹 Rozpoczynanie czyszczenia storage...');
            
            // Usuń najstarsze stany
            const allStates = await this.getAllData(this.stores.neural_states);
            if (allStates.length > 100) {
                allStates.sort((a, b) => a.timestamp - b.timestamp);
                const toDelete = allStates.slice(0, allStates.length - 100);
                
                for (const state of toDelete) {
                    await this.deleteData(this.stores.neural_states, state.id);
                }
            }
            
            // Usuń najstarsze historie
            const allHistories = await this.getAllData(this.stores.learning_history);
            if (allHistories.length > 200) {
                allHistories.sort((a, b) => a.timestamp - b.timestamp);
                const toDelete = allHistories.slice(0, allHistories.length - 200);
                
                for (const history of toDelete) {
                    await this.deleteData(this.stores.learning_history, history.id);
                }
            }
            
            // Ogranicz backupy
            await this.limitBackups(5);
            
            console.log('✅ Czyszczenie storage zakończone');
            
        } catch (error) {
            console.error('❌ Błąd czyszczenia storage:', error);
        }
    }
    
    // Eksport wszystkich danych
    async exportAllData() {
        try {
            const exportData = {
                networks: await this.getAllData(this.stores.neural_networks),
                states: await this.getAllData(this.stores.neural_states),
                histories: await this.getAllData(this.stores.learning_history),
                configurations: await this.getAllData(this.stores.configurations),
                metadata: {
                    exportTimestamp: Date.now(),
                    version: '2.0',
                    stats: this.stats
                }
            };
            
            console.log('📤 Eksport danych zakończony');
            return exportData;
            
        } catch (error) {
            console.error('❌ Błąd eksportu danych:', error);
            throw error;
        }
    }
    
    // Import danych
    async importAllData(importData) {
        try {
            console.log('📥 Rozpoczynanie importu danych...');
            
            // Import sieci
            if (importData.networks) {
                for (const network of importData.networks) {
                    await this.putData(this.stores.neural_networks, network);
                }
            }
            
            // Import stanów
            if (importData.states) {
                for (const state of importData.states) {
                    await this.putData(this.stores.neural_states, state);
                }
            }
            
            // Import historii
            if (importData.histories) {
                for (const history of importData.histories) {
                    await this.putData(this.stores.learning_history, history);
                }
            }
            
            // Import konfiguracji
            if (importData.configurations) {
                for (const config of importData.configurations) {
                    await this.putData(this.stores.configurations, config);
                }
            }
            
            console.log('✅ Import danych zakończony');
            return true;
            
        } catch (error) {
            console.error('❌ Błąd importu danych:', error);
            throw error;
        }
    }
    
    // Pobierz statystyki storage
    getStorageStatistics() {
        return {
            ...this.stats,
            isInitialized: this.isInitialized,
            dbName: this.config.dbName,
            autoBackupActive: this.backupTimer !== null,
            compressionEnabled: this.config.compressionEnabled
        };
    }
    
    // Zamknij połączenie z bazą
    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
        
        this.stopAutoBackup();
        this.isInitialized = false;
        
        console.log('💾 Storage zamknięty');
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PersistentNeuralStorage };
} else if (typeof window !== 'undefined') {
    window.PersistentNeuralStorage = PersistentNeuralStorage;
    
    console.log('💾 Persistent Neural Storage załadowany!');
}