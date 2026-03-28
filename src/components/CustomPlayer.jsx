import React, { useState, useEffect, useRef, useCallback, memo } from 'react';

/* ── helpers ─────────────────────────────────── */
const getYouTubeId = (url) => {
  if (!url) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  const m = url.match(/(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*)/);
  return m && m[1].length === 11 ? m[1] : null;
};

const isIPhone = () =>
  typeof window !== 'undefined' && /iPhone|iPod/.test(navigator.userAgent);

const fmt = (s) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
};

const SPEEDS = [1, 1.25, 1.5, 1.75, 2];

// Global counter to ensure unique element IDs
let playerCounter = 0;

/* ═══════════════════════════════════════════════ */
const CustomPlayer = ({
  videoId,
  videoUrl,
  thumbnail,
  onEnded,
  onPlay,
  title,
  initialTime = 0,
}) => {
  const rawId = videoId || (videoUrl && videoUrl.match(/embed\/([^?]+)/)?.[1]) || '';
  const validId = getYouTubeId(rawId);

  // Unique element ID for this player instance
  const [elementId] = useState(() => `medx-yt-${++playerCounter}`);

  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const progressBarRef = useRef(null);
  const shouldPlayRef = useRef(false);
  const initialSeekDoneRef = useRef(false);
  const onEndedRef = useRef(onEnded);
  const onPlayRef = useRef(onPlay);
  const playFiredRef = useRef(false);
  const isInitializedRef = useRef(false);
  const previousVideoIdRef = useRef(validId);

  useEffect(() => { onEndedRef.current = onEnded; }, [onEnded]);
  useEffect(() => { onPlayRef.current = onPlay; }, [onPlay]);

  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [iphoneDevice, setIphoneDevice] = useState(false);
  const [showActionOverlay, setShowActionOverlay] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [showIphoneSwitchOverlay, setShowIphoneSwitchOverlay] = useState(false);
  const controlsTimerRef = useRef(null);

  /* ── 1. Load YT IFrame API once ── */
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(tag, firstScript);
    }
    setIphoneDevice(isIPhone());
  }, []);

  useEffect(() => {
    const previousVideoId = previousVideoIdRef.current;
    const switchedVideos = Boolean(previousVideoId && previousVideoId !== validId);

    playFiredRef.current = false;
    initialSeekDoneRef.current = false;
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setShowSplash(false);
    setShowActionOverlay(false);
    setControlsVisible(false);

    if (iphoneDevice && switchedVideos) {
      setStatus('loading');
      setShowIphoneSwitchOverlay(true);
    } else if (!switchedVideos) {
      setStatus('idle');
      setShowIphoneSwitchOverlay(false);
    } else {
      setShowIphoneSwitchOverlay(false);
    }

    previousVideoIdRef.current = validId;
  }, [validId, iphoneDevice]);

  /* ── progress save ── */
  const stateRef = useRef({ currentTime: 0, duration: 0, status: 'idle', title, videoId: validId });
  useEffect(() => {
    stateRef.current = { currentTime, duration, status, title, videoId: validId };
  }, [currentTime, duration, status, title, validId]);

  const saveProgress = useCallback(() => {
    const { currentTime: ct, duration: d, title: t, videoId: vid } = stateRef.current;
    if (!vid || d <= 0 || ct < 5 || ct > d - 5) return;
    try {
      localStorage.setItem('medx2026_last', JSON.stringify({ videoId: vid, title: t || '', timestamp: ct, duration: d, ts: Date.now() }));
    } catch (_) {}
  }, []);

  useEffect(() => { if (status === 'paused') saveProgress(); }, [status, saveProgress]);
  useEffect(() => {
    const iv = setInterval(() => { if (stateRef.current.status === 'playing') saveProgress(); }, 5000);
    return () => { clearInterval(iv); saveProgress(); };
  }, [saveProgress]);

  /* ── 2. Initialize YouTube player ── */
  useEffect(() => {
    if (!validId) return;
    // Guard against double-init (React Strict Mode / HMR)
    if (isInitializedRef.current) return;

    const initPlayer = () => {
      const targetEl = document.getElementById(elementId);
      if (!targetEl) {
        setTimeout(initPlayer, 100);
        return;
      }

      if (window.YT && window.YT.Player) {
        isInitializedRef.current = true;
        
        playerRef.current = new window.YT.Player(elementId, {
          videoId: validId,
          playerVars: {
            autoplay: 0,
            mute: 0,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            fs: 0,
            iv_load_policy: 3,
            cc_load_policy: 0,
            enablejsapi: 1,
            playsinline: 1,
            origin: window.location.origin,
            start: initialTime > 0 ? Math.floor(initialTime) : undefined,
          },
          events: {
            onReady: (event) => {
              // Store the actual player instance from the event
              playerRef.current = event.target;
              setDuration(event.target.getDuration());
              
              if (initialTime > 0 && !initialSeekDoneRef.current) {
                event.target.seekTo(initialTime, true);
                initialSeekDoneRef.current = true;
                setCurrentTime(initialTime);
                const d = event.target.getDuration();
                if (d > 0) setProgress((initialTime / d) * 100);
                shouldPlayRef.current = true;
              }
              if (shouldPlayRef.current) {
                event.target.playVideo();
              }
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setStatus('playing');
                setShowIphoneSwitchOverlay(false);
                if (!playFiredRef.current) {
                  playFiredRef.current = true;
                  onPlayRef.current?.();
                }
              }
              if (event.data === window.YT.PlayerState.PAUSED) setStatus('paused');
              if (event.data === window.YT.PlayerState.ENDED) {
                setStatus('ended');
                setShowIphoneSwitchOverlay(false);
                onEndedRef.current?.();
              }
            },
          },
        });
      } else {
        setTimeout(initPlayer, 200);
      }
    };

    // Wait for DOM to be ready
    setTimeout(initPlayer, 150);

    return () => {
      isInitializedRef.current = false;
      if (playerRef.current?.destroy) {
        try { playerRef.current.destroy(); } catch (_) {}
        playerRef.current = null;
      }
    };
  }, [validId, elementId]);

  /* ── 3. Progress loop ── */
  useEffect(() => {
    let iv;
    if (status === 'playing' && playerRef.current) {
      iv = setInterval(() => {
        try {
          const p = playerRef.current;
          if (p && typeof p.getCurrentTime === 'function') {
            const c = p.getCurrentTime();
            const d = p.getDuration();
            setCurrentTime(c);
            setDuration(d);
            if (d > 0) setProgress((c / d) * 100);
          }
        } catch (_) {}
      }, 500);
    }
    return () => clearInterval(iv);
  }, [status]);

  /* ── handlers ── */
  const handleStartPlay = () => {
    if (!iphoneDevice) setShowSplash(true);
    setStatus('loading');
    shouldPlayRef.current = true;

    // Use the player instance
    const p = playerRef.current;
    if (p && typeof p.playVideo === 'function') {
      p.playVideo();
    }
  };

  // Hide splash once playing, or after timeout
  useEffect(() => {
    if (status === 'playing' && showSplash) {
      const t = setTimeout(() => setShowSplash(false), 3000);
      return () => clearTimeout(t);
    }
    if (status === 'loading') {
      const t = setTimeout(() => {
        setShowSplash(false);
      }, 6000);
      return () => clearTimeout(t);
    }
  }, [status, showSplash]);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p || typeof p.playVideo !== 'function') return;
    if (status === 'playing') {
      p.pauseVideo();
    } else {
      setShowActionOverlay(true);
      setTimeout(() => setShowActionOverlay(false), iphoneDevice ? 800 : 1000);
      p.playVideo();
    }
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (isMuted) { p.unMute(); setIsMuted(false); }
    else { p.mute(); setIsMuted(true); }
  };

  const handleProgressClick = (e) => {
    e.stopPropagation();
    const p = playerRef.current;
    if (!p || !progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const seekTo = (pct / 100) * duration;
    p.seekTo(seekTo, true);
    setProgress(pct);
    setCurrentTime(seekTo);
  };

  const handleProgressDrag = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const getClientX = (ev) => ev.touches ? ev.touches[0].clientX : ev.clientX;
    const onMove = (ev) => {
      const p = playerRef.current;
      if (!p || !progressBarRef.current || !duration) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((getClientX(ev) - rect.left) / rect.width) * 100));
      setProgress(pct);
      setCurrentTime((pct / 100) * duration);
    };
    const onUp = (ev) => {
      const p = playerRef.current;
      if (p && progressBarRef.current && duration) {
        const clientX = ev.changedTouches ? ev.changedTouches[0].clientX : ev.clientX;
        const rect = progressBarRef.current.getBoundingClientRect();
        const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        p.seekTo((pct / 100) * duration, true);
        setProgress(pct);
      }
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
  };

  const handleVolume = (e) => {
    const p = playerRef.current;
    if (!p) return;
    const v = parseInt(e.target.value);
    setVolume(v);
    p.setVolume(v);
    setIsMuted(v === 0);
  };

  const cycleSpeed = () => {
    const p = playerRef.current;
    if (!p) return;
    const next = SPEEDS[(SPEEDS.indexOf(playbackSpeed) + 1) % SPEEDS.length];
    setPlaybackSpeed(next);
    p.setPlaybackRate(next);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current || iphoneDevice) return;
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
    } else {
      (containerRef.current.requestFullscreen || containerRef.current.webkitRequestFullscreen)?.call(containerRef.current);
    }
  };

  const poster = thumbnail || (validId ? `https://img.youtube.com/vi/${validId}/maxresdefault.jpg` : null);
  const showIdleOverlay = status === 'idle' || showIphoneSwitchOverlay;

  if (!validId) {
    return (
      <div className="medx-player medx-player--error">
        <span className="material-symbols-outlined" style={{ fontSize: '3rem' }}>error</span>
        <span style={{ marginTop: '0.5rem' }}>INVALID VIDEO ID</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="medx-player"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* ── SPLASH ── */}
      {showSplash && (
        <div className="medx-player__splash">
          <div className="medx-player__splash-spinner"></div>
          <span className="medx-player__splash-text">LOADING VIDEO...</span>
          <div className="medx-player__branding-tag medx-player__branding-tag--top">MEDX PLAYER</div>
        </div>
      )}

      {/* ── YOUTUBE IFRAME — always mounted ── */}
      <div className="medx-player__iframe-wrap">
        <div
          id={elementId}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transform: 'scale(1.01)',
            transformOrigin: 'center',
          }}
        />
      </div>

      {/* ── INTERACTION SHIELD ── */}
      {status !== 'idle' && !showIphoneSwitchOverlay && (
        <div className="medx-player__shield" onClick={() => {
          togglePlay();
          // Show controls briefly on tap (mobile)
          setControlsVisible(true);
          clearTimeout(controlsTimerRef.current);
          controlsTimerRef.current = setTimeout(() => setControlsVisible(false), 4000);
        }}>
          <div
            className="medx-player__gradient medx-player__gradient--top"
            style={{ opacity: isHovering || controlsVisible || status === 'paused' ? 1 : 0 }}
          />
          <div
            className="medx-player__gradient medx-player__gradient--bottom"
            style={{ opacity: isHovering || controlsVisible || status === 'paused' ? 1 : 0 }}
          />
        </div>
      )}

      {/* ── ACTION OVERLAY ── */}
      {showActionOverlay && (
        <div className="medx-player__action-overlay">
          <div className="medx-player__action-pulse"></div>
        </div>
      )}

      {/* ── IDLE OVERLAY (poster + play) ── */}
      {showIdleOverlay && (
        <div className="medx-player__idle" onClick={handleStartPlay}>
          {poster && (
            <div
              className="medx-player__poster"
              style={{ backgroundImage: `url(${poster})` }}
            />
          )}
          <div className="medx-player__idle-gradient" />
          <div className="medx-player__big-play">
            <div className="medx-player__big-play-outer">
              <div className="medx-player__big-play-inner">
                <span className="material-symbols-outlined filled" style={{ fontSize: '3rem', marginLeft: '4px', color: 'white' }}>
                  play_arrow
                </span>
              </div>
            </div>
            <span className="medx-player__big-play-label">PLAY VIDEO</span>
          </div>
          <div className="medx-player__branding-tag medx-player__branding-tag--top">MEDX PLAYER</div>
        </div>
      )}

      {/* ── LOADING SPINNER ── */}
      {status === 'loading' && !showSplash && !showIphoneSwitchOverlay && (
        <div className="medx-player__loading">
          <div className="medx-player__splash-spinner"></div>
        </div>
      )}

      {/* ── CUSTOM CONTROLS ── */}
      {(status === 'playing' || status === 'paused') && (
        <div
          className="medx-player__controls"
          style={{ opacity: isHovering || controlsVisible || status === 'paused' ? 1 : 0 }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Custom progress bar */}
          <div
            ref={progressBarRef}
            className="medx-player__progress-bar"
            onClick={handleProgressClick}
            onMouseDown={handleProgressDrag}
            onTouchStart={handleProgressDrag}
          >
            <div className="medx-player__progress-track">
              <div
                className="medx-player__progress-fill"
                style={{ width: `${progress || 0}%` }}
              />
            </div>
            <div
              className="medx-player__progress-thumb"
              style={{ left: `${progress || 0}%` }}
            />
          </div>
          <div className="medx-player__controls-row">
            <div className="medx-player__controls-left">
              <button className="medx-player__ctrl-btn" onClick={togglePlay}>
                <span className="material-symbols-outlined filled" style={{ fontSize: '24px' }}>
                  {status === 'playing' ? 'pause' : 'play_arrow'}
                </span>
              </button>
              <span className="medx-player__time">
                {fmt(currentTime)} / {fmt(duration)}
              </span>
            </div>
            <div className="medx-player__controls-right">
              <div className="medx-player__volume-group">
                <button className="medx-player__ctrl-btn" onClick={toggleMute}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {isMuted || volume === 0 ? 'volume_off' : 'volume_up'}
                  </span>
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolume}
                  className="medx-player__volume-slider"
                />
              </div>
              <button className="medx-player__speed-btn" onClick={cycleSpeed} title="Playback Speed">
                {playbackSpeed}x
              </button>
              {!iphoneDevice && (
                <button className="medx-player__ctrl-btn" onClick={toggleFullscreen}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>fullscreen</span>
                </button>
              )}
              <div className="medx-player__branding-inline">MEDX</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(CustomPlayer);
