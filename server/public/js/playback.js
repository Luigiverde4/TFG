// ELEMENTOS DOM
const video = document.getElementById('video');


// Info de la repeticion
const speedDisplay = document.getElementById('speedDisplay');
const timeDisplay = document.getElementById('timeDisplay');
 
// Info de los recordings dispoibles y seleccioneados
const currentRecordingEl = document.getElementById('currentRecording');
const recordingCountEl = document.getElementById('recordingCount');
const recordingsListEl = document.getElementById('recordingsList');

//  Sector grabaciones disponibles
const streamFilterEl = document.getElementById('streamFilter');
const startOffsetInput = document.getElementById('startOffset');

// Visualizar deste T - SEGUNDOS
const lookbackTimeInput = document.getElementById('lookbackTime');

// Controles de timeline
const timelineSlider = document.getElementById('timelineSlider');
const timelineStart = document.getElementById('timelineStart');
const timelineEnd = document.getElementById('timelineEnd');


// Variables globales
let allRecordings = [];
let selectedRecording = null;

// VISUALES
// Cambiar entre modos de reproducción
function updatePlaybackMode() {
    const mode = document.querySelector('input[name="playbackMode"]:checked').value;
    const offsetControls = document.getElementById('offsetControls');
    const lookbackControls = document.getElementById('lookbackControls');
    
    if (mode === 'offset') {
        offsetControls.style.display = 'flex';
        lookbackControls.style.display = 'none';
    } else {
        offsetControls.style.display = 'none';
        lookbackControls.style.display = 'flex';
    }
}

// Actualizar la grabación seleccionada visualmente
function updateSelectedRecording() {
    document.querySelectorAll('.recording-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    if (selectedRecording) {
        const items = document.querySelectorAll('.recording-item');
        const selectedDate = formatDate(selectedRecording.start);
        items.forEach(item => {
            if (item.textContent.includes(selectedRecording.stream) && 
                item.textContent.includes(selectedDate)) {
                item.classList.add('selected');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }
}

// FILTRO STREAMS
// Actualizar el filtro de streams
function updateStreamFilter() {
    const streams = [...new Set(allRecordings.map(r => r.stream))].sort();
    
    streamFilterEl.innerHTML = '<option value="all">Todos los streams</option>';
    streams.forEach(stream => {
        const option = document.createElement('option');
        option.value = stream;
        option.textContent = stream;
        streamFilterEl.appendChild(option);
    });
}

// Filtrar grabaciones por stream
function filterRecordings() {
    const selectedStream = streamFilterEl.value;
    
    if (selectedStream === 'all') {
        displayRecordings(allRecordings);
    } else {
        const filtered = allRecordings.filter(r => r.stream === selectedStream);
        displayRecordings(filtered);
    }
}

// Mostrar lista de grabaciones
function displayRecordings(recordings) {
    if (recordings.length === 0) {
        recordingsListEl.innerHTML = '<div class="empty-state"><p>🎬 No hay grabaciones para este filtro</p></div>';
        return;
    }

    recordingsListEl.innerHTML = '';
    
    recordings.forEach((recording, index) => {
        const item = document.createElement('div');
        item.className = 'recording-item';
        item.onclick = () => playRecording(recording);
        
        const formattedDate = formatDate(recording.start);
        const formattedDuration = formatDuration(recording.duration);
        const formattedTime = formatTime(recording.duration);
        
        item.innerHTML = `
            <div class="recording-header">
                <span class="recording-stream">📹 ${recording.stream}</span>
                <span class="recording-date">${formattedDate}</span>
            </div>
            <div class="recording-filename">
                Duración: ${formattedDuration} (${formattedTime})
            </div>
        `;
        
        recordingsListEl.appendChild(item);
    });
}

// Cargar grabaciones del servidor
async function loadRecordings() {
    const server = document.getElementById('server').value;
    
    try {
        recordingsListEl.innerHTML = '<div class="empty-state"><p>⏳ Cargando grabaciones...</p></div>';
        
        // Primero obtener la lista de paths con grabaciones
        const pathsURL = `http://${server}:9997/v3/recordings/list`;
        const pathsResponse = await fetch(pathsURL);
        if (!pathsResponse.ok) {
            throw new Error(`HTTP ${pathsResponse.status}: ${pathsResponse.statusText}`);
        }
        
        const pathsData = await pathsResponse.json();
        
        if (!pathsData.items || pathsData.items.length === 0) {
            recordingsListEl.innerHTML = '<div class="empty-state"><p>🎬 No hay grabaciones disponibles</p></div>';
            recordingCountEl.textContent = '0 grabaciones';
            return;
        }
        
        // Obtener detalles de cada path
        allRecordings = [];
        for (const item of pathsData.items) {
            const listURL = `http://${server}:9996/list?path=${encodeURIComponent(item.name)}`;
            const response = await fetch(listURL);
            if (!response.ok) continue;
            
            const segments = await response.json();
            segments.forEach(segment => {
                allRecordings.push({
                    stream: item.name,
                    start: new Date(segment.start),
                    duration: segment.duration,
                    startISO: segment.start,
                    url: segment.url
                });
            });
        }
        
        if (allRecordings.length === 0) {
            recordingsListEl.innerHTML = '<div class="empty-state"><p>🎬 No hay grabaciones disponibles</p></div>';
            recordingCountEl.textContent = '0 grabaciones';
            return;
        }

        // Ordenar por fecha (más recientes primero)
        allRecordings.sort((a, b) => b.start - a.start);
        
        // Actualizar filtro de streams
        updateStreamFilter();
        
        // Mostrar grabaciones
        displayRecordings(allRecordings);
        
        recordingCountEl.textContent = `${allRecordings.length} grabación${allRecordings.length !== 1 ? 'es' : ''}`;
        
    } catch (error) {
        console.error('Error al cargar grabaciones:', error);
        recordingsListEl.innerHTML = `
            <div class="empty-state">
                <p>❌ Error al cargar grabaciones</p>
                <p class="hint">${error.message}</p>
                <p class="hint">Asegúrate de que MediaMTX está ejecutándose</p>
            </div>
        `;
        alert('Error al cargar grabaciones: ' + error.message);
    }
}



// REPRODUCIR
// Reproducir una grabación
function playRecording(recording) {
    // Actualizar la interfaz
    selectedRecording = recording;
    updateSelectedRecording();
    
    // Configurar controles de tiempo
    startOffsetInput.max = Math.floor(recording.duration);
    startOffsetInput.value = 0;
    timelineSlider.max = Math.floor(recording.duration);
    timelineSlider.value = 0;
    timelineSlider.disabled = false;
    
    // Actualizar timeline
    const startDate = new Date(recording.start);
    const endDate = new Date(startDate.getTime() + recording.duration * 1000);
    timelineStart.textContent = formatTimeOnly(startDate);
    timelineEnd.textContent = formatTimeOnly(endDate);
    
    // Reproducir desde el inicio
    playFromOffset();
}

// Reproducir desde un offset específico
function playFromOffset() {
    if (!selectedRecording) {
        alert('Por favor, selecciona una grabación primero');
        return;
    }
    
    const server = document.getElementById('server').value;
    const mode = document.querySelector('input[name="playbackMode"]:checked').value;
    
    let offset = 0;
    let newDuration = selectedRecording.duration;
    
    if (mode === 'offset') {
        // Modo: desde el inicio de la grabación
        offset = parseFloat(startOffsetInput.value) || 0;
        newDuration = selectedRecording.duration - offset;
        
        if (offset > selectedRecording.duration) {
            alert('El offset es mayor que la duración de la grabación');
            return;
        }
    } else {
        // Modo: hacia atrás desde ahora
        const lookbackSeconds = parseFloat(lookbackTimeInput.value) || 60;
        const now = new Date();
        const recordingStart = new Date(selectedRecording.start);
        const recordingEnd = new Date(recordingStart.getTime() + selectedRecording.duration * 1000);
        
        // Verificar que "ahora" esté dentro del rango de la grabación
        if (now < recordingStart) {
            alert('La grabación aún no ha comenzado');
            return;
        }
        
        // Calcular el punto de inicio (ahora - lookback)
        const startPoint = new Date(now.getTime() - lookbackSeconds * 1000);
        
        // Si el punto de inicio es anterior al inicio de la grabación, usar el inicio de la grabación
        if (startPoint < recordingStart) {
            offset = 0;
            // Calcular duración desde el inicio hasta ahora (o hasta el fin si la grabación ya terminó)
            const endPoint = now < recordingEnd ? now : recordingEnd;
            newDuration = (endPoint.getTime() - recordingStart.getTime()) / 1000;
            
            if (newDuration <= 0) {
                alert('No hay contenido disponible en ese rango');
                return;
            }
        } else if (startPoint > recordingEnd) {
            alert('El tiempo solicitado está más allá del final de la grabación');
            return;
        } else {
            // El punto de inicio está dentro de la grabación
            offset = (startPoint.getTime() - recordingStart.getTime()) / 1000;
            // Duración desde el punto de inicio hasta ahora (o hasta el fin)
            const endPoint = now < recordingEnd ? now : recordingEnd;
            newDuration = (endPoint.getTime() - startPoint.getTime()) / 1000;
            
            if (newDuration <= 0) {
                alert('No hay contenido disponible en ese rango');
                return;
            }
        }
    }
    
    if (newDuration <= 0) {
        alert('La duración calculada no es válida');
        return;
    }
    
    // Calcular el nuevo tiempo de inicio
    const originalStart = new Date(selectedRecording.start);
    const newStart = new Date(originalStart.getTime() + offset * 1000);
    
    // Construir la URL con el nuevo inicio
    const startISO = newStart.toISOString();
    const playURL = `http://${server}:9996/get?duration=${newDuration}&path=${encodeURIComponent(selectedRecording.stream)}&start=${encodeURIComponent(startISO)}`;
    
    console.log('Modo:', mode);
    console.log('Offset:', offset.toFixed(2), 's');
    console.log('Duración:', newDuration.toFixed(2), 's');
    console.log('URL:', playURL);
    
    // Advertir si la grabación es muy reciente (menos de 10 segundos de antigüedad)
    const now = new Date();
    const recordingEnd = new Date(originalStart.getTime() + selectedRecording.duration * 1000);
    const secondsSinceEnd = (now - recordingEnd) / 1000;
    
    if (secondsSinceEnd < 10 && secondsSinceEnd > 0) {
        console.warn('Advertencia: Grabación muy reciente, puede no estar completamente disponible');
    }
    
    // Reproducir el video
    video.src = playURL;
    video.load();
    video.play().catch(err => {
        console.error('Error al reproducir:', err);
        alert('⚠️ No se pudo iniciar la reproducción. El segmento puede no estar disponible aún.');
    });
    
    let offsetText = '';
    if (mode === 'offset' && offset > 0) {
        offsetText = ` (desde +${offset.toFixed(0)}s)`;
    } else if (mode === 'lookback') {
        const lookback = parseFloat(lookbackTimeInput.value) || 60;
        offsetText = ` (últimos ${lookback}s)`;
    }
    currentRecordingEl.textContent = `${selectedRecording.stream} - ${formatDate(originalStart)}${offsetText}`;
}


// FORMATEO FECHAS 
// Formatear fecha
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// Formatear solo la hora
function formatTimeOnly(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
}

// Formatear duración
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return '00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// CONTROL DE VELOCIDAD
// Control de velocidad de reproducción
function setSpeed(speed) {
    video.playbackRate = speed;
    speedDisplay.textContent = speed.toFixed(2) + 'x';
}

function changeSpeed(delta) {
    const newSpeed = Math.max(0.25, Math.min(4, video.playbackRate + delta));
    setSpeed(newSpeed);
}

// Actualizar información del tiempo
function updateTimeDisplay() {
    const current = formatTime(video.currentTime);
    const total = formatTime(video.duration);
    timeDisplay.textContent = `${current} / ${total}`;
}


// Event listeners para el video
video.addEventListener('timeupdate', updateTimeDisplay);
video.addEventListener('loadedmetadata', updateTimeDisplay);
video.addEventListener('ratechange', () => {
    speedDisplay.textContent = video.playbackRate.toFixed(2) + 'x';
});

// Manejar errores de carga del video
video.addEventListener('error', (e) => {
    console.error('Error al cargar el video:', e);
    const error = video.error;
    let errorMessage = 'Error desconocido al cargar el video';
    
    if (error) {
        switch(error.code) {
            case error.MEDIA_ERR_ABORTED:
                errorMessage = 'Carga del video abortada';
                break;
            case error.MEDIA_ERR_NETWORK:
                errorMessage = 'Error de red al cargar el video';
                break;
            case error.MEDIA_ERR_DECODE:
                errorMessage = 'Error de decodificación del video';
                break;
            case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage = 'Segmento de grabación no disponible. Puede que la grabación aún se esté procesando o el segmento no exista.';
                break;
        }
    }
    
    alert(`⚠️ ${errorMessage}\n\nSi la grabación es muy reciente, espera unos segundos e intenta de nuevo.`);
    currentRecordingEl.textContent = 'Error al reproducir';
});

// Sincronizar slider con input numérico
timelineSlider.addEventListener('input', () => {
    startOffsetInput.value = timelineSlider.value;
});

startOffsetInput.addEventListener('input', () => {
    const value = parseFloat(startOffsetInput.value) || 0;
    timelineSlider.value = value;
});

// Cargar grabaciones al inicio
window.addEventListener('load', () => {
    console.log('MediaMTX Playback Player cargado');
    updateTimeDisplay();
    loadRecordings();
});
