import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/theme-context';

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());
  const { theme } = useTheme();
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const formattedTime = time.toLocaleTimeString();
  
  const formattedDate = time.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  const hourDegrees = (hours * 30) + (minutes * 0.5);
  const minuteDegrees = minutes * 6;
  const secondDegrees = seconds * 6;
  
  const isLightMode = theme.mode === 'light';
  const isSolid = theme.style === 'solid';
  
  return (
    <div className="flex flex-col items-center">
      <div className={`relative w-40 h-40 rounded-full ${isLightMode ? 'border-black/20' : 'border-white/20'} border mb-4`}>
        <div className="absolute inset-0 rounded-full flex items-center justify-center">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className={`absolute w-1 h-2 ${isLightMode ? 'bg-black/30' : 'bg-white/50'}`}
              style={{ 
                transform: `rotate(${i * 30}deg) translateY(-18px)`,
                transformOrigin: 'bottom center',
                top: '50%',
                left: 'calc(50% - 0.5px)'
              }}
            />
          ))}
          
          <div 
            className={`absolute w-1 h-12 rounded-full ${isLightMode ? 'bg-black/70' : 'bg-white/90'}`}
            style={{ 
              transform: `rotate(${hourDegrees}deg)`,
              transformOrigin: 'bottom center',
              bottom: '50%',
              left: 'calc(50% - 0.5px)'
            }}
          />
          
          <div 
            className={`absolute w-0.5 h-16 rounded-full ${isLightMode ? 'bg-black/60' : 'bg-white/80'}`}
            style={{ 
              transform: `rotate(${minuteDegrees}deg)`,
              transformOrigin: 'bottom center',
              bottom: '50%',
              left: 'calc(50% - 0.25px)'
            }}
          />
          
          <div 
            className="absolute w-0.5 h-16 bg-red-500 rounded-full"
            style={{ 
              transform: `rotate(${secondDegrees}deg)`,
              transformOrigin: 'bottom center',
              bottom: '50%',
              left: 'calc(50% - 0.25px)'
            }}
          />
          
          <div className={`absolute w-3 h-3 rounded-full ${isLightMode ? 'bg-black/80' : 'bg-white'}`} />
        </div>
      </div>
      
      <div className="text-xl font-bold widget-text mb-1">{formattedTime}</div>
      <div className="text-sm widget-text-muted">{formattedDate}</div>
    </div>
  );
};

export default ClockWidget;
