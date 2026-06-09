Escuela Técnica Superior de Ingeniería de Telecomunicación
Universitat Politècnica de València
Edificio 4D. Camino de Vera, s/n, 46022 Valencia
Tel. +34 96 387 71 90, ext. 77190
**[http://www.etsit.upv.es](http://www.etsit.upv.es)**



# Resumen

Este Trabajo Final de Grado (TFG) tiene como objetivo desarrollar e implementar un sistema
que permita la distribución de vídeo con la menor latencia posible en una red local, apoyándose

en herramientas web para la visualización, emisión y control de los flujos, y MediaMTX como
servidor de contenidos.

La arquitectura desarrollada cubre todas las etapas del video: captura, codificación, publicación,
enrutado y distribución, ya sea para grabación, visualización o composición para realización.

Además, se utilizarán los protocolos WHIP (WebRTC-HTTP Ingestion Protocol) para la
contribución de señal y WHEP (WebRTC-HTTP Egress Protocol) para la entrega a clientes

web, aprovechando la arquitectura y tecnologías web implementadas y buscando la latencia
mínima.

Todo el sistema se despliega a través de contenedores Docker, incluyendo un backend sencillo

de Node.js para servir las herramientas web y gestionar las comunicaciones API de clientes con
MediaMTX.

# Resum

Este Treball Final de Grau (TFG) té com a objectiu desenvolupar i implementar un sistema que
permeta la distribució de vídeo amb la menor latència possible en una xarxa local, recolzant-se
en ferramentes web per a la visualització, emissió i control dels fluxos, i en MediaMTX com a
servidor de continguts.

L’arquitectura desenvolupada cobrix totes les etapes del vídeo: captura, codificació, publicació,
encaminament i distribució, ja siga per a gravació, visualització o composició per a realització.

A més, s’utilitzaran els protocols WHIP (WebRTC-HTTP Ingestion Protocol) per a la contribució
de senyal i WHEP (WebRTC-HTTP Egress Protocol) per al lliurament a clients web, aprofitant
l’arquitectura i les tecnologies web implementades i buscant la latència mínima.

Tot el sistema es desplega a través de contenidors Docker, incloent-hi un backend senzill de
Node.js per a servir les ferramentes web i gestionar les comunicacions API dels clients amb
MediaMTX.

# Abstract

This Bachelor's Thesis aims to develop and implement a system that enables video distribution
with the lowest possible latency over a local network, relying on web tools for stream viewing,
publishing, and control, and on MediaMTX as the content server.

The developed architecture covers all video stages: capture, encoding, publishing, routing, and
distribution, whether for recording, monitoring, or composition for live production.

In addition, the WHIP (WebRTC-HTTP Ingestion Protocol) and WHEP (WebRTC-HTTP Egress
Protocol) protocols will be used for signal contribution and delivery to web clients, leveraging
the implemented web architecture and technologies while targeting minimum latency.

The entire system is deployed through Docker containers, including a simple Node.js backend to
serve the web tools and manage client API communications with MediaMTX.


Escuela Técnica Superior de Ingeniería de Telecomunicación
Universitat Politècnica de València
Edificio 4D. Camino de Vera, s/n, 46022 Valencia
Tel. +34 96 387 71 90, ext. 77190
**[http://www.etsit.upv.es](http://www.etsit.upv.es)**

# RESUMEN EJECUTIVO

## La memoria del TFG/TFM del NOMBRE TÍTULO debe desarrollar en el texto los siguientes conceptos, debidamente justificados y

# discutidos, centrados en el ámbito de la NOMBRE DISCIPLINA

## CONCEPT (ABET) CONCEPTO (traducción) ¿Cumple?

## (S/N)

## ¿Dónde?

## (páginas)

1. IDENTIFY: 1. IDENTIFICAR: (^)
1.1. Problem statement and opportunity 1.1. Planteamiento del problema y oportunidad (^)

## 1.2. Constraints (standards, codes, needs,

## requirements & specifications)

## 1.2. Toma en consideración de los condicionantes (normas

## técnicas y regulación, necesidades, requisitos y

## especificaciones)

1.3. Setting of goals 1.3. Establecimiento de objetivos (^)
2. FORMULATE: 2. FORMULAR: (^)
2.1. Creative solution generation (analysis) 2.1. Generación de soluciones creativas (análisis) (^)

## 2.2. Evaluation of multiple solutions and decision-

## making (synthesis)

## 2.2. Evaluación de múltiples soluciones y toma de decisiones

## (síntesis)

3. SOLVE: 3. RESOLVER: (^)
3.1. Fulfilment of goals 3.1. Evaluación del cumplimiento de objetivos (^)

## 3.2. Overall impact and significance (contributions

## and practical recommendations)

## 3.2. Evaluación del impacto global y alcance (contribuciones y

## recomendaciones prácticas)


## Escuela Técnica Superior de Ingeniería de Telecomunicación

Universitat Politècnica de València

**[http://www.etsit.upv.es](http://www.etsit.upv.es)**



- Tel. +34 96 387 71 90, ext. Edificio 4D. Camino de Vera, s/n, 46022 Valencia
   - Capítulo 1. Introducción Índice
      - 1.1 Contexto y motivación
      - 1.2 Problemas
         - 1.2.1 Latencia
         - 1.2.2 Inestabilidad
         - 1.2.3 Coste
         - 1.2.4 Calidad y compresión
      - 1.3 Objetivos
      - 1.4 Relación asignaturas GTDM
      - 1.5 Metodología / Estructura de la memoria
   - Capítulo 2. Estado del arte
      - 2.1 Tecnologías de transmisión de video
         - 2.1.1 Cableado
         - 2.1.2 Inalámbrico
      - 2.2 Protcólos de Streaming
         - 2.2.1 Protcolos Real Time
         - 2.2.2 SRT
      - 2.3 WebRTC
         - 2.3.1 WHIP & WHEP
   - Capítulo 3. Diseño arquitectura
      - 3.1 Requisitos
      - 3.2 Diseño global
      - 3.3 Diseño de capas
         - 3.3.1 Fuente
         - 3.3.2 Captura
         - 3.3.3 Flujo.........................................................................................................................
         - 3.3.4 Transporte y red
         - 3.3.5 Media Server
         - 3.3.6 Cliente
         - 3.3.7 Distribución
      - 3.4 Flujo extremo a extremo
   - 3.5 Decisiones de diseño / trade-offs (dar una vuelta)
   - 4.1 Estructura del proyecto Capítulo 4. Desarrollo Error! Bookmark not defined.
   - 4.2 FFMPEG Herramienta de codificación ()ffmoegsgsdv
   - 4.3 Herramientas Web
      - 4.3.1 Broadcaster
      - 4.3.2 Player
      - 4.3.3 Playback
      - 4.3.4 API.........................................................................................................................
      - 4.3.5 Stats
   - 5.1 Sistema de versionado Git / Github Capítulo 5. Despliegue Error! Bookmark not defined.
   - 5.2 Despliegue Docker
      - 5.2.1 Dockercompose
   - 5.3 MediaMTX
   - 5.4 Node
   - 5.5 WebRTC / WHIP / WHEP
      - 5.5.1 RTCPeerConnect
   - 5.6 HTTPS y Certificados
      - 5.6.1 HTTPS
      - 5.6.2 Mkcert
   - 5.7 Comunicación y Proxy APIs
      - 5.7.1 Network Docker
      - 5.7.2 API MediaMTX
      - 5.7.3 API Grabaciones
- Capítulo 6. Pliego de condiciones
   - 6.1 Requisitos técnicos
   - 6.2 Materiales y equipo
      - 6.2.1 Red.........................................................................................................................
      - 6.2.2 Dispositivos
   - 6.3 Presupuesto estimado
- Capítulo 7. Pruebas y Resultados.........................................................................................
   - 7.1 Objetivos del experimento
   - 7.2 Escenario de prueba
   - 7.3 Herramientas de medición
   - 7.4 Posibles problemas
   - 7.5 Resultados latencia entre extremos
   - 7.6 Resultado estabilidad
   - 7.7 Resultado bitrate
- Capítulo 8. Discusión
   - 8.1 Interpretación de resultados
   - 8.2 Cumplimiento objetivos
   - 8.3 Limitaciones encontradas
- Capítulo 9. Conclusiones y líneas futuras
   - 9.1 Conclusiones principales
   - 9.2 Aportaciones del trabajo
   - 9.3 Líneas futuras
      - 9.3.1 5G,
      - 9.3.2 FFMPEG con WHIP en navegador?,
      - 9.3.3 Control de realización web + API OBS
- Capítulo 10. Bibliografía


Agradecer XYZ


# Capítulo 1. Introducción

#### 1.1 Contexto y motivación

Una emisión en directo o ‘live streaming’ es el proceso de transmisión de contenidos de video y
audio a través de Internet en tiempo real o casi en tiempo real. Abarca desde gameplays caseros
hasta eventos de mayor escala como competiciones deportivas. En todos los casos necesitan una
estructura que permita capturar, procesar y distribuir contenido audiovisual en tiempo real

Para el contenido se utilizan distintas fuentes de información que pueden ser estáticas (como
imágenes, vídeos pregrabados o texto) o dinámicas. Estas últimas son generadas por dispositivos
de captura, como cámaras y micrófonos, que convierten los eventos del directo en señales de
audio y vídeo. Finalmente, estas fuentes se componen en escenas en un sistema de realización y
se transmiten a través de una conexión de red.

Uno de los principales problemas encontrados en POLIWOOD UPV en producciones en directo
es la limitación física del cableado. Mientras que el cableado de audio es más versátil y manejable,
el de vídeo presenta mayores restricciones de longitud y fragilidad. En el caso de trabajar con
cámaras que no están instaladas de forma permanente o que requieren desplazamiento, estas
deben situarse lo suficientemente cerca del sistema de realización para poder proporcionar el
video. Esto restringe el área de cobertura a un radio del ordenador de producción y limita la
variedad de planos disponibles.

https://www.upv.es/entidades/adge/poliwood/

El uso de cableado de mayor longitud podría reducir esta limitación, pero introduce nuevos.
inconvenientes como mayor coste, pérdida de señal, fragilidad e incomodidad en el despliegue
Una solución es transmitir y recibir la señal de vídeo de forma inalámbrica con sistemas de
radiofrecuencia. Sin embargo, los sistemas profesionales comerciales tienen un coste de miles de
euros, lo que los hace inviables para producciones sencillas.

Como alternativa, se puede usar una red local, que resulta más económica y fácil de desplegar.
Mediante el uso de tecnologías web y protocolos de streaming, es posible distribuir y visualizar
las señales de vídeo a través de IP. De este modo, se pueden aprovechar dispositivos ya
disponibles, como teléfonos móviles u ordenadores portátiles conectados a la misma red,
aumentando la flexibilidad del sistema y facilitando versatilidad en la producción.

## 1.2 Problemática

Frente a usar un cable, una distribución inalámbrica no tiene un ancho de banda estable, teniendo
que convivir con el medio que le rodea. Al no utilizar sistemas de radiofrecuencia especializados,
que trabajan en bandas licenciadas o con protocolos propietarios de baja latencia, el uso de redes
Wi-Fi estándar introduce sus propios problemas de congestión y colisiones de datos.

Los principales retos técnicos que afectan a la calidad y viabilidad del sistema son los siguientes:

##### 1.2.1 Latencia

La latencia es un factor crítico en la producción en directo ya que los eventos no ocurren en
diferido. Los protocolos de streaming tradicionales, como RTMP o RTSP, priorizan la
continuidad de la reproducción sobre la inmediatez. Para ello, utilizan buffers que pueden
introducir retardos de entre 2 y 5 segundos.

En una realización multicámara o en un cambio de plano, este retardo es inasumible. La diferencia
temporal rompería la narrativa audiovisual, desincronizando los distintos planos o la imagen del
sonido.


##### 1.2.2 Inestabilidad

A diferencia del cable como HDMI o SDI, el aire es un medio compartido y por ende puede haber
interferencias electromagnéticas. Al trabajar con Wi-Fi, usamos bandas comunes: 2.4 o 5 GHz y,
además, la señal es susceptible a problemas como atenuación, reflexión u obstáculos físicos. El
posicionamiento del punto de acceso también es importante, dependiendo de tener Line of Sight
(LOS) o no.

Como consecuencia, pueden ocurrir los siguientes eventos:

1. Pérdida de paquetes
    Si se pierden paquetes, hay información que no va a llegar al receptor que podría no
    recuperarse. Pueden aparecer artefactos en la imagen, perder frames enteros y
    reproducirse interrumpidamente o incluso llegar a detenerse el video.
2. Jitter
    El jitter es la variabilidad del retardo de llegada entre paquetes. Si no recibimos paquetes
    continuamente, se interrumpiría la reproducción del video, congelando la imagen. Esto
    se resuelve esperando y guardando temporalmente en un buffer los paquetes antes de
    reproducirlos, pero esto introduce latencia.
3. Limitaciones de ancho de banda
    La capacidad efectiva depende de factores como la distancia, los obstáculos,
    interferencias o la congestión del propio canal. Esto limita la capacidad de transmisión
    de datos, reduciéndola y directamente afectando a la calidad de la transmisión.

##### 1.2.3 Coste

Las soluciones profesionales de transmisión inalámbrica de vídeo utilizan hardware específico y
protocolos propietarios para garantizar baja latencia y estabilidad. Unos emisores y receptores de
vídeo inalámbrico de este tipo pueden costar varios miles de euros, y el coste aumenta
rápidamente si se necesitan varias cámaras o enlaces simultáneos.

Esto las hace poco accesibles para producciones pequeñas, entornos académicos o proyectos
experimentales, donde no se puede asumir este tipo de inversión.

Por tanto, el coste se convierte en una limitación clara, lo que lleva a buscar alternativas más
económicas basadas en infraestructuras ya disponibles, como portátiles, teléfonos móviles o
dispositivos con interfaces de red para acceder a redes IP.

##### 1.2.4 Calidad y compresión

Las emisiones que se realizan en POLIWOOD son en resolución Full HD (1920×1080 píxeles).
Transmitir este vídeo sin compresión es inviable debido al enorme volumen de datos generado.

Tomando como ejemplo un segundo de vídeo RGB FHD a 25 FPS con una profundidad de color
de 8 bits por canal:

- 1920x1080 pixeles = 2 073 600 pixeles por frame
- 2 073 600 x 3 canales (RGB) = 6 220 800 muestras
- 6 220 800 x 8 bits = 49 766 400 bits por frame
- 49 766 400 x 25 frames = 1 244 160 000 bits por segundo

≈ 1.24 Gbps

Transmitir un flujo de 1.24 Gbps por un segundo de vídeo sin compresión saturaría cualquier red
estándar. Por ello, el uso de la compresión con pérdidas al codificar el flujo. Hay que encontrar el
balance: una compresión agresiva degrada la imagen, mientras que una de alta calidad requiere
más recursos computacionales, lo que puede elevar la latencia de procesamiento. La elección del
códec y su configuración (bitrate, GOP, etc.) es clave para equilibrar visualización y rendimiento.


#### 1.3 Objetivos

Este Trabajo Fin de Grado tiene como objetivo el diseño e implementación de un sistema de
distribución de vídeo sobre IP con una latencia extremo a extremo inferior al segundo,
complementado con herramientas web para el control, la emisión y la recepción de los flujos.

Para alcanzar este objetivo general, se plantean los siguientes objetivos específicos:

- Diseñar una arquitectura de distribución de vídeo basada en tecnologías IP.
- Analizar las limitaciones de los protocolos de streaming tradicionales en entornos en
    directo. ¿????
- Implementar un sistema de ingesta y distribución de vídeo de baja latencia mediante
    WebRTC.
- Integrar MediaMTX como servidor de medios para la gestión de flujos.
- Desarrollar herramientas web que permitan la emisión, control y recepción de los flujos
    de vídeo.
- Evaluar el sistema en términos de latencia, estabilidad y calidad de transmisión.
- Validar el prototipo en entornos de producción audiovisual reales.

#### 1.4 Relación asignaturas GTDM

Este trabajo al ser tan transversal en el ámbito multimedia abarca conocimientos en distintas áreas
del grado, agrupado en los siguientes grupos:

Redes y distribución

Relacionado con el ámbito de la telemática y la distribución de contenido audiovisual:

- Arquitectura de Redes
- Redes de Distribución de Contenido
- Comunicación de Datos
- Plataformas de Streaming
    - Seguridad y Gestión de Derechos
       Digitales
    - Sistemas y estándares de

##### 3.3.7 Distribución

Desarrollo y Tecnologías Software

Enfocado al diseño e implementación de sistemas digitales y aplicaciones:

- Programación
- Tecnologías Web
- Computadores y Sistemas
    operativos
- Sistemas embebidos
- Aplicaciones y Usabilidad
    - Interacción, Sensores y
       Transductores
    - Plataformas IoT
    - Talleres y seminarios de
       Tecnologías Emergentes I
    - Talleres y seminarios de
       Tecnologías Emergentes II

Audiovisual y Señal

Orientado a las señales audiovisuales y sus usos

- Sociedad Digital
- Narrativa y Lenguaje Audiovisual
- Señales y Sistemas Audiovisuales
- Sonido Óptica y Movimiento
    - Interacción, Sensores y
       Transductores
    - Equipos Multimedia
    - Imagen y Video Digital
    - Medios de Transmisión


Gestión y contexto

Relacionado con la planificación y el entorno del proyecto

- Dirección y Gestión de proyectos
- Prácticas de empresa

```
Ilustración 1 Asignaturas del GTDM
```
Estos bloques reflejan la naturaleza interdisciplinar del grado, integrando conocimientos de redes,
desarrollo software, producción audiovisual y gestión, lo cual resulta fundamental para el
desarrollo de este trabajo.

https://gtdm.webs.upv.es/index.php/plan-de-estudios/

#### 1.5 Metodología / Estructura de la memoria


# Capítulo 2. Estado del arte (darle una vuelta a inalambrico / digital)

#### 2.1 Tecnologías de transmisión de video

Actualmente existen dos métodos de transmisión de contenido audiovisual: usando medios
físicos, guiados, como cables o inalámbricos, no guiados, a través del aire mediante
radiofrecuencia o IP.

##### 2.1.1 Cableado

El SDI (Serial Digital Interface) es una interfaz digital estandarizada por la Society of Motion
Picture and Television Engineers para la transmisión de vídeo sin compresión. Esta tecnología
permite transportar señales de vídeo y audio digital en tiempo real a través de cable coaxial, con
una calidad alta y una latencia muy reducida.

En el SDI, la señal viaja en claro: sin compresión ni cifrado. Al ser un estándar profesional por la
SMPTE, se encuentra en equipo usado profesionalmente en producciones y no en dispositivos
mas domésticos.

https://www.smpte.org/who-we-are

https://es.wikipedia.org/wiki/Interfaz_Digital_Serial

```
Ilustración 2 SDI
```
El HDMI (High-Definition Multimedia Interface) es una interfaz digital diseñada para transmitir
video y audio de alta calidad entre dispositivos.

Permite en un único cable llevar video sin compresión junto a distintas pistas de audio,
simplificando conexiones. Esta más orientado al uso doméstico y entretenimiento, encontrándose
en dispositivos más casuales.

https://es.wikipedia.org/wiki/High-Definition_Multimedia_Interface


##### 2.1.2 Inalámbrico

Meter cosas aquí para cohesion

Para la transmisión de datos de manera digital, existen distintos protocolos. Existen dos protocolos
clave:

1. Transmission Control Protocol (TCP)
    El TCP esta orientado a la integridad de los datos recibido. Se asegurar de que los
    paquetes lleguen correctamente a través de acuses de recibo “ACK” y en caso de pérdidas,
    se vuelven a enviar. Estas verificaciones lo hacen muy fiable pero introduce latencia por
    las confirmaciones necesarias..

```
Ilustración 3 Negociación TCP
```
https://es.wikipedia.org/wiki/Protocolo_de_control_de_transmisi%C3%B3n

2. User Datagram Protocol (UDP)
    El UDP esta orientado a la velocidad y baja latencia. No se asegura de que los paquetes
    lleguen correctamente, haciéndolo útil para aplicaciones en streaming.
    https://es.wikipedia.org/wiki/Protocolo_de_datagramas_de_usuario

Como solución digital basada en IP, existe SMPTE 2110 de la SMPTE. Este define estándares
de transporte de video, audio y otros datos a través de redes IP profesionales. Permite separar

los flujos de video, audio y metadatos en streams independientes haciéndolo muy flexible y
escalable.

https://www.telefonicaserviciosaudiovisuales.com/diccionario-audiovisual/smpte-2110/

Alternativamente, existen otras soluciones inalámbricas propietarias para transmitir video
directamente sin redes IP. Útil en producciones móviles o eventos en directo. Un ejemplo serían
los hollyland tal tal tal https://eu.hollyland.com/en-es/products/cosmo-c

#### 2.2 Protcólos de Streaming

Una vez abierta la puerta de usar redes IP para la transmisión de video y audio, existen distintos
protocolos de red para el transporte de contenido. Todos definen como se envía, recibe y
sincronizan los datos pero cada uno tiene distintas prioridades y casos de uso distintos.


Algunos protocolos son mejores para baja latencia, otros ofertan mayor control, mas estabilidad,
compatibilidad etc

https://restream.io/blog/streaming-protocols

**_2.2.1 Protocolos en tiempo real_**

Meter cosas aquí para cohesion

**_2.2.1.1 RTP_**

El RTP ( Real Time Protocol) desarrollado por la IETF (Internet Engineering Task Force) fue
diseñado para la transmisión de video y audio en tiempo real sobre redes IP. Al trabajar sobre
UDP, la latencia es mínima.

No garantiza que lleguen los paquetes pero introduce datos como timestamps y nº de secuencia
para facilitar sincronización y reconstrucción del flujo.

https://es.wikipedia.org/wiki/Protocolo_de_transporte_en_tiempo_real

**_2.2.1.2 RTMP_**

Ya no udp ahora tcp

El RTMP ( Real-Time Messaging Protocol) fue desarrollado por Adobe para la transmisión de
audio , video y datos entre un servidor y un reproductor. Originalmente se planteó para funcionar
con Adobbe Flash pero sigue usandose en plataformas de streaming.

RTMP trabaja sobre TCP, priorizando estabilidad frente a latencia. Esto hace que introduzca mas
retardo frente a otros protocolos.

**_2.2.1.3 RTSP_**

El RTSP ( Real Time Streaming Protocol) fue desarrollado por la IETF para controlar
transmisiones multimedia sobre redes IP. Se usa principalmente en sistemas de videovigilancia y
cámaras IP.

No transporta el contenido directamente sino que funciona como protocolo de control a través de
peticiones a un servidor. El flujo de audio y video se suele mandar por RTP.

https://es.wikipedia.org/wiki/Protocolo_de_transmisi%C3%B3n_en_tiempo_real

```
Ilustración 4 RTSP
```
##### 2.2.2 SRT

El SRT ( Seceure Realiable Transport) fue desarrollado por Haivision para la transmisión de video
a baja latencia sobre redes inestables como internet.


SRT trabaja sobre UDP, permitiendo baja latencia y agregando funcionalidades como recuperar
paquetes, control de errores y cifrar la transmisión, mejorando la fiabilidad sobre un UDP puro.

https://www.telefonicaserviciosaudiovisuales.com/articulos-de-divulgacion/srt-el-estandar-de-
facto-en-streaming/

#### 2.3 WebRTC

WebRTC ( Web Real-Time Communication) es un conjunto de tecnologías y APIs desarrolladas
por Google, W3C y la IETF para comunicaciones multimedia en tiempo real a través de
navegadores y aplicaciones.

Permite transmitir video, audio y datos entre dispositivos, sin un servidor intermediario,
permitiendo una latencia mínima nativamente desde el navegador. Utiliza protocolos basados en
UDP y mecanismos como SDP, ICE, STUN y TURN para establecer las conexiones entre
dispositivos detrás de NATs y otros problemas que puede encontrar en internet.

Se revisitarán estas tecnologías en el Capítulo N

WebRTC: https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API#webrtc_reference

##### 2.3.1 WHIP & WHEP

Para simplificar la publicación y reproducción de flujos, surgieron protocolos basados en HTTP.

El WHIP ( WebRTC- HTTP Ingestion Protocol) es un protocolo diseñado para realizar el
intercambio del SDP a través de peticiones HTTP para la ingesta de contenido WebRTC a un
media server. Esto sustituye sistemas de signaling personalizados, mejorando la interoperabilidad
de dispositivos y servicios

WHIP: https://www.ietf.org/archive/id/draft-murillo-whep-03.html

El WHEP (WebRTC HTTP Egress Protocol) es un protocolo diseñado para realizar la
reproducción del stream WebRTC saliente de un media server en el cliente..

WHEP: https://www.ietf.org/archive/id/draft-ietf-wish-whip-01.html

```
Table 1 Protocolos de Streaming
```
```
Protocolo Transporte Latencia Fiabilidad Caso de uso
```
```
RTP UDP Muy baja Baja Profesional
```
```
RTSP TCP/UDP Baja Media Videovigilancia
```
```
RTMP TCP Media Alta Muy alta
```
```
SRT UDP Baja Alta Profesional
```
```
WebRTC UDP Muy baja Media Navegadores
```

# Capítulo 3. Diseño arquitectura

#### 3.1 Requisitos

El sistema por diseñar necesita una arquitectura que permita la retransmisión multimedia en
tiempo real de forma flexible y modular.

Buscamos:

- Baja latencia
- Fácil despliegue
- Escalable
- Funcional en redes locales
- Interoperabilidad

#### 3.2 Diseño global

La arquitectura del sistema se basa en un modelo modular dividido en distintas capas funcionales.
El flujo principal comienza con la captura del contenido multimedia desde distintas fuentes,
continúa con el procesamiento y codificación del stream, y finaliza con la distribución hacia los
clientes finales mediante un servidor multimedia central.

Como núcleo del sistema se utiliza MediaMTX, encargado de recibir, gestionar y redistribuir los
streams utilizando distintos protocolos de streaming. Esto permite desacoplar las fuentes de
contenido de los clientes de reproducción, facilitando la interoperabilidad entre diferentes
tecnologías.

#### 3.3 Diseño de capas

##### 3.3.1 Fuente

Las fuentes de contenido representan el origen de las señales multimedia utilizadas por el sistema.
Estas pueden ser tanto dispositivos físicos como streams generados externamente.

Ejemplos:

- Webcams
- Cámaras integradas en portátiles
- Cámaras en móviles
- Camaras profesionales con salida HDMI
- Cámaras IP
- Streams de video

Dependiendo de la fuente, dimensión, bitrate y FPS entre otros pueden variar.

```
METER DIBUJO DE ARQUITECTURA
```
##### 3.3.2 Captura

La capa de captura es el puente entre el hardware y las herramientas para procesar el contenido
del flujo, Se encarga de obtener el contenido generado por la fuente a través de distintos
mecanismos como:


- Capturadoras HDMI
- Interfaces DirectShow
- Sistemas V4L
- Cámaras integradas
- Interfaces de audio y video externas
    METER DIBUJO DE ARQUITECTURA

##### 3.3.3 Flujo.........................................................................................................................

Una vez capturado el contenido, el flujo multimedia es procesado y preparado para su transmisión
mediante distintas herramientas de procesamiento multimedia.

Ejemplos:

- FFMPEG
- G-STREAMER
- WebRTC PeerConnection

Con estas herramientas, podemos modificar distintos parámetros del flujo que vamos a emitir
como:

- Bitrate
- Resolución
- GOP
- Codecs
    METER DIBUJO DE ARQUITECTURA

##### 3.3.4 Transporte y red

La capa de transporte y red es la encargada de mover el contenido multimedia entre los distintos
componentes del sistema. Puede funcionar tanto sobre redes Ethernet como conexiones WiFi,
dependiendo del escenario de despliegue y movilidad requerida.

Sobre estas redes se utilizan distintos protocolos de transporte, principalmente TCP y UDP, cada
uno orientado a diferentes necesidades:

- TCP prioriza la fiabilidad e integridad de los datos.
- UDP prioriza la baja latencia y velocidad de transmisión.
    QUITAR ¿?

La elección del protocolo afecta directamente al comportamiento del sistema, especialmente en
aspectos como:

- Latencia.
- Estabilidad.
- Recuperación ante pérdidas.
- Calidad del stream.

En entornos locales mediante Ethernet se obtiene una conexión más estable y predecible, mientras
que redes WiFi aportan movilidad a costa de una mayor variabilidad en latencia y pérdidas de
paquetes.

```
METER DIBUJO DE ARQUITECTURA
```

##### 3.3.5 Media Server

El núcleo de distribución multimedia del sistema se basa en MediaMTX, utilizado como servidor
central de streaming.

Este servidor es responsable de:

- Recibir streams entrantes.
- Redistribuir contenido mediante distintos protocolos.
- Gestionar conexiones cliente.
- Gestionar sesiones.
- Exponer APIs de control y monitorización.

Gracias a su soporte multiprotocolo, el sistema puede interoperar entre tecnologías como RTMP,
RTSP, SRT o WebRTC.

```
METER DIBUJO DE ARQUITECTURA
```
##### 3.3.6 Cliente

La capa cliente representa los dispositivos encargados de consumir y reproducir el contenido
multimedia distribuido por el sistema.

Ejemplos:

- Navegadores
- Aplicaciones multimedia
- VLC
- Clientes WebRTC
    METER DIBUJO DE ARQUITECTURA

**_3.3.7 Distribución_**

La capa de distribución permite reenviar o redistribuir los flujos multimedia hacia otras
plataformas o servicios externos.

Esto facilita la integración del sistema con infraestructuras de streaming ya existentes y permite
componer escenas mas complejas.

Ejemplos:

- Otros Media Server
- OBS
    METER DIBUJO DE ARQUITECTURA

#### 3.4 Flujo extremo a extremo

El flujo comienza en una fuente de contenido multimedia, como una webcam, cámara profesional
o stream externo. Esta señal de video es capturada mediante interfaces o dispositivos de
adquisición compatibles con el sistema.

El contenido es procesado mediante herramientas multimedia como FFmpeg, GStreamer o
WebRTC PeerConnection. Aquí pueden modificarse distintos parámetros del flujo, como
resolución, bitrate, codecs o encapsulado del stream.


Una vez preparado, el contenido es enviado al servidor multimedia MediaMTX utilizando
protocolos como WHIP o alternativamente RTMP, SRT, RTSP u otro compatible.

MediaMTX recibe el stream y se encarga de gestionar las conexiones, redistribuir el contenido y
exponerlo mediante distintos endpoints.

Los clientes consumen el contenido utilizando navegadores web, reproductores multimedia o
equivalentes.

Finalmente, esos clientes se usan para componer y redistribuir una escena más compleja a
plataformas de streaming u otras alternativas.

Este modularidad permite cambiar las distintas capas del sistema, facilitando la interoperabilidad
entre tecnologías y simplificando la integración de cambios.

#### 3.5 Decisiones de diseño

Durante el desarrollo del sistema se tomaron distintas decisiones técnicas orientadas a equilibrar
latencia, compatibilidad, facilidad de despliegue y complejidad de implementación.

La utilización de WebRTC permite alcanzar latencias muy reducidas y fácilmente reproducible
en un navegador, siendo especialmente adecuado para aplicaciones interactivas y retransmisiones
en tiempo real. Sin embargo, introduce una mayor complejidad debido al uso de signaling,
negociación ICE y gestión de conexiones peer-to-peer. Por otra parte, protocolos como RTMP o
SRT ofrecen una integración más sencilla, sin tener que ser peer-to-peer, aunque tienen una
latencia superior frente a WebRTC.

MediaMTX como servidor multimedia se debe a su soporte multiprotocolo, facilidad de
integración con Docker y capacidad para redistribuir streams.

Trabajar con navegadores es versátil y reproducible en todo tipo de dispositivos.

Finalmente, el uso predominante de protocolos basados en UDP permite minimizar la latencia del
sistema, sacrificando parcialmente la fiabilidad absoluta frente a soluciones basadas
completamente en TCP.


# Capítulo 4. Implementación

Una vez clara la

Para facilitar el desarrollo, mantenimiento y despliegue del sistema se han usado distintas
herramientas para gestionar el código y los distintos servicios que la arquitectura debe
proporcionar.

## 4.1 Estructura del proyecto

El desarrollo del proyecto se puede estructurar en N zonas:

1. Web
2. Media Server
3. Protocolos / ¿???

Linux / Windows / Android / iOS

## 4.2 Sistema de versionado Git / Github

Durante el desarrollo del trabajo, para el control de versiones del proyecto se utiliza Git junto a
un repositorio remoto en GitHub. Esto permite mantener un historial completo de cambios sobre
el código, facilitando la gestión de distintas versiones del proyecto, recuperar cambios y la
integración de nuevas funcionalidades de forma controlada.

GitHub actúa como plataforma remota de almacenamiento y colaboración, permitiendo
sincronizar el repositorio entre distintos dispositivos y mantener una copia centralizada del
proyecto.

El repositorio principal utilizado durante el desarrollo es:

https://github.com/Luigiverde4/WebMTX

Durante el desarrollo del proyecto, el repositorio recibió estrellas, llamando la atención de otros
usuarios interesados en implementaciones de WebRTC.

Tiene una licencia MIT, de software libre y permisiva que permite a cualquier usuario utilizar,
copiar, modificar y distribuir el software, incluso con fines comerciales, siempre que se mantenga
el aviso de copyright y la propia licencia en las copias del software.

https://opensource.org/license/mit

## 4.3 Despliegue Docker

Para el despliegue de la infraestructura se utiliza Docker, una plataforma de virtualización ligera
basada en contenedores. Docker permite empaquetar aplicaciones y servicios junto a todas sus
dependencias en entornos reproducibles y aislados. Esto facilita la instalación, despliegue y
portabilidad del sistema entre diferentes dispositivos o sistemas operativos.

Así cada servicio del proyecto puede ejecutarse de forma independiente, manteniendo una
configuración consistente y reduciendo problemas de compatibilidad entre entornos.

El uso de Docker simplifica el despliegue reproducible del sistema y el aislamiento de servicios,
pero añade un extra de abstracción sobre la red y la infraestructura, teniendo que hacer port
forwarding.


https://docs.docker.com/get-started/docker-
overview/#:~:text=Docker%20is%20an%20open%20platform,ways%20you%20manage%20yo
ur%20applications.

**_4.3.1 Dockercompose_**

Usamos Docker Compose, ya que se pueden definir y gestionar múltiples dockers / servicios en
un mismo entorno a través de un único archivo de configuración. En este se específica los dockers
necesarios, sus configuraciones, comunicaciones y archivos a cargar en volumenes.

Cada servicio esta en su propio contenedor, pero manteniendo la posibilidad de comunicarse con
los otros servicios para intercambiar datos y eventos a través de una red virtual interna.

Al tener una capa de virtualización, un elemento clave es exponer los distintos puertos para la
comunicación de los protocolos de red y de las llamadas API.

Extracto del docker compose:: (possible anexo, ya esta en Gh)
mediamtx:
image: bluenviron/mediamtx:latest
container_name: mediamtxTFG
restart: unless-stopped

ports:

- "1935:1935" # RTMP
- "8554:8554" # RTSP
- "8888:8888" # HLS HTTPS
- "8889:8889" # WebRTC HTTPS
- "8189:8189/udp" # WebRTC ICE/UDP
- "9997:9997" # API HTTPS

Asi los distintos clientes podrán acceder a los servicios del Docker específico.

#### 4.4 MediaMTX

Como centro del sistema se utiliza MediaMTX, un media server multiprotocolo escrito en Go
orientado a la retransmisión de contenidos multimedia en tiempo real.

MediaMTX permite recibir, convertir y distribuir streams utilizando múltiples protocolos de
streaming como RTSP, RTMP, SRT, WebRTC o HLS, facilitando la interoperabilidad entre ellos
y los clientes. Esta es una de sus principales ventajas: la flexibilidad. Un mismo stream puede
recibirse mediante un protocolo y redistribuirse automáticamente utilizando otro distinto.

Por ejemplo, un video RTMP puede visualizarse posteriormente mediante WebRTC o RTSP si el
códec es correcto y sin necesidad de pasos adicionales..

Para la configuración se usa un mediamtx.yml , especificando paths, configuraciones de
grabaciones etc

Además, tiene un Docker, permitiendo desplegar el servidor multimedia junto al resto de servicios
del sistema de forma sencilla.

https://mediamtx.org/docs/kickoff/introduction

#### 4.5 Node

Para implementar

#### WebRTC / WHIP / WHEP

Explicar ICE, STUN TURN aquí ¿ Me paso de divulgativo?


**_4.5.1 RTCPeerConnect_**

https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API

#### 4.6 HTTPS y Certificados

###### 4.6.1 HTTPS

Aparecen las siguientes limitaciones / requerimientos

El protocolo HTTPS (HyperText Transfer Protocol Secure) permite establecer comunicaciones
cifradas entre cliente y servidor mediante TLS/SSL, garantizando autenticidad, integridad y
privacidad de los datos transmitidos.

https://www.cloudflare.com/es-es/learning/ssl/what-is-https/

En este proyecto, HTTPS resulta especialmente importante debido al uso de la API
getUserMedia(), utilizada para acceder a cámaras y micrófonos desde el navegador.

La mayoría de navegadores únicamente permiten utilizar getUserMedia() en:

- localhost
- Webs HTTPS válidos

Esto implica que, para permitir la captura multimedia desde otros dispositivos de la red local
utilizando direcciones IP, el servidor debe funcionar bajo HTTPS.

GetUserMedia

https://developer.mozilla.org/es/docs/Web/API/MediaDevices/getUserMedia

Además, los navegadores bloquean recursos inseguros HTTP cargados desde páginas HTTPS
mediante mecanismos de protección contra Mixed Content. Esto obliga a que tanto APIs, streams
y recursos multimedia sean servidos de forma segura y consistente.

Mixed Content

https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Mixed_content

**_4.6.2 Mkcert cambiar el nombre_**

Para facilitar el desarrollo y despliegue en redes locales se utilizó mkcert, una herramienta
orientada a generar certificados TLS válidos para entornos de desarrollo.

mkcert permite crear una autoridad certificadora local e instalarla en el sistema operativo,
generando posteriormente certificados confiables para direcciones como:

- Localhost
- IPs de una LAN
- Hostnames personalizados

Gracias a ello, el sistema puede utilizar HTTPS dentro de redes locales sin necesidad de adquirir
certificados públicos reales.

https://mkcert.org/

#### 4.7 FFMPEG Herramienta de codificación ()

https://www.msys2.org/

https://github.com/ossrs/ffmpeg-webrtc

https://www.openssl.org/


#### 4.8 Herramientas Web

**_4.8.1 Broadcaster_**

**_4.8.2 Player_**

**_4.8.3 Playback_**

**_4.8.4 API_**

**_4.8.5 Stats_**

https://www.chartjs.org/

#### 4.9 Comunicación y Proxy APIs

**_4.9.1 Network Docker_**

Previamente habíamos mencionado que se comunicaban los dockers.

Los ponemos en modo Bridge para que las peticiones que llegan de la API por el Docker de Node
lleguen al Docker de MediaMTX y haya comunicación.

**_4.9.2 API MediaMTX_**

**_4.9.3 API Grabaciones_**


# Capítulo 5. Pliego de condiciones

## 5.1 Requisitos técnicos

## 5.2 Materiales y equipo

**_5.2.1 Red_**

Router POLIWOOD

Antena POLIWOOD

Cables Ethernet?

**_5.2.2 Dispositivos_**

Cualquiera con acceso a la red montada

## 5.3 Presupuesto estimado


# Capítulo 6. Pruebas y Resultados

## 6.1 Objetivos del experimento

## 6.2 Escenario de prueba

## 6.3 Herramientas de medición

Reloj con ms

https://magacor.es/reloj/reloj1.html

## 6.4 Posibles problemas

## 6.5 Resultados latencia entre extremos

## 6.6 Resultado estabilidad

## 6.7 Resultado bitrate


# Capítulo 7. Discusión

## 7.1 Interpretación de resultados

Latencia bien? Bitrate bien? Se ha caído? Strict vs No Strict constraints

## 7.2 Cumplimiento objetivos

## 7.3 Limitaciones encontradas


# Capítulo 8. Conclusiones y líneas futuras

## 8.1 Conclusiones principales

## 8.2 Aportaciones del trabajo

La solución plantea una arquitectura multimedia que cubre las fases de captura, codificación,
publicación, enrutado y reproducción del flujo audiovisual.

Para ello, se adopta MediaMTX como servidor de medios y núcleo de gestión de sesiones,
utilizando los protocolos WHIP (WebRTC-HTTP Ingestion Protocol) para la contribución de
señal y WHEP (WebRTC-HTTP Egress Protocol) para la entrega a clientes web.

La aportación de este TFG reside en la integración de estas tecnologías en una plataforma
funcional y reproducible. El resultado es un prototipo operativo para entornos de producción
audiovisual real, donde la baja latencia es un requisito 1.

## 8.3 Líneas futuras

###### 8.3.1 5G,

**_8.3.2 FFMPEG con WHIP en navegador?_**

**_8.3.3 Licencia MIT `+ mod neg_**

**_8.3.4 Para clase / máster_**

**_8.3.5 Control de realización web + API OBS_**


# Capítulo 9. Bibliografía

La memoria debe incluir una relación bibliográfica de las fuentes consultadas. Las referencias
bibliográficas siempre deberán estar convenientemente citadas en el texto de la memoria. Se
deberá dedicar una sección de la misma para listarlas con la siguiente notación:

[ 1 ] Wilkins, R.; Little, J. “Solution of electrostatic field problems using Sander's function,” _IEEE
Transactions on Microwave Theory and Techniques,_ vol. 55, no. 9, pp. 1880–1886, September
2007.

[ 2 ] Ansoft Corporation, “HFSS: 3D high-frequency electromagnetic simulation,”
[http://www.ansoft.com/products/hf/hfss/index.cfm.](http://www.ansoft.com/products/hf/hfss/index.cfm.) [Online].

[ 3 ] Matthaei, G.; Young, L. and Jones, E. M. T. _Microwave Filters, Impedance-Matching
Networks, and Coupling Structures_. Artech House Inc., 1980.

L. L. Fernández, M. P. Díaz, R. B. Mejías, F. J. López and J. A. Santos, "Kurento: a media server
technology for convergent WWW/mobile real-time multimedia communications supporting
WebRTC," 2013 IEEE 14th International Symposium on "A World of Wireless, Mobile and
Multimedia Networks" (WoWMoM), Madrid, Spain, 2013, pp. 1 - 6, doi:
10.1109/WoWMoM.2013.6583507.


