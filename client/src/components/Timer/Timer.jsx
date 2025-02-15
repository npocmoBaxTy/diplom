import { useCallback, useEffect, useRef, useState } from "react";

const Timer2 = ({ min, onComplete }) => {
  const [countDownTime, setCountDownTIme] = useState({
    minutes: "00",
    seconds: "00",
  });
  const timerRef = useRef(null);

  const getTimeDifference = (countDownTime) => {
    const currentTime = new Date().getTime();
    const timeDifference = countDownTime - currentTime;

    const minutes =
      Math.floor((timeDifference % (60 * 60 * 1000)) / (1000 * 60)) >= 10
        ? Math.floor((timeDifference % (60 * 60 * 1000)) / (1000 * 60))
        : `0${Math.floor((timeDifference % (60 * 60 * 1000)) / (1000 * 60))}`;
    const seconds =
      Math.floor((timeDifference % (60 * 1000)) / 1000) >= 10
        ? Math.floor((timeDifference % (60 * 1000)) / 1000)
        : `0${Math.floor((timeDifference % (60 * 1000)) / 1000)}`;

    if (timeDifference < 0) {
      setCountDownTIme({
        minutes: "00",
        seconds: "00",
      });
      clearInterval(timerRef.current);
      if (onComplete) {
        onComplete(); // вызываем callback при окончании таймера
      }
    } else {
      setCountDownTIme({
        minutes: minutes,
        seconds: seconds,
      });
    }
  };

  const startCountDown = useCallback(() => {
    const customDate = new Date();
    // Устанавливаем таймер на количество минут, переданных через проп min
    const countDownDate = new Date(customDate.getTime() + min * 60 * 1000);

    timerRef.current = setInterval(() => {
      getTimeDifference(countDownDate.getTime());
    }, 1000);
  }, [min]);

  useEffect(() => {
    startCountDown();

    return () => {
      clearInterval(timerRef.current); // Очищаем интервал при размонтировании компонента
    };
  }, [startCountDown]);

  return (
    <div className="quiz__timer-wrapper fixed top-5 right-5 rounded-lg text-lg">
      <div className="quiz__timer-inner rounded-md flex justify-center flex-col h-full">
        <div className="quiz__timer-inner flex bg-[#112D32] justify-between sm:p-2 rounded">
          <div className="flex justify-center gap-1 text-white items-center">
            <span className=" font-semibold">{countDownTime?.minutes}:</span>
            <span className=" font-semibold">{countDownTime?.seconds}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer2;
