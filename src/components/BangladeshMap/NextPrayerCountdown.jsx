import { useState, useEffect } from "react";

export default function NextPrayerCountdown({ prayerTimes }) {
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const prayerOrder = [
    { key: "fajr", name: "ফজর" },
    { key: "sunrise", name: "সূর্যোদয়" },
    { key: "dhuhr", name: "যোহর" },
    { key: "asrStandard", name: "আসর" },
    { key: "maghrib", name: "মাগরিব" },
    { key: "isha", name: "ইশা" },
  ];

  // Function to parse time string to Date object
  const parseTimeToDate = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0,
    );
  };

  // Find the next prayer
  const findNextPrayer = () => {
    const now = new Date();

    for (let prayer of prayerOrder) {
      const prayerTime = parseTimeToDate(prayerTimes[prayer.key]);

      // If prayer time is in the future
      if (prayerTime > now) {
        return {
          name: prayer.name,
          time: prayerTime,
        };
      }
    }

    // If no future prayers today, return first prayer of tomorrow
    const firstPrayer = prayerOrder[0];
    const firstPrayerTime = parseTimeToDate(prayerTimes[firstPrayer.key]);
    const tomorrow = new Date(firstPrayerTime);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      name: firstPrayer.name,
      time: tomorrow,
    };
  };

  // Calculate time remaining
  const calculateTimeRemaining = (targetTime) => {
    const now = new Date();
    const diff = targetTime - now;

    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
      total: diff,
    };
  };

  useEffect(() => {
    if (!prayerTimes) return;

    // Initial calculation
    const updateCountdown = () => {
      const next = findNextPrayer();
      setNextPrayer(next);

      const remaining = calculateTimeRemaining(next.time);
      setTimeRemaining(remaining);
    };

    updateCountdown();

    // Update every second
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [prayerTimes]);

  if (!prayerTimes || !nextPrayer || !timeRemaining) {
    return (
      <div>
        <p>লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 flex gap-2 items-center">
        <p className="h-2.5 w-2.5 bg-purple-400 rounded-full animate-pulse"></p>
        পরবর্তী নামাজ: <span className="">{nextPrayer.name} </span>
      </p>
      <h3
        className={`text-3xl font-bold tracking-wide text-end ${
          timeRemaining && timeRemaining.total < 30 * 60 * 1000
            ? "text-red-500"
            : "text-teal-900"
        }`}
      >
        {timeRemaining.hours}:{timeRemaining.minutes}:{timeRemaining.seconds}
      </h3>
    </div>
  );
}
