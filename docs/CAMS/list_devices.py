import subprocess

print("[INFO] Listando dispositivos de video disponibles...\n")

try:
    result = subprocess.run(
        ["ffmpeg", "-list_devices", "true", "-f", "dshow", "-i", "dummy"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )
    
    # Buscar líneas con "video"
    for line in result.stdout.split('\n'):
        if '"' in line and '[dshow' in line:
            print(line)
            
except Exception as e:
    print(f"[ERROR] {e}")
    print("\nAsegúrate de que FFmpeg está en el PATH del sistema")
