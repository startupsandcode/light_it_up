import React, { useState, useEffect, useRef } from 'react';
import { Camera, Zap, MonitorSmartphone, Info, X } from 'lucide-react';
import './App.css';

function App() {
  const [stream, setStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [mode, setMode] = useState('none'); // 'none', 'camera', 'screen'

  // Ring settings
  const [brightness, setBrightness] = useState(1); // 0.1 to 1 (alpha) or width? Usually brightness is opacity or thickness. Let's do opacity/color intensity.
  const [color, setColor] = useState('#ffffff');
  const [width, setWidth] = useState(50); // px

  // Cycle animation
  const [isCycling, setIsCycling] = useState(false);
  const [cycleSpeed, setCycleSpeed] = useState(1); // 1 to 10
  const [hue, setHue] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const videoRef = useRef(null);
  const cycleRef = useRef(null);

  // Handle Camera
  const toggleCamera = async () => {
    if (mode === 'camera') {
      stopStreams();
      setMode('none');
      return;
    }
    stopStreams();
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setMode('camera');
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please allow permissions.");
    }
  };

  // Handle Screen Share
  const toggleScreen = async () => {
    if (mode === 'screen') {
      stopStreams();
      setMode('none');
      return;
    }
    stopStreams();
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenStream(mediaStream);
      setMode('screen');

      // Handle user stopping share via browser UI
      mediaStream.getVideoTracks()[0].onended = () => {
        setMode('none');
        setScreenStream(null);
      };

    } catch (err) {
      console.error("Error accessing screen:", err);
    }
  };

  const stopStreams = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    if (screenStream) screenStream.getTracks().forEach(track => track.stop());
    setStream(null);
    setScreenStream(null);
  };

  useEffect(() => {
    if (videoRef.current) {
      if (mode === 'camera' && stream) {
        videoRef.current.srcObject = stream;
      } else if (mode === 'screen' && screenStream) {
        videoRef.current.srcObject = screenStream;
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [mode, stream, screenStream]);

  // Color Cycling Logic
  useEffect(() => {
    if (!isCycling) {
      if (cycleRef.current) cancelAnimationFrame(cycleRef.current);
      return;
    }

    const animate = () => {
      setHue(prev => (prev + cycleSpeed) % 360);
      cycleRef.current = requestAnimationFrame(animate);
    };
    cycleRef.current = requestAnimationFrame(animate);

    return () => {
      if (cycleRef.current) cancelAnimationFrame(cycleRef.current);
    };
  }, [isCycling, cycleSpeed]);

  // Compute final color
  const displayColor = isCycling ? `hsl(${hue}, 100%, 50%)` : color;

  // Compute ring style
  const ringStyle = {
    border: `${width}px solid ${displayColor}`,
    boxShadow: `0 0 ${width * 0.5}px ${displayColor}, inset 0 0 ${width * 0.2}px ${displayColor}`,
    opacity: 0.8 + (brightness * 0.2), // Base visibility plus boost
    filter: `brightness(${brightness * 100 + 50}%)`
  };

  // When cycling, we just override the border color logic in the style object above.
  // Actually, standard color input returns hex.

  return (
    <div className="app-container">
      <div
        className="ring-wrapper"
        style={{
          width: '95%',
          height: '90%',
          // The ring is arguably the border of this wrapper OR a child.
          // Let's use a child to allow the video to sit cleanly inside.
        }}
      >
        <div className="ring-light" style={ringStyle}></div>

        <div className="content-area" style={{ margin: `${width}px` }}>
          {mode !== 'none' && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`video-feed ${mode === 'screen' ? 'screen-share' : ''}`}
            />
          )}
          {mode === 'none' && (
            <div style={{ color: displayColor, opacity: 0.5, textAlign: 'center' }}>
              <h2>Ready</h2>
              <p>Select a source below</p>
            </div>
          )}
        </div>
      </div>

      <div className="controls-overlay active">
        {/* Source Controls */}
        <div className="control-group">
          <label>Source</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className={`icon-btn ${mode === 'camera' ? 'active' : ''}`}
              onClick={toggleCamera}
              title="Toggle Camera"
            >
              <Camera size={20} />
            </button>
            <button
              className={`icon-btn ${mode === 'screen' ? 'active' : ''}`}
              onClick={toggleScreen}
              title="Share Screen"
            >
              <MonitorSmartphone size={20} />
            </button>
          </div>
        </div>

        <div className="separator" style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' }}></div>

        {/* Appearance */}
        <div className="control-group">
          <label>Light</label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              type="color"
              value={color}
              onChange={(e) => { setIsCycling(false); setColor(e.target.value); }}
              disabled={isCycling}
              title="Color"
            />
            <button
              className={`icon-btn ${isCycling ? 'active' : ''}`}
              onClick={() => setIsCycling(!isCycling)}
              title="Cycle Colors"
            >
              <Zap size={20} />
            </button>
          </div>
        </div>

        {/* Sliders */}
        <div className="control-group" style={{ minWidth: 140 }}>
          <label>Thickness</label>
          <input
            type="range"
            min="10"
            max="150"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
        </div>

        <div className="control-group" style={{ minWidth: 140 }}>
          {/* If cycling, show speed, else brightness/intensity */}
          {isCycling ? (
            <>
              <label>Cycle Speed</label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={cycleSpeed}
                onChange={(e) => setCycleSpeed(Number(e.target.value))}
              />
            </>
          ) : (
            <>
              <label>Brightness</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
              />
            </>
          )}
        </div>

        <div className="separator" style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' }}></div>

        <button
          className={`icon-btn ${showHelp ? 'active' : ''}`}
          onClick={() => setShowHelp(true)}
          title="How to use as Camera"
        >
          <Info size={20} />
        </button>
      </div>

      {showHelp && (
        <div className="help-modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="help-modal" style={{
            background: '#1a1a1a', padding: 30, borderRadius: 20,
            maxWidth: 500, width: '90%', position: 'relative',
            border: '1px solid #333', color: '#eee'
          }}>
            <button
              onClick={() => setShowHelp(false)}
              style={{ position: 'absolute', top: 15, right: 15, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: 20, fontSize: '1.5rem' }}>Using as an External Camera</h2>
            <p style={{ marginBottom: 15, lineHeight: 1.6 }}>
              Web apps cannot directly become system cameras, but you can achieve this easily with **OBS Studio**:
            </p>
            <ol style={{ marginLeft: 20, marginBottom: 20, lineHeight: 1.6 }}>
              <li style={{ marginBottom: 8 }}>Install <b>OBS Studio</b> (free).</li>
              <li style={{ marginBottom: 8 }}>Add a <b>Window Capture</b> source and select this "Light It Up" window.</li>
              <li style={{ marginBottom: 8 }}>Click <b>Start Virtual Camera</b> in OBS controls.</li>
              <li style={{ marginBottom: 8 }}>In Zoom/Meet/Teams, select <b>OBS Virtual Camera</b> as your camera.</li>
            </ol>
            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
              Tip: Move this window to a secondary display (or specific area) to use it as your dedicated lighting/camera source.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
