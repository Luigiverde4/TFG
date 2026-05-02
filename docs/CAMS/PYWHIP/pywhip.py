# WHIP via Python
# Import required modules for WebRTC, video capture, and HTTP communication
import os
import cv2                            # For webcam video capture
import asyncio                        # For asynchronous event loop
import aiohttp                        # For sending HTTP (WHIP) requests
import av                             # For video frame encoding
import socket                         # For socket configuration
from aiortc import (
    RTCPeerConnection,               # Core class for managing WebRTC connections
    RTCConfiguration,                # Configuration for STUN/TURN servers
    RTCIceServer,                    # STUN server entry
    RTCSessionDescription,           # WebRTC SDP offer/answer
    VideoStreamTrack                 # Base class for sending video frames
)

# Disable IPv6 - force IPv4 only (fixes cross-network ICE connectivity)
os.environ['AIORTC_FORCE_IPV4'] = '1'
socket.IPV6_V6ONLY = 1

# === Static Configuration ===
#Please not the bellow value should be in number format nto string format
CAMERA_INDEX = 0      # Index of webcam (0 = default webcam)
FRAME_WIDTH  = 1920      # Desired video width
FRAME_HEIGHT = 1080    # Desired video height

SERVER_IP = "192.168.1.120"  # Your Server IP address
SERVER_PORT = "8889"         # Port for WebRTC (Make sure to enable this port & run MediaMTX on server)
MediaMTX_ENDPOINT = "pywhip"   # MediaMTX endpoint

# === Define a custom video track class that reads frames from a webcam ===
class WebcamVideoStreamTrack(VideoStreamTrack):
    """
    Custom video track to capture frames from a webcam device using OpenCV.
    This class is passed to the WebRTC connection as the source of video frames.
    """
    kind = "video"

    def __init__(self):
        super().__init__()
        # 🔌 Step 1: Open webcam device at the given index
        print(f"[DEBUG] Attempting to open camera at index {CAMERA_INDEX}...")
        try:
            self.cap = cv2.VideoCapture(CAMERA_INDEX)
            print(f"[DEBUG] cv2.VideoCapture created, checking if opened...")
            
            if not self.cap.isOpened():
                raise RuntimeError("❌ Failed to open webcam. Check if the camera is connected and available.")
            
            print(f"[DEBUG] Camera opened successfully")

            # 🎥 Step 2: Set desired resolution (optional)
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, FRAME_WIDTH)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_HEIGHT)

            print(f"[INFO] Webcam initialized on index {CAMERA_INDEX} at resolution {FRAME_WIDTH}x{FRAME_HEIGHT}")
        except Exception as e:
            print(f"[ERROR] Failed to initialize camera: {e}")
            raise

    async def recv(self):
        """
        Called repeatedly by WebRTC to get the next video frame.
        Converts OpenCV frame to aiortc-compatible for.
        """
        pts, time_base = await self.next_timestamp()  # Generate timestamp for the frame
        ret, frame = self.cap.read()  # Capture frame

        if not ret:
            raise RuntimeError("❌ Failed to read frame from webcam.")

        # Convert BGR (OpenCV format) to RGB
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Convert NumPy array to aiortc VideoFrame
        video_frame = av.VideoFrame.from_ndarray(frame, format="rgb24")
        video_frame.pts = pts
        video_frame.time_base = time_base

        #print("[INFO] Frame captured and sent")
        return video_frame

# === Main function to establish a WebRTC connection and publish the webcam stream ===
async def publish_stream():
    print("[INFO] Preparing WebRTC connection to MediaMTX (Server)...")

    # 🌍 Step 3: Create WebRTC peer connection with a STUN server (for NAT traversal)
    config = RTCConfiguration(
        iceServers=[
            RTCIceServer(urls=["stun:stun.l.google.com:19302"]),
            # Uncomment TURN server if behind restrictive NAT
            # RTCIceServer(urls=["turn:your-turn-server.com"], username="user", credential="pass")
        ]
    )
    print("[DEBUG] 1 - RTCConfiguration created")
    pc = RTCPeerConnection(configuration=config)

    print("[DEBUG] 2 - RTCPeerConnection created, now creating video track...")
    # 📡 Step 4: Create and attach video track from webcam
    try:
        print("[DEBUG] 3 - Attempting to create WebcamVideoStreamTrack...")
        video_track = WebcamVideoStreamTrack()
        print("[DEBUG] 4 - WebcamVideoStreamTrack created successfully")
    except Exception as e:
        print(f"[FATAL] Failed to create video track: {e}")
        await pc.close()
        raise
        
    print("[DEBUG] 5 - Adding track to peer connection...")
    pc.addTrack(video_track)

    print("[DEBUG] 6 - Creating SDP offer...")
    # 🧾 Step 5: Generate SDP offer from the client (this device)
    offer = await pc.createOffer()
    
    # 🔧 Filter out IPv6 candidates to force IPv4-only connection
    sdp_lines = offer.sdp.split('\n')
    filtered_sdp = []
    ipv6_filtered_count = 0
    for line in sdp_lines:
        # Skip IPv6 connection lines (c=IN IP6)
        if line.startswith('c=IN IP6'):
            print(f"[DEBUG] Filtering IPv6 connection line: {line}")
            filtered_sdp.append('c=IN IP4 0.0.0.0')  # Replace with IPv4 placeholder
            ipv6_filtered_count += 1
            continue
        
        # Skip ICE candidates with IPv6 addresses
        if line.startswith('a=candidate:'):
            parts = line.split()
            if len(parts) >= 5:
                # The IP address is typically at index 4
                ip_address = parts[4]
                # Skip if it's an IPv6 address (contains ':' for IPv6 format)
                if ':' in ip_address and not ip_address.startswith('['):
                    # IPv6 addresses contain colons, IPv4 don't
                    print(f"[DEBUG] Filtering IPv6 candidate: {ip_address}")
                    ipv6_filtered_count += 1
                    continue
        
        filtered_sdp.append(line)
    
    print(f"[DEBUG] Total IPv6 lines filtered: {ipv6_filtered_count}")
    offer.sdp = '\n'.join(filtered_sdp)
    print("[DEBUG] 7 - IPv6 candidates filtered, setting local description...")
    await pc.setLocalDescription(offer)
    print("[INFO] SDP offer created successfully (IPv4-only)")

    # 🌐 Step 6: Send SDP offer to MediaMTX WHIP endpoint via HTTP POST
    whip_url = f"http://{SERVER_IP}:{SERVER_PORT}/{MediaMTX_ENDPOINT}/whip" 
    print(f"[INFO] Sending offer to WHIP endpoint: {whip_url}")

    async with aiohttp.ClientSession() as session:
        async with session.post(
            whip_url,
            data=pc.localDescription.sdp,                    # SDP offer body
            headers={"Content-Type": "application/sdp"}      # Required header for WHIP
        ) as resp:
            if resp.status != 201:
                print(f"[ERROR] WHIP connection failed: HTTP {resp.status}")
                print(await resp.text())
                return

            # ✅ Step 7: Receive SDP answer from server and complete WebRTC handshake
            answer_sdp = await resp.text()
            await pc.setRemoteDescription(
                RTCSessionDescription(sdp=answer_sdp, type="answer")
            )
            print("[SUCCESS] WebRTC connection established with MediaMTX!")

    # 🕒 Step 8: Keep stream alive for 1 hour or until manually stopped
    try:
        await asyncio.sleep(3600)
    except KeyboardInterrupt:
        print("[INFO] Stream interrupted by user.")
    finally:
        # 🔚 Step 9: Cleanup
        await pc.close()
        video_track.cap.release()
        print("[INFO] Stream closed and webcam released.")

# === Entry Point ===
if __name__ == "__main__":
    try:
        asyncio.run(publish_stream())
    except Exception as e:
        print(f"[FATAL] Unhandled exception: {e}")