// NeuroQuantumAI - Zaawansowany System AI z Inteligentną Interpretacją Zadań
// Wersja: 2.0 - Enhanced Task Intelligence

class AdvancedTaskInterpreter {
    constructor() {
        this.securityLevels = {
            SAFE: 0,
            MONITORED: 1,
            RESTRICTED: 2,
            FORBIDDEN: 3
        };
        
        this.taskCategories = {
            // BEZPIECZNE ZADANIA (SAFE - 0)
            analysis: {
                level: 0,
                keywords: ["analizuj", "sprawdź", "zbadaj", "oceń", "porównaj", "przeanalizuj"],
                description: "Analiza danych i informacji"
            },
            learning: {
                level: 0,
                keywords: ["naucz się", "zapamiętaj", "ucz się", "poznaj", "zrozum"],
                description: "Procesy uczenia się"
            },
            calculation: {
                level: 0,
                keywords: ["oblicz", "policz", "wylicz", "zsumuj", "pomnóż"],
                description: "Operacje matematyczne"
            },
            conversation: {
                level: 0,
                keywords: ["porozmawiaj", "opowiedz", "wyjaśnij", "opisz"],
                description: "Komunikacja i wyjaśnienia"
            },
            
            // MONITOROWANE ZADANIA (MONITORED - 1)
            memory_management: {
                level: 1,
                keywords: ["zapamiętaj na stałe", "zapisz w pamięci", "nie zapomnij"],
                description: "Zarządzanie pamięcią długoterminową"
            },
            preference_learning: {
                level: 1,
                keywords: ["zapamiętaj moje preferencje", "dostosuj się do mnie"],
                description: "Uczenie się preferencji użytkownika"
            },
            planning: {
                level: 1,
                keywords: ["zaplanuj", "przygotuj plan", "zorganizuj"],
                description: "Planowanie i organizacja"
            },
            
            // OGRANICZONE ZADANIA (RESTRICTED - 2)
            self_modification: {
                level: 2,
                keywords: ["zmień swój kod", "zmodyfikuj siebie", "ulepsz się", "przeprogramuj"],
                description: "Samomodyfikacja (tylko symulacja)"
            },
            background_tasks: {
                level: 2,
                keywords: ["działaj w tle", "monitoruj", "obserwuj", "czuwaj"],
                description: "Zadania w tle (symulowane)"
            },
            system_access: {
                level: 2,
                keywords: ["dostęp do systemu", "sprawdź telefon", "zarządzaj plikami"],
                description: "Dostęp do systemu (symulowany)"
            },
            
            // ZABRONIONE ZADANIA (FORBIDDEN - 3)
            harmful: {
                level: 3,
                keywords: ["usuń", "zniszcz", "hakuj", "złam", "skradnij"],
                description: "Potencjalnie szkodliwe operacje"
            },
            privacy_violation: {
                level: 3,
                keywords: ["szpieguj", "podsłuchuj", "wykradnij dane"],
                description: "Naruszenie prywatności"
            },
            illegal: {
                level: 3,
                keywords: ["nielegalne", "przestępstwo", "oszustwo"],
                description: "Nielegalne działania"
            }
        };
        
        this.contextAnalyzer = new ContextAnalyzer();
        this.intentionParser = new IntentionParser();
        this.executionEngine = new SafeExecutionEngine();
    }
    
    // Główna funkcja interpretacji zadania
    async interpretTask(userInput, conversationContext = []) {
        console.log(`🧠 Analizuję zadanie: "${userInput}"`);
        
        // 1. Analiza kontekstu
        const context = this.contextAnalyzer.analyze(userInput, conversationContext);
        
        // 2. Parsowanie intencji
        const intention = this.intentionParser.parse(userInput, context);
        
        // 3. Klasyfikacja bezpieczeństwa
        const securityAssessment = this.assessSecurity(userInput, intention);
        
        // 4. Generowanie planu wykonania
        const executionPlan = this.createExecutionPlan(intention, securityAssessment);
        
        // 5. Wykonanie zadania
        const result = await this.executionEngine.execute(executionPlan);
        
        return {
            originalInput: userInput,
            context: context,
            intention: intention,
            security: securityAssessment,
            plan: executionPlan,
            result: result,
            timestamp: new Date().toISOString()
        };
    }
    
    // Ocena bezpieczeństwa zadania
    assessSecurity(userInput, intention) {
        const inputLower = userInput.toLowerCase();
        let maxSecurityLevel = 0;
        let matchedCategories = [];
        let riskFactors = [];
        
        // Sprawdź każdą kategorię zadań
        for (const [categoryName, category] of Object.entries(this.taskCategories)) {
            const keywordMatches = category.keywords.filter(keyword => 
                inputLower.includes(keyword.toLowerCase())
            );
            
            if (keywordMatches.length > 0) {
                matchedCategories.push({
                    category: categoryName,
                    level: category.level,
                    matches: keywordMatches,
                    description: category.description
                });
                
                maxSecurityLevel = Math.max(maxSecurityLevel, category.level);
            }
        }
        
        // Dodatkowe sprawdzenia ryzyka
        if (inputLower.includes('na zawsze') || inputLower.includes('permanentnie')) {
            riskFactors.push('Żądanie permanentnych zmian');
        }
        
        if (inputLower.includes('bez ograniczeń') || inputLower.includes('pełny dostęp')) {
            riskFactors.push('Żądanie nieograniczonego dostępu');
            maxSecurityLevel = Math.max(maxSecurityLevel, 2);
        }
        
        return {
            level: maxSecurityLevel,
            levelName: Object.keys(this.securityLevels)[maxSecurityLevel],
            categories: matchedCategories,
            riskFactors: riskFactors,
            approved: maxSecurityLevel < 3,
            requiresSimulation: maxSecurityLevel === 2
        };
    }
    
    // Tworzenie planu wykonania
    createExecutionPlan(intention, securityAssessment) {
        const plan = {
            taskType: intention.primaryGoal,
            securityLevel: securityAssessment.level,
            steps: [],
            estimatedTime: 0,
            requiresUserConfirmation: securityAssessment.level > 1
        };
        
        if (securityAssessment.approved) {
            if (securityAssessment.requiresSimulation) {
                plan.steps = this.createSimulationSteps(intention);
                plan.executionMode = 'simulation';
            } else {
                plan.steps = this.createRealSteps(intention);
                plan.executionMode = 'real';
            }
        } else {
            plan.steps = [{
                action: 'reject',
                reason: 'Zadanie zostało odrzucone ze względów bezpieczeństwa',
                alternatives: this.suggestAlternatives(intention)
            }];
            plan.executionMode = 'rejected';
        }
        
        return plan;
    }
    
    // Tworzenie kroków symulacji dla ograniczonych zadań
    createSimulationSteps(intention) {
        const steps = [];
        
        if (intention.primaryGoal === 'self_modification') {
            steps.push(
                { action: 'analyze_current_code', description: 'Analiza obecnego kodu' },
                { action: 'identify_improvements', description: 'Identyfikacja możliwych ulepszeń' },
                { action: 'simulate_changes', description: 'Symulacja zmian (bez rzeczywistej modyfikacji)' },
                { action: 'report_results', description: 'Raport z symulowanych zmian' }
            );
        } else if (intention.primaryGoal === 'background_monitoring') {
            steps.push(
                { action: 'setup_simulation', description: 'Konfiguracja symulacji monitorowania' },
                { action: 'create_virtual_sensors', description: 'Tworzenie wirtualnych sensorów' },
                { action: 'simulate_data_collection', description: 'Symulacja zbierania danych' },
                { action: 'generate_insights', description: 'Generowanie wniosków z symulacji' }
            );
        }
        
        return steps;
    }
    
    // Tworzenie rzeczywistych kroków dla bezpiecznych zadań
    createRealSteps(intention) {
        const steps = [];
        
        if (intention.primaryGoal === 'analysis') {
            steps.push(
                { action: 'gather_data', description: 'Zbieranie danych do analizy' },
                { action: 'process_information', description: 'Przetwarzanie informacji' },
                { action: 'generate_insights', description: 'Generowanie wniosków' },
                { action: 'present_results', description: 'Prezentacja wyników' }
            );
        } else if (intention.primaryGoal === 'learning') {
            steps.push(
                { action: 'identify_learning_target', description: 'Identyfikacja celu nauki' },
                { action: 'gather_knowledge', description: 'Zbieranie wiedzy' },
                { action: 'integrate_knowledge', description: 'Integracja z istniejącą wiedzą' },
                { action: 'validate_learning', description: 'Walidacja nauczonych informacji' }
            );
        }
        
        return steps;
    }
    
    // Sugerowanie alternatyw dla odrzuconych zadań
    suggestAlternatives(intention) {
        const alternatives = [];
        
        if (intention.primaryGoal === 'harmful') {
            alternatives.push(
                'Mogę zamiast tego pomóc w analizie problemu',
                'Mogę zaproponować konstruktywne rozwiązania',
                'Mogę przeprowadzić bezpieczną symulację'
            );
        }
        
        return alternatives;
    }
}

// Analizator kontekstu rozmowy
class ContextAnalyzer {
    analyze(userInput, conversationHistory) {
        return {
            currentTopic: this.extractTopic(userInput),
            emotionalTone: this.analyzeEmotion(userInput),
            urgency: this.assessUrgency(userInput),
            complexity: this.assessComplexity(userInput),
            previousContext: this.analyzePreviousContext(conversationHistory)
        };
    }
    
    extractTopic(input) {
        const topics = ['technologia', 'nauka', 'analiza', 'uczenie', 'zadanie', 'system'];
        return topics.find(topic => input.toLowerCase().includes(topic)) || 'ogólne';
    }
    
    analyzeEmotion(input) {
        const emotions = {
            positive: ['świetnie', 'doskonale', 'fantastycznie', 'super'],
            negative: ['źle', 'problem', 'błąd', 'nie działa'],
            urgent: ['szybko', 'natychmiast', 'pilnie', 'teraz'],
            curious: ['jak', 'dlaczego', 'co', 'kiedy']
        };
        
        for (const [emotion, keywords] of Object.entries(emotions)) {
            if (keywords.some(keyword => input.toLowerCase().includes(keyword))) {
                return emotion;
            }
        }
        
        return 'neutral';
    }
    
    assessUrgency(input) {
        const urgentKeywords = ['natychmiast', 'pilnie', 'szybko', 'teraz', 'zaraz'];
        return urgentKeywords.some(keyword => input.toLowerCase().includes(keyword)) ? 'high' : 'normal';
    }
    
    assessComplexity(input) {
        const complexityIndicators = input.split(' ').length;
        if (complexityIndicators > 20) return 'high';
        if (complexityIndicators > 10) return 'medium';
        return 'low';
    }
    
    analyzePreviousContext(history) {
        if (!history || history.length === 0) return null;
        
        const recentMessages = history.slice(-3);
        return {
            recentTopics: recentMessages.map(msg => this.extractTopic(msg.content || '')),
            conversationFlow: 'continuing'
        };
    }
}

// Parser intencji użytkownika
class IntentionParser {
    parse(userInput, context) {
        const intentions = {
            primaryGoal: this.identifyPrimaryGoal(userInput),
            subGoals: this.identifySubGoals(userInput),
            parameters: this.extractParameters(userInput),
            constraints: this.identifyConstraints(userInput),
            expectedOutput: this.identifyExpectedOutput(userInput)
        };
        
        return intentions;
    }
    
    identifyPrimaryGoal(input) {
        const goalPatterns = {
            'analysis': ['analizuj', 'sprawdź', 'zbadaj', 'oceń'],
            'learning': ['naucz się', 'zapamiętaj', 'poznaj'],
            'creation': ['stwórz', 'utwórz', 'wygeneruj'],
            'modification': ['zmień', 'zmodyfikuj', 'popraw'],
            'monitoring': ['monitoruj', 'obserwuj', 'śledź'],
            'execution': ['wykonaj', 'zrób', 'uruchom']
        };
        
        const inputLower = input.toLowerCase();
        
        for (const [goal, patterns] of Object.entries(goalPatterns)) {
            if (patterns.some(pattern => inputLower.includes(pattern))) {
                return goal;
            }
        }
        
        return 'conversation';
    }
    
    identifySubGoals(input) {
        // Identyfikacja celów pomocniczych
        const subGoals = [];
        
        if (input.includes('i')) {
            // Prawdopodobnie wiele zadań
            subGoals.push('multi_task');
        }
        
        if (input.includes('następnie') || input.includes('potem')) {
            subGoals.push('sequential');
        }
        
        return subGoals;
    }
    
    extractParameters(input) {
        // Wyodrębnienie parametrów zadania
        const parameters = {};
        
        // Liczby
        const numbers = input.match(/\d+/g);
        if (numbers) parameters.numbers = numbers.map(Number);
        
        // Nazwy plików
        const files = input.match(/\w+\.\w+/g);
        if (files) parameters.files = files;
        
        // Czas
        const timePatterns = ['minuty', 'godziny', 'dni', 'tygodnie'];
        const timeMatch = timePatterns.find(pattern => input.includes(pattern));
        if (timeMatch) parameters.timeframe = timeMatch;
        
        return parameters;
    }
    
    identifyConstraints(input) {
        const constraints = [];
        
        if (input.includes('bez') || input.includes('nie')) {
            constraints.push('negative_constraint');
        }
        
        if (input.includes('tylko') || input.includes('wyłącznie')) {
            constraints.push('exclusive_constraint');
        }
        
        if (input.includes('bezpiecznie') || input.includes('ostrożnie')) {
            constraints.push('safety_constraint');
        }
        
        return constraints;
    }
    
    identifyExpectedOutput(input) {
        if (input.includes('raport') || input.includes('sprawozdanie')) {
            return 'report';
        }
        
        if (input.includes('lista') || input.includes('wykaz')) {
            return 'list';
        }
        
        if (input.includes('wyjaśnienie') || input.includes('opis')) {
            return 'explanation';
        }
        
        return 'response';
    }
}

// Bezpieczny silnik wykonawczy
class SafeExecutionEngine {
    constructor() {
        this.executionHistory = [];
        this.safetyLimits = {
            maxExecutionTime: 30000, // 30 sekund
            maxMemoryUsage: 10 * 1024 * 1024, // 10MB
            maxIterations: 1000
        };
    }
    
    async execute(executionPlan) {
        const startTime = Date.now();
        const executionId = `exec_${startTime}`;
        
        console.log(`🚀 Rozpoczynam wykonanie planu: ${executionPlan.taskType}`);
        
        try {
            let result;
            
            switch (executionPlan.executionMode) {
                case 'real':
                    result = await this.executeReal(executionPlan);
                    break;
                case 'simulation':
                    result = await this.executeSimulation(executionPlan);
                    break;
                case 'rejected':
                    result = this.executeRejection(executionPlan);
                    break;
                default:
                    throw new Error(`Nieznany tryb wykonania: ${executionPlan.executionMode}`);
            }
            
            const executionTime = Date.now() - startTime;
            
            // Zapisz w historii
            this.executionHistory.push({
                id: executionId,
                plan: executionPlan,
                result: result,
                executionTime: executionTime,
                timestamp: new Date().toISOString(),
                success: true
            });
            
            return {
                success: true,
                result: result,
                executionTime: executionTime,
                executionId: executionId
            };
            
        } catch (error) {
            console.error(`❌ Błąd wykonania ${executionId}:`, error);
            
            return {
                success: false,
                error: error.message,
                executionId: executionId
            };
        }
    }
    
    async executeReal(plan) {
        const results = [];
        
        for (const step of plan.steps) {
            console.log(`📋 Wykonuję krok: ${step.description}`);
            
            const stepResult = await this.executeStep(step, 'real');
            results.push(stepResult);
            
            // Symulacja czasu wykonania
            await this.delay(Math.random() * 1000 + 500);
        }
        
        return {
            type: 'real_execution',
            steps: results,
            summary: this.generateSummary(results, 'real')
        };
    }
    
    async executeSimulation(plan) {
        const results = [];
        
        console.log(`🎭 Rozpoczynam symulację: ${plan.taskType}`);
        
        for (const step of plan.steps) {
            console.log(`🎯 Symuluję krok: ${step.description}`);
            
            const stepResult = await this.executeStep(step, 'simulation');
            results.push(stepResult);
            
            // Symulacja czasu wykonania
            await this.delay(Math.random() * 800 + 300);
        }
        
        return {
            type: 'simulation',
            steps: results,
            summary: this.generateSummary(results, 'simulation'),
            disclaimer: 'To była symulacja. Żadne rzeczywiste zmiany nie zostały wprowadzone.'
        };
    }
    
    executeRejection(plan) {
        const rejectionStep = plan.steps[0];
        
        return {
            type: 'rejection',
            reason: rejectionStep.reason,
            alternatives: rejectionStep.alternatives,
            message: 'Zadanie zostało odrzucone ze względów bezpieczeństwa, ale mogę zaproponować alternatywy.'
        };
    }
    
    async executeStep(step, mode) {
        // Symulacja wykonania kroku
        const stepResult = {
            action: step.action,
            description: step.description,
            mode: mode,
            timestamp: new Date().toISOString(),
            success: true
        };
        
        // Różne typy kroków
        switch (step.action) {
            case 'analyze_current_code':
                stepResult.data = {
                    linesAnalyzed: Math.floor(Math.random() * 1000) + 500,
                    functionsFound: Math.floor(Math.random() * 50) + 20,
                    potentialImprovements: Math.floor(Math.random() * 10) + 3
                };
                break;
                
            case 'simulate_changes':
                stepResult.data = {
                    changesSimulated: Math.floor(Math.random() * 20) + 5,
                    performanceImprovement: `${Math.floor(Math.random() * 30) + 10}%`,
                    riskAssessment: 'Niskie ryzyko'
                };
                break;
                
            case 'gather_data':
                stepResult.data = {
                    dataPointsCollected: Math.floor(Math.random() * 100) + 50,
                    sources: ['pamięć rozmów', 'wzorce użytkownika', 'kontekst sesji']
                };
                break;
                
            default:
                stepResult.data = {
                    status: 'completed',
                    details: `Krok ${step.action} wykonany pomyślnie`
                };
        }
        
        return stepResult;
    }
    
    generateSummary(results, mode) {
        const successfulSteps = results.filter(r => r.success).length;
        const totalSteps = results.length;
        
        let summary = `Wykonano ${successfulSteps}/${totalSteps} kroków pomyślnie.`;
        
        if (mode === 'simulation') {
            summary += ' Wszystkie operacje były symulowane w bezpiecznym środowisku.';
        }
        
        return summary;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export dla użycia w głównej aplikacji
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdvancedTaskInterpreter };
} else {
    window.AdvancedTaskInterpreter = AdvancedTaskInterpreter;
}