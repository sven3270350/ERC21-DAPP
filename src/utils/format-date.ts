export function formatDate(timestamp: string): string {
    const date = new Date(timestamp);
  
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short'
    };
  
    // Extract the formatted date parts
    const formattedDateParts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
  
    // Extract the needed parts
    const month = formattedDateParts.find(part => part.type === 'month')?.value;
    const day = formattedDateParts.find(part => part.type === 'day')?.value;
    const hour = formattedDateParts.find(part => part.type === 'hour')?.value;
    const minute = formattedDateParts.find(part => part.type === 'minute')?.value;
    const timeZoneName = formattedDateParts.find(part => part.type === 'timeZoneName')?.value;
  
    // Construct the final formatted date string
    return `${month} ${day}, ${hour}:${minute} ${timeZoneName}`;
  }
  