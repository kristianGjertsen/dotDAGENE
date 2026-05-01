import { useState } from 'react';
import type { color } from '../../../lib/colors';
import { LinkButton } from '../../../components/Elements/LinkButton';

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
const DEFAULT_EVENT_LOC = 'NTNU Realfagbygget, U1';
const DEFAULT_EVENT_DESC = 'Stands dotDAGENE velkommen!';
const DEFAULT_DTSTART_UTC = '20270309T090000Z';
const DEFAULT_DTEND_UTC = '20270309T140000Z';
const DEFAULT_SECOND_DAY_DTSTART_UTC = '20270310T090000Z';
const DEFAULT_SECOND_DAY_DTEND_UTC = '20270310T140000Z';
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
    title: `${eventTitle} - 9. mars`,
    details: eventDescription,
    location: eventLocation,
    dtstartUtc: eventStart,
    dtendUtc: eventEnd,
  });
  const secondDayGoogleCalendarUrl = makeGoogleCalendarUrl({
    title: `${eventTitle} - 10. mars`,
    details: eventDescription,
    location: eventLocation,
    dtstartUtc: DEFAULT_SECOND_DAY_DTSTART_UTC,
    dtendUtc: DEFAULT_SECOND_DAY_DTEND_UTC,
  });

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Main Button */}
      <div>
        <LinkButton link={googleCalendarUrl} size="md" color={color}>
          Legg til i kalender
        </LinkButton>
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
            Google Calendar 9. mars
          </a>
          <a
            href={secondDayGoogleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-6 py-3  border-1 text-left text-xl font-medium text-black transition-colors hover:bg-gray-200"
          >
            Google Calendar 10. mars
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
