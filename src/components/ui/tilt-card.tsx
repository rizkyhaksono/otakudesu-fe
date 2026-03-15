"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxRotation?: number; // Maximum rotation angle (degrees)
  perspective?: number; // CSS perspective value
  scale?: number; // Scale factor on hover
  transitionSpeed?: number; // Transition speed in ms
}

export function TiltCard({
  children,
  className,
  maxRotation = 10,
  perspective = 1000,
  scale = 1.05,
  transitionSpeed = 400,
  ...props
}: Readonly<TiltCardProps>) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [isHovered, setIsHovered] = useState(false);

  // Use requestAnimationFrame for smooth performance
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate relative position (-1 to 1)
      const xRel = (x / rect.width - 0.5) * 2;
      const yRel = (y / rect.height - 0.5) * 2;

      // Calculate rotation based on cursor position
      // Reverse signs so the card tilts *towards* the mouse
      const rotateY = xRel * maxRotation;
      const rotateX = -yRel * maxRotation;

      requestAnimationFrame(() => {
        setStyle({
          transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
          transition: "transform 0.1s ease-out", // Snappy movement while hovering
          zIndex: 50,
        });
      });
    },
    [maxRotation, perspective, scale]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    requestAnimationFrame(() => {
      setStyle({
        transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        transition: `transform ${transitionSpeed}ms ease-out`, // Smooth return to normal
        zIndex: 1,
      });
    });
  };

  useEffect(() => {
    // Optional cleanup or global event listeners if needed
    return () => setStyle({});
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn("relative transition-all will-change-transform", className)}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Shine effect that moves with the mouse */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-50 mix-blend-overlay transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.15) 0%, transparent 60%)",
          }}
        />
      )}
      {children}
    </div>
  );
}
