/* ========================================================
   1. UTILIDAD VISUAL (SEMÁFORO)
======================================================== */
function setColor(cell, clas) {
    if (!cell) return;
    cell.classList.remove("green", "yellow", "orange", "red", "blue");
    cell.classList.remove("bg-excelente", "bg-bueno", "bg-medio", "bg-bajo", "bg-malo"); // Compatibilidad CSS

    // Normalizamos el texto para comparaciones
    const c = clas ? clas.toLowerCase() : "";

    if (["normal", "excelente", "bueno", "bajo riesgo", "atleta", "atleta élite", "muy bueno"].includes(c)) {
        cell.classList.add("green");
    } else if (["aceptable", "moderado", "fitness"].includes(c)) {
        cell.classList.add("yellow");
    } else if (["regular", "elevada", "sobrepeso"].includes(c)) {
        cell.classList.add("orange");
    } else if (["obesidad", "deficiente", "taquicardia", "alto riesgo", "malo"].includes(c)) {
        cell.classList.add("red");
    }
}

/* ========================================================
   2. CÁLCULOS ANTROPOMÉTRICOS (Tu código mejorado)
======================================================== */

/* --- EDAD --- */
function calcEdad() {
    const n = document.getElementById("nacimiento").value;
    if (!n) return;
    const hoy = new Date();
    const fn = new Date(n);
    let edad = hoy.getFullYear() - fn.getFullYear();
    const m = hoy.getMonth() - fn.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fn.getDate())) edad--;
    document.getElementById("edad").value = edad;
    
    // Recalcular FC si cambia la edad
    clasFC();
}

/* --- COMPLEXIÓN --- */
function clasComplexion() {
    const mun = parseFloat(document.getElementById("muneca").value);
    const sexo = document.getElementById("sexo").value;
    if (!mun || !sexo) return;

    let clas = "";
    if (sexo === "M") {
        if (mun > 20) clas = "Grande";
        else if (mun >= 18) clas = "Mediana";
        else clas = "Pequeña";
    } else {
        if (mun > 16.5) clas = "Grande";
        else if (mun >= 15) clas = "Mediana";
        else clas = "Pequeña";
    }
    document.getElementById("compClas").value = clas;
}

/* --- IMC --- */
function calcIMC() {
    const peso = parseFloat(document.getElementById("peso").value);
    const altCM = parseInt(document.getElementById("altura").value);
    if (!peso || !altCM) return;

    const alt = altCM / 100;
    const imc = peso / (alt * alt);
    document.getElementById("imc").value = imc.toFixed(1);

    let clas = "";
    if (imc < 18.5) clas = "Bajo peso";
    else if (imc < 25) clas = "Normal";
    else if (imc < 30) clas = "Sobrepeso";
    else clas = "Obesidad";

    const inputClas = document.getElementById("imcClas");
    inputClas.value = clas;
    setColor(document.getElementById("imcClasCell"), clas); // Colorear celda
    setColor(inputClas, clas); // Colorear input también si se desea

    // Peso ideal
    const piMin = 18.5 * (alt ** 2);
    const piMax = 24.9 * (alt ** 2);
    document.getElementById("pesoIdeal").value = piMin.toFixed(1) + " – " + piMax.toFixed(1) + " kg";
}

/* --- CINTURA CADERA --- */
function calcRCC() {
    const c = parseFloat(document.getElementById("cintura").value);
    const cad = parseFloat(document.getElementById("cadera").value);
    if (!c || !cad) return;

    const r = c / cad;
    document.getElementById("rcc").value = r.toFixed(2);

    let clas = "";
    const sexo = document.getElementById("sexo").value;
    
    // Ajuste leve por sexo (estándar OMS)
    const limite = (sexo === "M") ? 0.90 : 0.85; 

    if (r <= limite) clas = "Bajo riesgo";
    else clas = "Alto riesgo";

    const inputClas = document.getElementById("rccClas");
    inputClas.value = clas;
    setColor(document.getElementById("rccClasCell"), clas);
}

/* --- FRECUENCIA CARDÍACA --- */
function clasFC() {
    const fc = parseFloat(document.getElementById("fc").value);
    if (!fc) return;

    let clas = "";
    if (fc < 60) clas = "Atleta";
    else if (fc <= 80) clas = "Normal";
    else if (fc <= 100) clas = "Elevada";
    else clas = "Taquicardia";

    const inputClas = document.getElementById("fcClas");
    inputClas.value = clas;
    setColor(document.getElementById("fcClasCell"), clas);

    const edad = parseInt(document.getElementById("edad").value || 0);
    if (edad > 0) {
        const fcm = 208 - (0.7 * edad);
        document.getElementById("fcm").value = Math.round(fcm) + " lpm";
    }
}

/* --- GRASA CORPORAL --- */
function clasificarGrasa() {
    const actividad = document.getElementById("actividad").value;
    const jp = parseFloat(document.getElementById("grasaJP").value);
    const sexo = document.getElementById("sexo").value;
    const edad = parseInt(document.getElementById("edad").value);

    const jpClas = document.getElementById("grasaJPClas");
    const dw = document.getElementById("grasaDW");
    const dwClas = document.getElementById("grasaDWClas");

    // Limpiar colores previos
    setColor(document.getElementById("jpClasCell"), "");
    setColor(document.getElementById("dwClasCell"), "");

    if (actividad === "promedio") {
        if (!jp || !sexo) return;
        let clas = "";
        if (sexo === "M") {
            if (jp <= 13) clas = "Atleta";
            else if (jp <= 17) clas = "Bueno";
            else if (jp <= 24) clas = "Normal";
            else if (jp <= 31) clas = "Sobrepeso";
            else clas = "Obesidad";
        } else {
            if (jp <= 20) clas = "Atleta";
            else if (jp <= 24) clas = "Bueno";
            else if (jp <= 31) clas = "Normal";
            else if (jp <= 39) clas = "Sobrepeso";
            else clas = "Obesidad";
        }
        jpClas.value = clas;
        setColor(document.getElementById("jpClasCell"), clas);
        dw.value = "";
        dwClas.value = "";
    } else if (actividad === "deportista") {
        if (!edad) return;
        // Referencias aproximadas D&W
        let grasaRef = 38; 
        if (edad <= 19) grasaRef = 18; 
        else if (edad <= 29) grasaRef = 20; 
        else if (edad <= 39) grasaRef = 22; 
        else grasaRef = 25; 

        dw.value = grasaRef.toFixed(1) + "% (Estimado)";
        
        // Clasificación simplificada para deportista
        let clas = "Normal";
        if(grasaRef < 15) clas = "Atleta élite";
        
        dwClas.value = clas;
        setColor(document.getElementById("dwClasCell"), clas);
        jpClas.value = "";
    }
}

/* ========================================================
   3. CÁLCULO DE PRUEBAS FÍSICAS (Esto faltaba)
======================================================== */

// Función auxiliar para determinar nivel
function evaluarNivel(valor, bajo, medio, alto) {
    if (valor >= alto) return "Excelente";
    if (valor >= medio) return "Bueno";
    if (valor >= bajo) return "Aceptable";
    return "Regular";
}

function calcBurpee() {
    const d1 = parseFloat(document.getElementById("bur1").value) || 0;
    const d2 = parseFloat(document.getElementById("bur2").value) || 0;
    const res = (d2 > 0) ? (d1 + d2) / 2 : d1; // Promedio o valor único
    
    if (res > 0) {
        document.getElementById("burRes").value = res;
        const clas = evaluarNivel(res, 20, 30, 40);
        document.getElementById("burClas").value = clas;
        setColor(document.getElementById("burClas"), clas);
    }
}

function calcAbd() {
    const res = parseFloat(document.getElementById("ab1").value) || 0;
    document.getElementById("abRes").value = res;
    if (res > 0) {
        const clas = evaluarNivel(res, 20, 35, 50);
        document.getElementById("abClas").value = clas;
        setColor(document.getElementById("abClas"), clas);
    }
}

function calcPiernas() {
    const res = parseFloat(document.getElementById("pier1").value) || 0;
    document.getElementById("pierRes").value = res;
    if (res > 0) {
        const clas = evaluarNivel(res, 25, 40, 55);
        document.getElementById("pierClas").value = clas;
        setColor(document.getElementById("pierClas"), clas);
    }
}

function calcFlex() {
    const res = parseFloat(document.getElementById("flex1").value) || 0;
    document.getElementById("flexRes").value = res;
    if (res > 0) {
        const clas = evaluarNivel(res, 15, 25, 40);
        document.getElementById("flexClas").value = clas;
        setColor(document.getElementById("flexClas"), clas);
    }
}

function calcHang() {
    const res = parseFloat(document.getElementById("hang1").value) || 0;
    document.getElementById("hangRes").value = res + "s";
    if (res > 0) {
        const clas = evaluarNivel(res, 30, 45, 60);
        document.getElementById("hangClas").value = clas;
        setColor(document.getElementById("hangClas"), clas);
    }
}

function calcCooper() {
    const dist = parseFloat(document.getElementById("coopDist").value) || 0;
    document.getElementById("coopRes").value = dist;
    if (dist > 0) {
        const clas = evaluarNivel(dist, 1600, 2000, 2400);
        document.getElementById("coopClas").value = clas;
        setColor(document.getElementById("coopClas"), clas);
    }
}

/* ========================================================
   4. GENERADOR DE RETROALIMENTACIÓN (Texto automático)
======================================================== */

function generarFeedback() {
    const bur = document.getElementById("burClas").value;
    const abd = document.getElementById("abClas").value;
    const pier = document.getElementById("pierClas").value;
    const flex = document.getElementById("flexClas").value;
    const hang = document.getElementById("hangClas").value;
    const coop = document.getElementById("coopClas").value;

    if (!bur && !abd && !pier && !flex && !hang && !coop) return;

    let html = "";
    
    // Función pequeña para generar el texto por prueba
    const getTexto = (clas, nombre) => {
        if(clas === "Excelente") return `Nivel sobresaliente en ${nombre}. Mantener cargas altas.`;
        if(clas === "Bueno") return `Buen desempeño en ${nombre}. Progresar gradualmente.`;
        if(clas === "Aceptable") return `Nivel funcional en ${nombre}. Enfocar en volumen.`;
        return `Déficit en ${nombre}. Se recomienda iniciar con ejercicios asistidos.`;
    };

    if(bur) html += `<div class="retro-title">Burpees</div>` + getTexto(bur, "resistencia anaeróbica");
    if(abd) html += `<div class="retro-title">Abdominales</div>` + getTexto(abd, "zona media (core)");
    if(pier) html += `<div class="retro-title">Sentadillas</div>` + getTexto(pier, "fuerza de piernas");
    if(flex) html += `<div class="retro-title">Flexiones</div>` + getTexto(flex, "tren superior");
    if(hang) html += `<div class="retro-title">Suspensión</div>` + getTexto(hang, "fuerza isométrica");
    if(coop) html += `<div class="retro-title">Test Cooper</div>` + getTexto(coop, "capacidad aeróbica");

    html += `
    <div class="retro-title">Recomendaciones Generales</div>
    <ul>
        <li>Actividad cardiovascular: 150 min/semana moderados.</li>
        <li>Entrenamiento de fuerza: 2-3 sesiones/semana.</li>
        <li>Hidratación constante y descanso de 7-8 horas.</li>
    </ul>`;

    document.getElementById("feedbackCapacidades").innerHTML = html;
}

// Ejecutar feedback constantemente para actualizar mientras se escribe
setInterval(generarFeedback, 1000);

/* ========================================================
   5. VALIDACIONES (Tu código original de seguridad)
======================================================== */
function validarEstatura() {
    const alt = document.getElementById("altura");
    const err = document.getElementById("alturaError");
    let val = alt.value.trim();
    alt.classList.remove("input-error");
    err.textContent = "";
    if (!val) return;
    
    if (val.includes(",") || val.includes(".")) {
        alt.classList.add("input-error");
        err.textContent = "Use enteros (cm).";
        return;
    }
    const num = parseInt(val);
    if (num < 50 || num > 250) {
        alt.classList.add("input-error");
        err.textContent = "Altura fuera de rango.";
    }
}

function validarPeso() {
    const peso = document.getElementById("peso");
    const err = document.getElementById("pesoError");
    const val = parseFloat(peso.value);
    peso.classList.remove("input-error");
    err.textContent = "";
    if (val < 2 || val > 400) {
        peso.classList.add("input-error");
        err.textContent = "Peso inválido.";
    }
}

function validarCorreo() {
    const email = document.getElementById("correoPaciente");
    const err = document.getElementById("correoError");
    const val = email.value.trim();
    email.classList.remove("input-error");
    err.textContent = "";
    if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        email.classList.add("input-error");
        err.textContent = "Correo inválido.";
    }
}

function validarCelular() {
    const cel = document.getElementById("celular");
    const err = document.getElementById("celularError");
    const val = cel.value.trim();
    cel.classList.remove("input-error");
    err.textContent = "";
    if (val && val.length !== 10) {
        cel.classList.add("input-error");
        err.textContent = "Debe tener 10 dígitos.";
    }
}