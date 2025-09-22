// System Klasyfikacji i Priorytetyzacji Zadań
// NeuroQuantumAI v2.0 - Intelligent Task Management

class TaskClassificationSystem {
    constructor() {
        this.taskTypes = this.initializeTaskTypes();
        this.priorityMatrix = this.initializePriorityMatrix();
        this.learningHistory = new Map(); // Historia skuteczności wykonania zadań
        this.userPreferences = new Map(); // Preferencje użytkownika
    }
    
    initializeTaskTypes() {
        return {
            // KATEGORIA: ANALIZA I BADANIA
            ANALYSIS: {
                id: 'analysis',
                name: 'Analiza i Badania',
                securityLevel: 0,
                baseComplexity: 2,
                estimatedTime: 'krótki',
                capabilities: [
                    'analiza_tekstu', 'analiza_danych', 'porównanie', 
                    'ocena', 'badanie_wzorców', 'statystyki'
                ],
                examples: [
                    "Przeanalizuj ten tekst pod kątem sentymentu",
                    "Porównaj te dwie opcje",
                    "Oceń jakość tego rozwiązania"
                ]
            },
            
            // KATEGORIA: UCZENIE SIĘ I ROZWÓJ
            LEARNING: {
                id: 'learning',
                name: 'Uczenie się i Rozwój',
                securityLevel: 1,
                baseComplexity: 3,
                estimatedTime: 'średni',
                capabilities: [
                    'nauka_wzorców', 'zapamiętywanie', 'adaptacja',
                    'rozwój_umiejętności', 'integracja_wiedzy'
                ],
                examples: [
                    "Naucz się moich preferencji",
                    "Zapamiętaj ten sposób rozwiązywania problemów",
                    "Dostosuj się do mojego stylu komunikacji"
                ]
            },
            
            // KATEGORIA: PLANOWANIE I ORGANIZACJA
            PLANNING: {
                id: 'planning',
                name: 'Planowanie i Organizacja',
                securityLevel: 1,
                baseComplexity: 4,
                estimatedTime: 'średni',
                capabilities: [
                    'tworzenie_planów', 'harmonogramowanie', 'organizacja',
                    'priorytetyzacja', 'optymalizacja_procesów'
                ],
                examples: [
                    "Zaplanuj mój dzień",
                    "Zorganizuj te zadania według priorytetów",
                    "Stwórz harmonogram nauki"
                ]
            },
            
            // KATEGORIA: KREATYWNOŚĆ I GENEROWANIE
            CREATIVITY: {
                id: 'creativity',
                name: 'Kreatywność i Generowanie',
                securityLevel: 0,
                baseComplexity: 3,
                estimatedTime: 'średni',
                capabilities: [
                    'generowanie_pomysłów', 'tworzenie_treści', 'brainstorming',
                    'rozwiązania_kreatywne', 'inspiracja'
                ],
                examples: [
                    "Wygeneruj pomysły na projekt",
                    "Stwórz kreatywne rozwiązanie tego problemu",
                    "Zaproponuj alternatywne podejścia"
                ]
            },
            
            // KATEGORIA: KOMUNIKACJA I WYJAŚNIENIA
            COMMUNICATION: {
                id: 'communication',
                name: 'Komunikacja i Wyjaśnienia',
                securityLevel: 0,
                baseComplexity: 2,
                estimatedTime: 'krótki',
                capabilities: [
                    'wyjaśnianie', 'tłumaczenie', 'komunikacja',
                    'prezentacja_wyników', 'edukacja'
                ],
                examples: [
                    "Wyjaśnij mi to prostymi słowami",
                    "Przetłumacz ten tekst techniczny",
                    "Przedstaw wyniki w przystępny sposób"
                ]
            },
            
            // KATEGORIA: MONITOROWANIE I OBSERWACJA (SYMULOWANE)
            MONITORING: {
                id: 'monitoring',
                name: 'Monitorowanie i Obserwacja',
                securityLevel: 2,
                baseComplexity: 5,
                estimatedTime: 'długi',
                capabilities: [
                    'monitorowanie_wzorców', 'obserwacja_trendów', 'alerty',
                    'śledzenie_postępów', 'analiza_zachowań'
                ],
                examples: [
                    "Monitoruj moje postępy w nauce",
                    "Obserwuj trendy w naszych rozmowach",
                    "Śledź moje preferencje czasowe"
                ],
                simulationNote: "Zadania monitorowania są symulowane w bezpiecznym środowisku"
            },
            
            // KATEGORIA: SAMOMODYFIKACJA (SYMULOWANE)
            SELF_IMPROVEMENT: {
                id: 'self_improvement',
                name: 'Samomodyfikacja i Ulepszenia',
                securityLevel: 2,
                baseComplexity: 6,
                estimatedTime: 'długi',
                capabilities: [
                    'analiza_własnego_kodu', 'optymalizacja_algorytmów',
                    'uczenie_meta', 'samodiagnoza', 'ewolucja_zachowań'
                ],
                examples: [
                    "Ulepsz swoje algorytmy odpowiedzi",
                    "Zoptymalizuj sposób analizy moich próśb",
                    "Rozwiń swoje zdolności rozumowania"
                ],
                simulationNote: "Samomodyfikacja jest symulowana - rzeczywisty kod pozostaje niezmieniony"
            },
            
            // KATEGORIA: ZADANIA SYSTEMOWE (SYMULOWANE)
            SYSTEM_TASKS: {
                id: 'system_tasks',
                name: 'Zadania Systemowe',
                securityLevel: 2,
                baseComplexity: 4,
                estimatedTime: 'średni',
                capabilities: [
                    'symulacja_dostępu_systemu', 'wirtualne_operacje_plikowe',
                    'symulacja_sensorów', 'emulacja_funkcji_telefonu'
                ],
                examples: [
                    "Sprawdź status systemu",
                    "Symuluj dostęp do plików",
                    "Emuluj funkcje aparatu"
                ],
                simulationNote: "Wszystkie operacje systemowe są symulowane"
            }
        };
    }
    
    initializePriorityMatrix() {
        return {
            // Macierz priorytetów: [pilność, ważność] -> priorytet
            URGENT_IMPORTANT: { priority: 1, label: 'Krytyczny', color: '#ff4444' },
            URGENT_NORMAL: { priority: 2, label: 'Wysoki', color: '#ff8800' },
            NORMAL_IMPORTANT: { priority: 3, label: 'Średni', color: '#ffaa00' },
            NORMAL_NORMAL: { priority: 4, label: 'Niski', color: '#88cc88' },
            
            // Modyfikatory priorytetów
            USER_PREFERENCE_BOOST: 0.5, // Zwiększa priorytet o 0.5
            LEARNING_OPPORTUNITY: 0.3,  // Zadania uczące się mają wyższy priorytet
            COMPLEXITY_PENALTY: 0.2,    // Złożone zadania mają niższy priorytet
            SUCCESS_HISTORY_BOOST: 0.4  // Zadania z historią sukcesów mają wyższy priorytet
        };
    }
    
    // Główna funkcja klasyfikacji zadania
    classifyTask(taskDescription, context = {}) {
        console.log(`🔍 Klasyfikuję zadanie: "${taskDescription}"`);
        
        // 1. Identyfikacja typu zadania
        const taskType = this.identifyTaskType(taskDescription);
        
        // 2. Analiza złożoności
        const complexity = this.analyzeComplexity(taskDescription, taskType);
        
        // 3. Ocena pilności
        const urgency = this.assessUrgency(taskDescription, context);
        
        // 4. Ocena ważności
        const importance = this.assessImportance(taskDescription, context);
        
        // 5. Obliczenie priorytetu
        const priority = this.calculatePriority(urgency, importance, taskType, complexity);
        
        // 6. Oszacowanie czasu wykonania
        const timeEstimate = this.estimateExecutionTime(taskType, complexity);
        
        // 7. Identyfikacja wymaganych zasobów
        const resources = this.identifyRequiredResources(taskType, complexity);
        
        // 8. Ocena ryzyka
        const riskAssessment = this.assessRisk(taskType, taskDescription);
        
        const classification = {
            id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            originalDescription: taskDescription,
            taskType: taskType,
            complexity: complexity,
            urgency: urgency,
            importance: importance,
            priority: priority,
            timeEstimate: timeEstimate,
            resources: resources,
            risk: riskAssessment,
            context: context,
            timestamp: new Date().toISOString(),
            status: 'classified'
        };
        
        // Zapisz do historii uczenia się
        this.updateLearningHistory(classification);
        
        return classification;
    }
    
    // Identyfikacja typu zadania
    identifyTaskType(description) {
        const descLower = description.toLowerCase();
        const scores = new Map();
        
        // Sprawdź każdy typ zadania
        for (const [typeId, typeInfo] of Object.entries(this.taskTypes)) {
            let score = 0;
            
            // Sprawdź przykłady
            for (const example of typeInfo.examples) {
                const exampleWords = example.toLowerCase().split(' ');
                const matchingWords = exampleWords.filter(word => 
                    word.length > 3 && descLower.includes(word)
                );
                score += matchingWords.length * 2;
            }
            
            // Sprawdź możliwości
            for (const capability of typeInfo.capabilities) {
                const capabilityWords = capability.split('_');
                const matchingCaps = capabilityWords.filter(word => 
                    descLower.includes(word)
                );
                score += matchingCaps.length;
            }
            
            scores.set(typeId, score);
        }
        
        // Znajdź najlepiej pasujący typ
        const bestMatch = Array.from(scores.entries())
            .sort((a, b) => b[1] - a[1])[0];
        
        if (bestMatch[1] > 0) {
            return this.taskTypes[bestMatch[0]];
        }
        
        // Domyślny typ - komunikacja
        return this.taskTypes.COMMUNICATION;
    }
    
    // Analiza złożoności zadania
    analyzeComplexity(description, taskType) {
        let complexity = taskType.baseComplexity;
        
        // Modyfikatory złożoności
        const complexityIndicators = {
            high: ['złożony', 'skomplikowany', 'zaawansowany', 'wieloetapowy', 'szczegółowy'],
            medium: ['średni', 'normalny', 'standardowy'],
            low: ['prosty', 'łatwy', 'podstawowy', 'szybki']
        };
        
        const descLower = description.toLowerCase();
        
        if (complexityIndicators.high.some(indicator => descLower.includes(indicator))) {
            complexity += 2;
        } else if (complexityIndicators.low.some(indicator => descLower.includes(indicator))) {
            complexity -= 1;
        }
        
        // Długość opisu jako wskaźnik złożoności
        const wordCount = description.split(' ').length;
        if (wordCount > 20) complexity += 1;
        if (wordCount > 50) complexity += 1;
        
        // Obecność liczb, dat, nazw własnych
        if (/\d/.test(description)) complexity += 0.5;
        if (/[A-Z][a-z]+/.test(description)) complexity += 0.5;
        
        return Math.max(1, Math.min(10, Math.round(complexity * 10) / 10));
    }
    
    // Ocena pilności
    assessUrgency(description, context) {
        const urgencyKeywords = {
            critical: ['natychmiast', 'pilnie', 'krytyczne', 'awaryjnie', 'teraz'],
            high: ['szybko', 'rychło', 'wkrótce', 'dziś'],
            medium: ['niedługo', 'w tym tygodniu', 'wkrótce'],
            low: ['kiedyś', 'w przyszłości', 'może', 'opcjonalnie']
        };
        
        const descLower = description.toLowerCase();
        
        for (const [level, keywords] of Object.entries(urgencyKeywords)) {
            if (keywords.some(keyword => descLower.includes(keyword))) {
                return level;
            }
        }
        
        // Sprawdź kontekst czasowy
        if (context.timeframe === 'immediate') return 'critical';
        if (context.timeframe === 'today') return 'high';
        
        return 'medium';
    }
    
    // Ocena ważności
    assessImportance(description, context) {
        const importanceIndicators = {
            critical: ['kluczowe', 'fundamentalne', 'niezbędne', 'krytyczne'],
            high: ['ważne', 'istotne', 'znaczące', 'priorytetowe'],
            medium: ['przydatne', 'pomocne', 'interesujące'],
            low: ['opcjonalne', 'dodatkowe', 'nice-to-have']
        };
        
        const descLower = description.toLowerCase();
        
        for (const [level, keywords] of Object.entries(importanceIndicators)) {
            if (keywords.some(keyword => descLower.includes(keyword))) {
                return level;
            }
        }
        
        // Sprawdź preferencje użytkownika
        if (this.userPreferences.has('important_topics')) {
            const importantTopics = this.userPreferences.get('important_topics');
            if (importantTopics.some(topic => descLower.includes(topic))) {
                return 'high';
            }
        }
        
        return 'medium';
    }
    
    // Obliczenie priorytetu
    calculatePriority(urgency, importance, taskType, complexity) {
        // Bazowy priorytet z macierzy
        const urgencyImportanceKey = `${urgency.toUpperCase()}_${importance.toUpperCase()}`;
        let basePriority = this.priorityMatrix[urgencyImportanceKey]?.priority || 4;
        
        // Modyfikatory
        let priorityModifier = 0;
        
        // Bonus za preferencje użytkownika
        if (this.isUserPreferredTask(taskType)) {
            priorityModifier -= this.priorityMatrix.USER_PREFERENCE_BOOST;
        }
        
        // Bonus za możliwości uczenia się
        if (taskType.id === 'learning' || taskType.capabilities.includes('nauka_wzorców')) {
            priorityModifier -= this.priorityMatrix.LEARNING_OPPORTUNITY;
        }
        
        // Kara za złożoność
        if (complexity > 6) {
            priorityModifier += this.priorityMatrix.COMPLEXITY_PENALTY;
        }
        
        // Bonus za historię sukcesów
        if (this.hasSuccessHistory(taskType)) {
            priorityModifier -= this.priorityMatrix.SUCCESS_HISTORY_BOOST;
        }
        
        const finalPriority = Math.max(1, Math.min(5, basePriority + priorityModifier));
        
        return {
            numeric: Math.round(finalPriority * 10) / 10,
            label: this.getPriorityLabel(finalPriority),
            color: this.getPriorityColor(finalPriority)
        };
    }
    
    // Oszacowanie czasu wykonania
    estimateExecutionTime(taskType, complexity) {
        const baseTime = {
            'krótki': 30,    // 30 sekund
            'średni': 120,   // 2 minuty
            'długi': 300     // 5 minut
        };
        
        let estimatedSeconds = baseTime[taskType.estimatedTime] || 60;
        
        // Modyfikacja na podstawie złożoności
        estimatedSeconds *= (complexity / taskType.baseComplexity);
        
        return {
            seconds: Math.round(estimatedSeconds),
            humanReadable: this.formatTime(estimatedSeconds),
            category: taskType.estimatedTime
        };
    }
    
    // Identyfikacja wymaganych zasobów
    identifyRequiredResources(taskType, complexity) {
        const resources = {
            memory: Math.min(100, complexity * 10), // MB
            processing: Math.min(100, complexity * 15), // %
            network: taskType.capabilities.includes('analiza_danych') ? 'medium' : 'low',
            storage: Math.min(50, complexity * 5) // MB
        };
        
        return resources;
    }
    
    // Ocena ryzyka
    assessRisk(taskType, description) {
        let riskLevel = 'low';
        let riskFactors = [];
        
        if (taskType.securityLevel >= 2) {
            riskLevel = 'medium';
            riskFactors.push('Wymaga symulacji ze względów bezpieczeństwa');
        }
        
        if (taskType.securityLevel >= 3) {
            riskLevel = 'high';
            riskFactors.push('Potencjalnie niebezpieczne operacje');
        }
        
        // Sprawdź ryzykowne słowa kluczowe
        const riskyKeywords = ['usuń', 'zniszcz', 'zmień na stałe', 'bez ograniczeń'];
        const descLower = description.toLowerCase();
        
        riskyKeywords.forEach(keyword => {
            if (descLower.includes(keyword)) {
                riskLevel = 'high';
                riskFactors.push(`Wykryto ryzykowne słowo kluczowe: "${keyword}"`);
            }
        });
        
        return {
            level: riskLevel,
            factors: riskFactors,
            mitigation: this.suggestRiskMitigation(riskLevel, riskFactors)
        };
    }
    
    // Pomocnicze funkcje
    isUserPreferredTask(taskType) {
        if (!this.userPreferences.has('preferred_task_types')) return false;
        const preferredTypes = this.userPreferences.get('preferred_task_types');
        return preferredTypes.includes(taskType.id);
    }
    
    hasSuccessHistory(taskType) {
        if (!this.learningHistory.has(taskType.id)) return false;
        const history = this.learningHistory.get(taskType.id);
        return history.successRate > 0.8 && history.totalExecutions > 3;
    }
    
    getPriorityLabel(priority) {
        if (priority <= 1.5) return 'Krytyczny';
        if (priority <= 2.5) return 'Wysoki';
        if (priority <= 3.5) return 'Średni';
        return 'Niski';
    }
    
    getPriorityColor(priority) {
        if (priority <= 1.5) return '#ff4444';
        if (priority <= 2.5) return '#ff8800';
        if (priority <= 3.5) return '#ffaa00';
        return '#88cc88';
    }
    
    formatTime(seconds) {
        if (seconds < 60) return `${Math.round(seconds)}s`;
        if (seconds < 3600) return `${Math.round(seconds / 60)}min`;
        return `${Math.round(seconds / 3600)}h`;
    }
    
    suggestRiskMitigation(riskLevel, riskFactors) {
        const mitigations = [];
        
        if (riskLevel === 'high') {
            mitigations.push('Wykonanie tylko w trybie symulacji');
            mitigations.push('Wymagane potwierdzenie użytkownika');
            mitigations.push('Szczegółowe logowanie operacji');
        } else if (riskLevel === 'medium') {
            mitigations.push('Monitorowanie wykonania');
            mitigations.push('Możliwość przerwania operacji');
        }
        
        return mitigations;
    }
    
    // Aktualizacja historii uczenia się
    updateLearningHistory(classification) {
        const taskTypeId = classification.taskType.id;
        
        if (!this.learningHistory.has(taskTypeId)) {
            this.learningHistory.set(taskTypeId, {
                totalExecutions: 0,
                successfulExecutions: 0,
                successRate: 0,
                averageComplexity: 0,
                averageExecutionTime: 0,
                lastExecution: null
            });
        }
        
        const history = this.learningHistory.get(taskTypeId);
        history.totalExecutions++;
        history.lastExecution = classification.timestamp;
        
        // Aktualizacja średniej złożoności
        history.averageComplexity = (
            (history.averageComplexity * (history.totalExecutions - 1) + classification.complexity) 
            / history.totalExecutions
        );
    }
    
    // Aktualizacja wyniku wykonania
    updateExecutionResult(taskId, success, executionTime) {
        // Znajdź zadanie w historii i zaktualizuj statystyki
        for (const [taskTypeId, history] of this.learningHistory.entries()) {
            if (success) {
                history.successfulExecutions++;
            }
            history.successRate = history.successfulExecutions / history.totalExecutions;
            
            if (executionTime) {
                history.averageExecutionTime = (
                    (history.averageExecutionTime * (history.totalExecutions - 1) + executionTime)
                    / history.totalExecutions
                );
            }
        }
    }
    
    // Pobierz statystyki systemu
    getSystemStats() {
        const stats = {
            totalTasksClassified: Array.from(this.learningHistory.values())
                .reduce((sum, history) => sum + history.totalExecutions, 0),
            taskTypeDistribution: {},
            averageSuccessRate: 0,
            preferredTaskTypes: Array.from(this.userPreferences.get('preferred_task_types') || [])
        };
        
        // Rozkład typów zadań
        for (const [taskTypeId, history] of this.learningHistory.entries()) {
            stats.taskTypeDistribution[taskTypeId] = {
                count: history.totalExecutions,
                successRate: history.successRate,
                averageComplexity: history.averageComplexity
            };
        }
        
        // Średni wskaźnik sukcesu
        const successRates = Array.from(this.learningHistory.values())
            .map(h => h.successRate)
            .filter(rate => rate > 0);
        
        if (successRates.length > 0) {
            stats.averageSuccessRate = successRates.reduce((sum, rate) => sum + rate, 0) / successRates.length;
        }
        
        return stats;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TaskClassificationSystem };
} else {
    window.TaskClassificationSystem = TaskClassificationSystem;
}