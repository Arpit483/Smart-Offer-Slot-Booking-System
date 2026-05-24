import { useEffect, useState } from 'react';
import { Icon } from './Icon';

export function CountdownTimer({ targetDate }: { targetDate: string | Date }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft('Expired');
        setIsUrgent(true);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      setIsUrgent(days === 0 && hours < 24);

      if (days > 0) {
        setTimeLeft(`Ends in ${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`Ends in ${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`Ends in ${minutes}m`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // update every minute

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${isUrgent ? 'text-danger' : 'text-warning'}`}>
      <Icon name="schedule" size={14} />
      {timeLeft}
    </span>
  );
}

export default CountdownTimer;
