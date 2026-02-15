"use client";

import { useEffect, useState } from "react";
import { getPrayerTimes, formatTime12Hour } from "@/utils/prayerTimes";

const DistrictModal = ({ data, onClose }) => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data && data.coordinates) {
      setLoading(true);
      getPrayerTimes(data.coordinates.lat, data.coordinates.lng)
        .then((times) => {
          setPrayerTimes(times);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [data]);

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in duration-200">
        {/* modal header */}
        <div className="bg-linear-to-r from-teal-600 to-teal-700 p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{data.name} জেলা</h2>
              <p className="text-sm text-teal-100">{data.division} বিভাগ</p>
            </div>
            {/* close button */}
            <button
              onClick={onClose}
              className="text-3xl font-bold leading-none hover:text-gray-200 transition-colors"
            >
              &times;
            </button>
          </div>
        </div>

        {/* content body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-5">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
          ) : prayerTimes ? (
            <>
              {/* Date Display */}
              <div className="text-center bg-teal-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">আজকের তারিখ</p>
                <p className="font-semibold text-teal-900">{prayerTimes.date}</p>
                <p className="text-xs text-gray-500 mt-1">{prayerTimes.hijri} হিজরি</p>
              </div>

              {/* Suhur and Iftar - Highlighted */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-linear-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl shadow-lg">
                  <div className="text-center">
                    <p className="text-sm opacity-90 mb-1">সেহরির শেষ সময়</p>
                    <p className="text-3xl font-bold">{formatTime12Hour(prayerTimes.suhur)}</p>
                    <p className="text-xs mt-1 opacity-75">ফজরের আগে</p>
                  </div>
                </div>
                <div className="bg-linear-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg">
                  <div className="text-center">
                    <p className="text-sm opacity-90 mb-1">ইফতারের সময়</p>
                    <p className="text-3xl font-bold">{formatTime12Hour(prayerTimes.iftar)}</p>
                    <p className="text-xs mt-1 opacity-75">মাগরিব</p>
                  </div>
                </div>
              </div>

              {/* All Prayer Times */}
              <div>
                <h3 className="font-bold text-teal-800 mb-3 text-lg border-b pb-2">
                  আজকের নামাজের সময়সূচি
                </h3>
                <div className="space-y-2">
                  <PrayerTimeRow
                    name="ফজর"
                    time={formatTime12Hour(prayerTimes.fajr)}
                    icon="🌅"
                  />
                  <PrayerTimeRow
                    name="সূর্যোদয়"
                    time={formatTime12Hour(prayerTimes.sunrise)}
                    icon="☀️"
                    isSpecial={false}
                  />
                  <PrayerTimeRow
                    name="যোহর"
                    time={formatTime12Hour(prayerTimes.dhuhr)}
                    icon="🌤️"
                  />
                  <PrayerTimeRow
                    name="আসর"
                    time={formatTime12Hour(prayerTimes.asr)}
                    icon="🌥️"
                  />
                  <PrayerTimeRow
                    name="মাগরিব"
                    time={formatTime12Hour(prayerTimes.maghrib)}
                    icon="🌆"
                  />
                  <PrayerTimeRow
                    name="ইশা"
                    time={formatTime12Hour(prayerTimes.isha)}
                    icon="🌙"
                  />
                </div>
              </div>

              {/* District Info */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-bold text-teal-700 mb-2">জেলা সম্পর্কে</h3>
                <p className="text-sm text-gray-700 mb-2">{data.info}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <p><strong>বিখ্যাত:</strong> {data.famous_for}</p>
                  <p><strong>আয়তন:</strong> {data.area}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>নামাজের সময় লোড করতে সমস্যা হয়েছে</p>
              <p className="text-sm mt-2">দয়া করে পরে আবার চেষ্টা করুন</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 text-right">
          <button
            onClick={onClose}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-all hover:shadow-md"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

// Prayer Time Row Component
const PrayerTimeRow = ({ name, time, icon, isSpecial = true }) => (
  <div className={`flex justify-between items-center p-3 rounded-lg ${isSpecial ? 'bg-teal-50 border border-teal-100' : 'bg-gray-50'
    }`}>
    <div className="flex items-center gap-2">
      <span className="text-xl">{icon}</span>
      <span className="font-semibold text-gray-700">{name}</span>
    </div>
    <span className="text-lg font-bold text-teal-700">{time}</span>
  </div>
);

export default DistrictModal;
