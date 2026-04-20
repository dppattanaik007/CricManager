// Skill-aware team balancer.
// 1. Group players by skill, sort each group by rating descending.
// 2. Distribute groups in priority order (WK → Bowler → Batsman → All-Rounder)
//    assigning each next player to the team with the LOWEST total rating so
//    far, tiebroken by smallest team size. This guarantees each scarce skill
//    is spread across teams before we start filling with bulk roles.
// 3. Run a pairwise-swap refinement to minimise (max − min) total — but
//    only swap players of the SAME skill so the distribution stays intact.

const SKILL_PRIORITY = ["wk", "bowl", "bat", "allr"];

function pickLowestTotalTeam(teams) {
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
  return target;
}

function assignBySkill(players, numTeams) {
  const teams = Array.from({ length: numTeams }, () => ({
    players: [],
    total: 0,
  }));

  // Split players into skill buckets (preserving unknown skills under 'allr').
  const buckets = Object.fromEntries(SKILL_PRIORITY.map((s) => [s, []]));
  for (const p of players) {
    const key = buckets[p.skill] ? p.skill : "allr";
    buckets[key].push(p);
  }
  for (const s of SKILL_PRIORITY) {
    buckets[s].sort((a, b) => b.rating - a.rating);
  }

  // Distribute skill-by-skill.
  for (const skill of SKILL_PRIORITY) {
    for (const p of buckets[skill]) {
      const idx = pickLowestTotalTeam(teams);
      teams[idx].players.push(p);
      teams[idx].total += p.rating;
    }
  }
  return teams;
}

// Pairwise swap refinement, restricted to same-skill swaps so the skill
// distribution per team remains balanced.
function refineBySwap(teams, maxIters = 400) {
  for (let iter = 0; iter < maxIters; iter++) {
    const totals = teams.map((t) => t.total);
    const maxI = totals.indexOf(Math.max(...totals));
    const minI = totals.indexOf(Math.min(...totals));
    if (maxI === minI) return;
    const spread = totals[maxI] - totals[minI];
    if (spread === 0) return;

    let best = null;
    const A = teams[maxI].players;
    const B = teams[minI].players;
    for (let ai = 0; ai < A.length; ai++) {
      for (let bi = 0; bi < B.length; bi++) {
        if (A[ai].skill !== B[bi].skill) continue; // same-skill only
        const delta = A[ai].rating - B[bi].rating;
        if (delta <= 0) continue;
        const newA = totals[maxI] - delta;
        const newB = totals[minI] + delta;
        if (newA < newB) continue; // would flip max/min
        const newSpread = newA - newB;
        if (newSpread < spread && (!best || newSpread < best.newSpread)) {
          best = { ai, bi, newSpread, newA, newB };
        }
      }
    }
    if (!best) return;

    const pa = A[best.ai];
    const pb = B[best.bi];
    A[best.ai] = pb;
    B[best.bi] = pa;
    teams[maxI].total = best.newA;
    teams[minI].total = best.newB;
  }
}

// Count players of each skill in a team — handy for the UI pills.
function skillCounts(players) {
  const c = { wk: 0, bowl: 0, bat: 0, allr: 0 };
  for (const p of players) {
    if (c[p.skill] === undefined) c.allr += 1;
    else c[p.skill] += 1;
  }
  return c;
}

export function generateTeams(players, numTeams) {
  const n = Math.max(2, Math.min(4, Number(numTeams) || 2));
  if (players.length === 0) return [];

  const teams = assignBySkill(players, n);
  refineBySwap(teams);

  const totals = teams.map((t) => t.total);
  const max = Math.max(...totals);
  const min = Math.min(...totals);
  const avg = totals.reduce((a, b) => a + b, 0) / totals.length || 1;
  const diffPct = ((max - min) / avg) * 100;

  const names = ["Team Alpha", "Team Bravo", "Team Charlie", "Team Delta"];

  return teams.map((t, i) => ({
    id: `t${i + 1}`,
    name: names[i] ?? `Team ${i + 1}`,
    players: [...t.players].sort((a, b) => b.rating - a.rating),
    total: t.total,
    avg: t.players.length ? +(t.total / t.players.length).toFixed(1) : 0,
    balanceDiffPct: +diffPct.toFixed(2),
    skillCounts: skillCounts(t.players),
  }));
}
