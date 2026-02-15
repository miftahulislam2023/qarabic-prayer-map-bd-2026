// Fetch prayer times from AlAdhan API
export async function getPrayerTimes(lat, lng) {
    try {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        // Fetch Standard Asr (Shafi) - school=0
        const urlStandard = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lng}&method=1&school=0`;
        // Fetch Hanafi Asr - school=1
        const urlHanafi = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lng}&method=1&school=1`;

        const [responseStandard, responseHanafi] = await Promise.all([
            fetch(urlStandard),
            fetch(urlHanafi)
        ]);

        const dataStandard = await responseStandard.json();
        const dataHanafi = await responseHanafi.json();

        if (dataStandard.code === 200 && dataStandard.data && dataHanafi.code === 200 && dataHanafi.data) {
            const timingsStandard = dataStandard.data.timings;
            const timingsHanafi = dataHanafi.data.timings;

            // Add 1 minute to Maghrib time
            const maghribAdjusted = addMinutes(timingsStandard.Maghrib, 1);

            // Return prayer times
            return {
                fajr: timingsStandard.Fajr,
                dhuhr: timingsStandard.Dhuhr,
                asrStandard: timingsStandard.Asr,
                asrHanafi: timingsHanafi.Asr,
                maghrib: maghribAdjusted,
                isha: timingsStandard.Isha,
                sunrise: timingsStandard.Sunrise,
                sunset: timingsStandard.Sunset,
                // Suhur is typically 10-15 minutes before Fajr
                suhur: calculateSuhur(timingsStandard.Fajr),
                // Iftar is at adjusted Maghrib time
                iftar: maghribAdjusted,
                date: dataStandard.data.date.readable,
                hijri: dataStandard.data.date.hijri.date
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

// Add minutes to a time string
function addMinutes(timeString, minutesToAdd) {
    const [hours, minutes] = timeString.split(':').map(Number);
    let newMinutes = minutes + minutesToAdd;
    let newHours = hours;

    if (newMinutes >= 60) {
        newMinutes -= 60;
        newHours += 1;
        if (newHours >= 24) newHours -= 24;
    }

    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
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
