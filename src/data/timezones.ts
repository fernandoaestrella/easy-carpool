import moment from 'moment-timezone';

export interface TimezoneOption {
  id: string;
  displayName: string;
  utcOffset: string;
}

/**
 * Gets all available timezones with formatted display names
 * Formats as: "America/New_York (UTC-5:00) Eastern Time"
 */
export const getTimezoneOptions = (): TimezoneOption[] => {
  const timezones = moment.tz.names();
  
  return timezones
    .filter((tz) => {
      // Filter out deprecated and uncommon timezones
      return !tz.includes('Etc/') && 
             !tz.includes('GMT') && 
             !tz.includes('UCT') && 
             !tz.includes('UTC') &&
             !tz.startsWith('US/') &&
             !tz.startsWith('Canada/') &&
             !tz.includes('posix') &&
             !tz.includes('right');
    })
    .map((timezoneId) => {
      const now = moment.tz(timezoneId);
      const utcOffset = now.format('Z');
      const zoneName = now.format('z');
      
      // Create readable display name
      const parts = timezoneId.split('/');
      const city = parts[parts.length - 1].replace(/_/g, ' ');
      const region = parts[0];
      
      return {
        id: timezoneId,
        displayName: `${city}, ${region} (UTC${utcOffset}) ${zoneName}`,
        utcOffset,
      };
    })
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
};

/**
 * Get popular timezones for quick selection
 */
export const getPopularTimezones = (): TimezoneOption[] => {
  const popularIds = [
    'America/New_York',
    'America/Chicago',
    'America/Denver', 
    'America/Los_Angeles',
    'America/Toronto',
    'America/Vancouver',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
  ];
  
  const allTimezones = getTimezoneOptions();
  return popularIds
    .map(id => allTimezones.find(tz => tz.id === id))
    .filter((tz): tz is TimezoneOption => tz !== undefined);
};
