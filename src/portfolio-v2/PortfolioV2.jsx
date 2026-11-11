import { useEffect, useRef } from 'react';
import markup from './markup.html?raw';
import './portfolio-v2.css';
import { initField, initDivider } from './field.js';
import { initSite } from './site.js';

/**
 * The red-and-black portfolio. The page markup lives in markup.html so the
 * design stays in one place; this component mounts it and starts the code
 * field, the footer divider, the copy keys, the code-pane wires and the
 * contact form (which posts to /api/contact). Every init returns a cleanup,
 * so React StrictMode's double mount is safe.
 *
 * The rebuild effect is loaded separately from /rebuild.js in index.html.
 */
export default function PortfolioV2() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const offs = [
      initField(root.querySelector('.hero')),
      initDivider(root.querySelector('canvas.divider')),
      initSite(root),
    ];
    return () => offs.forEach((off) => off && off());
  }, []);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: markup }} />;
}
