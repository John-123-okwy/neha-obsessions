export default function ChefHatLogo({ size = 22 }) {
  return (
    <svg width={size} height={size * (58/48)} viewBox="0 -2 48 58" fill="none">
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 13 C13.5 10.5, 18.5 8, 16 6 S13.5 2.5, 16 1" />
        <path d="M24 14 C21.5 11, 26.5 8, 24 5.5 S21.5 1.5, 24 0" />
        <path d="M32 13 C29.5 10.5, 34.5 8, 32 6 S29.5 2.5, 32 1" />
        <circle cx="15" cy="31" r="7.5" />
        <circle cx="24" cy="29" r="9" />
        <circle cx="33" cy="31" r="7.5" />
        <rect x="13" y="34" width="22" height="11" rx="4" />
        <rect x="10" y="42" width="28" height="9" rx="2.5" />
      </g>
    </svg>
  );
}