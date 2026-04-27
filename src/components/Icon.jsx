// Inline icon component — пять основных тем + декор для шапки/тёмных режимов.

const PATHS = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </>
  ),
  moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  midnight: (
    <>
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
      <circle cx="12" cy="12" r="9" />
    </>
  ),
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 4 13c0-6 8-9 16-9 0 8-3 16-9 16z" />
      <path d="M2 22 13 11" />
    </>
  ),
  flame: (
    <path d="M12 2c1 4 4 5 4 10a4 4 0 0 1-8 0c0-2 1-3 1-5-2 1-3 3-3 5a6 6 0 0 0 12 0c0-5-3-8-6-10z" />
  ),
};

export function Icon({ name, size = 16, ...rest }) {
  const path = PATHS[name];
  if (!path) return null;
  const stroked = ['sun', 'moon', 'midnight', 'leaf'].includes(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={stroked ? 'none' : 'currentColor'}
      stroke={stroked ? 'currentColor' : 'none'}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {path}
    </svg>
  );
}
