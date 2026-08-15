# PaperTrail

Cryptographic chain-of-custody system for government documents, exam papers, land mutation records, and government tenders. Built for the Smart Kopargaon Hackathon.

## The problem
Once a government document leaves official hands, there's no reliable way to prove who touched it, when, or whether it was altered. Exam leaks, land record fraud, and tender manipulation all trace back to the same gap: no tamper-evident trail.

## How it works
Every document gets a SHA-256 hash on registration. Every handoff, scanned by QR or entered manually, is logged as a checkpoint. Matching content verifies clean. One changed character breaks the hash and flags a tamper instantly, with a side-by-side comparison of exactly what changed.

## Tech stack
React, Tailwind CSS, Web Crypto API (SHA-256), localStorage, QR-based verification

## Run it locally
npm install
npm run dev

## Documentation
Full write-up: PaperTrail_Documentation.pdf

---
Smart Kopargaon Hackathon — Round 2
