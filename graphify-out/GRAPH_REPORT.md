# Graph Report - PlanEstudio  (2026-08-22)

## Corpus Check
- 472 files · ~794,802 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1355 nodes · 3095 edges · 77 communities (55 shown, 22 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b842e2b0`
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
- Community 40
- Community 41
- Community 45
- Community 47
- Community 48
- Community 50
- Community 51
- Community 53
- Community 54
- Community 56
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
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
- `CertificateClientProps` --references--> `LevelId`  [EXTRACTED]
  app-elearning/src/app/certificado/[nivel]/certificate-client.tsx → app-elearning/src/lib/i18n.ts
- `CurriculumMapPage()` --calls--> `getAllProfessionalRoutes()`  [EXTRACTED]
  app-elearning/src/app/mapa/page.tsx → app-elearning/src/lib/professional-routes.ts
- `ChoiceGroup()` --calls--> `cn()`  [EXTRACTED]
  app-elearning/src/app/mi-ruta/my-route-client.tsx → app-elearning/src/lib/utils.ts
- `generateStaticParams()` --calls--> `getAllLevels()`  [EXTRACTED]
  app-elearning/src/app/nivel/[level]/modulo/[slug]/page.tsx → app-elearning/src/lib/content.ts
- `generateStaticParams()` --calls--> `getAllLevels()`  [EXTRACTED]
  app-elearning/src/app/nivel/[level]/page.tsx → app-elearning/src/lib/content.ts

## Import Cycles
- None detected.

## Communities (77 total, 22 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (50): AvailabilitySelector(), ChoiceGroup(), DiagnosticPanel(), labelRequirement(), MyRouteClient(), pickRecommendedRoutes(), RouteSummary, metadata (+42 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (58): WorkstationPreviewSection(), metadata, PrepararEntornoClient(), requirementBadge(), StatusIndicator(), ToolActions(), ToolCard(), ToolRow() (+50 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (32): SearchHit, PracticeSummaryItem, DIFFICULTY_ORDER, FilterChips(), intersects(), PracticeCard, PracticesClient(), STATUS_ORDER (+24 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (19): FEATURED_ARTIFACTS, LabsPage(), metadata, LabCardStatus(), LabCardStatusProps, CERT_VARIANT, DIFFICULTY_ORDER, DOMAIN_ORDER (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (35): main(), MyRoutePage(), InteractivePracticePage(), metadata, PRACTICE_ACCOUNTS, PracticeAccount, PRACTICE_PRODUCTS, PracticeProduct (+27 more)

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (31): ASSESSMENT_MULTIPLIER, AssessmentLevel, buildSelfAssessment(), createAttempt(), createPracticeRecord(), ensureActiveAttempt(), ensureAttemptEvidence(), ensureEvidence() (+23 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (32): InteractivePracticeSummary(), buildImportResult(), cloneRecord(), createInteractivePracticeProgressExport(), createInteractivePracticeRecord(), earliestIso(), getInteractivePracticeReviewQueue(), InteractivePracticeEvent (+24 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (53): PracticePortabilityPanel(), Preview, applyPracticeImport(), canonicalReviewForComparison(), corruptPreview(), corruptReviewPreview(), createEvidencePackage(), createPracticeProgressExport() (+45 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (56): generateMetadata(), generateStaticParams(), LEVEL_BADGE, ModulePage(), PageProps, metadata, ReviewPage(), metadata (+48 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (26): FeedbackPanel(), FlowEngine(), initialAnswer(), InteractiveExercise(), InteractivePracticeClientProps, masteryClass(), masteryLabel(), PracticeFeedbackPanel() (+18 more)

### Community 10 - "Community 10"
Cohesion: 0.15
Nodes (15): CertificateNameDialogProps, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, DialogContent() (+7 more)

### Community 11 - "Community 11"
Cohesion: 0.05
Nodes (38): FIRST_SESSION, metadata, STEPS, Dynamics365HubPage(), metadata, EmployabilityPage(), metadata, STEP_ICONS (+30 more)

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (24): metadata, PortfolioPage(), PortfolioClient(), PortfolioProfileData, PortfolioRouteData, ViewMode, generateMetadata(), generateStaticParams() (+16 more)

### Community 13 - "Community 13"
Cohesion: 0.07
Nodes (27): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+19 more)

### Community 14 - "Community 14"
Cohesion: 0.13
Nodes (31): APP_CONTENT_DIR, deriveLabIdFromSlug(), estimateReadingMinutes(), extractModulesFromContent(), failContent(), formatLabDisplayId(), formatLabReadableId(), getAllLevels() (+23 more)

### Community 15 - "Community 15"
Cohesion: 0.13
Nodes (25): ASSESSMENT_OPTIONS, assessmentLevelLabel(), attemptLabel(), ExternalReviewPanel(), MessageList(), PracticeAttemptHistory(), PracticeWorkspaceData, ReviewDetailCard() (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.13
Nodes (12): PageProps, metadata, DOMAIN_LINKS, EMPLOYABILITY_LINKS, LEVEL_CONFIG, NavLink(), RESOURCE_LINKS, SIDEBAR_FOOTER_LABEL (+4 more)

### Community 17 - "Community 17"
Cohesion: 0.09
Nodes (22): assetPackId, company, format, generatedAt, paths, legacyApp, portal, scenario (+14 more)

### Community 18 - "Community 18"
Cohesion: 0.05
Nodes (71): main(), Preview, RetentionPortabilityPanel(), RetentionSummary(), RetentionTodayCard(), CONFIDENCE_LABELS, ModuleLink, PanelView (+63 more)

### Community 19 - "Community 19"
Cohesion: 0.07
Nodes (48): metadata, PracticalExperiencePage(), generateMetadata(), generateStaticParams(), PracticeDetailPage(), Props, splitSolution(), metadata (+40 more)

### Community 20 - "Community 20"
Cohesion: 0.06
Nodes (45): react, main(), generateMetadata(), generateStaticParams(), PageProps, ResourcePage(), BEGINNER_MINIMUM, CATEGORY_STYLE (+37 more)

### Community 21 - "Community 21"
Cohesion: 0.17
Nodes (20): build(), crc32(), csv(), customers, dosDateTime(), ensureDir(), products, regions (+12 more)

### Community 22 - "Community 22"
Cohesion: 0.17
Nodes (14): AppShellProps, contextClassName(), contextLabel(), LEVEL_LABELS, SearchBar(), SearchBarProps, TYPE_CONFIG, ThemeToggle() (+6 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (19): Before Making Changes, CI/CD, Code Snippets Style, Content: Heading Formats (legacy MkDocs / docs/ only), Content: Module Format, Content: Module Frontmatter (Next.js app), Content Quality Standards, Content: Question Bank (+11 more)

### Community 24 - "Community 24"
Cohesion: 0.10
Nodes (20): scripts, build, build:pages, dev, dev:e2e, e2e, generate:rpa-assets, lint (+12 more)

### Community 25 - "Community 25"
Cohesion: 0.18
Nodes (14): CertificatePage(), CERT_VARIANT, generateMetadata(), generateStaticParams(), LabDetailPage(), LEVEL_BAR, Props, DashboardPage() (+6 more)

### Community 26 - "Community 26"
Cohesion: 0.12
Nodes (15): generateMetadata(), generateStaticParams(), LEVEL_ACCENT, LevelPage(), PageProps, LabCompleteButton(), LabCompleteButtonProps, CertificateNameDialog() (+7 more)

### Community 27 - "Community 27"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 28 - "Community 28"
Cohesion: 0.12
Nodes (17): devDependencies, cross-env, eslint-config-next, tailwindcss, @testing-library/jest-dom, tsx, @types/flexsearch, @types/react-dom (+9 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (9): LEVEL_CONFIG, LevelNavItem(), OverallProgressBannerClient(), ProgressRingClient(), ProgressRing(), ProgressRingProps, calculateLevelProgress(), calculateOverallProgress() (+1 more)

### Community 30 - "Community 30"
Cohesion: 0.22
Nodes (13): getLastPractice(), PracticeDomainProgress(), PracticeProgressSummary(), PracticeWorkspaceClient(), addExternalReviewToRecord(), calculatePracticeCounts(), canCompletePractice(), getLatestExternalReview() (+5 more)

### Community 31 - "Community 31"
Cohesion: 0.23
Nodes (13): DIFFICULTY_LABELS, DOMAIN_TAGS, extractSectionItems(), getCertificationBadges(), getCompetencies(), getLabDomains(), getLabKind(), getLabKindLabel() (+5 more)

### Community 33 - "Community 33"
Cohesion: 0.14
Nodes (13): ctx, __dirname, errors, escapeStr(), INPUT, literal, moduleBlocks, moduleIds (+5 more)

### Community 34 - "Community 34"
Cohesion: 0.22
Nodes (11): generateMetadata(), generateStaticParams(), InteractivePracticeDetailPage(), Props, InteractivePracticeClient(), DEFAULT_INTERACTIVE_PRACTICE_FILTERS, filterInteractivePractices(), hasActiveInteractivePracticeFilters() (+3 more)

### Community 37 - "Community 37"
Cohesion: 0.19
Nodes (11): args, __dirname, docsNiveles, estimateMinutes(), filterIds, LEVELS, outputBase, repoRoot (+3 more)

### Community 40 - "Community 40"
Cohesion: 0.31
Nodes (10): assertNoCsvInjection(), exists(), fail(), parseCsv(), read(), REQUIRED_DIRS, REQUIRED_FILES, REQUIRED_TEMPLATES (+2 more)

### Community 41 - "Community 41"
Cohesion: 0.12
Nodes (15): CertificateClient(), CertificateClientProps, BASICO_LABS, BASICO_MODULES, localStorageMock, replaceMock, ACCENT_TEXT_COLORS, BORDER_COLORS (+7 more)

### Community 45 - "Community 45"
Cohesion: 0.22
Nodes (8): engines, node, npm, name, overrides, postcss, private, version

### Community 47 - "Community 47"
Cohesion: 0.31
Nodes (6): metadata, assetHref(), Mode, MODES, REQUESTS, RpaPortalSandboxClient()

### Community 48 - "Community 48"
Cohesion: 0.16
Nodes (15): LEVEL_ACCENT, LevelReadinessData, ProgressDashboardClient(), ReadinessStatus, STATUS_CONFIG, ChecklistItemProgress, ChecklistProgressMap, LEVEL_MODULE_RANGE (+7 more)

### Community 50 - "Community 50"
Cohesion: 0.43
Nodes (7): buildModuleData(), buildQuestions(), certForModule(), createOption(), escapeHtml(), initSimulator(), levelForModule()

### Community 51 - "Community 51"
Cohesion: 0.04
Nodes (49): dependencies, autoprefixer, class-variance-authority, clsx, flexsearch, gray-matter, lucide-react, mermaid (+41 more)

### Community 53 - "Community 53"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 54 - "Community 54"
Cohesion: 0.60
Nodes (3): Get-PropertyValue(), Test-AppMatch(), Test-BlockedApp()

## Knowledge Gaps
- **435 isolated node(s):** `Current Handoff for Claude`, `What This Repository Is`, `Repository Structure`, `Next.js app (primary)`, `MkDocs (reference/legacy)` (+430 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 51` to `Community 20`, `Community 45`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `react` connect `Community 20` to `Community 51`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **What connects `Current Handoff for Claude`, `What This Repository Is`, `Repository Structure` to the rest of the system?**
  _435 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08022598870056497 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0647887323943662 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.0962566844919786 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.12121212121212122 - nodes in this community are weakly interconnected._