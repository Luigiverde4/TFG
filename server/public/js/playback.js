/**
 * NUCLEO DEL REPRODUCTOR DE GRABACIONES
 * Gestiona la consulta y reproducción de segmentos grabados.
 */

/**
 * Convierte la URL absoluta que entrega MediaMTX en una URL del proxy local.
 * @param {string} segmentUrl - URL del segmento devuelta por /api/playback/list.
 * @returns {string|null}
 */
function construirUrlProxyPlayback(segmentUrl) {
    try {
        let parsed = new URL(segmentUrl);
        return `/api/playback${parsed.pathname}${parsed.search}`;
    } catch {
        return null;
    }
}

/**
 * Carga las grabaciones disponibles desde los endpoints de grabación.
 */
async function loadRecordings() {
    try {
        recordingsListEl.innerHTML = '<div class="empty-state"><p>⏳ Cargando grabaciones...</p></div>';

        // Usar proxy del backend para evitar errores de red/CORS en el navegador.
        let pathsResponse = await fetch('/api/mediamtx/v3/recordings/list');
        if (!pathsResponse.ok) {
            throw new Error(`HTTPS ${pathsResponse.status}: ${pathsResponse.statusText}`);
        }

        let pathsData = await pathsResponse.json();

        if (!pathsData.items || pathsData.items.length === 0) {
            recordingsListEl.innerHTML = '<div class="empty-state"><p>🎬 No hay grabaciones disponibles</p></div>';
            recordingCountEl.textContent = '0 grabaciones';
            return;
        }

        allRecordings = [];
        for (let item of pathsData.items) {
            let listURL = `/api/playback/list?path=${encodeURIComponent(item.name)}`;
            let response = await fetch(listURL);
            if (!response.ok) continue;

            let segments = await response.json();
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

        allRecordings.sort((a, b) => b.start - a.start);
        actualizarFiltroStream();
        mostrarGrabaciones(allRecordings);

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

/**
 * Reproduce una grabación concreta y sincroniza la UI con su duración.
 * @param {Object} recording - Segmento de grabación seleccionado.
 */
function playRecording(recording) {
    selectedRecording = recording;
    actualizarGrabacionSeleccionada();

    startOffsetInput.max = Math.floor(recording.duration);
    startOffsetInput.value = 0;
    timelineSlider.max = Math.floor(recording.duration);
    timelineSlider.value = 0;
    timelineSlider.disabled = false;

    let startDate = new Date(recording.start);
    let endDate = new Date(startDate.getTime() + recording.duration * 1000);
    timelineStart.textContent = formatTimeOnly(startDate);
    timelineEnd.textContent = formatTimeOnly(endDate);

    playFromOffset();
}

/**
 * Calcula la ventana temporal a reproducir y lanza el vídeo.
 */
function playFromOffset() {
    if (!selectedRecording) {
        alert('Por favor, selecciona una grabación primero');
        return;
    }

    let mode = document.querySelector('input[name="playbackMode"]:checked').value;

    let offset = 0;
    let newDuration = selectedRecording.duration;

    if (mode === 'offset') {
        offset = parseFloat(startOffsetInput.value) || 0;
        newDuration = selectedRecording.duration - offset;

        if (offset > selectedRecording.duration) {
            alert('El offset es mayor que la duración de la grabación');
            return;
        }
    } else if (mode === 'lookback') {
        let lookbackSeconds = parseFloat(lookbackTimeInput.value) || 60;
        let now = new Date();
        let recordingStart = new Date(selectedRecording.start);
        let recordingEnd = new Date(recordingStart.getTime() + selectedRecording.duration * 1000);

        if (now < recordingStart) {
            alert('La grabación aún no ha comenzado');
            return;
        }

        let startPoint = new Date(now.getTime() - lookbackSeconds * 1000);

        if (startPoint < recordingStart) {
            offset = 0;
            let endPoint = now < recordingEnd ? now : recordingEnd;
            newDuration = (endPoint.getTime() - recordingStart.getTime()) / 1000;

            if (newDuration <= 0) {
                alert('No hay contenido disponible en ese rango');
                return;
            }
        } else if (startPoint > recordingEnd) {
            alert('El tiempo solicitado está más allá del final de la grabación');
            return;
        } else {
            offset = (startPoint.getTime() - recordingStart.getTime()) / 1000;
            let endPoint = now < recordingEnd ? now : recordingEnd;
            newDuration = (endPoint.getTime() - startPoint.getTime()) / 1000;

            if (newDuration <= 0) {
                alert('No hay contenido disponible en ese rango');
                return;
            }
        }
    } else if (mode === 'specific') {
        // Modo specific: acepta HH:MM o HH:MM:SS
        let timeValue = specificTimeInput.value.trim();
        if (!timeValue) {
            alert('Por favor, introduce una hora en formato HH:MM o HH:MM:SS');
            return;
        }

        // Validar formato HH:MM[:SS]
        let match = timeValue.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
        if (!match) {
            alert('Formato inválido. Usa HH:MM o HH:MM:SS');
            return;
        }

        let hh = parseInt(match[1], 10);
        let mm = parseInt(match[2], 10);
        let ss = match[3] ? parseInt(match[3], 10) : 0;
        
        // Validar rango de horas/minutos/segundos
        if (hh < 0 || hh > 23 || mm < 0 || mm > 59 || ss < 0 || ss > 59) {
            alert('Hora inválida');
            return;
        }

        let recordingStart = new Date(selectedRecording.start);
        let recordingEnd = new Date(recordingStart.getTime() + selectedRecording.duration * 1000);

        // Construir la hora específica en la misma fecha que la grabación
        let specificDate = new Date(recordingStart);
        specificDate.setHours(hh, mm, ss, 0);

        // Validar que la hora esté dentro del rango de la grabación
        if (specificDate < recordingStart) {
            alert('El tiempo solicitado está antes del inicio de la grabación');
            return;
        }

        if (specificDate > recordingEnd) {
            alert('El tiempo solicitado está más allá del final de la grabación');
            return;
        }

        // Calcular offset y duración desde ese punto
        offset = (specificDate.getTime() - recordingStart.getTime()) / 1000;
        newDuration = (recordingEnd.getTime() - specificDate.getTime()) / 1000;

        if (newDuration <= 0) {
            alert('No hay contenido disponible desde ese punto');
            return;
        }
    }

    if (newDuration <= 0) {
        alert('La duración calculada no es válida');
        return;
    }

    // Calcular el nuevo timestamp de inicio (start) basado en el offset
    let recordingStartDate = new Date(selectedRecording.start);
    let newStartDate = new Date(recordingStartDate.getTime() + offset * 1000);
    let newStartISO = newStartDate.toISOString();

    // Construir URL con los parámetros recalculados
    // Nota: Si hay offset, siempre construimos manualmente para garantizar los parámetros correctos
    let playURL;
    if (offset === 0 && newDuration === selectedRecording.duration) {
        // Reproducción desde el inicio sin cambios: podemos usar la URL original
        playURL = construirUrlProxyPlayback(selectedRecording.url);
    } else {
        // Hay offset o cambio de duración: construir manualmente con nuevos parámetros
        playURL = null;
    }

    if (!playURL) {
        playURL = `/api/playback/get?duration=${encodeURIComponent(newDuration)}&path=${encodeURIComponent(selectedRecording.stream)}&start=${encodeURIComponent(newStartISO)}`;
    }

    console.log('Modo:', mode);
    console.log('Offset:', offset.toFixed(2), 's');
    console.log('Duración:', newDuration.toFixed(2), 's');
    console.log('URL:', playURL);

    const seekOffset = Math.max(0, Math.min(offset, selectedRecording.duration));
    const onLoadedMetadata = () => {
        if (seekOffset > 0) {
            try {
                video.currentTime = seekOffset;
            } catch (error) {
                console.warn('No se pudo aplicar seek inicial:', error);
            }
        }
        video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
    video.addEventListener('loadedmetadata', onLoadedMetadata);

    let originalStart = new Date(selectedRecording.start);
    let now = new Date();
    let recordingEnd = new Date(originalStart.getTime() + selectedRecording.duration * 1000);
    let secondsSinceEnd = (now - recordingEnd) / 1000;

    if (secondsSinceEnd < 10 && secondsSinceEnd > 0) {
        console.warn('Advertencia: Grabación muy reciente, puede no estar completamente disponible');
    }

    // Limpiar reproducción previa para evitar AbortError al cambiar rápidamente de segmento.
    video.pause();
    video.removeAttribute('src');
    video.load();

    video.src = playURL;
    video.load();
    video.play().catch(err => {
        if (err && err.name === 'AbortError') {
            return;
        }
        console.error('Error al reproducir:', err);
        alert('⚠️ No se pudo iniciar la reproducción. El segmento puede no estar disponible aún.');
    });

    let offsetText = '';
    if (mode === 'offset' && offset > 0) {
        offsetText = ` (desde +${offset.toFixed(0)}s)`;
    } else if (mode === 'lookback') {
        let lookback = parseFloat(lookbackTimeInput.value) || 60;
        offsetText = ` (últimos ${lookback}s)`;
    } else if (mode === 'specific') {
        offsetText = ` (desde ${specificTimeInput.value})`;
    }
    currentRecordingEl.textContent = `${selectedRecording.stream} - ${formatDate(originalStart)}${offsetText}`;
}