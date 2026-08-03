import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Resume3DCard.module.css';
import resumePdf from '../../data/24BIR050 - Shiva Sanjay N D - Resume.pdf';

export const Resume3DCard = () => {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cardTransform, setCardTransform] = useState('perspective(2000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Dynamically load PDF.js to render the resume as a pure HD Canvas image texture,
  // completely bypassing browser iframes, Chromium grey background margins, and border artifacts.
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

        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // Ultra-HD Retina Scale (3.0x resolution) for crisp text and graphics clarity
        const scale = 3.0;
        const viewport = page.getViewport({ scale });
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
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

  // Real-time realistic 3D physical document tilt physics
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate natural rotation (max tilt: 13 degrees)
    const rotateY = ((x - centerX) / centerX) * 13;
    const rotateX = ((y - centerY) / centerY) * -13;

    setCardTransform(`perspective(2000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`);
    
    // Update specular reflection coordinates
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 0.25 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCardTransform('perspective(2000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePos({ x: 50, y: 50, opacity: 0 });
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
            <span className={styles.docTitle}>24BIR050 - Shiva Sanjay N D - Resume.pdf</span>
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
          style={{ 
            transform: cardTransform, 
            transition: isHovered ? 'box-shadow 0.3s ease, border-color 0.3s ease' : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s ease, border-color 0.4s ease' 
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Realistic Specular Glare */}
          <div 
            className={styles.glare} 
            style={{ 
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.05) 45%, transparent 75%)`,
              opacity: glarePos.opacity 
            }}
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
