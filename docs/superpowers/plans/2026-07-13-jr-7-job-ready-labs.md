# JR-7 Job-Ready Labs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add ten practical job-ready labs matching JR-001 through JR-010 from the labor skills matrix.

**Architecture:** Labs are standalone Markdown files under `app-elearning/content/labs`. The existing content loader auto-discovers them when their slug and frontmatter id follow `lab-NN`.

**Tech Stack:** Markdown labs, YAML frontmatter, Next.js static export, TypeScript content validation, Vitest.

## Global Constraints

- Use ids `lab-71` through `lab-80`.
- Keep titles traceable to JR-001 through JR-010.
- Do not change the lab validator.
- Include conceptual fallback when a real tenant/tool is not available.
- Run `npm run validate:content`, `npm run build:pages`, and `npm test`.

---

## Tasks

1. Create labs 71-74: Model-Driven job test, CRM JavaScript, Dataverse plugin, CRM integration.
2. Create labs 75-78: data migration, PPAC governance, Customer Service simulation, CRM legacy health assessment.
3. Create labs 79-80: technical interview simulation and AI-assisted CRM development.
4. Update `docs/Recursos/MATRIZ_SKILLS_LABORALES.md` to map JR-001..JR-010 to LAB-071..LAB-080.
5. Run final validation and commit each logical batch.

## Self-Review

- Spec coverage: all 10 recommended labs are covered.
- Placeholder scan: no TBD/TODO placeholders are left.
- Type consistency: lab ids and filenames match validator requirements.
