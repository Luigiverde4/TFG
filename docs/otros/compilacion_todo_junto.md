## 1. Compilación en Windows (UCRT64 - Un solo .exe)

### 1.1 Preparación
1. Abrir terminal **UCRT64**.
2. Instalar dependencias:
   `pacman -S mingw-w64-ucrt-x86_64-toolchain mingw-w64-ucrt-x86_64-openssl mingw-w64-ucrt-x86_64-libx264 mingw-w64-ucrt-x86_64-libopus`

### 1.2 Configuración Estática
Este comando es la clave para eliminar las DLLs.

```bash
./configure --prefix=\$MINGW_PREFIX \
            --enable-gpl \
            --enable-version3 \
            --enable-static \
            --disable-shared \
            --enable-libx264 \
            --enable-libopus \
            --enable-openssl \
            --enable-indev=dshow \
            --pkg-config-flags="--static" \
            --extra-ldflags="-static" \
            --disable-doc
```

### 1.3 Compilación
```bash
make clean
make -j\$(nproc)
```

---

## 2. Verificación
Ejecuta: `ldd ffmpeg.exe`. 
Si no aparecen librerías como `libavcodec.dll`, el proceso ha sido un éxito.

---