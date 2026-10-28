import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { hrApi } from '../services/api';

const ConnectionStatus = () => {
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await hrApi.getDashboardStats();
        setIsConnected(response.success);
      } catch {
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (isConnected === null) return null;

  return (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
      <span className="status-dot"></span>
      <span>{isConnected ? t('connection.connected') : t('connection.disconnected')}</span>
    </div>
  );
};

export default ConnectionStatus;
