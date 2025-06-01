import React, { useState, useEffect } from 'react';

export const APIStatusIndicator = () => {
  const [status, setStatus] = useState({ 
    online: null, 
    rateLimitInfo: null,
    cacheStats: null,
    lastChecked: null 
  });

  useEffect(() => {
    checkAPIStatus();
    const interval = setInterval(checkAPIStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkAPIStatus = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
                         import.meta.env.PROD ? 
                         'https://pkmn-analyzer-backend.onrender.com' : 
                         'http://localhost:3001';

      const response = await fetch(`${BACKEND_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(prev => ({
          ...prev,
          online: true,
          lastChecked: new Date().toLocaleTimeString(),
          serverInfo: data
        }));

        // Get cache stats if available
        try {
          const cacheResponse = await fetch(`${BACKEND_URL}/api/cache-stats`);
          if (cacheResponse.ok) {
            const cacheData = await cacheResponse.json();
            setStatus(prev => ({
              ...prev,
              cacheStats: cacheData.data?.cache
            }));
          }
        } catch (error) {
          // Cache stats endpoint might not be available, ignore
        }
      } else {
        throw new Error('API not responding');
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        online: false,
        lastChecked: new Date().toLocaleTimeString(),
        error: error.message
      }));
    }
  };

  const getStatusColor = () => {
    if (status.online === null) return '#gray';
    return status.online ? '#10b981' : '#ef4444';
  };

  const getStatusText = () => {
    if (status.online === null) return 'Checking...';
    return status.online ? 'API Online' : 'API Offline';
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 1000,
      minWidth: '200px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '4px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: getStatusColor()
        }} />
        <span style={{ fontWeight: 'bold' }}>{getStatusText()}</span>
      </div>
      
      {status.lastChecked && (
        <div style={{ opacity: 0.7, fontSize: '10px' }}>
          Last checked: {status.lastChecked}
        </div>
      )}

      {status.cacheStats && (
        <div style={{ opacity: 0.7, fontSize: '10px', marginTop: '4px' }}>
          Cache: {status.cacheStats.active} active, {status.cacheStats.total} total
        </div>
      )}

      {status.serverInfo && (
        <div style={{ opacity: 0.7, fontSize: '10px', marginTop: '4px' }}>
          Uptime: {Math.floor(status.serverInfo.uptime / 60)}m
        </div>
      )}

      {!status.online && status.error && (
        <div style={{ 
          color: '#fca5a5', 
          fontSize: '10px', 
          marginTop: '4px',
          wordBreak: 'break-word'
        }}>
          Error: {status.error}
        </div>
      )}
    </div>
  );
};
