// Elementos DOM
const statusEl = document.getElementById('status')
const stopBtn = document.getElementById('stopBtn')
const server = document.getElementById('server')
const streamName = document.getElementById('streamName')
const video = document.getElementById('video');

// Variables globales
let pc = null; // WebRTC PeerConnection

// Modificar DOM
function updateStatus(status, text) {
    statusEl.className = `status ${status}`;
    statusEl.textContent = text;
}


// Control del player
async function startPlay() {
    if (!streamName) {
        alert('Por favor, introduce el nombre del stream');
        return;
    }

    stopPlay(); // Detener cualquier reproducción anterior
    await playWebRTC(server.value, streamName.value);
}

function stopPlay() {
    // Detener WebRTC
    if (pc) {
        pc.close();
        pc = null;
    }
    
    // Detener el video
    video.pause();
    video.srcObject = null;
    video.src = '';
    
    updateStatus('disconnected', 'Desconectado');
    stopBtn.disabled = true;
}


// Comexion al server con WHEP
async function playWebRTC(server, streamName) {
    updateStatus('connecting', 'Conectando WebRTC...');
    
    try {
        pc = new RTCPeerConnection({
            iceServers: [{
                urls: 'stun:stun.l.google.com:19302'
            }]
        });

        // Manejar los tracks entrantes
        pc.ontrack = (event) => {
            console.log('Track recibido:', event.track.kind);
            video.srcObject = event.streams[0];
            updateStatus('connected', 'Conectado (WebRTC)');
            stopBtn.disabled = false;
        };
        
        // Estados fallidos de ICE
        pc.oniceconnectionstatechange = () => {
            console.log('ICE state:', pc.iceConnectionState);
            if (pc.iceConnectionState === 'disconnected' || 
                pc.iceConnectionState === 'failed' ||
                pc.iceConnectionState === 'closed') {
                updateStatus('disconnected', 'Desconectado');
                stopBtn.disabled = true;
            }
        };

        // Añadir transceivers para recibir audio y video
        pc.addTransceiver('video', { direction: 'recvonly' });
        pc.addTransceiver('audio', { direction: 'recvonly' });

        // Crear offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // Enviar offer al servidor MediaMTX
        const url = `http://${server}:8889/${streamName}/whep`;
        console.log('WHEP URL:', url);
        

        // Enviar el SDP al servidor
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/sdp'
            },
            body: offer.sdp
        });

        // RECIBIR RESPUESTA DEL SERVIDOR
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const answerSDP = await response.text();
        await pc.setRemoteDescription(new RTCSessionDescription({
            type: 'answer',
            sdp: answerSDP
        }));

        console.log('WebRTC iniciado correctamente');
        
    } catch (error) {
        console.error('Error en WebRTC:', error);
        updateStatus('disconnected', 'Error al conectar');
        alert('Error al iniciar WebRTC: ' + error.message);
        stopPlay();
    }
}
// Auto-play muted para evitar restricciones del navegador
video.addEventListener('play', () => {
    console.log('Video iniciado');
});