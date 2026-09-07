import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, className = 'w-5 h-5', ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      {children}
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </Icon>
  );
}

export function BarsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
    </Icon>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </Icon>
  );
}

export function BellNotificationIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </Icon>
  );
}

export function EmptyBellIcon(props: IconProps) {
  return (
    <Icon strokeWidth={1.5} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75" />
    </Icon>
  );
}
