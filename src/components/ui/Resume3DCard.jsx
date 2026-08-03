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
      >
        {/* Top Control Toolbar */}
        <div className={styles.modalToolbar}>
          <div className={styles.docInfo}>
            <span className={styles.pdfIconBadge}>PDF</span>
            <span className={styles.docTitle}>24BIR050 - Shiva Sanjay N D - Resume.pdf</span>
          </div>
          
          <div className={styles.toolbarActions}>
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
        <div className={styles.iframeContainer}>
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
