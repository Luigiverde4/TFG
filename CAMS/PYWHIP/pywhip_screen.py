# WHIP via Python (screen capture)
# Import required modules for WebRTC, screen capture, and HTTP communication
import asyncio                        # For asynchronous event loop
import aiohttp                        # For sending HTTP (WHIP) requests
import av                             # For video frame encoding
import mss                            # For fast screen capture
import numpy as np                    # For frame manipulation
from aiortc import (
    RTCPeerConnection,               # Core class for managing WebRTC connections
    RTCConfiguration,                # Configuration for STUN/TURN servers
    RTCIceServer,                    # STUN server entry
    RTCSessionDescription,           # WebRTC SDP offer/answer
    VideoStreamTrack                 # Base class for sending video frames
)

# === Static Configuration ===
# Please note the below value should be in number format, not string format
MONITOR_INDEX = 1     # 1 = primary monitor in mss (0 is a virtual full screen)
FRAME_WIDTH = 1920    # Desired video width (scaled if needed)
FRAME_HEIGHT = 1080   # Desired video height (scaled if needed)
FPS = 30              # Target capture frame rate

SERVER_IP = "192.168.1.120"   # Your Server IP address
SERVER_PORT = "8889"      # Port for WebRTC (Make sure to enable this port & run MediaMTX on server)
MediaMTX_ENDPOINT = "pywhip"   # MediaMTX endpoint

# === Define a custom video track class that reads frames from the screen ===
class ScreenVideoStreamTrack(VideoStreamTrack):
    """
    Custom video track to capture frames from the screen using mss.
    This class is passed to the WebRTC connection as the source of video frames.
    """
    kind = "video"

    def __init__(self):
        super().__init__()
        self.sct = mss.mss()
        monitors = self.sct.monitors
        if MONITOR_INDEX < 0 or MONITOR_INDEX >= len(monitors):
            raise RuntimeError(
                f"❌ Invalid MONITOR_INDEX {MONITOR_INDEX}. Available monitors: {len(monitors) - 1}"
            )
        self.monitor = monitors[MONITOR_INDEX]
        self.frame_interval = 1.0 / max(FPS, 1)

        print(
            "[INFO] Screen capture initialized on monitor index "
            f"{MONITOR_INDEX} at {self.monitor['width']}x{self.monitor['height']}"
        )

    async def recv(self):
        """
        Called repeatedly by WebRTC to get the next video frame.
        Converts screen frame to aiortc-compatible VideoFrame.
        """
        pts, time_base = await self.next_timestamp()

        # Capture screen frame (BGRA)
        img = self.sct.grab(self.monitor)
        frame = np.array(img)[:, :, :3]  # Drop alpha, keep BGR

        # Resize if needed to match desired dimensions
        if frame.shape[1] != FRAME_WIDTH or frame.shape[0] != FRAME_HEIGHT:
            # Use OpenCV-like resize via numpy + cv2 if available, else simple nearest
            try:
                import cv2

                frame = cv2.resize(frame, (FRAME_WIDTH, FRAME_HEIGHT), interpolation=cv2.INTER_LINEAR)
            except Exception:
                frame = frame[:: max(frame.shape[0] // FRAME_HEIGHT, 1), :: max(frame.shape[1] // FRAME_WIDTH, 1)]
                frame = frame[:FRAME_HEIGHT, :FRAME_WIDTH]

        # Convert BGR to RGB for aiortc
        frame = frame[:, :, ::-1]

        video_frame = av.VideoFrame.from_ndarray(frame, format="rgb24")
        video_frame.pts = pts
        video_frame.time_base = time_base

        await asyncio.sleep(self.frame_interval)
        return video_frame

# === Main function to establish a WebRTC connection and publish the screen stream ===
async def publish_stream():
    print("[INFO] Preparing WebRTC connection to MediaMTX (Server)...")

    # 🌍 Create WebRTC peer connection with a STUN server (for NAT traversal)
    config = RTCConfiguration(
        iceServers=[RTCIceServer(urls=["stun:stun.l.google.com:19302"])]
    )
    pc = RTCPeerConnection(configuration=config)

    # 📡 Create and attach video track from screen capture
    video_track = ScreenVideoStreamTrack()
    pc.addTrack(video_track)

    # 🧾 Generate SDP offer from the client (this device)
    offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    print("[INFO] SDP offer created successfully")

    # 🌐 Send SDP offer to MediaMTX WHIP endpoint via HTTP POST
    whip_url = f"http://{SERVER_IP}:{SERVER_PORT}/{MediaMTX_ENDPOINT}/whip"
    print(f"[INFO] Sending offer to WHIP endpoint: {whip_url}")

    async with aiohttp.ClientSession() as session:
        async with session.post(
            whip_url,
            data=pc.localDescription.sdp,
            headers={"Content-Type": "application/sdp"}
        ) as resp:
            if resp.status != 201:
                print(f"[ERROR] WHIP connection failed: HTTP {resp.status}")
                print(await resp.text())
                return

            # ✅ Receive SDP answer from server and complete WebRTC handshake
            answer_sdp = await resp.text()
            await pc.setRemoteDescription(
                RTCSessionDescription(sdp=answer_sdp, type="answer")
            )
            print("[SUCCESS] WebRTC connection established with MediaMTX!")

    # 🕒 Keep stream alive for 1 hour or until manually stopped
    try:
        await asyncio.sleep(3600)
    except KeyboardInterrupt:
        print("[INFO] Stream interrupted by user.")
    finally:
        # 🔚 Cleanup
        await pc.close()
        print("[INFO] Stream closed.")

# === Entry Point ===
if __name__ == "__main__":
    try:
        asyncio.run(publish_stream())
    except Exception as e:
        print(f"[FATAL] Unhandled exception: {e}")
