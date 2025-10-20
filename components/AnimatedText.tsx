import React from 'react';

const AnimatedText: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full px-4">
      <div className="gradient-text-container">
        <h1
          className="gradient-text"
          data-text="AI Layanan Informasi"
          style={{
            fontSize: 'clamp(28px, 7vw, 64px)',
            textAlign: 'center',
            margin: 0,
            lineHeight: '1.3'
          }}
        >
          AI Layanan Informasi
        </h1>
        <h1
          className="gradient-text"
          data-text="MPP Pandeglang"
          style={{
            fontSize: 'clamp(28px, 7vw, 64px)',
            textAlign: 'center',
            margin: 0,
            lineHeight: '1.3'
          }}
        >
          MPP Pandeglang
        </h1>
      </div>
    </div>
  );
};

export default AnimatedText;
