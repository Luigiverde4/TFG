const API_BASE = () => '/api/mediamtx/v3';

// Navigation
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');

    // Load data for the tab
    switch(tabName) {
        case 'paths':
            loadPaths();
            break;
        case 'config':
            loadConfig();
            break;
        case 'sessions':
            loadSessions();
            break;
        case 'recordings':
            loadRecordings();
            break;
    }
}

// Refresh all data
function refreshAll() {
    const activeTab = document.querySelector('.tab-button.active');
    if (activeTab) {
        activeTab.click();
    }
}

// ===== PATHS =====

async function loadPaths() {
    const grid = document.getElementById('pathsGrid');
    const count = document.getElementById('pathsCount');
    
    try {
        grid.innerHTML = '<div class="empty-state">Cargando paths...</div>';
        
        const response = await fetch(`${API_BASE()}/paths/list`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            grid.innerHTML = '<div class="empty-state">No hay paths activos</div>';
            count.textContent = '0 paths';
            return;
        }

        count.textContent = `${data.itemCount} path${data.itemCount !== 1 ? 's' : ''}`;
        
        grid.innerHTML = '';
        data.items.forEach(path => {
            const card = createPathCard(path);
            grid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading paths:', error);
        grid.innerHTML = `<div class="empty-state">❌ Error: ${error.message}</div>`;
    }
}

function createPathCard(path) {
    const card = document.createElement('div');
    card.className = 'path-card';
    
    const sourceText = typeof path.source === 'object' ? path.source.type : path.source;
    const bytesReceived = formatBytes(path.bytesReceived || 0);
    const bytesSent = formatBytes(path.bytesSent || 0);
    
    card.innerHTML = `
        <div class="path-card-header">
            <div class="path-name">${path.name}</div>
            <div class="path-status ${path.ready ? 'ready' : 'not-ready'}">
                ${path.ready ? '🟢 Ready' : '🔴 Not Ready'}
            </div>
        </div>
        <div class="path-info"><strong>Config:</strong> ${path.confName}</div>
        <div class="path-info"><strong>Source:</strong> ${sourceText}</div>
        ${path.ready && path.readyTime ? `<div class="path-info"><strong>Ready Since:</strong> ${new Date(path.readyTime).toLocaleString()}</div>` : ''}
        ${path.tracks && path.tracks.length > 0 ? `
            <div class="path-tracks">
                ${path.tracks.map(track => `<span class="track-badge">${track}</span>`).join('')}
            </div>
        ` : ''}
        <div class="path-info"><strong>↓ Received:</strong> ${bytesReceived}</div>
        <div class="path-info"><strong>↑ Sent:</strong> ${bytesSent}</div>
        ${path.readers && path.readers.length > 0 ? `<div class="path-info"><strong>👁️ Readers:</strong> ${path.readers.length}</div>` : ''}
        <div class="path-actions">
            <button class="btn-secondary btn-small" onclick="editPath('${path.name}')">✏️ Editar</button>
            <button class="btn-danger btn-small" onclick="closePathConfirm('${path.name}')">🗑️ Cerrar</button>
        </div>
    `;
    
    return card;
}

function editPath(pathName) {
    document.getElementById('pathName').value = pathName;
    // Switch to paths tab if not already there
    document.querySelector('[onclick="showTab(\'paths\')"]').click();
    // Scroll to form
    document.getElementById('pathName').scrollIntoView({ behavior: 'smooth' });
}

async function addOrUpdatePath() {
    const name = document.getElementById('pathName').value.trim();
    const source = document.getElementById('pathSource').value;
    const sourceUrl = document.getElementById('pathSourceUrl').value.trim();
    const record = document.getElementById('pathRecord').checked;
    
    if (!name) {
        alert('Por favor, introduce un nombre para el path');
        return;
    }
    
    const config = {
        source: source === 'publisher' ? 'publisher' : sourceUrl || source,
        record: record
    };
    
    try {
        const response = await fetch(`${API_BASE()}/config/paths/add/${encodeURIComponent(name)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || `HTTP ${response.status}`);
        }
        
        alert(`Path "${name}" configurado exitosamente`);
        loadPaths();
        
        // Clear form
        document.getElementById('pathName').value = '';
        document.getElementById('pathSource').value = 'publisher';
        document.getElementById('pathSourceUrl').value = '';
        document.getElementById('pathRecord').checked = false;
        
    } catch (error) {
        console.error('Error adding path:', error);
        alert('Error al configurar path: ' + error.message);
    }
}

async function closePathConfirm(pathName) {
    if (!confirm(`¿Cerrar el path "${pathName}"?`)) return;
    
    try {
        const response = await fetch(`${API_BASE()}/config/paths/remove/${encodeURIComponent(pathName)}`, {
            method: 'POST'
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        alert(`Path "${pathName}" cerrado`);
        loadPaths();
        
    } catch (error) {
        console.error('Error closing path:', error);
        alert('Error al cerrar path: ' + error.message);
    }
}

// Update source field visibility
document.getElementById('pathSource').addEventListener('change', function() {
    const sourceUrlGroup = document.getElementById('sourceUrlGroup');
    if (this.value === 'publisher') {
        sourceUrlGroup.style.display = 'none';
    } else {
        sourceUrlGroup.style.display = 'block';
        const placeholder = {
            'rtsp': 'rtsp://camera-ip:554/stream',
            'rtmp': 'rtmp://server/app/stream',
            'http': 'http://server/stream.m3u8'
        }[this.value] || '';
        document.getElementById('pathSourceUrl').placeholder = placeholder;
    }
});

// ===== CONFIG =====

async function loadConfig() {
    const display = document.getElementById('configDisplay');
    
    try {
        display.innerHTML = '<div class="empty-state">Cargando configuración...</div>';
        
        const response = await fetch(`${API_BASE()}/config/global/get`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const config = await response.json();
        
        display.innerHTML = '';
        displayConfigObject(config, display);
        
    } catch (error) {
        console.error('Error loading config:', error);
        display.innerHTML = `<div class="empty-state">❌ Error: ${error.message}</div>`;
    }
}

function displayConfigObject(obj, container, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            // Nested object
            const section = document.createElement('div');
            section.style.marginLeft = '20px';
            section.style.marginTop = '10px';
            const header = document.createElement('div');
            header.style.fontWeight = 'bold';
            header.style.color = '#667eea';
            header.textContent = key;
            container.appendChild(header);
            container.appendChild(section);
            displayConfigObject(value, section, fullKey);
        } else {
            // Simple value
            const item = document.createElement('div');
            item.className = 'config-item';
            item.innerHTML = `
                <span class="config-key">${key}</span>
                <span class="config-value">${JSON.stringify(value)}</span>
            `;
            container.appendChild(item);
        }
    }
}

async function updateConfig() {
    const key = document.getElementById('configKey').value.trim();
    const value = document.getElementById('configValue').value.trim();
    
    if (!key) {
        alert('Por favor, introduce una clave de configuración');
        return;
    }
    
    let parsedValue;
    try {
        // Try to parse as JSON
        parsedValue = JSON.parse(value);
    } catch {
        // Use as string
        parsedValue = value;
    }
    
    const config = { [key]: parsedValue };
    
    try {
        const response = await fetch(`${API_BASE()}/config/global/patch`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || `HTTP ${response.status}`);
        }
        
        alert(`Configuración actualizada: ${key} = ${value}`);
        loadConfig();
        
        document.getElementById('configKey').value = '';
        document.getElementById('configValue').value = '';
        
    } catch (error) {
        console.error('Error updating config:', error);
        alert('Error al actualizar configuración: ' + error.message);
    }
}

async function reloadConfig() {
    if (!confirm('¿Recargar la configuración desde el archivo?')) return;
    
    try {
        const response = await fetch(`${API_BASE()}/config/global/patch`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        alert('Configuración recargada exitosamente');
        loadConfig();
        
    } catch (error) {
        console.error('Error reloading config:', error);
        alert('Error al recargar configuración: ' + error.message);
    }
}

// ===== SESSIONS =====

async function loadSessions() {
    await Promise.all([
        loadRtspSessions(),
        loadWebrtcSessions(),
        loadHlsMuxers()
    ]);
    
    updateSessionsCount();
}

async function loadRtspSessions() {
    const container = document.getElementById('rtspSessions');
    
    try {
        const response = await fetch(`${API_BASE()}/rtspsessions/list`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            container.innerHTML = '<div class="empty-state">No hay sesiones RTSP</div>';
            return;
        }
        
        container.innerHTML = '';
        data.items.forEach(session => {
            const card = document.createElement('div');
            card.className = 'session-card';
            card.innerHTML = `
                <div class="session-id">ID: ${session.id}</div>
                <div class="session-info"><strong>State:</strong> ${session.state}</div>
                ${session.path ? `<div class="session-info"><strong>Path:</strong> ${session.path}</div>` : ''}
                ${session.transport ? `<div class="session-info"><strong>Transport:</strong> ${session.transport}</div>` : ''}
                ${session.bytesReceived ? `<div class="session-info"><strong>↓ Received:</strong> ${formatBytes(session.bytesReceived)}</div>` : ''}
                ${session.bytesSent ? `<div class="session-info"><strong>↑ Sent:</strong> ${formatBytes(session.bytesSent)}</div>` : ''}
                <div class="session-actions">
                    <button class="btn-danger btn-small" onclick="kickRtspSessionById('${session.id}')">❌ Cerrar</button>
                </div>
            `;
            container.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading RTSP sessions:', error);
        container.innerHTML = `<div class="empty-state">Error: ${error.message}</div>`;
    }
}

async function loadWebrtcSessions() {
    const container = document.getElementById('webrtcSessions');
    
    try {
        const response = await fetch(`${API_BASE()}/webrtcsessions/list`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            container.innerHTML = '<div class="empty-state">No hay sesiones WebRTC</div>';
            return;
        }
        
        container.innerHTML = '';
        data.items.forEach(session => {
            const card = document.createElement('div');
            card.className = 'session-card';
            card.innerHTML = `
                <div class="session-id">ID: ${session.id}</div>
                ${session.peerConnectionEstablished !== undefined ? `<div class="session-info"><strong>Connected:</strong> ${session.peerConnectionEstablished ? '✅ Yes' : '❌ No'}</div>` : ''}
                ${session.localCandidate ? `<div class="session-info"><strong>Local:</strong> ${session.localCandidate}</div>` : ''}
                ${session.remoteCandidate ? `<div class="session-info"><strong>Remote:</strong> ${session.remoteCandidate}</div>` : ''}
                ${session.bytesReceived ? `<div class="session-info"><strong>↓ Received:</strong> ${formatBytes(session.bytesReceived)}</div>` : ''}
                ${session.bytesSent ? `<div class="session-info"><strong>↑ Sent:</strong> ${formatBytes(session.bytesSent)}</div>` : ''}
                <div class="session-actions">
                    <button class="btn-danger btn-small" onclick="kickWebrtcSessionById('${session.id}')">❌ Cerrar</button>
                </div>
            `;
            container.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading WebRTC sessions:', error);
        container.innerHTML = `<div class="empty-state">Error: ${error.message}</div>`;
    }
}

async function loadHlsMuxers() {
    const container = document.getElementById('hlsMuxers');
    
    try {
        const response = await fetch(`${API_BASE()}/hlsmuxers/list`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            container.innerHTML = '<div class="empty-state">No hay muxers HLS</div>';
            return;
        }
        
        container.innerHTML = '';
        data.items.forEach(muxer => {
            const card = document.createElement('div');
            card.className = 'session-card';
            card.innerHTML = `
                <div class="session-info"><strong>Path:</strong> ${muxer.path}</div>
                ${muxer.created ? `<div class="session-info"><strong>Created:</strong> ${new Date(muxer.created).toLocaleString()}</div>` : ''}
                ${muxer.lastRequest ? `<div class="session-info"><strong>Last Request:</strong> ${new Date(muxer.lastRequest).toLocaleString()}</div>` : ''}
                ${muxer.bytesSent ? `<div class="session-info"><strong>↑ Sent:</strong> ${formatBytes(muxer.bytesSent)}</div>` : ''}
            `;
            container.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading HLS muxers:', error);
        container.innerHTML = `<div class="empty-state">Error: ${error.message}</div>`;
    }
}

function updateSessionsCount() {
    const rtsp = document.querySelectorAll('#rtspSessions .session-card').length;
    const webrtc = document.querySelectorAll('#webrtcSessions .session-card').length;
    const hls = document.querySelectorAll('#hlsMuxers .session-card').length;
    const total = rtsp + webrtc + hls;
    
    document.getElementById('sessionsCount').textContent = `${total} sesión${total !== 1 ? 'es' : ''}`;
}

async function kickRtspSession() {
    const id = document.getElementById('closeRtspId').value.trim();
    if (!id) {
        alert('Por favor, introduce el ID de la sesión');
        return;
    }
    await kickRtspSessionById(id);
}

async function kickRtspSessionById(id) {
    if (!confirm(`¿Cerrar la sesión RTSP ${id}?`)) return;
    
    try {
        const response = await fetch(`${API_BASE()}/rtspsessions/kick/${encodeURIComponent(id)}`, {
            method: 'POST'
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        alert('Sesión RTSP cerrada');
        loadRtspSessions();
        document.getElementById('closeRtspId').value = '';
        
    } catch (error) {
        console.error('Error kicking RTSP session:', error);
        alert('Error: ' + error.message);
    }
}

async function kickWebrtcSession() {
    const id = document.getElementById('closeWebrtcId').value.trim();
    if (!id) {
        alert('Por favor, introduce el ID de la sesión');
        return;
    }
    await kickWebrtcSessionById(id);
}

async function kickWebrtcSessionById(id) {
    if (!confirm(`¿Cerrar la sesión WebRTC ${id}?`)) return;
    
    try {
        const response = await fetch(`${API_BASE()}/webrtcsessions/kick/${encodeURIComponent(id)}`, {
            method: 'POST'
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        alert('Sesión WebRTC cerrada');
        loadWebrtcSessions();
        document.getElementById('closeWebrtcId').value = '';
        
    } catch (error) {
        console.error('Error kicking WebRTC session:', error);
        alert('Error: ' + error.message);
    }
}

// ===== RECORDINGS =====

async function loadRecordings() {
    const container = document.getElementById('recordingsManagement');
    
    try {
        container.innerHTML = '<div class="empty-state">Cargando grabaciones...</div>';
        
        const response = await fetch(`${API_BASE()}/recordings/list`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            container.innerHTML = '<div class="empty-state">No hay grabaciones</div>';
            return;
        }
        
        container.innerHTML = '';
        data.items.forEach(recording => {
            const pathDiv = document.createElement('div');
            pathDiv.className = 'recording-path';
            
            let segmentsHTML = '';
            if (recording.segments && recording.segments.length > 0) {
                segmentsHTML = '<div class="recording-segments">';
                recording.segments.forEach(segment => {
                    const startDate = new Date(segment.start);
                    segmentsHTML += `
                        <div class="recording-segment">
                            <div class="segment-info">
                                <strong>${startDate.toLocaleDateString()}</strong> ${startDate.toLocaleTimeString()}
                            </div>
                            <button class="btn-danger btn-small" onclick="deleteRecordingSegmentConfirm('${recording.name}', '${segment.start}')">🗑️</button>
                        </div>
                    `;
                });
                segmentsHTML += '</div>';
            }
            
            pathDiv.innerHTML = `
                <div class="recording-path-name">📁 ${recording.name}</div>
                ${segmentsHTML || '<div class="empty-state">Sin segmentos</div>'}
            `;
            
            container.appendChild(pathDiv);
        });
        
    } catch (error) {
        console.error('Error loading recordings:', error);
        container.innerHTML = `<div class="empty-state">❌ Error: ${error.message}</div>`;
    }
}

async function deleteRecordingSegment() {
    const path = document.getElementById('deleteRecPath').value.trim();
    const start = document.getElementById('deleteRecStart').value.trim();
    
    if (!path || !start) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    await deleteRecordingSegmentConfirm(path, start);
}

async function deleteRecordingSegmentConfirm(path, start) {
    if (!confirm(`¿Eliminar segmento de grabación?\nPath: ${path}\nInicio: ${start}`)) return;
    
    try {
        const response = await fetch(`${API_BASE()}/recordings/deletesegment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path, start })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        alert('Segmento eliminado');
        loadRecordings();
        
        document.getElementById('deleteRecPath').value = '';
        document.getElementById('deleteRecStart').value = '';
        
    } catch (error) {
        console.error('Error deleting recording segment:', error);
        alert('Error: ' + error.message);
    }
}

// ===== ACTIONS =====

async function closePath() {
    const name = document.getElementById('closePathName').value.trim();
    if (!name) {
        alert('Por favor, introduce el nombre del path');
        return;
    }
    await closePathConfirm(name);
    document.getElementById('closePathName').value = '';
}

// ===== UTILITIES =====

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Initialize on load
window.addEventListener('load', () => {
    console.log('MediaMTX Control Panel loaded');
    loadPaths();
});
