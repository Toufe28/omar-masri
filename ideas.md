# Design Directions

## Three Possible Directions

| Theme Name | Very Brief Intro | Probability |
| --- | --- | --- |
| **Tidal Contact Sheet** | A warm editorial gallery becomes a kinetic field of images, notes, and scrolling film strips, balancing fashion-book restraint with physical movement. | 0.07 |
| **Monochrome Atelier** | A paper-white art-book approach with charcoal rules, soft shadows, and slow, architectural image reveals. | 0.03 |
| **Chromatic Projection** | A nocturnal exhibition environment in which saturated image projections drift across dark, spatial surfaces and activated type. | 0.09 |

## Selected Direction: Tidal Contact Sheet

**Design Movement:** Contemporary fashion editorial meets kinetic gallery installation. The site uses the visual language of contact sheets, projection screens, printed production notes, and slow camera movement rather than conventional agency blocks.

**Core Principles:**

1. Let photography lead each moment: text acts as a precise editorial caption, not a competing marketing layer.
2. Alternate calm paper-like reading surfaces with immersive ink-dark image stages to create pacing across a very tall scroll.
3. Make motion physical and intentional: panels pin, photographs drift, image rails glide, and details reveal at the pace of a printed story being opened.
4. Treat every responsive breakpoint as a re-composed spread, never a compressed desktop page.

**Color Philosophy:** Ink black is the gallery room where images gain gravity; parchment-white is the tactile editorial page; Lagoon Signal (#00D6C6) is a rare optical cue for focus, active navigation, and light. Muted photographic blues and warm skin-tone materials are allowed inside photography, but never compete with the signature color in the interface.

**Layout Paradigm:** A long-form cinematic sequence built as alternating editorial spreads rather than centered blocks. The first viewport is a near-fullscreen opening shot; subsequent sections use off-axis type, staggered image frames, horizontal rails, pinned visual chapters, and a final immersive contact field. Content intentionally shifts between wide bleed, narrow annotation columns, and screen-filling media.

**Signature Elements:**

- A black-and-lagoon aperture halo used for the logo, section wayfinding, and active image metadata.
- Vertical gallery labels and hairline registration marks framing major image moments.
- A moving contact-sheet ribbon with numbered frames and restrained hover enlargement.

**Interaction Philosophy:** Interactions feel like operating a carefully designed photo book. Hovering a study previews it; scrolling advances a visual sequence; navigation uses a small editorial index. Controls remain unmistakable, keyboard reachable, and terse. Long-running motion always yields to reduced-motion preferences.

**Animation:** Use Framer Motion for scroll-linked transforms, clip reveals, and staggered editorial entrances, while CSS handles immediate control feedback. Hero media gently parallax at a small amplitude; image panels translate on scroll rather than continuously looping; horizontally moving contact sheets pause on hover. UI feedback stays under 240ms with a sharp `cubic-bezier(0.23, 1, 0.32, 1)` response. Motion defaults to opacity and transform only, respects `prefers-reduced-motion`, and avoids animation where it would disrupt reading or keyboard interaction.

**Typography System:** `DM Serif Display` carries the expressive, editorial display voice in large, cropped, carefully wrapped headlines. `Manrope` provides high-legibility operational text, navigational labels, and metadata. Serif type may overlap media; sans-serif labels stay small, uppercase, wide-tracked, and aligned to registration rules.

**Brand Essence:** **Koro & Moss is an image-led creative direction practice for cultural brands that need visual gravity, not decoration.** Personality: exacting, sensorial, cinematic.

**Brand Voice:** Headlines are tactile, declarative, and spare; CTAs invite inspection rather than push conversion. Examples: “Make the image carry weight.” and “Walk into the selected study.”

**Wordmark & Logo:** A compact small-caps `KORO & MOSS` wordmark is paired with a bold aperture symbol: two offset black arcs framing a lagoon core, like a lens catching projected light. The standalone mark is used prominently in the masthead and as the favicon.

**Signature Brand Color:** **Lagoon Signal — #00D6C6**.

## Style Decisions

- The page remains tall and image-forward; no section may collapse into a generic equal-card marketing grid.
- Lagoon Signal is used as a navigational and optical cue, never as a generic gradient or broad page background.
- Photography is treated as a bright, human counterpoint to the ink-dark gallery stages; every text-over-image placement has a contrast-safe scrim.
- The desktop experience may use pinned chapters and spatial image movement; mobile replaces those with concise, vertically composed transitions to retain smoothness and accessibility.
- The UI avoids centered template layouts, pill-heavy controls, purple gradients, and default sans-serif styling.

### Review-driven refinements

- Every major chapter carries a contact-sheet device: a folio, numbered frame, film-ruler mark, registration label, or metadata line.
- Spacious dark stages retain an optical trace through archive grids, an aperture halo, index labels, or framed study information; black space is atmospheric but never accidental.
- The aperture halo recurs at navigation, chapter transitions, location wayfinding, and the final plate as the studio’s optical signature.
- Lagoon Signal only indicates focus, active frame state, directional movement, or emitted light; it is never applied as decorative filler.

### Arabic-first gallery refinement

- Egyptian Arabic uses Cairo as a compact editorial display voice: authority comes from crop, placement, contrast, and pace rather than generic heavy weight or bright decorative type.
- Lagoon Signal is now constrained to emitted aperture light, active frames, tiny archive rules, focus states, and directional marks—never a broad surface or decorative panel.
- Dark gallery stages retain visible archive evidence through a stronger grid, optical-axis metadata, partial registration marks, and a closing aperture trace.
