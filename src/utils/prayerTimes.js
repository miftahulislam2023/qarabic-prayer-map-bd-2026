// Fetch prayer times from AlAdhan API
export async function getPrayerTimes(lat, lng) {
    try {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lng}&method=1`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 200 && data.data) {
            const timings = data.data.timings;

            // Return prayer times
            return {
                fajr: timings.Fajr,
                dhuhr: timings.Dhuhr,
                asr: timings.Asr,
                maghrib: timings.Maghrib,
                isha: timings.Isha,
                sunrise: timings.Sunrise,
                sunset: timings.Sunset,
                // Suhur is typically 10-15 minutes before Fajr
                suhur: calculateSuhur(timings.Fajr),
                // Iftar is at Maghrib time
                iftar: timings.Maghrib,
                date: data.data.date.readable,
                hijri: data.data.date.hijri.date
            };
        }

        return null;
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        return null;
    }
}

// Calculate Suhur time (10 minutes before Fajr)
function calculateSuhur(fajrTime) {
    const [hours, minutes] = fajrTime.split(':').map(Number);
    let suhurMinutes = minutes - 10;
    let suhurHours = hours;

    if (suhurMinutes < 0) {
        suhurMinutes += 60;
        suhurHours -= 1;
        if (suhurHours < 0) suhurHours += 24;
    }

    return `${String(suhurHours).padStart(2, '0')}:${String(suhurMinutes).padStart(2, '0')}`;
}

// Convert 24-hour format to 12-hour format with Bengali numerals
export function formatTime12Hour(time24) {
    if (!time24) return '';

    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;

    return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
}

// Bengal number conversion
export function toBengaliNumber(num) {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/\d/g, (digit) => bengaliDigits[digit]);
}
