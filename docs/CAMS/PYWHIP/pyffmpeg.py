# WHIP via Python + FFmpeg
# FFmpeg captura raw con baja latencia, aiortc codifica VP8 y envía por WHIP
import subprocess
import asyncio
import aiohttp
import av
import numpy as np
from aiortc import (
    RTCPeerConnection,
    RTCConfiguration,
    RTCIceServer,
    RTCSessionDescription,
    VideoStreamTrack
)

# === Static Configuration ===
CAMERA_INDEX = "Trust QHD Webcam"  # Nombre del dispositivo (cambia según tu cámara)
FRAME_WIDTH = 1920
FRAME_HEIGHT = 1080
FRAMERATE = 30

SERVER_IP = "localhost"
SERVER_PORT = "8889"
MediaMTX_ENDPOINT = "pywhip"

class FFmpegRawVideoTrack(VideoStreamTrack):
    """
    Captura raw video RGB24 desde FFmpeg con parámetros de baja latencia.
    aiortc convierte y codifica automáticamente a VP8 para WebRTC.
    """
    kind = "video"

    def __init__(self):
        super().__init__()
        print(f"[DEBUG] Iniciando FFmpeg con captura raw (baja latencia) desde '{CAMERA_INDEX}'...")
        
        try:
            # Comando FFmpeg con parámetros de baja latencia en captura
            self.process = subprocess.Popen(
                [
                    "ffmpeg",
                    # Flags de baja latencia
                    "-fflags", "+genpts+nobuffer+flush_packets",
                    "-flags", "low_delay",
                    # Captura DirectShow con buffers optimizados
                    "-f", "dshow",
                    "-rtbufsize", "512M",
                    "-thread_queue_size", "256",
                    "-framerate", str(FRAMERATE),
                    "-video_size", f"{FRAME_WIDTH}x{FRAME_HEIGHT}",
                    "-i", f"video={CAMERA_INDEX}",
                    # Control de framerate constante
                    "-fps_mode", "cfr",
                    "-r", str(FRAMERATE),
                    # Output raw RGB24 (más simple que yuv420p, aiortc lo convierte)
                    "-c:v", "rawvideo",
                    "-pix_fmt", "rgb24",
                    "-f", "rawvideo",
                    "pipe:1"
                ],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                bufsize=10**8
            )
            print("[INFO] FFmpeg con captura raw (baja latencia) iniciado correctamente")
            
            # Calcular tamaño de frame RGB24 (3 bytes por pixel)
            self.frame_size = FRAME_WIDTH * FRAME_HEIGHT * 3
            print(f"[INFO] Esperando frames rgb24 de {self.frame_size} bytes ({FRAME_WIDTH}x{FRAME_HEIGHT} @ {FRAMERATE}fps)")
            
        except Exception as e:
            print(f"[ERROR] No se pudo iniciar FFmpeg: {e}")
            raise

    async def recv(self):
        """
        Lee frames raw RGB24 desde FFmpeg.
        aiortc los convertirá y codificará a VP8 para WebRTC.
        """
        pts, time_base = await self.next_timestamp()
        
        try:
            # Leer frame raw RGB24 desde el pipe (async para no bloquear)
            raw_data = await asyncio.to_thread(self.process.stdout.read, self.frame_size)
            if len(raw_data) != self.frame_size:
                raise RuntimeError("Stream terminado o frame incompleto")
            
            # Convertir datos RGB24 a array numpy y crear VideoFrame
            rgb_array = np.frombuffer(raw_data, dtype=np.uint8).reshape(FRAME_HEIGHT, FRAME_WIDTH, 3)
            frame = av.VideoFrame.from_ndarray(rgb_array, format='rgb24')
            
            # Ajustar timestamps para WebRTC
            frame.pts = pts
            frame.time_base = time_base
            return frame
            
        except Exception as e:
            print(f"[ERROR] Error al leer frame: {e}")
            raise

    def __del__(self):
        """Limpiar recursos FFmpeg al destruir la clase."""
        if hasattr(self, 'process') and self.process:
            try:
                self.process.terminate()
                self.process.wait(timeout=2)
            except:
                self.process.kill()


async def publish_stream():
    """Conecta a MediaMTX y publica el stream de video."""
    print("[INFO] Preparando conexión WebRTC a MediaMTX (Server)...")

    # Crear configuración WebRTC con servidor STUN
    config = RTCConfiguration(
        iceServers=[RTCIceServer(urls=["stun:stun.l.google.com:19302"])]
    )
    print("[DEBUG] RTCConfiguration creada")
    
    pc = RTCPeerConnection(configuration=config)
    print("[DEBUG] RTCPeerConnection creada")

    try:
        print("[DEBUG] Creando track de video con FFmpeg (raw, aiortc codifica VP8)...")
        video_track = FFmpegRawVideoTrack()
        print("[DEBUG] Track creada, agregando a peer connection...")
        pc.addTrack(video_track)
        print("[DEBUG] Track agregada correctamente")

        print("[DEBUG] Creando SDP offer...")
        offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        print("[INFO] SDP offer creada correctamente")

        # Enviar offer a MediaMTX
        whip_url = f"http://{SERVER_IP}:{SERVER_PORT}/{MediaMTX_ENDPOINT}/whip"
        print(f"[INFO] Enviando offer a WHIP endpoint: {whip_url}")

        async with aiohttp.ClientSession() as session:
            async with session.post(
                whip_url,
                data=pc.localDescription.sdp,
                headers={"Content-Type": "application/sdp"}
            ) as resp:
                if resp.status != 201:
                    print(f"[ERROR] Conexión WHIP fallida: HTTP {resp.status}")
                    print(await resp.text())
                    return

                # Recibir answer del servidor
                answer_sdp = await resp.text()
                await pc.setRemoteDescription(
                    RTCSessionDescription(sdp=answer_sdp, type="answer")
                )
                print("[SUCCESS] ¡Conexión WebRTC establecida con MediaMTX!")

        # Mantener stream activo
        try:
            await asyncio.sleep(3600)
        except KeyboardInterrupt:
            print("[INFO] Stream interrumpido por el usuario")
    
    except Exception as e:
        print(f"[FATAL] Error: {e}")
    finally:
        await pc.close()
        print("[INFO] Stream cerrado")


if __name__ == "__main__":
    try:
        asyncio.run(publish_stream())
    except Exception as e:
        print(f"[FATAL] Excepción no manejada: {e}")