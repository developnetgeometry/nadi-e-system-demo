"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, useCallback } from "react";

export default function RemotePcStream({ pcId, siteId }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null); // Hidden video for stream processing
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const iceBufferRef = useRef<RTCIceCandidateInit[]>([]);
    const wsRef = useRef<WebSocket | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const dataChannelRef = useRef<RTCDataChannel | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [connectionState, setConnectionState] = useState<string>("new");
    const [isControlEnabled, setIsControlEnabled] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 1280, height: 720 });

    const userId: string = "web" + pcId;
    const channelName: string = siteId;

    // Canvas rendering function
    const drawVideoFrame = useCallback(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        
        if (!canvas || !video || video.readyState < 2) {
            animationFrameRef.current = requestAnimationFrame(drawVideoFrame);
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Update canvas size if video dimensions changed
        if (video.videoWidth && video.videoHeight) {
            const aspectRatio = video.videoWidth / video.videoHeight;
            const containerWidth = canvas.parentElement?.clientWidth || 1280;
            const newHeight = containerWidth / aspectRatio;
            
            if (canvas.width !== containerWidth || canvas.height !== newHeight) {
                canvas.width = containerWidth;
                canvas.height = newHeight;
                setCanvasSize({ width: containerWidth, height: newHeight });
            }
        }

        // Clear canvas and draw video frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Add overlay if control is enabled
        if (isControlEnabled) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
            ctx.font = '16px Arial';
            ctx.fillText('PC Control Active', 10, 30);
        }

        animationFrameRef.current = requestAnimationFrame(drawVideoFrame);
    }, [isControlEnabled]);

    // Mouse event handlers for PC control
    const handleCanvasMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isControlEnabled || !dataChannelRef.current) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        dataChannelRef.current.send(JSON.stringify({
            type: "mouse_move",
            data: { x, y }
        }));
    }, [isControlEnabled]);

    const handleCanvasMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isControlEnabled || !dataChannelRef.current) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        dataChannelRef.current.send(JSON.stringify({
            type: "mouse_down",
            data: { x, y, button: event.button }
        }));
    }, [isControlEnabled]);

    const handleCanvasMouseUp = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isControlEnabled || !dataChannelRef.current) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        dataChannelRef.current.send(JSON.stringify({
            type: "mouse_up",
            data: { x, y, button: event.button }
        }));
    }, [isControlEnabled]);

    const handleCanvasKeyDown = useCallback((event: React.KeyboardEvent<HTMLCanvasElement>) => {
        if (!isControlEnabled || !dataChannelRef.current) return;

        event.preventDefault();
        dataChannelRef.current.send(JSON.stringify({
            type: "key_down",
            data: { key: event.key, keyCode: event.keyCode }
        }));
    }, [isControlEnabled]);

    const handleCanvasKeyUp = useCallback((event: React.KeyboardEvent<HTMLCanvasElement>) => {
        if (!isControlEnabled || !dataChannelRef.current) return;

        event.preventDefault();
        dataChannelRef.current.send(JSON.stringify({
            type: "key_up",
            data: { key: event.key, keyCode: event.keyCode }
        }));
    }, [isControlEnabled]);

    useEffect(() => {
        if (!isConnected) return;

        const log = (...args: any[]) => console.log("[VIEWER]", ...args);

        const ws = new WebSocket("https://wss-signalling.onrender.com");
        wsRef.current = ws;

        let pc: RTCPeerConnection;

        ws.onopen = () => {
            log("WebSocket connected, joining channel...");
            ws.send(JSON.stringify({ type: "join", body: { channelName, userId } }));
        };

        ws.onmessage = async (msg) => {
            const { type, body } = JSON.parse(msg.data);
            log("Received message:", type);

            if (type === "joined") {
                log("Joined channel, creating peer connection...");
                
                pc = new RTCPeerConnection({
                    iceServers: [
                        { urls: "stun:stun.l.google.com:19302" },
                        { urls: "stun:stun1.l.google.com:19302" }
                    ]
                });
                pcRef.current = pc;

                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        log("Sending ICE candidate:", event.candidate);
                        ws.send(
                            JSON.stringify({
                                type: "send_ice_candidate",
                                body: { channelName, userId, candidate: event.candidate },
                            })
                        );
                    } else {
                        log("ICE gathering complete");
                    }
                };

                pc.ontrack = (event) => {
                    log("Received remote track:", event.track.kind);
                    const stream = event.streams[0];
                    if (stream) {
                        setRemoteStream(stream);
                        log("Remote stream set");
                    }
                };

                pc.onconnectionstatechange = () => {
                    log("Connection state changed:", pc.connectionState);
                    setConnectionState(pc.connectionState);
                };

                pc.oniceconnectionstatechange = () => {
                    log("ICE connection state:", pc.iceConnectionState);
                };

                try {
                    const offer = await pc.createOffer({
                        offerToReceiveAudio: true,
                        offerToReceiveVideo: true
                    });
                    await pc.setLocalDescription(offer);
                    
                    ws.send(
                        JSON.stringify({
                            type: "send_offer",
                            body: { channelName, userId, sdp: offer },
                        })
                    );
                    log("Offer created and sent");
                } catch (err) {
                    log("Error creating offer:", err);
                }
            }

            if (type === "answer_sdp_recieved") {
                if (!pc) {
                    log("Error: No peer connection available");
                    return;
                }

                try {
                    const answer = new RTCSessionDescription(body);
                    await pc.setRemoteDescription(answer);
                    log("Answer set as remote description");

                    for (const candidate of iceBufferRef.current) {
                        try {
                            await pc.addIceCandidate(new RTCIceCandidate(candidate));
                            log("Added buffered ICE candidate");
                        } catch (err) {
                            log("Error adding buffered ICE candidate:", err);
                        }
                    }
                    iceBufferRef.current = [];
                } catch (err) {
                    log("Error setting remote description:", err);
                }
            }

            if (type === "ice_candidate_recieved") {
                if (!pc) {
                    log("Error: No peer connection for ICE candidate");
                    return;
                }

                const candidate = new RTCIceCandidate(body);
                
                if (pc.remoteDescription && pc.remoteDescription.type) {
                    try {
                        await pc.addIceCandidate(candidate);
                        log("ICE candidate added successfully");
                    } catch (err) {
                        log("Error adding ICE candidate:", err);
                    }
                } else {
                    log("Buffering ICE candidate (no remote description yet)");
                    iceBufferRef.current.push(body);
                }
            }
        };

        ws.onerror = (err) => {
            log("WebSocket error:", err);
        };

        ws.onclose = (event) => {
            log("WebSocket closed:", event.code, event.reason);
        };

        return () => {
            log("Cleaning up connections...");
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (pcRef.current) {
                pcRef.current.close();
                pcRef.current = null;
            }
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
            setRemoteStream(null);
            setConnectionState("closed");
            iceBufferRef.current = [];
        };
    }, [isConnected]);

    // Handle stream changes and start/stop canvas rendering
    useEffect(() => {
        const video = videoRef.current;
        
        if (remoteStream && video) {
            video.srcObject = remoteStream;
            video.onloadeddata = () => {
                console.log("[VIEWER] Video loaded, starting canvas rendering");
                drawVideoFrame();
            };
        } else if (video) {
            video.srcObject = null;
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [remoteStream, drawVideoFrame]);

    const handleConnect = () => {
        if (isConnected) {
            if (pcRef.current) {
                pcRef.current.close();
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
            setRemoteStream(null);
            setConnectionState("closed");
            setIsControlEnabled(false);
        }
        setIsConnected(!isConnected);
    };

    const handleToggleControl = () => {
        setIsControlEnabled(!isControlEnabled);
        if (!isControlEnabled && canvasRef.current) {
            canvasRef.current.focus();
        }
    };

    return (
        <div className="w-full space-y-3 mt-4">
            <div className="flex gap-2 flex-wrap">
                <Badge className={isConnected ? "bg-green-200 text-green-700" : "bg-red-200 text-red-600"}>
                    {isConnected ? "Connected" : "Disconnected"}
                </Badge>
                <Badge className="bg-blue-200 text-blue-700">
                    WebRTC: {connectionState}
                </Badge>
                <Badge className={remoteStream ? "bg-green-200 text-green-700" : "bg-gray-200 text-gray-600"}>
                    Stream: {remoteStream ? "Active" : "None"}
                </Badge>
                <Badge className={isControlEnabled ? "bg-purple-200 text-purple-700" : "bg-gray-200 text-gray-600"}>
                    Control: {isControlEnabled ? "Active" : "Disabled"}
                </Badge>
                <Badge className="bg-gray-200 text-gray-600">
                    Size: {canvasSize.width}x{canvasSize.height}
                </Badge>
            </div>
            
            <div className="relative border rounded-md bg-black overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className={`w-full h-auto ${isControlEnabled ? 'cursor-crosshair' : 'cursor-default'}`}
                    style={{ minHeight: "300px", display: 'block' }}
                    tabIndex={isControlEnabled ? 0 : -1}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseUp={handleCanvasMouseUp}
                    onKeyDown={handleCanvasKeyDown}
                    onKeyUp={handleCanvasKeyUp}
                    onContextMenu={(e) => isControlEnabled && e.preventDefault()}
                />
                
                {/* Hidden video element for processing stream */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={false}
                    style={{ display: 'none' }}
                />
                
                {/* Loading overlay */}
                {isConnected && !remoteStream && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="text-white text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                            <p>Connecting to remote PC...</p>
                        </div>
                    </div>
                )}
                
                {/* Control instructions overlay */}
                {isControlEnabled && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white p-2 rounded text-sm">
                        <p>🎮 PC Control Active</p>
                        <p>Click canvas to focus</p>
                        <p>ESC to release focus</p>
                    </div>
                )}
            </div>
            
            <div className="flex justify-center gap-3 mt-3 flex-wrap">
                <Button 
                    onClick={handleConnect} 
                    className={isConnected ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                >
                    {isConnected ? "Disconnect" : "Connect to Stream"}
                </Button>
                
                <Button 
                    onClick={handleToggleControl}
                    disabled={!remoteStream || connectionState !== "connected"}
                    className={isControlEnabled ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"}
                >
                    {isControlEnabled ? "Disable Control" : "Take Over PC"}
                </Button>
                
                <Button 
                    onClick={() => canvasRef.current?.focus()}
                    disabled={!isControlEnabled}
                    className="bg-gray-600 hover:bg-gray-700"
                >
                    Focus Screen
                </Button>
            </div>
            
            {/* Control help */}
            {isControlEnabled && (
                <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded">
                    <h4 className="font-semibold mb-2">PC Control Instructions:</h4>
                    <ul className="space-y-1">
                        <li>• <strong>Mouse:</strong> Move cursor, click to interact</li>
                        <li>• <strong>Keyboard:</strong> Type keys (screen must be focused)</li>
                        <li>• <strong>Right-click:</strong> Context menu disabled during control</li>
                        <li>• <strong>Focus:</strong> Click screen or "Focus Screen" button</li>
                    </ul>
                </div>
            )}
        </div>
    );
}