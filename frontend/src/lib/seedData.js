// Seed data shipped with the app. Inserted on the very first load only.
// User-provided dataset — rating scale 0–100, role "allr" (All-Rounder).

import { uid } from "./storage";

const raw = [
  { name: "Abhijit Mishra",  rating: 92, role: "allr" },
  { name: "Rakesh Satpathy", rating: 92, role: "allr" },
  { name: "Soumya Mekap",    rating: 90, role: "allr" },
  { name: "Pravat",          rating: 90, role: "allr" },
  { name: "Alok",            rating: 88, role: "allr" },
  { name: "Tarini",          rating: 88, role: "allr" },
  { name: "Bitun",           rating: 85, role: "allr" },
  { name: "Dev",             rating: 85, role: "allr" },
  { name: "Shyam",           rating: 84, role: "allr" },
  { name: "Vivek",           rating: 84, role: "allr" },
  { name: "Dhruti",          rating: 78, role: "allr" },
  { name: "Shantanu",        rating: 78, role: "allr" },
  { name: "Surjit",          rating: 76, role: "allr" },
  { name: "Battle",          rating: 76, role: "allr" },
  { name: "Swapnil",         rating: 74, role: "allr" },
  { name: "Tanmay",          rating: 74, role: "allr" },
  { name: "Prabhat",         rating: 70, role: "allr" },
  { name: "Chiranjib",       rating: 70, role: "allr" },
  { name: "Shovan",          rating: 69, role: "allr" },
  { name: "Smruti",          rating: 69, role: "allr" },
];

export function buildSeedPlayers() {
  return raw.map((p) => ({
    id: uid(),
    name: p.name,
    skill: p.role,
    rating: p.rating,
    available: true,
  }));
}
