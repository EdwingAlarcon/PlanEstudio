# Graph Report - .  (2026-08-22)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1328 nodes · 3072 edges · 108 communities (68 shown, 40 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `50e62e6a`
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
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 83
- Community 84
- Community 85
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
1. `cn()` - 66 edges
2. `Button` - 42 edges
3. `useProgressStore` - 41 edges
4. `Badge()` - 36 edges
5. `getAllLabs()` - 35 edges
6. `LevelId` - 23 edges
7. `UI` - 21 edges
8. `scripts` - 20 edges
9. `getAllModules()` - 20 edges
10. `getAllLevels()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `generateStaticParams()` --calls--> `getAllPractices()`  [EXTRACTED]
  app-elearning/src/app/experiencia-practica/[slug]/page.tsx → app-elearning/src/lib/practices.ts
- `generateStaticParams()` --calls--> `getAllLabs()`  [EXTRACTED]
  app-elearning/src/app/labs/[slug]/page.tsx → app-elearning/src/lib/content.ts
- `CurriculumMapPage()` --calls--> `getAllProfessionalRoutes()`  [EXTRACTED]
  app-elearning/src/app/mapa/page.tsx → app-elearning/src/lib/professional-routes.ts
- `StatusIndicator()` --calls--> `cn()`  [EXTRACTED]
  app-elearning/src/app/preparar-entorno/preparar-entorno-client.tsx → app-elearning/src/lib/utils.ts
- `ChecklistRow()` --calls--> `cn()`  [EXTRACTED]
  app-elearning/src/components/checklist/checklist-client.tsx → app-elearning/src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (108 total, 40 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (68): CertificateClient(), BASICO_LABS, BASICO_MODULES, localStorageMock, replaceMock, AvailabilitySelector(), DiagnosticPanel(), labelRequirement() (+60 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (58): WorkstationPreviewSection(), metadata, PrepararEntornoClient(), requirementBadge(), StatusIndicator(), ToolActions(), ToolCard(), ToolRow() (+50 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (54): LEVEL_ACCENT, ReadinessStatus, STATUS_CONFIG, AppShellProps, contextClassName(), contextLabel(), LEVEL_LABELS, SearchBar() (+46 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (41): FEATURED_ARTIFACTS, LabsPage(), metadata, CERT_VARIANT, generateMetadata(), generateStaticParams(), LabDetailPage(), LEVEL_BAR (+33 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (37): main(), PRACTICE_ACCOUNTS, PracticeAccount, PRACTICE_PRODUCTS, PracticeProduct, PRACTICE_REQUESTS, PracticeRequest, arraysEqual() (+29 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (38): PracticeWorkspaceClient(), addExternalReviewToRecord(), ASSESSMENT_MULTIPLIER, AssessmentLevel, buildSelfAssessment(), canCompletePractice(), createAttempt(), createPracticeRecord() (+30 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (32): InteractivePracticeSummary(), buildImportResult(), cloneRecord(), createInteractivePracticeProgressExport(), createInteractivePracticeRecord(), earliestIso(), getInteractivePracticeReviewQueue(), InteractivePracticeEvent (+24 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (33): Preview, applyPracticeImport(), corruptPreview(), createEvidencePackage(), createPracticeProgressExport(), createReviewTemplate(), emptyPreview(), EvidencePackage (+25 more)

### Community 8 - "Community 8"
Cohesion: 0.14
Nodes (31): formatTime(), PanelState, QuizPanel(), QuizPanelProps, QuizResult(), SimulatorClient(), SimulatorClientProps, SimulatorState (+23 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (26): FeedbackPanel(), FlowEngine(), initialAnswer(), InteractiveExercise(), InteractivePracticeClient(), InteractivePracticeClientProps, masteryClass(), masteryLabel() (+18 more)

### Community 10 - "Community 10"
Cohesion: 0.11
Nodes (20): ChoiceGroup(), CertificateNameDialog(), CertificateNameDialogProps, LevelCompleteBanner(), COMPONENTS, MarkdownRenderer(), MarkdownRendererProps, PROSE_CLASSES (+12 more)

### Community 11 - "Community 11"
Cohesion: 0.11
Nodes (19): FIRST_SESSION, metadata, STEPS, Dynamics365HubPage(), metadata, IntegrationHubPage(), metadata, metadata (+11 more)

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (22): DashboardPage(), PortfolioPage(), metadata, ProfessionalRoutesPage(), STATUS_SHORT_LABEL, STATUS_VARIANT, generateMetadata(), generateStaticParams() (+14 more)

### Community 13 - "Community 13"
Cohesion: 0.07
Nodes (27): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+19 more)

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (25): APP_CONTENT_DIR, deriveLabIdFromSlug(), estimateReadingMinutes(), extractModulesFromContent(), failContent(), formatLabDisplayId(), formatLabReadableId(), getModuleById() (+17 more)

### Community 15 - "Community 15"
Cohesion: 0.13
Nodes (25): ASSESSMENT_OPTIONS, assessmentLevelLabel(), attemptLabel(), ExternalReviewPanel(), MessageList(), PracticeAttemptHistory(), PracticeWorkspaceData, ReviewDetailCard() (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.11
Nodes (16): LEVEL_CONFIG, DOMAIN_LINKS, EMPLOYABILITY_LINKS, LEVEL_CONFIG, LevelNavItem(), NavLink(), RESOURCE_LINKS, SIDEBAR_FOOTER_LABEL (+8 more)

### Community 17 - "Community 17"
Cohesion: 0.09
Nodes (22): assetPackId, company, format, generatedAt, paths, legacyApp, portal, scenario (+14 more)

### Community 18 - "Community 18"
Cohesion: 0.18
Nodes (18): Preview, RetentionPortabilityPanel(), applyRetentionImport(), corruptPreview(), createRetentionExport(), emptyPreview(), findDangerousKey(), parseRetentionImportText() (+10 more)

### Community 19 - "Community 19"
Cohesion: 0.15
Nodes (22): PRACTICE_HINT_LEVELS, APP_CONTENT_DIR, COVERAGE_STATES, CoverageState, EVIDENCE_TYPES, EvidenceArtifactType, EvidenceType, failPractice() (+14 more)

### Community 20 - "Community 20"
Cohesion: 0.15
Nodes (18): BEGINNER_MINIMUM, CATEGORY_STYLE, ChecklistClient(), ChecklistClientProps, ChecklistFilter, ChecklistRow(), FILTER_LABEL, findInitialModule() (+10 more)

### Community 21 - "Community 21"
Cohesion: 0.17
Nodes (20): build(), crc32(), csv(), customers, dosDateTime(), ensureDir(), products, regions (+12 more)

### Community 22 - "Community 22"
Cohesion: 0.17
Nodes (15): main(), generateMetadata(), generateStaticParams(), PageProps, ResourcePage(), ALLOWED_CATEGORIES, ChecklistItem, ChecklistModule (+7 more)

### Community 23 - "Community 23"
Cohesion: 0.16
Nodes (13): addDays(), isDueOn(), localDaysBetween(), parseIsoDate(), startOfLocalDay(), toIsoDate(), LEARNING_STEPS_DAYS, ReviewCardState (+5 more)

### Community 24 - "Community 24"
Cohesion: 0.10
Nodes (20): scripts, build, build:pages, dev, dev:e2e, e2e, generate:rpa-assets, lint (+12 more)

### Community 25 - "Community 25"
Cohesion: 0.13
Nodes (16): toLocalDayKey(), ReviewSessionSize, ReviewConfidence, INITIAL_STATE, recordDayLog(), ReviewActions, sanitizeCard(), sanitizeDayLog() (+8 more)

### Community 26 - "Community 26"
Cohesion: 0.15
Nodes (11): CertificatePage(), PageProps, generateMetadata(), LEVEL_ACCENT, LevelPage(), PageProps, metadata, ProgressDashboardPage() (+3 more)

### Community 27 - "Community 27"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 28 - "Community 28"
Cohesion: 0.12
Nodes (17): devDependencies, eslint, eslint-config-next, tailwindcss, @testing-library/jest-dom, tsx, @types/flexsearch, @types/react-dom (+9 more)

### Community 29 - "Community 29"
Cohesion: 0.21
Nodes (13): main(), getDueReviewItems(), getIncorrectReviewItems(), getLeechItems(), groupReinforcementByModule(), interleaveByModule(), isQuestionEligibleForReview(), ModuleReinforcementGroup (+5 more)

### Community 30 - "Community 30"
Cohesion: 0.18
Nodes (17): canonicalReviewForComparison(), corruptReviewPreview(), emptyReviewPreview(), findDangerousKey(), LEVEL_VALUES, normalizeReviewResult(), parseExternalReviewImportText(), parseReviewCriteria() (+9 more)

### Community 31 - "Community 31"
Cohesion: 0.23
Nodes (11): metadata, SimulatorPage(), ContentValidationError, LEVEL_MODULE_RANGE, getAllParsedQuestions(), getAllQuestions(), getCaseDiagnosisForModule(), getQuestionById() (+3 more)

### Community 32 - "Community 32"
Cohesion: 0.26
Nodes (11): RetentionSummary(), RetentionTodayCard(), CONFIDENCE_LABELS, ModuleLink, PanelView, ReviewSessionClient(), ReviewSessionClientProps, getReviewNow() (+3 more)

### Community 33 - "Community 33"
Cohesion: 0.14
Nodes (13): ctx, __dirname, errors, escapeStr(), INPUT, literal, moduleBlocks, moduleIds (+5 more)

### Community 34 - "Community 34"
Cohesion: 0.21
Nodes (11): metadata, MyRoutePage(), InteractivePracticePage(), metadata, generateMetadata(), generateStaticParams(), InteractivePracticeDetailPage(), Props (+3 more)

### Community 35 - "Community 35"
Cohesion: 0.24
Nodes (10): metadata, PracticalExperiencePage(), EVIDENCE_ARTIFACT_TYPES, getAllPractices(), getPracticeCompetencyMatrix(), getPracticeCounts(), PRACTICE_DIFFICULTIES, PRACTICE_DOMAINS (+2 more)

### Community 36 - "Community 36"
Cohesion: 0.24
Nodes (9): metadata, PortfolioClient(), PortfolioProfileData, PortfolioRouteData, ViewMode, getLaborProfileBySlug(), getLaborProfiles(), LABOR_PROFILES (+1 more)

### Community 37 - "Community 37"
Cohesion: 0.19
Nodes (11): args, __dirname, docsNiveles, estimateMinutes(), filterIds, LEVELS, outputBase, repoRoot (+3 more)

### Community 38 - "Community 38"
Cohesion: 0.21
Nodes (10): generateMetadata(), generateStaticParams(), PracticeDetailPage(), Props, splitSolution(), getPracticeBySlug(), PRACTICE_DIFFICULTY_LABELS, PRACTICE_DOMAIN_LABELS (+2 more)

### Community 39 - "Community 39"
Cohesion: 0.24
Nodes (11): generateMetadata(), generateStaticParams(), LEVEL_BADGE, ModulePage(), PageProps, generateStaticParams(), getAllLevels(), getModuleBySlug() (+3 more)

### Community 40 - "Community 40"
Cohesion: 0.31
Nodes (10): assertNoCsvInjection(), exists(), fail(), parseCsv(), read(), REQUIRED_DIRS, REQUIRED_FILES, REQUIRED_TEMPLATES (+2 more)

### Community 41 - "Community 41"
Cohesion: 0.24
Nodes (8): ACCENT_TEXT_COLORS, BORDER_COLORS, CertificateDiploma(), formatDate(), Callout(), CalloutProps, CalloutVariant, VARIANT_CONFIG

### Community 42 - "Community 42"
Cohesion: 0.24
Nodes (8): EmployabilityPage(), metadata, STEP_ICONS, EmployabilityHub, EmployabilityLink, EmployabilitySection, EmployabilityStep, getEmployabilityHub()

### Community 43 - "Community 43"
Cohesion: 0.24
Nodes (8): CurriculumMapPage(), LEGEND, metadata, LEVEL_COLORS, TROPHY_COLORS, Badge(), BadgeProps, badgeVariants

### Community 44 - "Community 44"
Cohesion: 0.22
Nodes (5): MODULE_QUESTIONS, QuestionType, RawQuestion, mockQuestions, VALID_QUESTION

### Community 45 - "Community 45"
Cohesion: 0.22
Nodes (8): engines, node, npm, name, overrides, postcss, private, version

### Community 46 - "Community 46"
Cohesion: 0.31
Nodes (6): metadata, RootLayout(), AppShell(), ReadingProgress(), ThemeProvider(), getPracticeSearchDocuments()

### Community 47 - "Community 47"
Cohesion: 0.31
Nodes (6): metadata, assetHref(), Mode, MODES, REQUESTS, RpaPortalSandboxClient()

### Community 48 - "Community 48"
Cohesion: 0.25
Nodes (8): CertificateClientProps, CertificateDiplomaProps, ChecklistItemProgress, ChecklistLevel, LevelInfo, ModuleInfo, LevelId, ProgressActions

### Community 49 - "Community 49"
Cohesion: 0.29
Nodes (4): initialRecords, LegacyMode, RpaLegacySimulatorClient(), metadata

### Community 50 - "Community 50"
Cohesion: 0.43
Nodes (7): buildModuleData(), buildQuestions(), certForModule(), createOption(), escapeHtml(), initSimulator(), levelForModule()

### Community 51 - "Community 51"
Cohesion: 0.29
Nodes (7): dependencies, autoprefixer, class-variance-authority, @radix-ui/react-separator, autoprefixer, class-variance-authority, @radix-ui/react-separator

### Community 52 - "Community 52"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 53 - "Community 53"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 54 - "Community 54"
Cohesion: 0.60
Nodes (3): Get-PropertyValue(), Test-AppMatch(), Test-BlockedApp()

### Community 55 - "Community 55"
Cohesion: 0.67
Nodes (3): metadata, ReviewPage(), getAllReviewableQuestions()

### Community 58 - "Community 58"
Cohesion: 0.67
Nodes (3): react, extractText(), react

## Knowledge Gaps
- **414 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+409 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 51` to `Community 45`, `Community 58`, `Community 64`, `Community 65`, `Community 66`, `Community 67`, `Community 68`, `Community 69`, `Community 70`, `Community 71`, `Community 72`, `Community 73`, `Community 74`, `Community 75`, `Community 76`, `Community 77`, `Community 78`, `Community 79`, `Community 80`, `Community 81`, `Community 82`, `Community 83`, `Community 84`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Why does `extractText()` connect `Community 58` to `Community 10`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Why does `react` connect `Community 58` to `Community 51`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _414 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05630252100840336 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06438631790744467 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06400409626216078 - nodes in this community are weakly interconnected._