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

  const sortedDates = Array.from(activityDays).sort();
  let streak = 0;
  const cursor = new Date(sortedDates[sortedDates.length - 1]);
  cursor.setHours(0, 0, 0, 0);

  while (activityDays.has(formatDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function buildSvg(streak, username) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="200" viewBox="0 0 420 200">
  <defs>
    <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#4ac0e8"/>
      <stop offset="100%" stop-color="#30cf7c"/>
    </linearGradient>
  </defs>
  <rect width="420" height="200" rx="30" fill="url(#bg)"/>
  <circle cx="53" cy="40" r="20" fill="rgba(255,255,255,0.12)"/>
  <text x="37" y="50" font-size="28">🔥</text>
  <text x="370" y="70" text-anchor="end" font-size="56" font-weight="800" fill="#fff">${streak}</text>
  <text x="210" y="120" text-anchor="middle" font-size="26" font-weight="700" fill="#fff">Time to code, ${username}!</text>
  <rect x="148" y="142" width="124" height="32" rx="16" fill="rgba(15,23,42,0.16)"/>
  <text x="210" y="163" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" letter-spacing="1.5">DAILY STREAK</text>
</svg>`;
}

module.exports = async (req, res) => {
  try {
    const username = (req.query?.username || 'octocat').toString().trim();
    
    const githubRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=100`,
      { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'CodyLingo' } }
    );

    if (!githubRes.ok) throw new Error('GitHub API error');

    const events = await githubRes.json();
    const streak = computeStreak(events);
    const svg = buildSvg(streak, username);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.status(200).end(svg);
  } catch (err) {
    const username = (req.query?.username || 'octocat').toString().trim();
    const fallbackSvg = buildSvg(0, username);
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.status(200).end(fallbackSvg);
  }
};
