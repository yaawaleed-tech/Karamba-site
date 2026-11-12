# Services build notes

The service routes use `ServicePage.astro` as a small page kit. Each page keeps
the shared hero, Questions, See also and closing band, while the feature,
detail, indigo-band and starting-point sections use a different service
voice and illustration. Websites and branding adds two extra sections for
the required six unique sections.

Motion is progressive enhancement. Sections reveal with `view()` timelines
only when motion is allowed; Firefox, older browsers, reduced motion and
`?fx=lite` show the complete static content. The inline governor in
`Layout.astro` selects `data-fx="lite"` for reduced motion, Save-Data,
low-memory devices or low-core coarse-pointer devices. Use `?fx=full` or
`?fx=lite` to override for the session.

The main knobs are `--space-section`, `--fs-h1`, `--fs-h2`, `--fs-h3` and
`--container-inner` in `src/styles/tokens.css`. Copy lives in
`src/data/services.ts`. Keep claims inside the confirmed facts and label
examples as illustrations.

The pages intentionally use CSS and inline SVG only. No new runtime
dependencies were added. There are no pinned stages in the low-width layout,
so phones receive a readable stacked version rather than a compressed desktop
scene.
