import { useState } from "react";

// Weekdays short labels (Monday start)
const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

const today = new Date();

const MonthCard = ({ month, year, editable, onDayClick }) => {
  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    dayIdx: null,
    alignLeft: false,
  });

  const handleMouseEnter = (e, i) => {
    if (!editable) {
      const rect = e.currentTarget.getBoundingClientRect();
      const tooltipWidth = 220;
      const alignLeft = rect.right + tooltipWidth > window.innerWidth;
      setTooltip({
        show: true,
        x: alignLeft ? rect.left - tooltipWidth - 10 : rect.right + 10,
        y: rect.top,
        dayIdx: i,
        alignLeft,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, dayIdx: null, alignLeft: false });
  };

  // Helper: Is this index a weekend? (Sat=5, Sun=6 in Monday-start grid)
  const isWeekend = (idx) => idx % 7 === 5 || idx % 7 === 6;

  // Border highlight for current month
  const borderColor =
    month.month === today.getMonth() && year === today.getFullYear()
      ? "border-teal-400"
      : "border-slate-700";

  return (
    <div
      className={`relative rounded-lg p-1 bg-slate-900 shadow text-[11px] w-full max-w-[210px] min-w-[175px] transition border-2 ${borderColor}`}
    >
      <div className="font-semibold text-center text-[12px] mb-1 text-slate-100 tracking-wide">
        {month.name}
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-[5px] mb-[1px]">
        {WEEKDAYS.map((d, i) => (
          <div
            key={i}
            className={`text-center font-semibold text-[10px] py-[2px] 
              ${i >= 5 ? "text-pink-600" : "text-slate-400"}
            `}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {month.days.map((day, i) => {
          if (!day.day) return <div key={i}></div>;

          const weekend = isWeekend(i);
          const hasEvents = day.events.length > 0;

          // Highlight today
          const isToday =
            day.day === today.getDate() &&
            month.month === today.getMonth() &&
            year === today.getFullYear();

          // Dynamic style for TODAY
          let todayClass = "";
          if (isToday && hasEvents) {
            todayClass = "bg-orange-600 text-white";
          } else if (isToday) {
            todayClass = "bg-teal-600 text-white";
          }

          // Normal button styles
          const buttonClass = weekend
            ? hasEvents
              ? "bg-pink-600 text-white"
              : "bg-pink-900 text-rose-200 hover:bg-pink-600"
            : hasEvents
            ? "bg-blue-600 text-white"
            : "bg-slate-700 hover:bg-blue-500 hover:text-white text-slate-300";

          return (
            <div
              key={day.date}
              onMouseEnter={(e) => handleMouseEnter(e, i)}
              onMouseLeave={handleMouseLeave}
              className="relative"
            >
              <button
                className={`
          w-6 h-6 flex items-center justify-center rounded font-medium transition duration-100 text-xs
          border-slate-600
          ${todayClass || buttonClass}
          ${!editable && "cursor-default"}
        `}
                disabled={!editable}
                onClick={() => editable && onDayClick(i)}
                tabIndex={-1}
              >
                {day.day}
              </button>
            </div>
          );
        })}
      </div>

      {/* Tooltip (unchanged) */}
      {!editable &&
        tooltip.show &&
        month.days[tooltip.dayIdx] &&
        month.days[tooltip.dayIdx].events.length > 0 && (
          <div
            className="fixed z-50 bg-slate-800 text-white text-xs rounded-md shadow-2xl max-w-[240px] w-fit whitespace-normal break-words pointer-events-none animate-fade-in"
            style={{
              top: tooltip.y,
              left: tooltip.x,
              transform: "translateY(-50%)",
            }}
          >
            {month.days[tooltip.dayIdx].events.map((event, idx) => (
              <div
                key={idx}
                className="mb-2 border-b border-slate-600 pb-1 mr-5 last:border-none last:mb-0"
              >
                <div className="font-semibold text-sm">{event.title}</div>
                {event.description && (
                  <div className="text-[11px] text-slate-300 mt-1 leading-snug">
                    {event.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default MonthCard;
