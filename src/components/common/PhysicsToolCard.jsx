import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import * as SVGL from 'svgl-react';

const getIconComponent = (name) => {
  const map = {
    'Java': SVGL.Java,
    'JavaScript': SVGL.Javascript,
    'Python': SVGL.Python,
    'C': SVGL.C,
    'VS Code': SVGL.Vscode,
    'HTML5': SVGL.Html5,
    'CSS3': SVGL.Css,
    'React': SVGL.React,
    'Tailwind CSS': SVGL.Tailwindcss,
    'Bootstrap': SVGL.Bootstrap,
    'Node.js': SVGL.Nodejs,
    'Express.js': SVGL.Expressjs,
    'MongoDB': SVGL.Mongodb,
    'PostgreSQL': SVGL.Postgresql,
    'MySQL': SVGL.Mysql,
    'GitHub': SVGL.GithubLight,
    'Notion': SVGL.Notion,
    'Docker': SVGL.Docker,
    'Salesforce': SVGL.Salesforce
  };
  return map[name] || null;
};

// Represents a single floating icon
const FloatingNode = ({ tool, containerBounds, cursorRef, isHovered }) => {
  const nodeRef = useRef(null);
  const pos = useRef({ x: Math.random() * (containerBounds.width - 60), y: Math.random() * (containerBounds.height - 60) });
  const vel = useRef({ x: 0, y: 0 });
  const timeOffset = useRef(Math.random() * 100);
  
  const IconComponent = getIconComponent(tool);

  useAnimationFrame((time) => {
    if (!nodeRef.current) return;

    // 1. Idle Float (Sine wave drifting)
    const t = (time + timeOffset.current * 1000) * 0.001;
    let forceX = Math.cos(t * 0.5) * 0.2;
    let forceY = Math.sin(t * 0.6) * 0.2;

    // 2. Cursor Repulsion
    if (isHovered.current) {
      const cursorX = cursorRef.current.x;
      const cursorY = cursorRef.current.y;
      
      const dx = pos.current.x + 24 - cursorX; // 24 is center offset (48px size)
      const dy = pos.current.y + 24 - cursorY;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);
      
      const repelRadius = 150;
      if (dist < repelRadius && dist > 0.1) {
        // Linear falloff force
        const force = (repelRadius - dist) / repelRadius;
        const pushForce = force * 4.0; 
        
        forceX += (dx / dist) * pushForce;
        forceY += (dy / dist) * pushForce;
      }
    }

    // 3. Boundary Containment (Soft bounce)
    const padding = 10;
    const maxX = containerBounds.width - 48 - padding;
    const maxY = containerBounds.height - 48 - padding;

    if (pos.current.x < padding) forceX += (padding - pos.current.x) * 0.1;
    if (pos.current.x > maxX) forceX -= (pos.current.x - maxX) * 0.1;
    if (pos.current.y < padding) forceY += (padding - pos.current.y) * 0.1;
    if (pos.current.y > maxY) forceY -= (pos.current.y - maxY) * 0.1;

    // 4. Update Velocity and Position
    vel.current.x = (vel.current.x + forceX) * 0.92; // 0.92 is friction/damping
    vel.current.y = (vel.current.y + forceY) * 0.92;
    
    pos.current.x += vel.current.x;
    pos.current.y += vel.current.y;

    // Apply transform directly for performance
    nodeRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
  });

  return (
    <div 
      ref={nodeRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        color: '#fff'
      }}
    >
      {IconComponent ? (
        <IconComponent style={{ width: '28px', height: '28px' }} />
      ) : (
        <span style={{ fontSize: '10px', color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
          {tool.substring(0, 5)}
        </span>
      )}
    </div>
  );
};

export const PhysicsToolCard = ({ title, subtitle, tools }) => {
  const containerRef = useRef(null);
  const cursorRef = useRef({ x: -1000, y: -1000 });
  const isHovered = useRef(false);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setBounds({ width: rect.width, height: rect.height });
      
      const handleResize = () => {
        if (containerRef.current) {
          const newRect = containerRef.current.getBoundingClientRect();
          setBounds({ width: newRect.width, height: newRect.height });
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    cursorRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <div 
      style={{
        background: '#0d0d0f',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '240px',
        position: 'relative'
      }}
    >
      {/* Top Physics Canvas Area */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => (isHovered.current = true)}
        onMouseLeave={() => (isHovered.current = false)}
        style={{
          flex: 1,
          position: 'relative',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          overflow: 'hidden'
        }}
      >
        {bounds.width > 0 && tools.map((tool, idx) => (
          <FloatingNode 
            key={idx} 
            tool={tool} 
            containerBounds={bounds} 
            cursorRef={cursorRef} 
            isHovered={isHovered} 
          />
        ))}
      </div>

      {/* Footer Title Area */}
      <div 
        style={{
          background: '#000000',
          padding: '20px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          zIndex: 10
        }}
      >
        <h3 style={{ margin: 0, color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>{title}</h3>
        {subtitle && (
          <p style={{ margin: '6px 0 0', color: '#999', fontSize: '13px', lineHeight: '1.4' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PhysicsToolCard;
