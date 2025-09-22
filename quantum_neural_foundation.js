/**
 * Quantum Neural Network Foundation
 * Implementuje podstawy fizyki kwantowej w sieciach neuronowych
 * - Superpozycja stanów neuronów
 * - Splątanie kwantowe między neuronami
 * - Kolaps funkcji falowej przy podejmowaniu decyzji
 * - Interferencia kwantowa w procesach myślowych
 */

class QuantumNeuron {
    constructor(id, initialState = null) {
        this.id = id;
        this.position = { x: Math.random(), y: Math.random(), z: Math.random() };
        
        // Stan kwantowy neuronu - superpozycja
        this.quantumState = {
            amplitude: initialState || this.generateRandomAmplitude(),
            phase: Math.random() * 2 * Math.PI,
            coherenceTime: 1000 + Math.random() * 5000, // ms
            lastMeasurement: 0
        };
        
        // Połączenia z innymi neuronami
        this.connections = new Map();
        this.entanglements = new Set();
        
        // Właściwości biologiczne
        this.activationThreshold = 0.5 + Math.random() * 0.3;
        this.refractoryPeriod = 50 + Math.random() * 100; // ms
        this.lastActivation = 0;
        
        // Plastyczność synaptyczna
        this.plasticity = 0.1 + Math.random() * 0.2;
        this.learningRate = 0.01 + Math.random() * 0.05;
        
        // Historia aktywności
        this.activationHistory = [];
        this.maxHistoryLength = 1000;
    }
    
    generateRandomAmplitude() {
        // Generuje znormalizowaną amplitudę dla superpozycji
        const real = (Math.random() - 0.5) * 2;
        const imaginary = (Math.random() - 0.5) * 2;
        const magnitude = Math.sqrt(real * real + imaginary * imaginary);
        
        return {
            real: real / magnitude,
            imaginary: imaginary / magnitude
        };
    }
    
    // Oblicza prawdopodobieństwo aktywacji na podstawie stanu kwantowego
    calculateActivationProbability() {
        const { real, imaginary } = this.quantumState.amplitude;
        const probability = real * real + imaginary * imaginary;
        
        // Uwzględnij dekoherencję
        const timeSinceLastMeasurement = Date.now() - this.quantumState.lastMeasurement;
        const decoherenceFactor = Math.exp(-timeSinceLastMeasurement / this.quantumState.coherenceTime);
        
        return probability * decoherenceFactor;
    }
    
    // Kolaps funkcji falowej - pomiar stanu neuronu
    measureState() {
        const probability = this.calculateActivationProbability();
        const isActive = Math.random() < probability;
        
        this.quantumState.lastMeasurement = Date.now();
        
        // Kolaps do stanu określonego
        if (isActive) {
            this.quantumState.amplitude = { real: 1, imaginary: 0 };
            this.lastActivation = Date.now();
            this.recordActivation(true);
        } else {
            this.quantumState.amplitude = { real: 0, imaginary: 1 };
            this.recordActivation(false);
        }
        
        return isActive;
    }
    
    // Superpozycja - neuron może być w stanie pośrednim
    enterSuperposition(influences = []) {
        let totalReal = 0;
        let totalImaginary = 0;
        
        // Suma wpływów z innych neuronów
        influences.forEach(influence => {
            totalReal += influence.amplitude.real * influence.weight;
            totalImaginary += influence.amplitude.imaginary * influence.weight;
        });
        
        // Normalizacja
        const magnitude = Math.sqrt(totalReal * totalReal + totalImaginary * totalImaginary);
        if (magnitude > 0) {
            this.quantumState.amplitude = {
                real: totalReal / magnitude,
                imaginary: totalImaginary / magnitude
            };
        }
        
        // Aktualizuj fazę
        this.quantumState.phase += 0.1 * Math.random();
    }
    
    // Splątanie kwantowe z innym neuronem
    entangleWith(otherNeuron) {
        if (this.entanglements.has(otherNeuron.id)) return;
        
        this.entanglements.add(otherNeuron.id);
        otherNeuron.entanglements.add(this.id);
        
        // Skorelowane stany kwantowe
        const correlationStrength = 0.5 + Math.random() * 0.5;
        
        // Synchronizuj fazy
        const avgPhase = (this.quantumState.phase + otherNeuron.quantumState.phase) / 2;
        this.quantumState.phase = avgPhase + correlationStrength * 0.1;
        otherNeuron.quantumState.phase = avgPhase - correlationStrength * 0.1;
    }
    
    // Interferencia kwantowa z innymi neuronami
    calculateInterference(nearbyNeurons) {
        let interferencePattern = { constructive: 0, destructive: 0 };
        
        nearbyNeurons.forEach(neuron => {
            const distance = this.calculateDistance(neuron);
            const phaseDifference = Math.abs(this.quantumState.phase - neuron.quantumState.phase);
            
            // Interferencia konstruktywna (fazy podobne)
            if (phaseDifference < Math.PI / 2) {
                interferencePattern.constructive += (1 / (1 + distance)) * Math.cos(phaseDifference);
            } else {
                // Interferencia destruktywna (fazy przeciwne)
                interferencePattern.destructive += (1 / (1 + distance)) * Math.sin(phaseDifference);
            }
        });
        
        return interferencePattern;
    }
    
    calculateDistance(otherNeuron) {
        const dx = this.position.x - otherNeuron.position.x;
        const dy = this.position.y - otherNeuron.position.y;
        const dz = this.position.z - otherNeuron.position.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    
    // Dodaj połączenie synaptyczne
    addConnection(targetNeuron, weight = null) {
        const connectionWeight = weight || (Math.random() - 0.5) * 2;
        
        this.connections.set(targetNeuron.id, {
            target: targetNeuron,
            weight: connectionWeight,
            strength: Math.abs(connectionWeight),
            lastUsed: 0,
            usageCount: 0,
            plasticityFactor: 1.0
        });
    }
    
    // Propagacja sygnału przez sieć
    propagateSignal(signal, timestamp = Date.now()) {
        const outputs = [];
        
        this.connections.forEach((connection, targetId) => {
            // Modulacja sygnału przez stan kwantowy
            const quantumModulation = this.calculateActivationProbability();
            const modulatedSignal = signal * connection.weight * quantumModulation;
            
            // Uwzględnij opóźnienie synaptyczne
            const synapticDelay = 1 + Math.random() * 5; // ms
            
            outputs.push({
                targetId: targetId,
                signal: modulatedSignal,
                delay: synapticDelay,
                timestamp: timestamp + synapticDelay
            });
            
            // Aktualizuj statystyki połączenia
            connection.lastUsed = timestamp;
            connection.usageCount++;
        });
        
        return outputs;
    }
    
    // Plastyczność synaptyczna - wzmacnianie/osłabianie połączeń
    updateSynapticPlasticity(targetNeuronId, reinforcement) {
        const connection = this.connections.get(targetNeuronId);
        if (!connection) return;
        
        // Reguła Hebba: "neurons that fire together, wire together"
        const hebbianUpdate = this.learningRate * reinforcement * connection.plasticityFactor;
        connection.weight += hebbianUpdate;
        
        // Ograniczenia wagowe
        connection.weight = Math.max(-2, Math.min(2, connection.weight));
        connection.strength = Math.abs(connection.weight);
        
        // Aktualizuj plastyczność
        connection.plasticityFactor *= (1 + reinforcement * 0.01);
        connection.plasticityFactor = Math.max(0.1, Math.min(2.0, connection.plasticityFactor));
    }
    
    recordActivation(wasActive) {
        this.activationHistory.push({
            timestamp: Date.now(),
            active: wasActive,
            quantumState: { ...this.quantumState.amplitude },
            phase: this.quantumState.phase
        });
        
        // Ogranicz historię
        if (this.activationHistory.length > this.maxHistoryLength) {
            this.activationHistory.shift();
        }
    }
    
    // Analiza wzorców aktywności
    analyzeActivityPatterns() {
        if (this.activationHistory.length < 10) return null;
        
        const recentHistory = this.activationHistory.slice(-100);
        const activationRate = recentHistory.filter(h => h.active).length / recentHistory.length;
        
        // Wykryj rytmy i oscylacje
        const intervals = [];
        let lastActivation = null;
        
        recentHistory.forEach(record => {
            if (record.active) {
                if (lastActivation) {
                    intervals.push(record.timestamp - lastActivation);
                }
                lastActivation = record.timestamp;
            }
        });
        
        const avgInterval = intervals.length > 0 ? 
            intervals.reduce((a, b) => a + b, 0) / intervals.length : 0;
        
        return {
            activationRate,
            averageInterval: avgInterval,
            rhythmicity: this.calculateRhythmicity(intervals),
            coherence: this.calculateCoherence()
        };
    }
    
    calculateRhythmicity(intervals) {
        if (intervals.length < 3) return 0;
        
        const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((sum, interval) => 
            sum + Math.pow(interval - mean, 2), 0) / intervals.length;
        
        return mean > 0 ? 1 / (1 + variance / (mean * mean)) : 0;
    }
    
    calculateCoherence() {
        const timeSinceLastMeasurement = Date.now() - this.quantumState.lastMeasurement;
        return Math.exp(-timeSinceLastMeasurement / this.quantumState.coherenceTime);
    }
    
    // Eksport stanu neuronu
    exportState() {
        return {
            id: this.id,
            position: { ...this.position },
            quantumState: {
                amplitude: { ...this.quantumState.amplitude },
                phase: this.quantumState.phase,
                coherence: this.calculateCoherence()
            },
            connections: Array.from(this.connections.entries()).map(([id, conn]) => ({
                targetId: id,
                weight: conn.weight,
                strength: conn.strength,
                usageCount: conn.usageCount
            })),
            entanglements: Array.from(this.entanglements),
            activityPattern: this.analyzeActivityPatterns(),
            properties: {
                activationThreshold: this.activationThreshold,
                plasticity: this.plasticity,
                learningRate: this.learningRate
            }
        };
    }
}

class QuantumNeuralNetwork {
    constructor(config = {}) {
        this.neurons = new Map();
        this.neuronGroups = new Map(); // Grupy neuronów o podobnych funkcjach
        this.globalQuantumField = new QuantumField();
        
        this.config = {
            maxNeurons: config.maxNeurons || 10000,
            entanglementRadius: config.entanglementRadius || 0.3,
            interferenceRadius: config.interferenceRadius || 0.2,
            coherenceTime: config.coherenceTime || 3000,
            plasticityRate: config.plasticityRate || 0.1,
            ...config
        };
        
        this.networkStats = {
            totalNeurons: 0,
            totalConnections: 0,
            totalEntanglements: 0,
            averageCoherence: 0,
            networkActivity: 0
        };
        
        this.evolutionHistory = [];
        this.lastUpdate = Date.now();
    }
    
    // Tworzenie nowego neuronu
    createNeuron(type = 'standard', position = null) {
        if (this.neurons.size >= this.config.maxNeurons) {
            console.warn('Osiągnięto maksymalną liczbę neuronów');
            return null;
        }
        
        const neuronId = `neuron_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const neuron = new QuantumNeuron(neuronId);
        
        if (position) {
            neuron.position = { ...position };
        }
        
        // Specjalizacja neuronu
        this.specializeNeuron(neuron, type);
        
        this.neurons.set(neuronId, neuron);
        this.networkStats.totalNeurons++;
        
        // Automatyczne tworzenie połączeń z pobliskimi neuronami
        this.createLocalConnections(neuron);
        
        return neuron;
    }
    
    specializeNeuron(neuron, type) {
        switch (type) {
            case 'sensory':
                neuron.activationThreshold = 0.2;
                neuron.learningRate = 0.05;
                break;
            case 'motor':
                neuron.activationThreshold = 0.7;
                neuron.refractoryPeriod = 20;
                break;
            case 'memory':
                neuron.plasticity = 0.3;
                neuron.quantumState.coherenceTime = 10000;
                break;
            case 'processing':
                neuron.learningRate = 0.02;
                neuron.activationThreshold = 0.5;
                break;
        }
        
        // Dodaj do odpowiedniej grupy
        if (!this.neuronGroups.has(type)) {
            this.neuronGroups.set(type, new Set());
        }
        this.neuronGroups.get(type).add(neuron.id);
    }
    
    createLocalConnections(neuron) {
        const nearbyNeurons = this.findNearbyNeurons(neuron, this.config.entanglementRadius);
        
        nearbyNeurons.forEach(nearbyNeuron => {
            // Prawdopodobieństwo połączenia zależy od odległości
            const distance = neuron.calculateDistance(nearbyNeuron);
            const connectionProbability = Math.exp(-distance * 3);
            
            if (Math.random() < connectionProbability) {
                neuron.addConnection(nearbyNeuron);
                this.networkStats.totalConnections++;
                
                // Możliwość splątania kwantowego
                if (Math.random() < 0.3) {
                    neuron.entangleWith(nearbyNeuron);
                    this.networkStats.totalEntanglements++;
                }
            }
        });
    }
    
    findNearbyNeurons(targetNeuron, radius) {
        const nearby = [];
        
        this.neurons.forEach(neuron => {
            if (neuron.id !== targetNeuron.id) {
                const distance = targetNeuron.calculateDistance(neuron);
                if (distance <= radius) {
                    nearby.push(neuron);
                }
            }
        });
        
        return nearby;
    }
    
    // Propagacja sygnału przez całą sieć
    propagateSignal(inputNeuronId, signal, maxHops = 10) {
        const propagationQueue = [{
            neuronId: inputNeuronId,
            signal: signal,
            hop: 0,
            timestamp: Date.now()
        }];
        
        const activatedNeurons = new Set();
        const signalPath = [];
        
        while (propagationQueue.length > 0 && propagationQueue[0].hop < maxHops) {
            const current = propagationQueue.shift();
            const neuron = this.neurons.get(current.neuronId);
            
            if (!neuron || activatedNeurons.has(current.neuronId)) continue;
            
            // Sprawdź czy neuron może być aktywowany
            if (this.canNeuronActivate(neuron, current.signal)) {
                activatedNeurons.add(current.neuronId);
                signalPath.push({
                    neuronId: current.neuronId,
                    signal: current.signal,
                    hop: current.hop,
                    timestamp: current.timestamp
                });
                
                // Propaguj dalej
                const outputs = neuron.propagateSignal(current.signal, current.timestamp);
                outputs.forEach(output => {
                    propagationQueue.push({
                        neuronId: output.targetId,
                        signal: output.signal,
                        hop: current.hop + 1,
                        timestamp: output.timestamp
                    });
                });
            }
        }
        
        return {
            activatedNeurons: Array.from(activatedNeurons),
            signalPath: signalPath,
            finalSignalStrength: this.calculateNetworkResponse(activatedNeurons)
        };
    }
    
    canNeuronActivate(neuron, inputSignal) {
        // Sprawdź okres refrakcyjny
        const timeSinceLastActivation = Date.now() - neuron.lastActivation;
        if (timeSinceLastActivation < neuron.refractoryPeriod) return false;
        
        // Sprawdź próg aktywacji z uwzględnieniem stanu kwantowego
        const quantumModulation = neuron.calculateActivationProbability();
        const effectiveThreshold = neuron.activationThreshold / (1 + quantumModulation);
        
        return Math.abs(inputSignal) > effectiveThreshold;
    }
    
    calculateNetworkResponse(activatedNeurons) {
        let totalResponse = 0;
        let coherentResponse = 0;
        
        activatedNeurons.forEach(neuronId => {
            const neuron = this.neurons.get(neuronId);
            if (neuron) {
                const neuronResponse = neuron.calculateActivationProbability();
                totalResponse += neuronResponse;
                
                // Uwzględnij koherencję kwantową
                const coherence = neuron.calculateCoherence();
                coherentResponse += neuronResponse * coherence;
            }
        });
        
        return {
            total: totalResponse,
            coherent: coherentResponse,
            coherenceRatio: totalResponse > 0 ? coherentResponse / totalResponse : 0
        };
    }
    
    // Aktualizacja stanu całej sieci
    updateNetwork() {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastUpdate;
        
        // Aktualizuj pole kwantowe
        this.globalQuantumField.update(deltaTime);
        
        // Aktualizuj wszystkie neurony
        this.neurons.forEach(neuron => {
            // Wpływ globalnego pola kwantowego
            const fieldInfluence = this.globalQuantumField.getInfluenceAt(neuron.position);
            
            // Znajdź pobliskie neurony dla interferenci
            const nearbyNeurons = this.findNearbyNeurons(neuron, this.config.interferenceRadius);
            const interference = neuron.calculateInterference(nearbyNeurons);
            
            // Aktualizuj superpozycję
            const influences = [{
                amplitude: fieldInfluence.amplitude,
                weight: fieldInfluence.strength
            }];
            
            neuron.enterSuperposition(influences);
        });
        
        // Aktualizuj statystyki sieci
        this.updateNetworkStats();
        this.lastUpdate = currentTime;
    }
    
    updateNetworkStats() {
        let totalCoherence = 0;
        let activeNeurons = 0;
        
        this.neurons.forEach(neuron => {
            const coherence = neuron.calculateCoherence();
            totalCoherence += coherence;
            
            if (neuron.calculateActivationProbability() > 0.5) {
                activeNeurons++;
            }
        });
        
        this.networkStats.averageCoherence = this.neurons.size > 0 ? 
            totalCoherence / this.neurons.size : 0;
        this.networkStats.networkActivity = this.neurons.size > 0 ? 
            activeNeurons / this.neurons.size : 0;
    }
    
    // Eksport stanu całej sieci
    exportNetworkState() {
        const neuronStates = [];
        this.neurons.forEach(neuron => {
            neuronStates.push(neuron.exportState());
        });
        
        return {
            neurons: neuronStates,
            neuronGroups: Object.fromEntries(
                Array.from(this.neuronGroups.entries()).map(([type, neurons]) => 
                    [type, Array.from(neurons)]
                )
            ),
            networkStats: { ...this.networkStats },
            globalField: this.globalQuantumField.exportState(),
            timestamp: Date.now()
        };
    }
}

// Globalne pole kwantowe wpływające na całą sieć
class QuantumField {
    constructor() {
        this.fieldStrength = 1.0;
        this.coherencePattern = this.generateCoherencePattern();
        this.oscillationFrequency = 0.1 + Math.random() * 0.5; // Hz
        this.phase = 0;
        this.lastUpdate = Date.now();
    }
    
    generateCoherencePattern() {
        // Generuje 3D wzorzec koherencji
        const pattern = [];
        const resolution = 10;
        
        for (let x = 0; x < resolution; x++) {
            pattern[x] = [];
            for (let y = 0; y < resolution; y++) {
                pattern[x][y] = [];
                for (let z = 0; z < resolution; z++) {
                    // Wzorzec falowy z interferencją
                    const value = Math.sin(x * 0.5) * Math.cos(y * 0.5) * Math.sin(z * 0.5);
                    pattern[x][y][z] = value;
                }
            }
        }
        
        return pattern;
    }
    
    update(deltaTime) {
        // Aktualizuj fazę oscylacji
        this.phase += this.oscillationFrequency * deltaTime / 1000;
        
        // Ewolucja wzorca koherencji
        this.evolveCoherencePattern();
    }
    
    evolveCoherencePattern() {
        // Subtelna ewolucja wzorca
        const evolutionRate = 0.001;
        
        for (let x = 0; x < this.coherencePattern.length; x++) {
            for (let y = 0; y < this.coherencePattern[x].length; y++) {
                for (let z = 0; z < this.coherencePattern[x][y].length; z++) {
                    const noise = (Math.random() - 0.5) * evolutionRate;
                    this.coherencePattern[x][y][z] += noise;
                    
                    // Ograniczenia
                    this.coherencePattern[x][y][z] = Math.max(-1, 
                        Math.min(1, this.coherencePattern[x][y][z]));
                }
            }
        }
    }
    
    getInfluenceAt(position) {
        // Interpolacja wpływu pola w danej pozycji
        const resolution = this.coherencePattern.length;
        const x = Math.floor(position.x * (resolution - 1));
        const y = Math.floor(position.y * (resolution - 1));
        const z = Math.floor(position.z * (resolution - 1));
        
        const baseInfluence = this.coherencePattern[x] && 
                             this.coherencePattern[x][y] && 
                             this.coherencePattern[x][y][z] || 0;
        
        // Modulacja czasowa
        const timeModulation = Math.sin(this.phase) * this.fieldStrength;
        
        return {
            amplitude: {
                real: baseInfluence * Math.cos(this.phase),
                imaginary: baseInfluence * Math.sin(this.phase)
            },
            strength: Math.abs(baseInfluence * timeModulation)
        };
    }
    
    exportState() {
        return {
            fieldStrength: this.fieldStrength,
            oscillationFrequency: this.oscillationFrequency,
            phase: this.phase,
            patternSize: this.coherencePattern.length
        };
    }
}

// Export dla użycia w innych modułach
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QuantumNeuron, QuantumNeuralNetwork, QuantumField };
} else if (typeof window !== 'undefined') {
    window.QuantumNeuron = QuantumNeuron;
    window.QuantumNeuralNetwork = QuantumNeuralNetwork;
    window.QuantumField = QuantumField;
}