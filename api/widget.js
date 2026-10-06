function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function computeStreak(events) {
  if (!Array.isArray(events) || events.length === 0) return 0;

  const activityDays = new Set();

  events.forEach((event) => {
    if (!event || !event.created_at) return;
    const date = new Date(event.created_at);
    date.setHours(0, 0, 0, 0);
    activityDays.add(formatDateKey(date));
  });

  if (activityDays.size === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Eğer bugün veya dün aktivite varsa seriyi başlat, yoksa güncel seri 0'dır
  let cursor = null;
  if (activityDays.has(formatDateKey(today))) {
    cursor = today;
  } else if (activityDays.has(formatDateKey(yesterday))) {
    cursor = yesterday;
  } else {
    return 0;
  }

  // Aktif günden geriye doğru kesintisiz günleri say
  while (activityDays.has(formatDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function buildTextLines(username) {
  const rawUsername = username || 'octocat';
  
  const safeUsername = String(rawUsername)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const rawText = `Time to code, ${rawUsername}!`;
  const maxCharsPerLine = 22;

  if (rawText.length <= maxCharsPerLine) {
    return { 
      lines: [`Time to code, ${safeUsername}!`], 
      fontSize: 27 
    };
  }

  const line1 = 'Time to code,';
  const line2 = `${safeUsername}!`;

  if (rawUsername.length <= 25) {
    return { 
      lines: [line1, line2], 
      fontSize: 24 
    };
  }

  return { 
    lines: [line1, line2], 
    fontSize: 20 
  };
}