# Graph Report - PlanEstudio  (2026-08-22)

## Corpus Check
- 472 files · ~795,647 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1359 nodes · 2997 edges · 116 communities (70 shown, 46 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a01fb09b`
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
- Community 48
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
- legacy-client.tsx
- page.tsx
- page.tsx
- card.tsx
- react
- accounts.ts
- products.ts
- requests.ts
- clsx
- flexsearch
- gray-matter
- lucide-react
- mermaid
- next
- next-themes
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-progress
- @radix-ui/react-scroll-area
- @radix-ui/react-slot
- @radix-ui/react-tooltip
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
- react-dom
- react-markdown
- rehype-highlight
- rehype-raw
- rehype-slug
- remark-gfm
- tailwind-merge
- zustand

## God Nodes (most connected - your core abstractions)
1. `cn()` - 56 edges
2. `Button` - 39 edges
3. `useProgressStore` - 37 edges
4. `getAllLabs()` - 35 edges
5. `Badge()` - 32 edges
6. `LevelId` - 23 edges
7. `scripts` - 20 edges
8. `getAllModules()` - 20 edges
9. `UI` - 20 edges
10. `getAllLevels()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `ChoiceGroup()` --calls--> `cn()`  [EXTRACTED]
  app-elearning/src/app/mi-ruta/my-route-client.tsx → app-elearning/src/lib/utils.ts
- `SimulatorPage()` --calls--> `getAllQuestions()`  [EXTRACTED]
  app-elearning/src/app/simulador/page.tsx → app-elearning/src/lib/questions-parser.ts
- `ChecklistRow()` --calls--> `cn()`  [EXTRACTED]
  app-elearning/src/components/checklist/checklist-client.tsx → app-elearning/src/lib/utils.ts
- `NavLink()` --calls--> `cn()`  [EXTRACTED]
  app-elearning/src/components/layout/sidebar.tsx → app-elearning/src/lib/utils.ts
- `MessageList()` --calls--> `cn()`  [EXTRACTED]
  app-elearning/src/components/practices/practice-workspace-client.tsx → app-elearning/src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (116 total, 46 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (44): AvailabilitySelector(), ChoiceGroup(), DiagnosticPanel(), labelRequirement(), MyRouteClient(), pickRecommendedRoutes(), RouteSummary, metadata (+36 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (54): WorkstationPreviewSection(), metadata, PrepararEntornoClient(), requirementBadge(), ToolCard(), ToolRow(), LabWorkstationGate(), LabWorkstationGateProps (+46 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (49): AppShellProps, contextClassName(), contextLabel(), LEVEL_LABELS, SearchBar(), SearchBarProps, SearchHit, TYPE_CONFIG (+41 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (32): FEATURED_ARTIFACTS, LabsPage(), metadata, CERT_VARIANT, DIFFICULTY_ORDER, DOMAIN_ORDER, FilterChipsProps, getActiveLevelCode() (+24 more)

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (28): main(), arraysEqual(), calculateInteractiveMastery(), DecisionOption, evaluateDebug(), evaluateDecision(), evaluateFetchXml(), evaluateFlow() (+20 more)

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (25): ASSESSMENT_MULTIPLIER, AssessmentLevel, createAttempt(), ensureActiveAttempt(), ensureAttemptEvidence(), EXTERNAL_REVIEW_RESULT_LABELS, ExternalPracticeReviewResult, getActiveAttempt() (+17 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (30): InteractivePracticeSummary(), buildImportResult(), cloneRecord(), createInteractivePracticeProgressExport(), createInteractivePracticeRecord(), earliestIso(), getInteractivePracticeReviewQueue(), InteractivePracticeEvent (+22 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (33): Preview, applyPracticeImport(), corruptPreview(), createEvidencePackage(), createPracticeProgressExport(), createReviewTemplate(), emptyPreview(), EvidencePackage (+25 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (33): metadata, SimulatorPage(), formatTime(), PanelState, QuizPanel(), QuizPanelProps, QuizResult(), SimulatorClient() (+25 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (15): initialAnswer(), InteractiveExercise(), InteractivePracticeClientProps, masteryClass(), masteryLabel(), PracticeFeedbackPanel(), PracticeListButton(), safeParseFeedback() (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.11
Nodes (21): CertificateNameDialogProps, COMPONENTS, MarkdownRenderer(), MarkdownRendererProps, PROSE_CLASSES, MermaidDiagram(), MermaidDiagramProps, renderQueue (+13 more)

### Community 11 - "Community 11"
Cohesion: 0.21
Nodes (9): FIRST_SESSION, metadata, STEPS, metadata, PowerPlatformHubPage(), Badge(), BadgeProps, badgeVariants (+1 more)

### Community 12 - "Community 12"
Cohesion: 0.20
Nodes (12): generateMetadata(), PageProps, ProfessionalRouteDetailPage(), STATUS_SHORT_LABEL, STATUS_VARIANT, getLaborProfileBySlug(), getLaborProfiles(), LABOR_PROFILES (+4 more)

### Community 13 - "Community 13"
Cohesion: 0.07
Nodes (27): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+19 more)

### Community 14 - "Community 14"
Cohesion: 0.15
Nodes (25): APP_CONTENT_DIR, deriveLabIdFromSlug(), estimateReadingMinutes(), extractModulesFromContent(), failContent(), formatLabDisplayId(), formatLabReadableId(), LABS_DIR (+17 more)

### Community 15 - "Community 15"
Cohesion: 0.12
Nodes (26): ASSESSMENT_OPTIONS, assessmentLevelLabel(), attemptLabel(), ExternalReviewPanel(), MessageList(), PracticeAttemptHistory(), PracticeWorkspaceData, ReviewDetailCard() (+18 more)

### Community 16 - "Community 16"
Cohesion: 0.15
Nodes (13): metadata, LevelReadinessData, DOMAIN_LINKS, EMPLOYABILITY_LINKS, LEVEL_CONFIG, LevelNavItem(), NavLink(), RESOURCE_LINKS (+5 more)

### Community 17 - "Community 17"
Cohesion: 0.09
Nodes (22): assetPackId, company, format, generatedAt, paths, legacyApp, portal, scenario (+14 more)

### Community 18 - "Community 18"
Cohesion: 0.18
Nodes (18): Preview, RetentionPortabilityPanel(), applyRetentionImport(), corruptPreview(), createRetentionExport(), emptyPreview(), findDangerousKey(), parseRetentionImportText() (+10 more)

### Community 19 - "Community 19"
Cohesion: 0.07
Nodes (48): metadata, PracticalExperiencePage(), generateMetadata(), generateStaticParams(), PracticeDetailPage(), Props, splitSolution(), metadata (+40 more)

### Community 20 - "Community 20"
Cohesion: 0.10
Nodes (25): BEGINNER_MINIMUM, CATEGORY_STYLE, ChecklistClient(), ChecklistClientProps, ChecklistFilter, ChecklistRow(), FILTER_LABEL, findInitialModule() (+17 more)

### Community 21 - "Community 21"
Cohesion: 0.17
Nodes (20): build(), crc32(), csv(), customers, dosDateTime(), ensureDir(), products, regions (+12 more)

### Community 22 - "Community 22"
Cohesion: 0.19
Nodes (14): RetentionSummary(), RetentionTodayCard(), CONFIDENCE_LABELS, ModuleLink, PanelView, ReviewSessionClient(), ReviewSessionClientProps, Button (+6 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (19): Before Making Changes, CI/CD, Code Snippets Style, Content: Heading Formats (legacy MkDocs / docs/ only), Content: Module Format, Content: Module Frontmatter (Next.js app), Content Quality Standards, Content: Question Bank (+11 more)

### Community 24 - "Community 24"
Cohesion: 0.10
Nodes (20): scripts, build, build:pages, dev, dev:e2e, e2e, generate:rpa-assets, lint (+12 more)

### Community 25 - "Community 25"
Cohesion: 0.16
Nodes (17): CERT_VARIANT, generateMetadata(), generateStaticParams(), LabDetailPage(), LEVEL_BAR, Props, PortfolioPage(), getAllLabs() (+9 more)

### Community 26 - "Community 26"
Cohesion: 0.15
Nodes (16): generateMetadata(), generateStaticParams(), LEVEL_BADGE, ModulePage(), PageProps, generateMetadata(), generateStaticParams(), LEVEL_ACCENT (+8 more)

### Community 27 - "Community 27"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 28 - "Community 28"
Cohesion: 0.12
Nodes (17): devDependencies, cross-env, eslint-config-next, tailwindcss, @testing-library/jest-dom, tsx, @types/flexsearch, @types/react-dom (+9 more)

### Community 29 - "Community 29"
Cohesion: 0.20
Nodes (4): LEVEL_CONFIG, GuidedHomeClient(), ProgressRing(), ProgressRingProps

### Community 30 - "Community 30"
Cohesion: 0.17
Nodes (16): PracticePortabilityPanel(), PracticeDomainProgress(), PracticeWorkspaceClient(), addExternalReviewToRecord(), buildSelfAssessment(), calculatePracticeCounts(), canCompletePractice(), createPracticeRecord() (+8 more)

### Community 31 - "Community 31"
Cohesion: 0.13
Nodes (16): toLocalDayKey(), ReviewSessionSize, ReviewConfidence, INITIAL_STATE, recordDayLog(), ReviewActions, sanitizeCard(), sanitizeDayLog() (+8 more)

### Community 33 - "Community 33"
Cohesion: 0.14
Nodes (13): ctx, __dirname, errors, escapeStr(), INPUT, literal, moduleBlocks, moduleIds (+5 more)

### Community 34 - "Community 34"
Cohesion: 0.22
Nodes (12): MyRoutePage(), InteractivePracticePage(), metadata, generateMetadata(), generateStaticParams(), InteractivePracticeDetailPage(), Props, InteractivePracticeClient() (+4 more)

### Community 37 - "Community 37"
Cohesion: 0.19
Nodes (11): args, __dirname, docsNiveles, estimateMinutes(), filterIds, LEVELS, outputBase, repoRoot (+3 more)

### Community 39 - "review-scheduler.ts"
Cohesion: 0.14
Nodes (12): main(), toIsoDate(), isQuestionEligibleForReview(), validateSpacedRepetition(), LEARNING_STEPS_DAYS, ReviewCardState, ReviewItemType, ReviewScheduleInput (+4 more)

### Community 40 - "Community 40"
Cohesion: 0.31
Nodes (10): assertNoCsvInjection(), exists(), fail(), parseCsv(), read(), REQUIRED_DIRS, REQUIRED_FILES, REQUIRED_TEMPLATES (+2 more)

### Community 41 - "Community 41"
Cohesion: 0.22
Nodes (10): CertificateClientProps, ACCENT_TEXT_COLORS, BORDER_COLORS, CertificateDiploma(), CertificateDiplomaProps, formatDate(), ChecklistLevel, LevelInfo (+2 more)

### Community 42 - "review-queue.ts"
Cohesion: 0.23
Nodes (14): addDays(), isDueOn(), localDaysBetween(), parseIsoDate(), startOfLocalDay(), getDueReviewItems(), getIncorrectReviewItems(), getLeechItems() (+6 more)

### Community 43 - "validateExternalReviewPayload"
Cohesion: 0.18
Nodes (17): canonicalReviewForComparison(), corruptReviewPreview(), emptyReviewPreview(), findDangerousKey(), LEVEL_VALUES, normalizeReviewResult(), parseExternalReviewImportText(), parseReviewCriteria() (+9 more)

### Community 44 - "interactive-practice-filters.ts"
Cohesion: 0.17
Nodes (13): DEFAULT_INTERACTIVE_PRACTICE_FILTERS, filterInteractivePractices(), hasActiveInteractivePracticeFilters(), InteractivePracticeDomainFilter, InteractivePracticeFilters, InteractivePracticeLevelFilter, InteractivePracticeMasteryFilter, InteractivePracticeTypeFilter (+5 more)

### Community 45 - "Community 45"
Cohesion: 0.22
Nodes (8): engines, node, npm, name, overrides, postcss, private, version

### Community 46 - "validate-content.ts"
Cohesion: 0.24
Nodes (11): main(), generateMetadata(), generateStaticParams(), PageProps, ResourcePage(), parseChecklistMarkdown(), ContentValidationError, getAllResourcePages() (+3 more)

### Community 47 - "Community 47"
Cohesion: 0.31
Nodes (6): metadata, assetHref(), Mode, MODES, REQUESTS, RpaPortalSandboxClient()

### Community 48 - "Community 48"
Cohesion: 0.09
Nodes (34): CertificateClient(), BASICO_LABS, BASICO_MODULES, localStorageMock, replaceMock, LEVEL_ACCENT, ProgressDashboardClient(), ReadinessStatus (+26 more)

### Community 49 - "questions-parser.ts"
Cohesion: 0.27
Nodes (11): DashboardPage(), metadata, ReviewPage(), getAllParsedQuestions(), getAllQuestions(), getAllReviewableQuestions(), getCaseDiagnosisForModule(), getQuestionById() (+3 more)

### Community 50 - "Community 50"
Cohesion: 0.43
Nodes (7): buildModuleData(), buildQuestions(), certForModule(), createOption(), escapeHtml(), initSimulator(), levelForModule()

### Community 51 - "Community 51"
Cohesion: 0.29
Nodes (7): dependencies, autoprefixer, class-variance-authority, @radix-ui/react-separator, autoprefixer, class-variance-authority, @radix-ui/react-separator

### Community 52 - "domain-hubs.ts"
Cohesion: 0.21
Nodes (10): Dynamics365HubPage(), metadata, IntegrationHubPage(), metadata, DomainHub, DomainHubLink, DomainHubSection, DomainHubStep (+2 more)

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
Cohesion: 0.22
Nodes (9): CurriculumMapPage(), LEGEND, metadata, metadata, ProfessionalRoutesPage(), STATUS_SHORT_LABEL, STATUS_VARIANT, generateStaticParams() (+1 more)

### Community 64 - "questions-parser-validation.test.ts"
Cohesion: 0.22
Nodes (5): MODULE_QUESTIONS, QuestionType, RawQuestion, mockQuestions, VALID_QUESTION

### Community 65 - "legacy-client.tsx"
Cohesion: 0.29
Nodes (4): initialRecords, LegacyMode, RpaLegacySimulatorClient(), metadata

### Community 66 - "page.tsx"
Cohesion: 0.33
Nodes (4): CertificatePage(), PageProps, ProgressDashboardPage(), getLabsForLevel()

### Community 67 - "page.tsx"
Cohesion: 0.43
Nodes (5): metadata, PortfolioClient(), PortfolioProfileData, PortfolioRouteData, ViewMode

### Community 68 - "card.tsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 69 - "react"
Cohesion: 0.67
Nodes (3): react, extractText(), react

## Knowledge Gaps
- **447 isolated node(s):** `LEVEL_ID_TO_CODE`, `LEVEL_CONFIG`, `LEVEL_ORDER`, `CERT_VARIANT`, `DOMAIN_ORDER` (+442 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 51` to `Community 45`, `react`, `clsx`, `flexsearch`, `gray-matter`, `lucide-react`, `mermaid`, `next`, `next-themes`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-progress`, `@radix-ui/react-scroll-area`, `@radix-ui/react-slot`, `@radix-ui/react-tooltip`, `react-dom`, `react-markdown`, `rehype-highlight`, `rehype-raw`, `rehype-slug`, `remark-gfm`, `tailwind-merge`, `zustand`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `extractText()` connect `react` to `Community 10`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `Community 51`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **What connects `LEVEL_ID_TO_CODE`, `LEVEL_CONFIG`, `LEVEL_ORDER` to the rest of the system?**
  _447 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08941176470588236 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06169772256728778 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06766917293233082 - nodes in this community are weakly interconnected._