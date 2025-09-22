/**
 * Neurogenesis System
 * System tworzenia nowych neuronów w zależności od potrzeb sieci
 * - Monitorowanie obciążenia sieci
 * - Tworzenie neuronów w odpowiedzi na wysoką aktywność
 * - Różne typy neuronów (sensoryczne, przetwarzające, motoryczne)
 * - Ograniczenia zasobów i optymalizacja
 */

class NeurogenesisSystem {
    constructor(config = {}) {
        // Parametry neurogenesis
        this.maxNeurons = config.maxNeurons || 1000;
        this.neurogenesisRate = config.neurogenesisRate || 0.1; // neurony/sekunda przy wysokiej aktywności
        this.activityThreshold = config.activityThreshold || 0.8; // próg aktywności dla neurogenesis
        this.resourceThreshold = config.resourceThreshold || 0.9; // próg zasobów
        
        // Typy neuronów do tworzenia
        this.neuronTypes = {
            'processing': { weight: 0.6, specialization: 'przetwarzanie' },
            'memory': { weight: 0.2, specialization: 'pamięć' },
            'sensory': { weight: 0.1, specialization: 'sensoryczne' },
            'motor': { weight: 0.1, specialization: 'motoryczne' }
        };
        
        // Monitoring sieci
        this.networkLoad = {
            current: 0,
            history: [],
            overloadEvents: 0
        };
        
        // Statystyki neurogenesis
        this.neurogenesisStats = {
            totalCreated: 0,
            createdByType: {},
            creationRate: 0,
            lastCreation: 0,
            resourceLimited: 0
        };
        
        // Kolejka do tworzenia
        this.creationQueue = [];
        this.maxQueueSize = 10;
        
        // Obszary sieci (dla lokalizacji neuronów)
        this.networkRegions = {
            'input': { x: 0, y: 0, z: 0, capacity: 0.2 },
            'processing': { x: 0.5, y: 0.5, z: 0.5, capacity: 0.6 },
            'output': { x: 1, y: 1, z: 1, capacity: 0.2 }
        };
        
        console.log('🧠➕ Neurogenesis System zainicjalizowany');
    }
    
    // Monitorowanie obciążenia sieci
    monitorNetworkLoad(neurons, timestamp = Date.now()) {
        if (neurons.size === 0) {
            this.networkLoad.current = 0;
            return;
        }
        
        let totalActivity = 0;
        let activeNeurons = 0;
        let overloadedNeurons = 0;
        
        neurons.forEach(neuron => {
            const activity = this.calculateNeuronActivity(neuron);
            totalActivity += activity;
            
            if (activity > 0.5) activeNeurons++;
            if (activity > 0.9) overloadedNeurons++;
        });
        
        // Oblicz obciążenie sieci
        this.networkLoad.current = totalActivity / neurons.size;
        
        // Zapisz do historii
        this.networkLoad.history.push({
            timestamp: timestamp,
            load: this.networkLoad.current,
            activeNeurons: activeNeurons,
            overloadedNeurons: overloadedNeurons,
            totalNeurons: neurons.size
        });
        
        // Ogranicz historię
        if (this.networkLoad.history.length > 100) {
            this.networkLoad.history.shift();
        }
        
        // Sprawdź czy jest przeciążenie
        if (overloadedNeurons > neurons.size * 0.3) {
            this.networkLoad.overloadEvents++;
        }
        
        return {
            currentLoad: this.networkLoad.current,
            activeNeurons: activeNeurons,
            overloadedNeurons: overloadedNeurons,
            needsNeurogenesis: this.shouldTriggerNeurogenesis()
        };
    }
    
    // Oblicz aktywność neuronu
    calculateNeuronActivity(neuron) {
        if (!neuron.activationHistory || neuron.activationHistory.length < 5) {
            return 0;
        }
        
        const recentHistory = neuron.activationHistory.slice(-20);
        const activeCount = recentHistory.filter(record => record.active).length;
        
        return activeCount / recentHistory.length;
    }
    
    // Sprawdź czy uruchomić neurogenesis
    shouldTriggerNeurogenesis() {
        // Warunki dla neurogenesis:
        // 1. Wysokie obciążenie sieci
        if (this.networkLoad.current < this.activityThreshold) return false;
        
        // 2. Nie przekroczono limitu neuronów
        if (this.getCurrentNeuronCount() >= this.maxNeurons) return false;
        
        // 3. Dostępne zasoby
        if (this.calculateResourceUsage() > this.resourceThreshold) return false;
        
        // 4. Trend wzrostowy obciążenia
        if (this.networkLoad.history.length >= 5) {
            const recentLoads = this.networkLoad.history.slice(-5).map(h => h.load);
            const trend = this.calculateTrend(recentLoads);
            if (trend <= 0) return false; // Brak wzrostu obciążenia
        }
        
        return true;
    }
    
    // Oblicz trend (czy obciążenie rośnie)
    calculateTrend(values) {
        if (values.length < 2) return 0;
        
        let trend = 0;
        for (let i = 1; i < values.length; i++) {
            trend += values[i] - values[i-1];
        }
        
        return trend / (values.length - 1);
    }
    
    // Oblicz użycie zasobów
    calculateResourceUsage() {
        const currentNeurons = this.getCurrentNeuronCount();
        return currentNeurons / this.maxNeurons;
    }
    
    getCurrentNeuronCount() {
        return this.neurogenesisStats.totalCreated; // Uproszczenie - w rzeczywistości byłaby to aktualna liczba
    }
    
    // Główna metoda neurogenesis
    performNeurogenesis(neurons, timestamp = Date.now()) {
        // Monitoruj obciążenie
        const loadInfo = this.monitorNetworkLoad(neurons, timestamp);
        
        if (!loadInfo.needsNeurogenesis) {
            return { created: false, reason: 'no_need' };
        }
        
        // Określ typ neuronu do utworzenia
        const neuronType = this.selectNeuronType(neurons);
        
        // Określ lokalizację
        const position = this.selectNeuronPosition(neuronType, neurons);
        
        // Utwórz neuron
        const newNeuron = this.createNeuron(neuronType, position, timestamp);
        
        // Aktualizuj statystyki
        this.updateNeurogenesisStats(neuronType, timestamp);
        
        return {
            created: true,
            neuron: newNeuron,
            type: neuronType,
            position: position,
            reason: 'high_network_load'
        };
    }
    
    // Wybierz typ neuronu do utworzenia
    selectNeuronType(neurons) {
        // Analiza potrzeb sieci
        const typeNeeds = this.analyzeNetworkNeeds(neurons);
        
        // Wybierz typ na podstawie potrzeb i wag
        let selectedType = 'processing'; // domyślny
        let maxScore = 0;
        
        Object.entries(this.neuronTypes).forEach(([type, config]) => {
            const need = typeNeeds[type] || 0;
            const weight = config.weight;
            const score = need * weight;
            
            if (score > maxScore) {
                maxScore = score;
                selectedType = type;
            }
        });
        
        return selectedType;
    }
    
    // Analiza potrzeb sieci
    analyzeNetworkNeeds(neurons) {
        const needs = {
            'processing': 0.5, // zawsze potrzebne
            'memory': 0.3,
            'sensory': 0.1,
            'motor': 0.1
        };
        
        if (neurons.size === 0) return needs;
        
        // Policz istniejące typy neuronów
        const typeCounts = {};
        neurons.forEach(neuron => {
            const type = this.identifyNeuronType(neuron);
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
        
        // Dostosuj potrzeby na podstawie braków
        Object.keys(needs).forEach(type => {
            const currentCount = typeCounts[type] || 0;
            const expectedRatio = this.neuronTypes[type].weight;
            const currentRatio = currentCount / neurons.size;
            
            if (currentRatio < expectedRatio) {
                needs[type] += (expectedRatio - currentRatio) * 2;
            }
        });
        
        return needs;
    }
    
    // Identyfikuj typ neuronu (uproszczona heurystyka)
    identifyNeuronType(neuron) {
        // Na podstawie właściwości neuronu
        if (neuron.activationThreshold < 0.3) return 'sensory';
        if (neuron.activationThreshold > 0.8) return 'motor';
        if (neuron.plasticity && neuron.plasticity > 0.2) return 'memory';
        return 'processing';
    }
    
    // Wybierz pozycję dla nowego neuronu
    selectNeuronPosition(neuronType, neurons) {
        const region = this.selectRegionForType(neuronType);
        
        // Dodaj losowe odchylenie w obrębie regionu
        const randomOffset = () => (Math.random() - 0.5) * 0.2;
        
        return {
            x: Math.max(0, Math.min(1, region.x + randomOffset())),
            y: Math.max(0, Math.min(1, region.y + randomOffset())),
            z: Math.max(0, Math.min(1, region.z + randomOffset()))
        };
    }
    
    // Wybierz region dla typu neuronu
    selectRegionForType(neuronType) {
        switch (neuronType) {
            case 'sensory':
                return this.networkRegions.input;
            case 'motor':
                return this.networkRegions.output;
            default:
                return this.networkRegions.processing;
        }
    }
    
    // Utwórz nowy neuron
    createNeuron(type, position, timestamp) {
        const neuronId = `neuron_${type}_${timestamp}_${Math.random().toString(36).substr(2, 6)}`;
        
        // Konfiguracja na podstawie typu
        const config = this.getNeuronConfig(type);
        config.position = position;
        
        // Utwórz kwantowy neuron plastyczny
        const neuron = new QuantumPlasticNeuron(neuronId, config);
        
        // Dodaj metadane
        neuron.birthTimestamp = timestamp;
        neuron.neuronType = type;
        neuron.generation = this.calculateGeneration();
        
        console.log(`🧠➕ Utworzono nowy neuron: ${neuronId} (typ: ${type})`);
        
        return neuron;
    }
    
    // Konfiguracja neuronu na podstawie typu
    getNeuronConfig(type) {
        const baseConfig = {
            coherenceTime: 2000 + Math.random() * 3000,
            threshold: 0.5 + Math.random() * 0.3
        };
        
        switch (type) {
            case 'sensory':
                return {
                    ...baseConfig,
                    threshold: 0.2 + Math.random() * 0.2,
                    frequency: 5 + Math.random() * 10,
                    hebbianEnabled: true,
                    stdpEnabled: true
                };
                
            case 'motor':
                return {
                    ...baseConfig,
                    threshold: 0.7 + Math.random() * 0.2,
                    refractoryPeriod: 20 + Math.random() * 30,
                    ltpEnabled: true
                };
                
            case 'memory':
                return {
                    ...baseConfig,
                    coherenceTime: 5000 + Math.random() * 5000,
                    plasticity: 0.3 + Math.random() * 0.2,
                    hebbianEnabled: true,
                    ltpEnabled: true,
                    homeostaticEnabled: true
                };
                
            case 'processing':
            default:
                return {
                    ...baseConfig,
                    frequency: 1 + Math.random() * 5,
                    hebbianEnabled: true,
                    stdpEnabled: true,
                    ltdEnabled: true
                };
        }
    }
    
    // Oblicz generację neuronu
    calculateGeneration() {
        // Uproszczona generacja na podstawie czasu
        return Math.floor(this.neurogenesisStats.totalCreated / 100) + 1;
    }
    
    // Aktualizuj statystyki neurogenesis
    updateNeurogenesisStats(neuronType, timestamp) {
        this.neurogenesisStats.totalCreated++;
        this.neurogenesisStats.createdByType[neuronType] = 
            (this.neurogenesisStats.createdByType[neuronType] || 0) + 1;
        this.neurogenesisStats.lastCreation = timestamp;
        
        // Oblicz częstotliwość tworzenia
        if (this.neurogenesisStats.totalCreated > 1) {
            const timeSpan = timestamp - (this.neurogenesisStats.firstCreation || timestamp);
            this.neurogenesisStats.creationRate = this.neurogenesisStats.totalCreated / (timeSpan / 1000);
        } else {
            this.neurogenesisStats.firstCreation = timestamp;
        }
    }
    
    // Dodaj neuron do kolejki tworzenia
    queueNeuronCreation(type, priority = 1, reason = 'manual') {
        if (this.creationQueue.length >= this.maxQueueSize) {
            return { queued: false, reason: 'queue_full' };
        }
        
        this.creationQueue.push({
            type: type,
            priority: priority,
            reason: reason,
            timestamp: Date.now()
        });
        
        // Sortuj według priorytetu
        this.creationQueue.sort((a, b) => b.priority - a.priority);
        
        return { queued: true, queuePosition: this.creationQueue.length };
    }
    
    // Przetwórz kolejkę tworzenia
    processCreationQueue(neurons) {
        if (this.creationQueue.length === 0) return { processed: 0 };
        
        let processed = 0;
        const maxProcessPerCycle = 3; // Maksymalnie 3 neurony na cykl
        
        while (this.creationQueue.length > 0 && processed < maxProcessPerCycle) {
            const request = this.creationQueue.shift();
            
            // Sprawdź czy nadal potrzebne
            if (this.shouldTriggerNeurogenesis()) {
                const result = this.performNeurogenesis(neurons);
                if (result.created) {
                    processed++;
                }
            }
        }
        
        return { processed: processed };
    }
    
    // Analiza skuteczności neurogenesis
    analyzeNeurogenesisEffectiveness() {
        if (this.neurogenesisStats.totalCreated < 5) return null;
        
        // Rozkład typów neuronów
        const totalCreated = this.neurogenesisStats.totalCreated;
        const typeDistribution = {};
        
        Object.entries(this.neurogenesisStats.createdByType).forEach(([type, count]) => {
            typeDistribution[type] = (count / totalCreated) * 100;
        });
        
        // Efektywność w odpowiedzi na obciążenie
        const recentHistory = this.networkLoad.history.slice(-20);
        const avgLoad = recentHistory.length > 0 ? 
            recentHistory.reduce((sum, h) => sum + h.load, 0) / recentHistory.length : 0;
        
        // Trend obciążenia
        const loadTrend = recentHistory.length >= 5 ? 
            this.calculateTrend(recentHistory.slice(-5).map(h => h.load)) : 0;
        
        return {
            totalNeuronsCreated: totalCreated,
            creationRate: this.neurogenesisStats.creationRate,
            typeDistribution: typeDistribution,
            averageNetworkLoad: avgLoad,
            loadTrend: loadTrend,
            overloadEvents: this.networkLoad.overloadEvents,
            resourceUsage: this.calculateResourceUsage(),
            queueLength: this.creationQueue.length,
            effectiveness: this.calculateEffectiveness(avgLoad, loadTrend)
        };
    }
    
    // Oblicz skuteczność neurogenesis
    calculateEffectiveness(avgLoad, loadTrend) {
        // Skuteczność = czy neurogenesis pomaga w zarządzaniu obciążeniem
        const loadManagement = avgLoad < this.activityThreshold ? 1 : 0.5;
        const trendManagement = loadTrend <= 0 ? 1 : 0.5;
        const resourceEfficiency = 1 - this.calculateResourceUsage();
        
        return (loadManagement + trendManagement + resourceEfficiency) / 3;
    }
    
    // Reset systemu neurogenesis
    reset() {
        this.networkLoad = {
            current: 0,
            history: [],
            overloadEvents: 0
        };
        
        this.neurogenesisStats = {
            totalCreated: 0,
            createdByType: {},
            creationRate: 0,
            lastCreation: 0,
            resourceLimited: 0
        };
        
        this.creationQueue = [];
        
        console.log('🔄 Neurogenesis System zresetowany');
    }
    
    // Eksport stanu systemu
    exportState() {
        return {
            parameters: {
                maxNeurons: this.maxNeurons,
                neurogenesisRate: this.neurogenesisRate,
                activityThreshold: this.activityThreshold,
                resourceThreshold: this.resourceThreshold
            },
            networkLoad: {
                current: this.networkLoad.current,
                overloadEvents: this.networkLoad.overloadEvents,
                recentHistory: this.networkLoad.history.slice(-10)
            },
            statistics: { ...this.neurogenesisStats },
            analysis: this.analyzeNeurogenesisEffectiveness(),
            creationQueue: this.creationQueue.length,
            neuronTypes: this.neuronTypes,
            networkRegions: this.networkRegions
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NeurogenesisSystem };
} else if (typeof window !== 'undefined') {
    window.NeurogenesisSystem = NeurogenesisSystem;
    
    console.log('🧠➕ Neurogenesis System załadowany!');
}