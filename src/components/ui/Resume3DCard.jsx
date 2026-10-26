import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Resume3DCard.module.css';
import resumePdf from '../../data/Shiva Sanjay N D Resume.pdf';
import { getQualityConfig } from '../../utils/quality';

export const Resume3DCard = () => {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rectRef = useRef(null);
  const rafRef = useRef(0);
  const tgtRef = useRef({ x: 0, y: 0 });

  // Resume viewer interactive tool state ('select' | 'hand'), zoom level, and pan drag tracking
  const [viewMode, setViewMode] = useState('select');
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleZoomIn = () => setZoomLevel((z) => Math.min(Number((z + 0.25).toFixed(2)), 3.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(Number((z - 0.25).toFixed(2)), 0.5));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleWheelZoom = (e) => {
    e.stopPropagation();
    if (e.deltaY < 0) {
      setZoomLevel((z) => Math.min(Number((z + 0.15).toFixed(2)), 3.5));
    } else if (e.deltaY > 0) {
      setZoomLevel((z) => Math.max(Number((z - 0.15).toFixed(2)), 0.5));
    }
  };


  // Keyboard zoom controls operable during both Hand and Select tools
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        handleZoomIn();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        handleResetZoom();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  useEffect(() => {
    const handleWindowMove = (e) => {
      if (!isDragging) return;
      setPanOffset({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y
      });
    };
    const handleWindowUp = () => {
      setIsDragging(false);
    };
    if (isDragging) {
      window.addEventListener('mousemove', handleWindowMove);
      window.addEventListener('mouseup', handleWindowUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleWindowMove);
      window.removeEventListener('mouseup', handleWindowUp);
    };
  }, [isDragging]);

  const handleDragStart = (e) => {
    if (viewMode !== 'hand') return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  // Dynamically load PDF.js to render the resume as a canvas texture (Phase 02: scale 1.5 + bitmap conversion + cleanup)
  useEffect(() => {
    let isCancelled = false;

    const renderPdfCanvas = async () => {
      try {
        if (!window.pdfjsLib) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        if (isCancelled || !window.pdfjsLib) return;

        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const loadingTask = window.pdfjsLib.getDocument(resumePdf);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        if (isCancelled) {
          pdf.destroy();
          return;
        }

        // Render PDF page once at scale 1.5 (cap by Math.min(devicePixelRatio, 2))
        const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
        const scale = Math.min(dpr, 1.5);
        const viewport = page.getViewport({ scale });

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = viewport.width;
        tempCanvas.height = viewport.height;
        const tempContext = tempCanvas.getContext('2d');

        await page.render({
          canvasContext: tempContext,
          viewport: viewport,
        }).promise;

        if (isCancelled) {
          tempCanvas.width = 0;
          tempCanvas.height = 0;
          pdf.destroy();
          return;
        }

        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const context = canvas.getContext('2d');
          if (window.createImageBitmap) {
            const bitmap = await createImageBitmap(tempCanvas);
            context.drawImage(bitmap, 0, 0);
            bitmap.close();
          } else {
            context.drawImage(tempCanvas, 0, 0);
          }
        }

        tempCanvas.width = 0;
        tempCanvas.height = 0;
        pdf.destroy();

        if (!isCancelled) {
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Failed to render HD resume canvas texture:', error);
      }
    };

    renderPdfCanvas();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Window resize to update cached rect
  useEffect(() => {
    const handleResize = () => {
      if (cardRef.current && rectRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect();
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // RAF callback writing style.transform and CSS variables for glare directly
  const applyTilt = () => {
    rafRef.current = 0;
    const { x, y } = tgtRef.current;
    if (cardRef.current) {
      const rotX = (-y * 13).toFixed(2);
      const rotY = (x * 13).toFixed(2);
      cardRef.current.style.transform = `perspective(2000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03, 1.03, 1.03)`;
    }
    if (glareRef.current) {
      glareRef.current.style.setProperty('--gx', `${(x * 50 + 50).toFixed(1)}%`);
      glareRef.current.style.setProperty('--gy', `${(y * 50 + 50).toFixed(1)}%`);
    }
  };

  const handlePointerEnter = (e) => {
    if (e.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !getQualityConfig().tilt) {
      return;
    }
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
      cardRef.current.style.willChange = 'transform';
      cardRef.current.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
    }
    if (glareRef.current) {
      glareRef.current.style.setProperty('--glare-opacity', '0.25');
    }
  };

  const handlePointerMove = (e) => {
    if (e.pointerType === 'touch' || !rectRef.current) return;
    const r = rectRef.current;
    tgtRef.current = {
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
    };
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(applyTilt);
    }
  };

  const handlePointerLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    rectRef.current = null;
    if (cardRef.current) {
      cardRef.current.style.willChange = 'auto';
      cardRef.current.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s ease, border-color 0.4s ease';
      cardRef.current.style.transform = 'perspective(2000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
    if (glareRef.current) {
      glareRef.current.style.setProperty('--glare-opacity', '0');
    }
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = (e) => {
    if (e) e.stopPropagation();
    setIsModalOpen(false);
  };

  // Keyboard Escape listener to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const modalMarkup = isModalOpen && typeof document !== 'undefined' ? (
    <div 
      className={styles.modalBackdrop} 
      onClick={closeModal}
      role="dialog" 
      aria-modal="true"
    >
      <div 
        className={styles.modalContainer} 
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheelZoom}
      >
        {/* Top Control Toolbar */}
        <div className={styles.modalToolbar}>
          <div className={styles.docInfo}>
            <span className={styles.pdfIconBadge}>PDF</span>
            <span className={styles.docTitle}>Shiva Sanjay N D Resume.pdf</span>
          </div>
          
          <div className={styles.toolbarActions}>
            {/* Tool Selection Toggle (Hand Pan vs Select Text/Links) */}
            <div className={styles.toolToggleGroup}>
              <button
                type="button"
                className={`${styles.toolBtn} ${viewMode === 'hand' ? styles.toolBtnActive : ''}`}
                onClick={() => setViewMode('hand')}
                title="Hand Tool: Click and drag to reposition and pan resume"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
                  <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
                  <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
                  <path d="M18 11a4 4 0 0 1 4 4v2a6 6 0 0 1-6 6h-2.2a6 6 0 0 1-4.2-1.7l-4.2-4.2a1 1 0 0 1 0-1.4l1.3-1.3a1 1 0 0 1 1.4 0L10 15.5V9a2 2 0 0 1 2-2v0a2 2 0 0 1 2 2"></path>
                </svg>
                <span>Hand</span>
              </button>
              
              <button
                type="button"
                className={`${styles.toolBtn} ${viewMode === 'select' ? styles.toolBtnActive : ''}`}
                onClick={() => setViewMode('select')}
                title="Select Tool: Highlight text and click interactive hyperlinks"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
                  <path d="M13 13l6 6"></path>
                </svg>
                <span>Select</span>
              </button>
            </div>

            {/* Zoom Controls usable in BOTH Hand Tool and Select Tool */}
            <div className={styles.zoomControlsGroup}>
              <button
                type="button"
                className={styles.zoomBtn}
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                title="Zoom Out (Ctrl -)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <button
                type="button"
                className={styles.zoomPercentageBtn}
                onClick={handleResetZoom}
                title="Reset Zoom and Position (Ctrl 0)"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                type="button"
                className={styles.zoomBtn}
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3.5}
                title="Zoom In (Ctrl +)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>

            <a 
              href={resumePdf} 
              target="_blank" 
              rel="noopener noreferrer"
              download="Shiva_Sanjay_Resume.pdf"
              className={styles.downloadBtn}
              title="Download official resume PDF"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download PDF</span>
            </a>
            
            <button 
              type="button"
              onClick={closeModal}
              className={styles.closeBtn}
              title="Close Viewer (ESC)"
            >
              <span>✕ Close</span>
            </button>
          </div>
        </div>

        {/* High-Resolution Embedded PDF Viewer in Modal */}
        <div className={styles.iframeContainer} onWheel={handleWheelZoom}>
          {viewMode === 'hand' && (
            <div 
              className={`${styles.dragOverlay} ${isDragging ? styles.dragOverlayDragging : ''}`}
              onMouseDown={handleDragStart}
              onWheel={handleWheelZoom}
              title="Hand tool active: click and hold to pan resume"
            />
          )}
          <div 
            className={styles.iframeTransformWrapper}
            style={{ 
              transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoomLevel})`,
              transformOrigin: 'center center'
            }}
          >
            <iframe
              src={`${resumePdf}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
              className={styles.iframeViewer}
              title="Shiva Sanjay Resume Viewer"
              allow="fullscreen"
              frameBorder="0"
              style={{ border: '0px none', outline: '0px none' }}
            >
              <p style={{ color: '#fff', padding: '2rem', textAlign: 'center' }}>
                Your browser does not support embedded PDF rendering. 
                <a href={resumePdf} target="_blank" rel="noopener noreferrer" style={{ color: '#FF2E54', marginLeft: '0.5rem', textDecoration: 'underline' }}>
                  Click here to view or download the PDF directly.
                </a>
              </p>
            </iframe>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div 
        className={styles.cardWrapper} 
        onClick={handleCardClick}
        title="Click to open full-screen document reader"
      >
        <div
          ref={cardRef}
          className={styles.tiltCard}
          onPointerMove={handlePointerMove}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          {/* Realistic Specular Glare */}
          <div 
            ref={glareRef}
            className={styles.glare} 
          />

          {!isLoaded && (
            <div className={styles.loadingContainer}>
              <span>Rendering HD Document Texture...</span>
            </div>
          )}

          {/* Pure HD Quality Transparent Canvas Image - ZERO Chromium iframe grey borders or lines! */}
          <canvas
            ref={canvasRef}
            className={styles.liveCanvasPreview}
            style={{ display: isLoaded ? 'block' : 'none', background: 'transparent' }}
          />

          {/* Transparent protective shield ensures mouse hover tilt works smoothly and clicks trigger modal */}
          <div className={styles.previewClickOverlay} />
        </div>
      </div>

      {/* Render Modal via React Portal */}
      {typeof document !== 'undefined' && createPortal(modalMarkup, document.body)}
    </>
  );
};

export default Resume3DCard;
