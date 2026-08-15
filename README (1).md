# PaperTrail

**Chain-of-Custody Audit Protocol for Tamper-Evident Government Document Tracking**

Built for the Smart Kopargaon Hackathon 2026 — Problem Statement SKH020, *Smart Digital Documentation System for Government Offices*.

## The Problem

Three government exams were compromised in a single 2026 testing season, each a different failure point: a pre-circulated NEET-UG paper, a Maharashtra TET printing-press breach, a leaked UGC-NET PDF. Different attack vectors, one shared root cause — once a document leaves its point of creation, nobody can prove whether it's still the original.

## What It Does

PaperTrail seals every document with a SHA-256 cryptographic fingerprint at creation, then re-checks that fingerprint at every handoff (printing, transit, storage, distribution). A hash mismatch instantly names the exact checkpoint where a document was altered and who held it at the time — no blockchain, no new infrastructure, just a hash chain running on hardware departments already have.

## Tech Stack

React · Tailwind CSS · Vite · native Web Crypto API (SHA-256) · qrcode.react · html5-qrcode · localStorage

## Running Locally

```bash
npm install
npm run dev
```

## Documentation

Full 8-page technical documentation: [`/docs/PaperTrail_Documentation.pdf`](./docs/PaperTrail_Documentation.pdf)

## Demo Video

*(add YouTube link here once uploaded)*

## Team

**PaperTrail** · Team ID `56EGZG` · Smart Kopargaon Hackathon 2026
