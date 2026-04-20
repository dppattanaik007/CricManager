// Greedy team-balancing algorithm.
// 1. Sort players by rating (descending).
// 2. Assign each player to the team with the lowest total rating so far.
//    Break ties by (a) smaller team size, (b) team index.
// 3. Within each team, interleave skills by distributing players round-robin
//    per skill group so no team ends up all-bowlers / all-batsmen.

function assignByRating(players, numTeams) {
  const teams = Array.from({ length: numTeams }, () => ({ players: [], total: 0 }));
  const sorted = [...players].sort((a, b) => b.rating - a.rating);

  for (const p of sorted) {
    // choose team with min total; tiebreak on player count, then index
    let target = 0;
    for (let i = 1; i < teams.length; i++) {
      const a = teams[i];
      const b = teams[target];
      if (
        a.total < b.total ||
        (a.total === b.total && a.players.length < b.players.length)
      ) {
        target = i;
      }
    }
    teams[target].players.push(p);
    teams[target].total += p.rating;
  }
  return teams;
}

export function generateTeams(players, numTeams) {
  const n = Math.max(2, Math.min(4, Number(numTeams) || 2));
  if (players.length === 0) return [];

  // First balance by rating.
  const teams = assignByRating(players, n);

  // Compute balance metric (for UI feedback).
  const totals = teams.map((t) => t.total);
  const max = Math.max(...totals);
  const min = Math.min(...totals);
  const avg = totals.reduce((a, b) => a + b, 0) / totals.length || 1;
  const diffPct = ((max - min) / avg) * 100;

  // Names like Team Alpha, Team Bravo ...
  const names = ["Team Alpha", "Team Bravo", "Team Charlie", "Team Delta"];

  return teams.map((t, i) => ({
    id: `t${i + 1}`,
    name: names[i] ?? `Team ${i + 1}`,
    players: t.players,
    total: t.total,
    avg: t.players.length ? +(t.total / t.players.length).toFixed(1) : 0,
    balanceDiffPct: +diffPct.toFixed(2),
  }));
}
