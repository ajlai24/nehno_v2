"use client";

import React, { useState } from "react";
import { useTrail, animated, UseTrailProps } from "@react-spring/web";
import { useInView } from "react-intersection-observer";

interface ScrollAnimatedProps {
  children: React.ReactNode;
  threshold?: number;
  trailProps?: UseTrailProps;
}

const ScrollAnimated = ({
  children,
  threshold = 0.5,
  trailProps,
}: ScrollAnimatedProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const trail = useTrail(1, {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(30px)",
    config: { tension: 80, friction: 30 },
    delay: 100,
    ...trailProps,
  });

  const { ref } = useInView({
    triggerOnce: true,
    threshold: threshold,
    onChange: (inView) => setIsVisible(inView),
  });

  return (
    <div ref={ref}>
      {trail.map((style, index) => (
        <animated.div key={index} style={style}>
          {children}
        </animated.div>
      ))}
    </div>
  );
};

export default ScrollAnimated;
