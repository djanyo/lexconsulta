// Global variables
let currentSection = 'home';
let chatMessages = [];
let isTyping = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set initial time for chat
    document.getElementById('initialTime').textContent = getCurrentTime();
    
    // Load data
    loadLawyers();
    loadResources();
    loadProcesses();
    loadNews();
    loadQuickQuestions();
    
    // Add event listeners
    addEventListeners();
}

function addEventListeners() {
    // Chat input
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Search and filter inputs
    const lawyerSearch = document.getElementById('lawyerSearch');
    if (lawyerSearch) {
        lawyerSearch.addEventListener('input', filterLawyers);
    }
    
    const resourceSearch = document.getElementById('resourceSearch');
    if (resourceSearch) {
        resourceSearch.addEventListener('input', filterResources);
    }
}

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    updateNavigation(sectionId);
    currentSection = sectionId;
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function updateNavigation(activeSection) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === activeSection) {
            link.classList.add('active');
        }
    });
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
}

// Chat functions
const predefinedResponses = {
    // DERECHO CIVIL
    divorcio: 'Para el divorcio existen dos modalidades principales:\n\n1. **Divorcio de mutuo acuerdo**: Cuando ambos cónyuges están de acuerdo en divorciarse y en las condiciones (custodia, pensiones, etc.). Es más rápido y económico.\n\n2. **Divorcio contencioso**: Cuando hay desacuerdo entre las partes. Requiere procedimiento judicial completo.\n\n**Documentos necesarios:**\n• Certificado de matrimonio\n• Convenio regulador\n• Certificados de nacimiento de hijos\n• Documentación económica\n\n¿Te interesa información específica sobre alguno de estos tipos?',
    
    contrato: 'Los contratos pueden ser de varios tipos:\n\n• **Contratos civiles**: Compraventa, arrendamiento, donación\n• **Contratos laborales**: Indefinido, temporal, formación\n• **Contratos mercantiles**: Suministro, distribución, franquicia\n\n**Requisitos básicos:**\n• Consentimiento de las partes\n• Objeto lícito y determinado\n• Causa lícita\n\n**Consejos importantes:**\n• Siempre por escrito para mayor seguridad\n• Leer todas las cláusulas antes de firmar\n• Conservar copias originales\n\n¿Sobre qué tipo de contrato necesitas información específica?',
    
    herencia: 'En materia de herencias:\n\n**Con testamento**: Se respeta la voluntad del fallecido dentro de los límites legales (legítima).\n\n**Sin testamento**: Se aplica la sucesión intestada según el orden legal:\n1. Descendientes (hijos, nietos)\n2. Ascendientes (padres, abuelos)\n3. Cónyuge\n4. Hermanos y sobrinos\n5. Otros parientes hasta 4º grado\n6. Estado\n\n**Documentos necesarios:**\n• Certificado de defunción\n• Certificado de últimas voluntades\n• Inventario de bienes\n• Documentos de parentesco\n\n**Plazos importantes:**\n• 6 meses para liquidar el Impuesto de Sucesiones\n• 30 años para reclamar la herencia\n\n¿Tu consulta es sobre herencia con o sin testamento?',

    // DERECHO LABORAL
    despido: 'Los despidos pueden ser:\n\n• **Procedente**: Causa justificada, indemnización según tipo de contrato\n• **Improcedente**: Sin causa justificada, 33 días por año (máx. 24 mensualidades)\n• **Nulo**: Por discriminación, 45 días por año + readmisión\n\n**Causas de despido procedente:**\n• Faltas repetidas de puntualidad\n• Falta de adaptación a modificaciones técnicas\n• Ineptitud sobrevenida\n• Transgresión de buena fe contractual\n\n**Plazos importantes:**\n• 20 días hábiles para reclamar desde el despido\n• 4 días para solicitar conciliación previa\n\n¿Necesitas más detalles sobre algún tipo específico de despido?',

    finiquito: 'El finiquito es la liquidación final que debe recibir el trabajador al finalizar su contrato:\n\n**Conceptos incluidos:**\n• Salario pendiente hasta la fecha de cese\n• Parte proporcional de pagas extras\n• Vacaciones no disfrutadas\n• Indemnización (si corresponde)\n\n**Plazos de pago:**\n• Debe pagarse en el momento del cese\n• Máximo retraso: día siguiente hábil\n\n**Importante:**\n• Revisar todos los conceptos antes de firmar\n• Firmar "no conforme" si hay discrepancias\n• Conservar copia del documento\n\n¿Tienes dudas sobre algún concepto específico del finiquito?',

    vacaciones: 'Sobre las vacaciones laborales:\n\n**Duración:**\n• 30 días naturales por año trabajado\n• Se pueden fraccionar en períodos mínimos de 7 días\n• Al menos 2 semanas consecutivas en período estival\n\n**Derechos del trabajador:**\n• Conocer fechas con 2 meses de antelación\n• Cobrar salario íntegro durante vacaciones\n• No se pueden compensar económicamente (salvo fin de contrato)\n\n**Período de disfrute:**\n• Generalmente entre mayo y octubre\n• Puede acordarse otro período por convenio\n\n¿Tienes alguna situación específica con tus vacaciones?',

    // DERECHO INMOBILIARIO
    alquiler: 'En arrendamientos urbanos (LAU):\n\n**Derechos del inquilino:**\n• Duración mínima 5 años (7 si propietario es persona jurídica)\n• Prórroga tácita anual\n• Derecho de tanteo y retracto\n• Actualización de renta según IPC\n\n**Obligaciones del inquilino:**\n• Pago puntual de la renta\n• Uso conforme al destino\n• Conservación de la vivienda\n• Comunicar necesidad de reparaciones\n\n**Fianza:**\n• 1 mes de renta para vivienda\n• 2 meses para uso distinto de vivienda\n• Depositada en organismo autonómico\n\n¿Tu consulta es como propietario o inquilino?',

    desahucio: 'El desahucio puede ser por:\n\n**1. Falta de pago:**\n• Requerimiento fehaciente previo\n• Demanda si no se subsana\n• Procedimiento rápido (2-4 meses)\n\n**2. Expiración del contrato:**\n• Notificación con 30 días de antelación\n• Solo si han transcurrido los plazos mínimos\n\n**3. Necesidad del propietario:**\n• Para vivienda propia o familiares\n• Indemnización de 1 mes si contrato > 5 años\n\n**Defensa del inquilino:**\n• Alegar pago o subsanar deuda\n• Solicitar plazos adicionales\n• Recurrir la sentencia\n\n¿En qué situación específica te encuentras?',

    // DERECHO PENAL
    denuncia: 'Para presentar una denuncia:\n\n**¿Dónde presentarla?**\n• Comisaría de Policía\n• Cuartel de Guardia Civil\n• Juzgado de Guardia\n• Fiscalía (delitos públicos)\n\n**Información necesaria:**\n• Datos personales del denunciante\n• Hechos ocurridos (fecha, lugar, circunstancias)\n• Datos del presunto autor (si se conocen)\n• Testigos y pruebas disponibles\n\n**Tipos de delitos:**\n• **Públicos**: Se persiguen de oficio\n• **Semipúblicos**: Requieren denuncia\n• **Privados**: Solo por querella del ofendido\n\n**Plazos:**\n• Delitos: no prescriben hasta varios años\n• Faltas: 6 meses desde conocimiento\n\n¿Qué tipo de situación necesitas denunciar?',

    accidente: 'En caso de accidente de tráfico:\n\n**Pasos inmediatos:**\n1. Asegurar la zona y avisar emergencias si hay heridos\n2. Rellenar parte amistoso de accidente\n3. Tomar fotos de vehículos, daños y situación\n4. Recabar datos de testigos\n5. Avisar a las aseguradoras\n\n**Documentación necesaria:**\n• Permiso de conducir\n• Documentación del vehículo\n• Póliza de seguro\n• Parte de accidente\n\n**Plazos importantes:**\n• 7 días para comunicar a la aseguradora\n• 1 año para reclamar daños personales\n• 3 años para reclamar daños materiales\n\n¿El accidente ha sido con heridos o solo daños materiales?',

    // DERECHO FISCAL
    hacienda: 'Sobre obligaciones con Hacienda:\n\n**Principales impuestos:**\n• **IRPF**: Renta de personas físicas\n• **IVA**: Impuesto sobre valor añadido\n• **Sociedades**: Para empresas\n• **Patrimonio**: Grandes patrimonios\n\n**Plazos de declaración:**\n• IRPF: Abril-Junio\n• IVA: Trimestral o mensual\n• Sociedades: 25 días tras cierre ejercicio\n\n**Derechos del contribuyente:**\n• Información y asistencia\n• Confidencialidad\n• Recurrir actos administrativos\n• Aplazamiento y fraccionamiento\n\n¿Tienes alguna consulta específica sobre impuestos?',

    multa: 'Para recurrir una multa:\n\n**Tipos de recursos:**\n• **Alegaciones**: En el expediente sancionador\n• **Recurso de alzada**: Contra resolución definitiva\n• **Recurso contencioso**: En vía judicial\n\n**Plazos:**\n• Alegaciones: 15-20 días según tipo\n• Recurso alzada: 1 mes\n• Contencioso: 2 meses\n\n**Motivos de recurso:**\n• Defectos de forma en la notificación\n• Prescripción de la infracción\n• Falta de pruebas\n• Error en identificación del infractor\n\n**Documentación:**\n• Copia de la multa\n• Pruebas que apoyen la defensa\n• Alegaciones por escrito\n\n¿Qué tipo de multa has recibido?',

    // DERECHO DE FAMILIA
    custodia: 'Sobre la custodia de menores:\n\n**Tipos de custodia:**\n• **Compartida**: Ambos progenitores (preferente)\n• **Exclusiva**: Un solo progenitor\n• **Partida**: Cada hijo con un progenitor\n\n**Criterios del juez:**\n• Interés superior del menor\n• Edad y opinión del menor\n• Relación con cada progenitor\n• Disponibilidad y estabilidad\n• Capacidad económica\n\n**Derechos del progenitor no custodio:**\n• Régimen de visitas\n• Participar en decisiones importantes\n• Información sobre el menor\n\n**Pensión alimenticia:**\n• Obligatoria para ambos progenitores\n• Proporcional a ingresos y necesidades\n\n¿Tu situación es de separación o divorcio en curso?',

    pension: 'Sobre pensiones alimenticias:\n\n**¿Quién debe pagarla?**\n• Ambos progenitores según sus posibilidades\n• Generalmente quien no tiene custodia\n\n**¿Qué incluye?**\n• Alimentación, vestido, habitación\n• Asistencia médica\n• Educación e instrucción\n• Gastos extraordinarios (50% cada uno)\n\n**Modificación:**\n• Por cambio sustancial de circunstancias\n• Aumento o disminución de ingresos\n• Nuevas necesidades del menor\n\n**Impago:**\n• Delito de abandono de familia\n• Embargo de nómina y cuentas\n• Inhabilitación para obtener ayudas públicas\n\n¿Necesitas información sobre cálculo o modificación?',

    // DERECHO MERCANTIL
    empresa: 'Para crear una empresa:\n\n**Formas jurídicas principales:**\n• **Autónomo**: Persona física, responsabilidad ilimitada\n• **SL**: Sociedad Limitada, capital mínimo 3.006€\n• **SA**: Sociedad Anónima, capital mínimo 60.101€\n• **SLP**: Sociedad Limitada Profesional\n\n**Pasos para SL:**\n1. Certificación negativa del nombre\n2. Depósito del capital social\n3. Escritura pública ante notario\n4. Liquidación del impuesto (1% del capital)\n5. Inscripción en Registro Mercantil\n6. Altas fiscales y laborales\n\n**Tiempo estimado:** 15-30 días\n**Coste aproximado:** 300-600€\n\n¿Qué tipo de actividad vas a desarrollar?',

    // DERECHO ADMINISTRATIVO
    recurso: 'Para recurrir actos administrativos:\n\n**Tipos de recursos:**\n• **Reposición**: Ante el mismo órgano (opcional)\n• **Alzada**: Ante órgano superior\n• **Extraordinario de revisión**: Casos específicos\n\n**Plazos:**\n• Reposición: 1 mes\n• Alzada: 1 mes (3 meses si no hay reposición)\n• Contencioso-administrativo: 2 meses\n\n**Motivos de recurso:**\n• Incompetencia del órgano\n• Defectos de forma\n• Desviación de poder\n• Vulneración de derechos\n\n**Efectos:**\n• Generalmente no suspensivos\n• Puede solicitarse suspensión cautelar\n\n¿Contra qué tipo de resolución quieres recurrir?',

    // OTROS TEMAS FRECUENTES
    testamento: 'Sobre testamentos:\n\n**Tipos principales:**\n• **Ológrafo**: Escrito a mano por el testador\n• **Abierto notarial**: Ante notario (más seguro)\n• **Cerrado**: Contenido secreto\n\n**Contenido típico:**\n• Identificación del testador\n• Revocación de testamentos anteriores\n• Disposiciones sobre bienes\n• Nombramiento de herederos\n• Legados específicos\n\n**Limitaciones:**\n• Legítima: 2/3 para herederos forzosos\n• Tercio de mejora: para descendientes\n• Tercio de libre disposición\n\n**Validez:**\n• Capacidad del testador\n• Forma legal adecuada\n• Contenido no contrario a ley\n\n¿Quieres información sobre algún tipo específico?',

    seguro: 'Sobre seguros y reclamaciones:\n\n**Tipos principales:**\n• **Hogar**: Incendios, robos, daños por agua\n• **Auto**: Obligatorio, responsabilidad civil\n• **Vida**: Fallecimiento, invalidez\n• **Salud**: Asistencia médica privada\n\n**Derechos del asegurado:**\n• Información clara sobre cobertura\n• Indemnización en plazo (40 días máximo)\n• Peritación contradictoria\n• Recurrir ante mediador de seguros\n\n**Reclamaciones:**\n1. Comunicar siniestro inmediatamente\n2. Aportar documentación requerida\n3. Colaborar en la investigación\n4. Recurrir si hay desacuerdo\n\n¿Tienes algún problema específico con tu seguro?',

    // RESPUESTAS GENERALES
    saludo: '¡Hola! Es un placer ayudarte. Soy tu asistente legal especializado. Puedo orientarte en temas como:\n\n• **Derecho Civil**: contratos, herencias, divorcios\n• **Derecho Penal**: delitos, denuncias, procedimientos\n• **Derecho Laboral**: despidos, contratos, finiquitos\n• **Derecho Fiscal**: impuestos, multas, Hacienda\n• **Derecho de Familia**: custodia, pensiones, adopción\n• **Derecho Mercantil**: empresas, sociedades, contratos\n• **Derecho Inmobiliario**: alquileres, compraventas, hipotecas\n• **Derecho Administrativo**: recursos, procedimientos públicos\n\n¿Sobre qué tema legal necesitas consultar?',

    gracias: '¡De nada! Me alegra poder ayudarte. Recuerda que esta información es orientativa y para casos específicos siempre es recomendable consultar con un abogado especializado.\n\n¿Hay algo más en lo que pueda asistirte? Estoy aquí para resolver todas tus dudas legales.',

    default: 'Entiendo tu consulta, pero necesito más información específica para darte una respuesta precisa. ¿Podrías contarme más detalles sobre tu situación?\n\nPor ejemplo:\n• ¿Se trata de un tema civil, penal, laboral o fiscal?\n• ¿Cuál es el problema específico que enfrentas?\n• ¿Hay algún documento o situación particular involucrada?\n\nMientras más detalles me proporciones, mejor podré orientarte. También puedes usar las preguntas frecuentes de abajo para temas comunes.'
};

function getResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Saludos
    if (lowerMessage.includes('hola') || lowerMessage.includes('buenos días') || lowerMessage.includes('buenas tardes') || lowerMessage.includes('buenas noches')) {
        return predefinedResponses.saludo;
    }
    
    // Agradecimientos
    if (lowerMessage.includes('gracias') || lowerMessage.includes('muchas gracias')) {
        return predefinedResponses.gracias;
    }

    // DERECHO CIVIL
    if (lowerMessage.includes('divorcio') || lowerMessage.includes('separar') || lowerMessage.includes('matrimonio')) {
        return predefinedResponses.divorcio;
    }
    if (lowerMessage.includes('contrato') || lowerMessage.includes('acuerdo') || lowerMessage.includes('firma')) {
        return predefinedResponses.contrato;
    }
    if (lowerMessage.includes('herencia') || lowerMessage.includes('testamento') || lowerMessage.includes('sucesión') || lowerMessage.includes('heredar')) {
        return predefinedResponses.herencia;
    }
    if (lowerMessage.includes('testamento') && !lowerMessage.includes('herencia')) {
        return predefinedResponses.testamento;
    }

    // DERECHO LABORAL
    if (lowerMessage.includes('despido') || lowerMessage.includes('despedir') || lowerMessage.includes('echar del trabajo')) {
        return predefinedResponses.despido;
    }
    if (lowerMessage.includes('finiquito') || lowerMessage.includes('liquidación')) {
        return predefinedResponses.finiquito;
    }
    if (lowerMessage.includes('vacaciones') || lowerMessage.includes('días libres')) {
        return predefinedResponses.vacaciones;
    }

    // DERECHO INMOBILIARIO
    if (lowerMessage.includes('alquiler') || lowerMessage.includes('arrendamiento') || lowerMessage.includes('inquilino') || lowerMessage.includes('renta')) {
        return predefinedResponses.alquiler;
    }
    if (lowerMessage.includes('desahucio') || lowerMessage.includes('echar de casa') || lowerMessage.includes('desalojar')) {
        return predefinedResponses.desahucio;
    }

    // DERECHO PENAL
    if (lowerMessage.includes('denuncia') || lowerMessage.includes('denunciar') || lowerMessage.includes('delito')) {
        return predefinedResponses.denuncia;
    }
    if (lowerMessage.includes('accidente') || lowerMessage.includes('choque') || lowerMessage.includes('atropello')) {
        return predefinedResponses.accidente;
    }

    // DERECHO FISCAL
    if (lowerMessage.includes('hacienda') || lowerMessage.includes('impuesto') || lowerMessage.includes('irpf') || lowerMessage.includes('declaración')) {
        return predefinedResponses.hacienda;
    }
    if (lowerMessage.includes('multa') || lowerMessage.includes('sanción') || lowerMessage.includes('recurrir')) {
        return predefinedResponses.multa;
    }

    // DERECHO DE FAMILIA
    if (lowerMessage.includes('custodia') || lowerMessage.includes('hijos') || lowerMessage.includes('menor')) {
        return predefinedResponses.custodia;
    }
    if (lowerMessage.includes('pensión') || lowerMessage.includes('manutención') || lowerMessage.includes('alimentos')) {
        return predefinedResponses.pension;
    }

    // DERECHO MERCANTIL
    if (lowerMessage.includes('empresa') || lowerMessage.includes('sociedad') || lowerMessage.includes('autónomo') || lowerMessage.includes('negocio')) {
        return predefinedResponses.empresa;
    }

    // DERECHO ADMINISTRATIVO
    if (lowerMessage.includes('recurso') || lowerMessage.includes('administración') || lowerMessage.includes('ayuntamiento')) {
        return predefinedResponses.recurso;
    }

    // OTROS
    if (lowerMessage.includes('seguro') || lowerMessage.includes('aseguradora') || lowerMessage.includes('póliza')) {
        return predefinedResponses.seguro;
    }
    
    return predefinedResponses.default;
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message || isTyping) return;
    
    // Add user message
    addMessage(message, 'user');
    messageInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate bot response delay
    setTimeout(() => {
        hideTypingIndicator();
        const response = getResponse(message);
        addMessage(response, 'bot');
    }, 1500);
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
        </div>
        <div class="message-content">
            <div class="message-text">${text}</div>
            <div class="message-time">${getCurrentTime()}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    isTyping = true;
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="message-text">
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Disable send button
    document.getElementById('sendButton').disabled = true;
}

function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    
    // Enable send button
    document.getElementById('sendButton').disabled = false;
}

function loadQuickQuestions() {
    const questions = [
        '¿Cómo iniciar un divorcio?',
        '¿Qué hacer en caso de despido?',
        '¿Cómo reclamar una herencia?',
        '¿Cuáles son mis derechos como inquilino?',
        '¿Cómo hacer un contrato válido?',
        '¿Cómo presentar una denuncia?',
        '¿Qué incluye el finiquito?',
        '¿Cómo recurrir una multa?',
        '¿Qué es la custodia compartida?',
        '¿Cómo crear una empresa?',
        '¿Qué hacer tras un accidente?',
        '¿Cuándo debo hacer testamento?',
        '¿Cómo reclamar al seguro?',
        '¿Qué es un desahucio?',
        '¿Cuáles son mis derechos laborales?',
        '¿Cómo funciona la pensión alimenticia?',
        '¿Qué documentos necesito para heredar?',
        '¿Puedo romper un contrato?',
        '¿Cómo declaro mis impuestos?',
        '¿Qué hacer si no me pagan el salario?'
    ];
    
    const questionsGrid = document.getElementById('quickQuestions');
    if (questionsGrid) {
        questionsGrid.innerHTML = questions.map(question => 
            `<button class="question-btn" onclick="setMessage('${question}')">${question}</button>`
        ).join('');
    }
}

function setMessage(message) {
    document.getElementById('messageInput').value = message;
}

// Utility functions
function getCurrentTime() {
    return new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Data loading functions
function loadLawyers() {
    const lawyers = [
        {
            id: 1,
            name: 'Ana María González',
            specialty: 'Derecho Civil',
            location: 'Madrid, España',
            rating: 4.9,
            reviews: 127,
            experience: '15 años',
            phone: '+34 911 234 567',
            email: 'ana.gonzalez@bufetegonzalez.es',
            description: 'Especialista en derecho civil con amplia experiencia en contratos y responsabilidad civil.',
            verified: true
        },
        {
            id: 2,
            name: 'Carlos Rodríguez López',
            specialty: 'Derecho Penal',
            location: 'Barcelona, España',
            rating: 4.8,
            reviews: 95,
            experience: '12 años',
            phone: '+34 933 456 789',
            email: 'carlos.rodriguez@defensorpenal.es',
            description: 'Abogado penalista con experiencia en defensa criminal y derecho procesal penal.',
            verified: true
        },
        {
            id: 3,
            name: 'María Elena Vargas',
            specialty: 'Derecho Laboral',
            location: 'Valencia, España',
            rating: 4.7,
            reviews: 203,
            experience: '18 años',
            phone: '+34 963 789 012',
            email: 'elena.vargas@laboralistas.es',
            description: 'Experta en derecho del trabajo, despidos, negociación colectiva y prevención de riesgos.',
            verified: true
        },
        {
            id: 4,
            name: 'Roberto Silva Mendoza',
            specialty: 'Derecho Familiar',
            location: 'Sevilla, España',
            rating: 4.9,
            reviews: 156,
            experience: '20 años',
            phone: '+34 954 123 456',
            email: 'roberto.silva@familiarlegal.es',
            description: 'Especializado en divorcios, custodia de menores y derecho matrimonial.',
            verified: true
        },
        {
            id: 5,
            name: 'Laura Martínez Ruiz',
            specialty: 'Derecho Fiscal',
            location: 'Bilbao, España',
            rating: 4.8,
            reviews: 89,
            experience: '10 años',
            phone: '+34 944 567 890',
            email: 'laura.martinez@fiscalistas.es',
            description: 'Asesora fiscal y tributaria para empresas y particulares.',
            verified: true
        },
        {
            id: 6,
            name: 'José Antonio Herrera',
            specialty: 'Derecho Mercantil',
            location: 'Zaragoza, España',
            rating: 4.6,
            reviews: 74,
            experience: '14 años',
            phone: '+34 976 890 123',
            email: 'jose.herrera@mercantil.es',
            description: 'Especialista en derecho empresarial, sociedades y contratación mercantil.',
            verified: true
        }
    ];
    
    displayLawyers(lawyers);
}

function displayLawyers(lawyers) {
    const lawyersGrid = document.getElementById('lawyersGrid');
    if (!lawyersGrid) return;
    
    lawyersGrid.innerHTML = lawyers.map(lawyer => `
        <div class="lawyer-card">
            <div class="lawyer-header">
                <h3 class="lawyer-name">${lawyer.name}</h3>
                ${lawyer.verified ? '<span class="verified-badge">Verificado</span>' : ''}
            </div>
            
            <div class="lawyer-info">
                <span class="specialty">${lawyer.specialty}</span>
                <div class="location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${lawyer.location}
                </div>
                <span>${lawyer.experience} de experiencia</span>
            </div>
            
            <div class="rating">
                <div class="stars">
                    <i class="fas fa-star star"></i>
                    <span class="rating-text">${lawyer.rating}</span>
                    <span class="reviews">(${lawyer.reviews} reseñas)</span>
                </div>
            </div>
            
            <p class="lawyer-description">${lawyer.description}</p>
            
            <div class="lawyer-actions">
                <a href="tel:${lawyer.phone}" class="action-btn btn-call">
                    <i class="fas fa-phone"></i>
                    Llamar
                </a>
                <a href="mailto:${lawyer.email}" class="action-btn btn-email">
                    <i class="fas fa-envelope"></i>
                    Email
                </a>
                <button class="action-btn btn-profile">Ver Perfil Completo</button>
            </div>
        </div>
    `).join('');
}

function filterLawyers() {
    // Implementation for filtering lawyers
    console.log('Filtering lawyers...');
}

function loadResources() {
    const resources = [
        {
            id: 1,
            title: 'Modelo de Contrato de Compraventa',
            category: 'Contratos',
            type: 'Plantilla',
            description: 'Plantilla completa para contratos de compraventa de bienes muebles e inmuebles.',
            downloads: 1250,
            size: '125 KB',
            format: 'PDF/DOCX',
            lastUpdated: '2024-01-15'
        },
        {
            id: 2,
            title: 'Guía Completa de Derecho Laboral',
            category: 'Laboral',
            type: 'Guía',
            description: 'Manual completo sobre derechos y obligaciones laborales en España.',
            downloads: 2100,
            size: '2.5 MB',
            format: 'PDF',
            lastUpdated: '2024-01-10'
        },
        {
            id: 3,
            title: 'Plantilla de Testamento Ológrafo',
            category: 'Testamentos',
            type: 'Plantilla',
            description: 'Modelo de testamento ológrafo con instrucciones detalladas.',
            downloads: 890,
            size: '95 KB',
            format: 'PDF/DOCX',
            lastUpdated: '2024-01-12'
        },
        {
            id: 4,
            title: 'Procedimiento de Divorcio Express',
            category: 'Divorcios',
            type: 'Guía',
            description: 'Guía paso a paso para el divorcio de mutuo acuerdo.',
            downloads: 1780,
            size: '1.8 MB',
            format: 'PDF',
            lastUpdated: '2024-01-08'
        },
        {
            id: 5,
            title: 'Contrato de Arrendamiento Vivienda',
            category: 'Inmobiliario',
            type: 'Plantilla',
            description: 'Modelo de contrato de alquiler adaptado a la LAU vigente.',
            downloads: 3200,
            size: '180 KB',
            format: 'PDF/DOCX',
            lastUpdated: '2024-01-14'
        },
        {
            id: 6,
            title: 'Manual de Constitución de Sociedad',
            category: 'Mercantil',
            type: 'Guía',
            description: 'Procedimientos para constituir una sociedad limitada en España.',
            downloads: 650,
            size: '3.2 MB',
            format: 'PDF',
            lastUpdated: '2024-01-05'
        },
        {
            id: 7,
            title: 'Recurso de Alzada Administrativo',
            category: 'Administrativo',
            type: 'Plantilla',
            description: 'Modelo de recurso de alzada contra resoluciones administrativas.',
            downloads: 420,
            size: '110 KB',
            format: 'PDF/DOCX',
            lastUpdated: '2024-01-11'
        },
        {
            id: 8,
            title: 'Declaración de la Renta - Guía Fiscal',
            category: 'Fiscal',
            type: 'Guía',
            description: 'Guía completa para la declaración del IRPF con ejemplos prácticos.',
            downloads: 2850,
            size: '4.1 MB',
            format: 'PDF',
            lastUpdated: '2024-01-16'
        }
    ];
    
    displayResources(resources);
}

function displayResources(resources) {
    const resourcesGrid = document.getElementById('resourcesGrid');
    if (!resourcesGrid) return;
    
    resourcesGrid.innerHTML = resources.map(resource => `
        <div class="resource-card">
            <div class="resource-header">
                <div class="resource-icon">
                    <i class="fas fa-file-text"></i>
                </div>
                <div>
                    <h3 class="resource-title">${resource.title}</h3>
                    <div class="resource-badges">
                        <span class="badge badge-category">${resource.category}</span>
                        <span class="badge badge-type">${resource.type}</span>
                    </div>
                </div>
            </div>
            
            <p class="resource-description">${resource.description}</p>
            
            <div class="resource-meta">
                <div class="meta-item">
                    <i class="fas fa-download"></i>
                    ${resource.downloads.toLocaleString()} descargas
                </div>
                <span>Tamaño: ${resource.size}</span>
                <span>Formato: ${resource.format}</span>
                <span>Actualizado: ${new Date(resource.lastUpdated).toLocaleDateString('es-ES')}</span>
            </div>
            
            <div class="resource-actions">
                <button class="action-btn btn-call">
                    <i class="fas fa-download"></i>
                    Descargar
                </button>
                <button class="action-btn btn-email">
                    <i class="fas fa-eye"></i>
                    Vista previa
                </button>
            </div>
        </div>
    `).join('');
}

function filterResources() {
    // Implementation for filtering resources
    console.log('Filtering resources...');
}

function loadProcesses() {
    const processes = [
        {
            id: 1,
            title: 'Divorcio de Mutuo Acuerdo',
            description: 'Procedimiento rápido para divorcios consensuados',
            duration: '2-3 meses',
            cost: '300-800€',
            difficulty: 'Fácil',
            steps: [
                'Acuerdo entre las partes sobre custodia, pensiones y bienes',
                'Preparación de la documentación necesaria',
                'Presentación de la demanda ante el Juzgado',
                'Ratificación del convenio regulador',
                'Sentencia de divorcio'
            ],
            requirements: [
                'Certificado de matrimonio',
                'Convenio regulador firmado',
                'Certificado de nacimiento de los hijos (si los hay)',
                'Documentación económica'
            ]
        },
        {
            id: 2,
            title: 'Reclamación de Cantidad',
            description: 'Recuperación de deudas mediante procedimiento judicial',
            duration: '6-12 meses',
            cost: '200-1500€',
            difficulty: 'Medio',
            steps: [
                'Recopilación de pruebas de la deuda',
                'Requerimiento extrajudicial de pago',
                'Presentación de la demanda',
                'Notificación al deudor',
                'Celebración del juicio (si hay oposición)',
                'Sentencia y ejecución'
            ],
            requirements: [
                'Contrato o documento que acredite la deuda',
                'Justificantes de los requerimientos de pago',
                'Documentos de identidad',
                'Pruebas adicionales (facturas, emails, etc.)'
            ]
        },
        {
            id: 3,
            title: 'Constitución de Sociedad Limitada',
            description: 'Creación de una sociedad de responsabilidad limitada',
            duration: '15-30 días',
            cost: '300-600€',
            difficulty: 'Medio',
            steps: [
                'Certificación negativa del nombre',
                'Apertura de cuenta bancaria para el capital',
                'Otorgamiento de escritura pública',
                'Liquidación del Impuesto de Transmisiones',
                'Inscripción en el Registro Mercantil',
                'Alta en Hacienda y Seguridad Social'
            ],
            requirements: [
                'DNI de todos los socios',
                'Capital mínimo: 3.006€',
                'Estatutos sociales',
                'Certificación negativa de denominación'
            ]
        },
        {
            id: 4,
            title: 'Despido Improcedente',
            description: 'Reclamación por despido sin causa justificada',
            duration: '4-8 meses',
            cost: '0-500€',
            difficulty: 'Medio',
            steps: [
                'Presentación de papeleta de conciliación',
                'Intento de conciliación previa',
                'Demanda ante el Juzgado de lo Social',
                'Celebración del juicio',
                'Sentencia',
                'Ejecución de la sentencia'
            ],
            requirements: [
                'Carta de despido',
                'Contrato de trabajo',
                'Nóminas de los últimos meses',
                'Certificado de empresa',
                'Documentos acreditativos de la relación laboral'
            ]
        },
        {
            id: 5,
            title: 'Herencia (Sucesión Intestada)',
            description: 'Tramitación de herencia sin testamento',
            duration: '3-6 meses',
            cost: '500-2000€',
            difficulty: 'Difícil',
            steps: [
                'Certificado de defunción y últimas voluntades',
                'Declaración de herederos',
                'Inventario de bienes',
                'Liquidación del Impuesto de Sucesiones',
                'Partición de la herencia',
                'Inscripción de bienes a nombre de herederos'
            ],
            requirements: [
                'Certificado de defunción',
                'Certificado de últimas voluntades',
                'Documentos de parentesco',
                'Inventario de bienes del fallecido',
                'Certificados de titularidad'
            ]
        },
        {
            id: 6,
            title: 'Desahucio por Impago',
            description: 'Procedimiento para desalojar inquilino moroso',
            duration: '3-6 meses',
            cost: '400-1200€',
            difficulty: 'Medio',
            steps: [
                'Requerimiento fehaciente de pago',
                'Presentación de demanda de desahucio',
                'Celebración del juicio',
                'Sentencia de desahucio',
                'Lanzamiento (desalojo)',
                'Reclamación de rentas adeudadas'
            ],
            requirements: [
                'Contrato de arrendamiento',
                'Justificantes de impago',
                'Requerimientos de pago',
                'Certificado de deudas'
            ]
        }
    ];
    
    displayProcesses(processes);
}

function displayProcesses(processes) {
    const processesGrid = document.getElementById('processesGrid');
    if (!processesGrid) return;
    
    processesGrid.innerHTML = processes.map(process => `
        <div class="process-card">
            <div class="process-header" onclick="toggleProcess(${process.id})">
                <div class="process-title-row">
                    <div class="process-info">
                        <h3>${process.title}</h3>
                        <p class="process-description">${process.description}</p>
                        
                        <div class="process-meta">
                            <div class="meta-item">
                                <i class="fas fa-clock"></i>
                                Duración: ${process.duration}
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-euro-sign"></i>
                                Costo: ${process.cost}
                            </div>
                            <span class="difficulty-badge difficulty-${process.difficulty.toLowerCase()}">
                                ${process.difficulty}
                            </span>
                        </div>
                    </div>
                    
                    <i class="fas fa-chevron-right expand-icon" id="icon-${process.id}"></i>
                </div>
            </div>
            
            <div class="process-details" id="details-${process.id}">
                <div class="details-grid">
                    <div class="detail-section">
                        <h4>
                            <i class="fas fa-check-circle"></i>
                            Pasos del Procedimiento
                        </h4>
                        <ol class="steps-list">
                            ${process.steps.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                    
                    <div class="detail-section">
                        <h4>
                            <i class="fas fa-file-text"></i>
                            Documentación Necesaria
                        </h4>
                        <ul class="requirements-list">
                            ${process.requirements.map(req => `<li>${req}</li>`).join('')}
                        </ul>
                        
                        <div class="warning-box">
                            <h5>⚠️ Aviso Importante</h5>
                            <p>Esta información es orientativa. Siempre consulte con un profesional legal para casos específicos, ya que cada situación puede requerir pasos adicionales o documentación específica.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function toggleProcess(processId) {
    const details = document.getElementById(`details-${processId}`);
    const icon = document.getElementById(`icon-${processId}`);
    
    if (details.classList.contains('expanded')) {
        details.classList.remove('expanded');
        icon.classList.remove('expanded');
    } else {
        // Close all other processes
        document.querySelectorAll('.process-details').forEach(detail => {
            detail.classList.remove('expanded');
        });
        document.querySelectorAll('.expand-icon').forEach(ic => {
            ic.classList.remove('expanded');
        });
        
        // Open selected process
        details.classList.add('expanded');
        icon.classList.add('expanded');
    }
}

function loadNews() {
    const news = [
        {
            id: 1,
            title: 'Nueva Ley de Vivienda: Cambios en el Alquiler',
            category: 'Derecho Civil',
            date: '2024-01-20',
            author: 'Dr. María González',
            summary: 'Análisis de las principales modificaciones introducidas por la nueva Ley de Vivienda en materia de arrendamientos urbanos.',
            tags: ['Vivienda', 'Alquiler', 'LAU'],
            trending: true,
            readTime: 5
        },
        {
            id: 2,
            title: 'Sentencia del Tribunal Supremo sobre Cláusulas Suelo',
            category: 'Jurisprudencia',
            date: '2024-01-18',
            author: 'Lic. Carlos Martín',
            summary: 'El TS establece nuevos criterios para la nulidad de cláusulas suelo en contratos hipotecarios anteriores a 2013.',
            tags: ['Hipotecas', 'Cláusulas Suelo', 'Bancos'],
            trending: false,
            readTime: 7
        },
        {
            id: 3,
            title: 'Reforma del Código Penal: Delitos Informáticos',
            category: 'Derecho Penal',
            date: '2024-01-15',
            author: 'Prof. Ana Rodríguez',
            summary: 'Nuevas tipificaciones y modificaciones en los delitos relacionados con las tecnologías de la información.',
            tags: ['Ciberdelitos', 'Código Penal', 'Tecnología'],
            trending: true,
            readTime: 6
        },
        {
            id: 4,
            title: 'Cambios en el IRPF para 2024',
            category: 'Derecho Fiscal',
            date: '2024-01-12',
            author: 'Dr. Luis Fernández',
            summary: 'Principales modificaciones en el Impuesto sobre la Renta de las Personas Físicas para el ejercicio 2024.',
            tags: ['IRPF', 'Hacienda', 'Declaración'],
            trending: false,
            readTime: 8
        },
        {
            id: 5,
            title: 'Nueva Directiva Europea de Protección de Datos',
            category: 'Normativa UE',
            date: '2024-01-10',
            author: 'Dra. Elena Vázquez',
            summary: 'La UE aprueba nuevas medidas para reforzar la protección de datos personales en el ámbito digital.',
            tags: ['RGPD', 'Protección Datos', 'UE'],
            trending: true,
            readTime: 4
        },
        {
            id: 6,
            title: 'Reforma Laboral: Contratación Temporal',
            category: 'Derecho Laboral',
            date: '2024-01-08',
            author: 'Lic. Roberto Silva',
            summary: 'Análisis del impacto de la reforma laboral en la contratación temporal y fija discontinua.',
            tags: ['Contratación', 'Reforma Laboral', 'Empleo'],
            trending: false,
            readTime: 9
        }
    ];
    
    displayNews(news);
    displayTrendingNews(news.filter(article => article.trending));
}

function displayNews(news) {
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) return;
    
    newsGrid.innerHTML = news.map(article => `
        <article class="news-card" data-category="${article.category}">
            <div class="news-header">
                <div class="news-badges">
                    <span class="badge badge-category">${article.category}</span>
                    ${article.trending ? '<span class="badge badge-trending"><i class="fas fa-trending-up"></i> Tendencia</span>' : ''}
                </div>
                <span class="read-time">${article.readTime} min lectura</span>
            </div>
            
            <h2 class="news-title">${article.title}</h2>
            <p class="news-summary">${article.summary}</p>
            
            <div class="news-meta">
                <div class="news-info">
                    <div class="news-info-item">
                        <i class="fas fa-calendar"></i>
                        ${new Date(article.date).toLocaleDateString('es-ES')}
                    </div>
                    <div class="news-info-item">
                        <i class="fas fa-user"></i>
                        ${article.author}
                    </div>
                </div>
                
                <div class="news-tags">
                    ${article.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            </div>
            
            <div class="read-more">
                <a href="#" class="read-more-btn">
                    Leer más
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </article>
    `).join('');
}

function displayTrendingNews(trendingNews) {
    const trendingContainer = document.getElementById('trendingNews');
    if (!trendingContainer) return;
    
    trendingContainer.innerHTML = trendingNews.slice(0, 4).map(article => `
        <div class="trending-item">
            <h4 class="trending-title">${article.title}</h4>
            <div class="trending-date">
                <i class="fas fa-calendar"></i>
                ${new Date(article.date).toLocaleDateString('es-ES')}
            </div>
        </div>
    `).join('');
}

function filterNews(category) {
    const newsCards = document.querySelectorAll('.news-card');
    const filterButtons = document.querySelectorAll('.news-filters .filter-btn');
    
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter news cards
    newsCards.forEach(card => {
        if (!category || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}