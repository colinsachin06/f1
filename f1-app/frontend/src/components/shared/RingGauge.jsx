import React, { useEffect, useRef } from 'react';

function RingGauge({ score = 0, size = 120, color }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size - 16) / 2;
    const lineWidth = 8;

    let startTime = null;
    const duration = 1000;

    const getColor = (s) => {
      if (s >= 80) return '#39FF14';
      if (s >= 60) return '#FFD700';
      if (s >= 40) return '#FF8000';
      return '#E8002D';
    };

    const gaugeColor = color || getColor(score);

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentScore = score * easeProgress;

      ctx.clearRect(0, 0, size, size);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 2.25 * Math.PI);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      const endAngle = 0.75 * Math.PI + (currentScore / 100) * 1.5 * Math.PI;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, endAngle);
      ctx.strokeStyle = gaugeColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = `${size / 5}px Orbitron`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(Math.round(currentScore), centerX, centerY);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [score, size, color]);

  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size}
      style={{ display: 'block', margin: '0 auto' }}
    />
  );
}

export default RingGauge;
