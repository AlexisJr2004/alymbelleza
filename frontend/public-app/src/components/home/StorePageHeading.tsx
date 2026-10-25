import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import StoreIcon, { type StoreIconName } from './StoreIcon';
import '../../styles/commerce.css';

interface StorePageHeadingProps {
  page: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
  icon: StoreIconName;
}

export default function StorePageHeading({ page, eyebrow, title, description, icon }: StorePageHeadingProps) {
  return <>
    <nav className="bb-commerce-breadcrumb" aria-label="Ruta de navegación">
      <Link to="/">Inicio</Link><StoreIcon name="chevron" /><span aria-current="page">{page}</span>
    </nav>
    <header className="bb-commerce-heading">
      <div><p className="bb-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>
      <span className="bb-commerce-heading-icon"><StoreIcon name={icon} /></span>
    </header>
  </>;
}
