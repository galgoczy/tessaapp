import React from 'react';

/**
 * WaveAnimation Component
 *
 * SVG-based animated wave visualization for voice interaction.
 * Renders 3 overlapping wave paths with different colors.
 */
const WaveAnimation = ({
  phase = 0,
  isActive = false,
  colors = ['#fb923c', '#f472b6', '#a78bfa'],
  width = 240,
  height = 50,
}) => {
  // Generate wave path
  const generateWavePath = (waveIndex) => {
    const points = 40;
    const amplitude = isActive ? 18 : 6;
    const dampening = 1 - waveIndex * 0.25;

    return Array.from({ length: points }, (_, j) => {
      const x = (j / (points - 1)) * width;
      const y = height / 2 + Math.sin(
        (j / (points - 1)) * Math.PI * 3 + phase + waveIndex * 0.8
      ) * amplitude * dampening;

      return `${j === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <svg
      width={width}
      height={height}
      style={{ marginBottom: 24 }}
    >
      {[0, 1, 2].map(i => (
        <path
          key={i}
          d={generateWavePath(i)}
          fill="none"
          stroke={colors[i]}
          strokeWidth={2.5 - i * 0.5}
          opacity={0.8 - i * 0.2}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
};

export default WaveAnimation;
