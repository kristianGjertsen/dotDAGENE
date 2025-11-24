import { useState } from 'react';
import { colorMap, type color } from '../../lib/colors';

interface CalendarButtonProps {
  color: color;
  eventTitle?: string;
  eventDescription?: string;
  eventLocation?: string;
  eventStart?: string;
  eventEnd?: string;
  icsUrl?: string;
}

// Eventinformasjon
const DEFAULT_EVENT_TITLE = 'dotDAGENE: Stands';
const DEFAULT_EVENT_LOC = 'NTNU Realfagsbygget, U1';
const DEFAULT_EVENT_DESC = 'Stands dotDAGENE velkommen!';
const DEFAULT_DTSTART_UTC = '20260303T090000Z';
const DEFAULT_DTEND_UTC = '20260303T140000Z';
const DEFAULT_ICS_URL = 'https://dotdagene.no/event.ics';

function makeGoogleCalendarUrl({
  title,
  details,
  location,
  dtstartUtc,
  dtendUtc,
}: {
  title: string;
  details?: string;
  location?: string;
  dtstartUtc: string;
  dtendUtc: string;
}) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details: details ?? '',
    location: location ?? '',
    dates: `${dtstartUtc}/${dtendUtc}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export const CalendarButton = ({
  color,
  eventTitle = DEFAULT_EVENT_TITLE,
  eventDescription = DEFAULT_EVENT_DESC,
  eventLocation = DEFAULT_EVENT_LOC,
  eventStart = DEFAULT_DTSTART_UTC,
  eventEnd = DEFAULT_DTEND_UTC,
  icsUrl = DEFAULT_ICS_URL,
}: CalendarButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const googleCalendarUrl = makeGoogleCalendarUrl({
    title: eventTitle,
    details: eventDescription,
    location: eventLocation,
    dtstartUtc: eventStart,
    dtendUtc: eventEnd,
  });

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Main Button */}
      <div>
        <button
          className="group relative inline-block cursor-pointer select-none focus:outline-none whitespace-nowrap"
        >
          {/* Bottom "shadow" chip */}
          <span aria-hidden="true" className="absolute inset-0 bg-black" />
          {/* Top actual button chip */}
          <span
            className={
              'relative block border-3 border-black px-6 py-3 text-center text-2xl font-medium text-white transition-transform duration-150 ' +
              'group-hover:translate-x-1 group-hover:translate-y-1 ' +
              colorMap.get(color)
            }
          >
            <span className="pointer-events-none">Legg til i kalender</span>
          </span>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-1/2 bottom-full min-w-[200px] -translate-x-1/2 border-2 border-black bg-white shadow-lg flex flex-col gap[3px]">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-6 py-3  border-1 text-left text-xl font-medium text-black transition-colors hover:bg-gray-200"
          >
            Google Calendar
          </a>
          <a
            href={icsUrl}
            download
            className="block w-full px-6 py-3 border-1 text-left text-xl font-medium text-black transition-colors hover:bg-gray-200"
          >
            Andre Kalendere
          </a>
        </div>
      )}
    </div>
  );
};
