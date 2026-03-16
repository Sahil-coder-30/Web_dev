import React, { useState } from 'react';
import Loder from './Loder';
import EntryLoader from '../EntryLoader/EntryLoader';

const LoaderDemo = () => {
  const [showEntry, setShowEntry] = useState(true);

  const replayEntry = () => {
    setShowEntry(false);
    setTimeout(() => setShowEntry(true), 100);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0806',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#F0EBE3',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      padding: '2rem'
    }}>
      <h1 style={{ marginBottom: '4rem', fontSize: '2.5rem', fontStyle: 'italic', fontFamily: '"DM Serif Display", serif' }}>
        Jigyaza Loader Preview
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '6rem' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Entry Sequence Builder
        </h2>
        <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {showEntry && <EntryLoader onComplete={() => console.log('Entry Sequence Complete!')} />}
        </div>
        <button 
          onClick={replayEntry}
          style={{
            marginTop: '2rem',
            padding: '10px 20px',
            backgroundColor: '#C8621A',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: '600',
            letterSpacing: '1px'
          }}
        >
          Replay GSAP Entrance
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '4rem', alignItems: 'flex-end', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <Loder size={220} />
          <p style={{ color: '#4A4440', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>Default (220px)</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <Loder size={120} color="#facc15" />
          <p style={{ color: '#4A4440', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>Medium (120px)</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <Loder size={60} color="#3b82f6" />
          <p style={{ color: '#4A4440', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>Small (60px)</p>
        </div>
      </div>
      
      <p style={{ marginTop: '4rem', color: '#c7621a', cursor: 'pointer' }} onClick={() => window.history.back()}>
        ← Go Back
      </p>
    </div>
  );
};

export default LoaderDemo;
