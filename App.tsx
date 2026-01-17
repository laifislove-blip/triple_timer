
import React, { useState } from 'react';
import { Timer } from './components/Timer';
import { THEMES } from './constants';

const App: React.FC = () => {
  // 소리 토글 UI는 요청에 따라 삭제되었으며, 기본값은 소리 켬(isMuted = false) 상태입니다.
  const [isMuted] = useState(false);

  return (
    <div className="flex flex-col items-center justify-start p-2">
      <div className="w-full max-w-md bg-transparent">
        <main className="flex flex-col gap-3">
          {/* 25분 집중 타이머 (Blue) */}
          <Timer 
            initialMinutes={25} 
            theme={THEMES.focus} 
            isMuted={isMuted}
          />
          {/* 10분 휴식 타이머 (Green) */}
          <Timer 
            initialMinutes={10} 
            theme={THEMES.shortBreak} 
            isMuted={isMuted}
          />
          {/* 15분 휴식 타이머 (Yellow) */}
          <Timer 
            initialMinutes={15} 
            theme={THEMES.longBreak} 
            isMuted={isMuted}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
