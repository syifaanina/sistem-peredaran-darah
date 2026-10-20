// Coordinates refer to the entire supplied 1254 × 1254 illustration.
// Each segment starts at the exact endpoint of the previous segment.
// Internal heart connections and the capillary behind the body silhouette
// are inferred: the raster reference does not expose these vessels fully.
export const BLUE = '#007bd5';
export const RED = '#f51e37';
export const routes = {
  kecil: {
    title: 'Peredaran Darah Kecil',
    summary: 'Bilik kanan → paru-paru → serambi kiri',
    stages: ['Menuju paru-paru', 'Pertukaran gas di paru-paru', 'Kembali ke jantung'],
    segments: [
      { color: BLUE, d: 'M 647 589 C 627 566 612 533 629 494 C 633 471 628 439 637 409 C 645 380 678 365 669 345 C 664 329 640 328 615 328 L 481 328 Q 436 328 436 281 L 436 192 Q 436 144 482 143 L 521 143' },
      { exchange: true, d: 'M 521 143 C 542 127 564 122 584 135 C 606 150 609 185 592 201 C 576 218 548 209 535 191 C 521 172 545 159 570 151 C 596 141 613 138 635 139 C 657 139 677 146 700 158 C 728 173 726 193 707 205 C 684 221 655 201 659 178 C 662 155 697 143 738 145' },
      { color: RED, d: 'M 738 145 L 779 145 Q 821 145 821 188 L 821 349 Q 821 394 780 395 L 744 395 C 715 394 687 404 690 431 C 691 443 701 450 710 455' },
    ],
  },
  besar: {
    title: 'Peredaran Darah Besar',
    summary: 'Bilik kiri → seluruh tubuh → serambi kanan',
    stages: ['Menuju seluruh tubuh', 'Pertukaran gas di tubuh', 'Kembali ke jantung'],
    segments: [
      { color: RED, d: 'M 715 580 C 733 553 724 521 694 492 C 663 463 640 423 640 378 L 640 339 Q 640 311 670 311 L 844 311 Q 879 311 879 350 L 879 714 Q 879 766 849 790 C 811 829 806 860 800 917 C 796 985 743 1068 661 1093' },
      { exchange: true, d: 'M 661 1093 C 645 1099 608 1100 589 1093 C 537 1079 499 1031 477 977 C 460 935 464 892 455 864 C 444 829 426 815 410 795' },
      { color: BLUE, d: 'M 410 795 Q 382 772 382 725 L 382 453 Q 382 394 427 394 L 529 394 C 551 395 563 413 563 437' },
    ],
  },
};

export function particleColor(mode, segment, progress) {
  if (!segment.exchange) return segment.color;
  const from = mode === 'kecil' ? [0, 123, 213] : [245, 30, 55];
  const to = mode === 'kecil' ? [245, 30, 55] : [0, 123, 213];
  const t = progress * progress * (3 - 2 * progress);
  return `rgb(${from.map((value, i) => Math.round(value + (to[i] - value) * t)).join(',')})`;
}
