'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endTime: number; // Unix timestamp in seconds
  onEnd?: () => void;
}

export default function CountdownTimer({ endTime, onEnd }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const difference = endTime - now;

      if (difference <= 0) {
        setIsEnded(true);
        if (onEnd) onEnd();
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      const days = Math.floor(difference / (24 * 60 * 60));
      const hours = Math.floor((difference % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((difference % (60 * 60)) / 60);
      const seconds = difference % 60;

      return { days, hours, minutes, seconds };
    };

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
    }, 1000);

    // 初始计算
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [endTime, onEnd]);

  if (isEnded) {
    return (
      <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
        <span className="text-red-600 font-semibold">拍卖已结束</span>
      </div>
    );
  }

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 1;

  return (
    <div className={`text-center p-4 rounded-lg border ${
      isUrgent 
        ? 'bg-red-50 border-red-200' 
        : 'bg-blue-50 border-blue-200'
    }`}>
      <h3 className={`text-sm font-medium mb-2 ${
        isUrgent ? 'text-red-600' : 'text-blue-600'
      }`}>
        {isUrgent ? '即将结束' : '剩余时间'}
      </h3>
      
      <div className="flex justify-center space-x-4">
        {timeLeft.days > 0 && (
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              isUrgent ? 'text-red-600' : 'text-blue-600'
            }`}>
              {timeLeft.days.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-500">天</div>
          </div>
        )}
        
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            isUrgent ? 'text-red-600' : 'text-blue-600'
          }`}>
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500">时</div>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            isUrgent ? 'text-red-600' : 'text-blue-600'
          }`}>
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500">分</div>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            isUrgent ? 'text-red-600' : 'text-blue-600'
          }`}>
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500">秒</div>
        </div>
      </div>
      
      {isUrgent && (
        <div className="mt-2 text-xs text-red-500">
          最后机会！拍卖即将结束
        </div>
      )}
    </div>
  );
} 