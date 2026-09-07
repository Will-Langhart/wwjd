/**
 * Marks of the ancient Church.
 *
 * Every mark here is pre-schism and non-figural. That is deliberate:
 * the catacomb symbols predate Chalcedon (451) and the later divisions,
 * so they are held in common by Eastern Orthodox, Oriental Orthodox and
 * Protestant alike — and because none of them depicts a face, they carry
 * none of the reverence problem that an icon on a garment does.
 */

type MarkProps = {
  className?: string;
  strokeWidth?: number;
  title?: string;
};

/**
 * Chi-Rho (☧) — the Chi and Rho of ΧΡΙΣΤΟΣ superimposed.
 * The Constantinian monogram; the oldest christogram in continuous use.
 */
export const ChiRho = ({ className, strokeWidth = 5, title = "Chi-Rho" }: MarkProps) => (
  <svg
    viewBox="0 0 100 124"
    fill="none"
    role="img"
    aria-label={title}
    className={className}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Chi — the diagonal cross */}
    <path d="M17 42 L83 102" />
    <path d="M83 42 L17 102" />
    {/* Rho — vertical stem */}
    <path d="M50 8 V 116" />
    {/* Rho — the bowl */}
    <path d="M50 12 C 74 12, 76 44, 50 46" />
  </svg>
);

/**
 * Ichthys (ΙΧΘΥΣ) — the fish. Scratched on catacomb walls before
 * the cross was ever safe to display openly.
 */
export const Ichthys = ({ className, strokeWidth = 5, title = "Ichthys" }: MarkProps) => (
  <svg
    viewBox="0 0 140 72"
    fill="none"
    role="img"
    aria-label={title}
    className={className}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 36 C 40 2, 92 2, 118 36 C 92 70, 40 70, 8 36 Z" />
    <path d="M112 16 L 134 36 L 112 56" />
  </svg>
);

/**
 * The staurogram (⳨) — tau-rho. Found in the earliest New Testament
 * papyri as an abbreviation of σταυρός, and the first known pictorial
 * reference to the crucifixion.
 */
export const Staurogram = ({ className, strokeWidth = 5, title = "Staurogram" }: MarkProps) => (
  <svg
    viewBox="0 0 100 124"
    fill="none"
    role="img"
    aria-label={title}
    className={className}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M50 8 V 116" />
    <path d="M16 44 H 84" />
    <path d="M50 12 C 74 12, 76 40, 50 42" />
  </svg>
);

/**
 * A small lozenge-and-cross used as a typographic ornament between
 * sections — the register break of a manuscript page.
 */
export const OrnamentGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path
      d="M12 2 L15 9 L22 12 L15 15 L12 22 L9 15 L2 12 L9 9 Z"
      fill="currentColor"
      opacity="0.9"
    />
  </svg>
);

/**
 * The ornamental rule: hairline, glyph, hairline.
 * Used in place of a plain <hr> everywhere on the site.
 */
export const OrnamentRule = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
    <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-border" />
    <OrnamentGlyph className="w-3 h-3 text-accent" />
    <span className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-border" />
  </div>
);

/**
 * OrnamentField — the hero ground.
 *
 * A tiling lattice of roundels and equal-armed crosses, drawn from the
 * vocabulary of Coptic textile bands and Byzantine floor mosaic. Rendered
 * inline (not as a background-image) so it inherits currentColor and
 * therefore adapts to light and dark without a second asset.
 *
 * The tile is 128px square, so translating the field by exactly 128px in
 * each axis loops seamlessly — see .animate-drift.
 */
export const OrnamentField = ({ className = "" }: { className?: string }) => (
  <svg className={className} aria-hidden="true" width="100%" height="100%">
    <defs>
      <pattern id="np-ornament" width="128" height="128" patternUnits="userSpaceOnUse">
        {/* central roundel */}
        <circle cx="64" cy="64" r="38" fill="none" stroke="currentColor" strokeWidth="1.1" />
        {/* equal-armed cross within */}
        <path d="M64 42 V86 M42 64 H86" stroke="currentColor" strokeWidth="1.1" fill="none" />
        {/* bars connecting roundel to roundel */}
        <path d="M64 0 V22 M64 106 V128 M0 64 H22 M106 64 H128" stroke="currentColor" strokeWidth="0.9" fill="none" />
        {/* lozenges at the lattice intersections */}
        <path d="M64 6 l6 6 l-6 6 l-6 -6 Z" fill="currentColor" opacity="0.5" />
        <path d="M6 64 l6 6 l-6 6 l-6 -6 Z" fill="currentColor" opacity="0.5" />
        {/* corner quarter-arcs — resolve into full circles across the seam */}
        <circle cx="0" cy="0" r="11" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <circle cx="128" cy="0" r="11" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <circle cx="0" cy="128" r="11" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <circle cx="128" cy="128" r="11" fill="none" stroke="currentColor" strokeWidth="0.9" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#np-ornament)" />
  </svg>
);
