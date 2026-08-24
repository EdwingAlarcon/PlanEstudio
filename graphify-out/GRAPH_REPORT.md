# Graph Report - PlanEstudio  (2026-08-22)

## Corpus Check
- 472 files · ~796,579 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1386 nodes · 3023 edges · 92 communities (67 shown, 25 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4b99372d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- review-scheduler.ts
- Community 40
- Community 41
- review-queue.ts
- validateExternalReviewPayload
- interactive-practice-filters.ts
- Community 45
- validate-content.ts
- Community 47
- progress-dashboard-client.tsx
- questions-parser.ts
- Community 50
- Community 51
- domain-hubs.ts
- Community 53
- Community 54
- page.tsx
- Community 56
- getAllProfessionalRoutes
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- questions-parser-validation.test.ts
- page.tsx
- card.tsx
- accounts.ts
- products.ts
- requests.ts
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94
- Community 95
- Community 96
- Community 97

## God Nodes (most connected - your core abstractions)
1. `cn()` - 56 edges
2. `Button` - 39 edges
3. `useProgressStore` - 37 edges
4. `getAllLabs()` - 35 edges
5. `Badge()` - 32 edges
6. `PlanEstudio — Estado de sprints post-auditoría (handoff)` - 25 edges
7. `LevelId` - 23 edges
8. `scripts` - 20 edges
9. `getAllModules()` - 20 edges
10. `UI` - 20 edges

## Surprising Connections (you probably didn't know these)
- `generateStaticParams()` --calls--> `getAllResourcePages()`  [EXTRACTED]
  app-elearning/src/app/recursos/[slug]/page.tsx → app-elearning/src/lib/content.ts
- `ChecklistRow()` --calls--> `cn()`  [EXTRACTED]
  app-elearning/src/components/checklist/checklist-client.tsx → app-elearning/src/lib/utils.ts
- `NavLink()` --calls--> `cn()`  [EXTRACTED]
  app-elearning/src/components/layout/sidebar.tsx → app-elearning/src/lib/utils.ts
- `ExternalReviewPanel()` --indirect_call--> `review()`  [INFERRED]
  app-elearning/src/components/practices/practice-workspace-client.tsx → app-elearning/src/lib/__tests__/practice-progress.test.ts
- `MessageList()` --calls--> `cn()`  [EXTRACTED]
  app-elearning/src/components/practices/practice-workspace-client.tsx → app-elearning/src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (92 total, 25 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.10
Nodes (24): CertificateClient(), BASICO_LABS, BASICO_MODULES, localStorageMock, replaceMock, LabCardStatus(), LabCardStatusProps, LabCompleteButton() (+16 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (55): WorkstationPreviewSection(), metadata, PrepararEntornoClient(), requirementBadge(), ToolCard(), ToolRow(), LabWorkstationGate(), LabWorkstationGateProps (+47 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (49): AppShellProps, contextClassName(), contextLabel(), LEVEL_LABELS, SearchBar(), SearchBarProps, SearchHit, TYPE_CONFIG (+41 more)

### Community 3 - "Community 3"
Cohesion: 0.19
Nodes (12): CERT_VARIANT, DIFFICULTY_ORDER, DOMAIN_ORDER, FilterChipsProps, getActiveLevelCode(), intersects(), LabsClient(), LEVEL_CONFIG (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.14
Nodes (26): main(), arraysEqual(), DecisionOption, evaluateDebug(), evaluateDecision(), evaluateFetchXml(), evaluateFlow(), evaluateInteractivePractice() (+18 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (28): addExternalReviewToRecord(), ASSESSMENT_MULTIPLIER, createAttempt(), CRITICAL_FAILURE_OPTIONS, ensureActiveAttempt(), ensureAttemptEvidence(), EXTERNAL_REVIEW_RESULT_LABELS, ExternalPracticeReviewResult (+20 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (30): InteractivePracticeSummary(), buildImportResult(), cloneRecord(), createInteractivePracticeProgressExport(), createInteractivePracticeRecord(), earliestIso(), getInteractivePracticeReviewQueue(), InteractivePracticeEvent (+22 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (33): Preview, applyPracticeImport(), corruptPreview(), createEvidencePackage(), createPracticeProgressExport(), createReviewTemplate(), emptyPreview(), EvidencePackage (+25 more)

### Community 8 - "Community 8"
Cohesion: 0.14
Nodes (30): formatTime(), PanelState, QuizPanel(), QuizPanelProps, QuizResult(), SimulatorClient(), SimulatorClientProps, SimulatorState (+22 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (15): initialAnswer(), InteractiveExercise(), InteractivePracticeClientProps, masteryClass(), masteryLabel(), PracticeFeedbackPanel(), PracticeListButton(), safeParseFeedback() (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (12): ChoiceGroup(), CertificateNameDialogProps, ProgressRing(), ProgressRingProps, DialogContent(), DialogOverlay(), DialogTitle(), Input (+4 more)

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (4): initialRecords, LegacyMode, RpaLegacySimulatorClient(), metadata

### Community 12 - "Community 12"
Cohesion: 0.09
Nodes (29): CurriculumMapPage(), LEGEND, metadata, metadata, MyRoutePage(), metadata, PortfolioPage(), PortfolioClient() (+21 more)

### Community 13 - "Community 13"
Cohesion: 0.07
Nodes (27): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+19 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (31): generateStaticParams(), generateStaticParams(), APP_CONTENT_DIR, deriveLabIdFromSlug(), estimateReadingMinutes(), extractModulesFromContent(), failContent(), formatLabDisplayId() (+23 more)

### Community 15 - "Community 15"
Cohesion: 0.14
Nodes (23): ASSESSMENT_OPTIONS, assessmentLevelLabel(), attemptLabel(), ExternalReviewPanel(), MessageList(), PracticeAttemptHistory(), PracticeWorkspaceData, ReviewDetailCard() (+15 more)

### Community 16 - "Community 16"
Cohesion: 0.17
Nodes (10): DOMAIN_LINKS, EMPLOYABILITY_LINKS, LEVEL_CONFIG, NavLink(), RESOURCE_LINKS, SIDEBAR_FOOTER_LABEL, SidebarProps, Separator (+2 more)

### Community 17 - "Community 17"
Cohesion: 0.09
Nodes (22): assetPackId, company, format, generatedAt, paths, legacyApp, portal, scenario (+14 more)

### Community 18 - "Community 18"
Cohesion: 0.05
Nodes (71): main(), Preview, RetentionPortabilityPanel(), RetentionSummary(), RetentionTodayCard(), CONFIDENCE_LABELS, ModuleLink, PanelView (+63 more)

### Community 19 - "Community 19"
Cohesion: 0.07
Nodes (49): metadata, PracticalExperiencePage(), generateMetadata(), generateStaticParams(), PracticeDetailPage(), Props, splitSolution(), metadata (+41 more)

### Community 20 - "Community 20"
Cohesion: 0.06
Nodes (45): react, main(), generateMetadata(), generateStaticParams(), PageProps, ResourcePage(), BEGINNER_MINIMUM, CATEGORY_STYLE (+37 more)

### Community 21 - "Community 21"
Cohesion: 0.17
Nodes (20): build(), crc32(), csv(), customers, dosDateTime(), ensureDir(), products, regions (+12 more)

### Community 22 - "Community 22"
Cohesion: 0.07
Nodes (26): Beginner UX — auditoría de estudiante principiante (sprint 14), Cierre de la Fase 2 (Developer Workstation, Environment Setup & Project Foundations), Comandos de validación de referencia, Contexto, Contexto original del diseño (2026-08-03/04, antes de implementar), Cómo continuar, Diagnósticos cerrados (no re-abrir sin instrucción explícita), Estado al 2026-08-22 (auditoría de estudiante sin conocimientos previos + mejoras) (+18 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (19): Before Making Changes, CI/CD, Code Snippets Style, Content: Heading Formats (legacy MkDocs / docs/ only), Content: Module Format, Content: Module Frontmatter (Next.js app), Content Quality Standards, Content: Question Bank (+11 more)

### Community 24 - "Community 24"
Cohesion: 0.10
Nodes (20): scripts, build, build:pages, dev, dev:e2e, e2e, generate:rpa-assets, lint (+12 more)

### Community 25 - "Community 25"
Cohesion: 0.26
Nodes (10): CERT_VARIANT, generateMetadata(), generateStaticParams(), LabDetailPage(), LEVEL_BAR, Props, getAllLabs(), getLabBySlug() (+2 more)

### Community 26 - "Community 26"
Cohesion: 0.14
Nodes (20): FEATURED_ARTIFACTS, LabsPage(), metadata, LabWithMeta, DIFFICULTY_LABELS, DOMAIN_TAGS, DomainTag, extractSectionItems() (+12 more)

### Community 27 - "Community 27"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 28 - "Community 28"
Cohesion: 0.12
Nodes (17): devDependencies, cross-env, eslint-config-next, tailwindcss, @testing-library/jest-dom, tsx, @types/flexsearch, @types/react-dom (+9 more)

### Community 29 - "Community 29"
Cohesion: 0.25
Nodes (3): DashboardPage(), LEVEL_CONFIG, GuidedHomeClient()

### Community 30 - "Community 30"
Cohesion: 0.20
Nodes (14): PracticeDomainProgress(), PracticeWorkspaceClient(), buildSelfAssessment(), calculatePracticeCounts(), canCompletePractice(), compareLatestAttempts(), createPracticeRecord(), ensureEvidence() (+6 more)

### Community 31 - "Community 31"
Cohesion: 0.25
Nodes (16): AvailabilitySelector(), DiagnosticPanel(), labelRequirement(), MyRouteClient(), pickRecommendedRoutes(), GuidedDashboardSummary(), Sidebar(), Progress (+8 more)

### Community 33 - "Community 33"
Cohesion: 0.14
Nodes (13): ctx, __dirname, errors, escapeStr(), INPUT, literal, moduleBlocks, moduleIds (+5 more)

### Community 34 - "Community 34"
Cohesion: 0.29
Nodes (9): InteractivePracticePage(), metadata, generateMetadata(), generateStaticParams(), InteractivePracticeDetailPage(), Props, InteractivePracticeClient(), getAllInteractivePractices() (+1 more)

### Community 37 - "Community 37"
Cohesion: 0.19
Nodes (11): args, __dirname, docsNiveles, estimateMinutes(), filterIds, LEVELS, outputBase, repoRoot (+3 more)

### Community 39 - "review-scheduler.ts"
Cohesion: 0.16
Nodes (14): CertificateClientProps, ACCENT_TEXT_COLORS, BORDER_COLORS, CertificateDiploma(), CertificateDiplomaProps, formatDate(), Callout(), CalloutProps (+6 more)

### Community 40 - "Community 40"
Cohesion: 0.31
Nodes (10): assertNoCsvInjection(), exists(), fail(), parseCsv(), read(), REQUIRED_DIRS, REQUIRED_FILES, REQUIRED_TEMPLATES (+2 more)

### Community 41 - "Community 41"
Cohesion: 0.16
Nodes (12): LEVEL_ACCENT, PageProps, CertificateNameDialog(), LEVEL_COLORS, LevelCompleteBanner(), TROPHY_COLORS, ModuleCompletionClient(), Button (+4 more)

### Community 42 - "review-queue.ts"
Cohesion: 0.16
Nodes (16): classifySearchDocument(), DEFAULT_ONBOARDING_STATE, ExperienceLevel, FOUNDATION_ACTIVITIES, FoundationActivity, FoundationActivityType, NextBestAction, normalizeOnboardingState() (+8 more)

### Community 43 - "validateExternalReviewPayload"
Cohesion: 0.18
Nodes (17): canonicalReviewForComparison(), corruptReviewPreview(), emptyReviewPreview(), findDangerousKey(), LEVEL_VALUES, normalizeReviewResult(), parseExternalReviewImportText(), parseReviewCriteria() (+9 more)

### Community 44 - "interactive-practice-filters.ts"
Cohesion: 0.14
Nodes (16): DEFAULT_INTERACTIVE_PRACTICE_FILTERS, filterInteractivePractices(), hasActiveInteractivePracticeFilters(), InteractivePracticeDomainFilter, InteractivePracticeFilters, InteractivePracticeLevelFilter, InteractivePracticeMasteryFilter, InteractivePracticeTypeFilter (+8 more)

### Community 45 - "Community 45"
Cohesion: 0.22
Nodes (8): engines, node, npm, name, overrides, postcss, private, version

### Community 46 - "validate-content.ts"
Cohesion: 0.21
Nodes (13): RouteSummary, ExperienceGoal, NavigationMode, OnboardingAnswers, OnboardingStage, OnboardingState, appendEvent(), JourneyEvent (+5 more)

### Community 47 - "Community 47"
Cohesion: 0.31
Nodes (6): metadata, assetHref(), Mode, MODES, REQUESTS, RpaPortalSandboxClient()

### Community 48 - "progress-dashboard-client.tsx"
Cohesion: 0.28
Nodes (7): metadata, LEVEL_ACCENT, LevelReadinessData, ProgressDashboardClient(), ReadinessStatus, STATUS_CONFIG, PracticePortabilityPanel()

### Community 49 - "questions-parser.ts"
Cohesion: 0.17
Nodes (16): generateMetadata(), LEVEL_BADGE, ModulePage(), PageProps, metadata, SimulatorPage(), ContentValidationError, getModuleBySlug() (+8 more)

### Community 50 - "Community 50"
Cohesion: 0.43
Nodes (7): buildModuleData(), buildQuestions(), certForModule(), createOption(), escapeHtml(), initSimulator(), levelForModule()

### Community 51 - "Community 51"
Cohesion: 0.04
Nodes (49): dependencies, autoprefixer, class-variance-authority, clsx, flexsearch, gray-matter, lucide-react, mermaid (+41 more)

### Community 52 - "domain-hubs.ts"
Cohesion: 0.12
Nodes (19): FIRST_SESSION, metadata, STEPS, Dynamics365HubPage(), metadata, IntegrationHubPage(), metadata, metadata (+11 more)

### Community 53 - "Community 53"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 54 - "Community 54"
Cohesion: 0.60
Nodes (3): Get-PropertyValue(), Test-AppMatch(), Test-BlockedApp()

### Community 55 - "page.tsx"
Cohesion: 0.24
Nodes (8): EmployabilityPage(), metadata, STEP_ICONS, EmployabilityHub, EmployabilityLink, EmployabilitySection, EmployabilityStep, getEmployabilityHub()

### Community 58 - "getAllProfessionalRoutes"
Cohesion: 0.33
Nodes (7): metadata, ReviewPage(), getAllModules(), getAllResourcePages(), getAllReviewableQuestions(), HUBS, resolvableHrefs()

### Community 64 - "questions-parser-validation.test.ts"
Cohesion: 0.22
Nodes (5): MODULE_QUESTIONS, QuestionType, RawQuestion, mockQuestions, VALID_QUESTION

### Community 66 - "page.tsx"
Cohesion: 0.27
Nodes (7): CertificatePage(), PageProps, generateMetadata(), LevelPage(), ProgressDashboardPage(), getLabsForLevel(), getLevelById()

### Community 68 - "card.tsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

## Knowledge Gaps
- **471 isolated node(s):** `Estado al 2026-08-22 noche (fix de infra Vercel — dominio planestudio.vercel.app roto)`, `Estado al 2026-08-22 (auditoría de estudiante sin conocimientos previos + mejoras)`, `Estado al 2026-08-22 (pausa por reinicio de PC del usuario)`, `Sprint — Spaced Repetition & Long-Term Retention Engine (2026-08-18)`, `Sprint de cierre — Interactive Practice Engine Completion & Validation (2026-08-11)` (+466 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 51` to `Community 20`, `Community 45`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `react` connect `Community 20` to `Community 51`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **What connects `Estado al 2026-08-22 noche (fix de infra Vercel — dominio planestudio.vercel.app roto)`, `Estado al 2026-08-22 (auditoría de estudiante sin conocimientos previos + mejoras)`, `Estado al 2026-08-22 (pausa por reinicio de PC del usuario)` to the rest of the system?**
  _471 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.10483870967741936 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.060362173038229376 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.14039408866995073 - nodes in this community are weakly interconnected._