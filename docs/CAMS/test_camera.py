# Test simple: probar si FFmpeg funciona con el nombre sin comillas
import subprocess
import sys

CAMERA_NAME = "Trust QHD Webcam"

print("[INFO] Prueba con nombre simple sin comillas extra\n")
print(f"[DEBUG] Dispositivo: {CAMERA_NAME}\n")

ffmpeg_cmd = [
    "ffmpeg.exe",
    "-v", "info",
    "-f", "dshow",
    "-i", f"video={CAMERA_NAME}",  # SIN comillas extras
    "-t", "1",
    "-f", "null",
    "-"
]

print(f"[DEBUG] Comando:\n{' '.join(ffmpeg_cmd)}\n")
print("="*80 + "\n")

try:
    process = subprocess.Popen(
        ffmpeg_cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=True,
        bufsize=1
    )
    
    for line in iter(process.stdout.readline, ''):
        if line:
            print(f"[FFmpeg] {line.rstrip()}")
    
    ret = process.wait()
    
    if ret == 0:
        print("\n[SUCCESS] ✓ FFmpeg funcionó correctamente")
    else:
        print(f"\n[ERROR] FFmpeg terminó con código {ret}")

except Exception as e:
    print(f"[ERROR] {e}")
