/**
 * Load `public/scripts/aem-embed.js` at runtime so Vite does not treat it as an
 * index.html entry (absolute `/scripts/...` resolves to repo root and fails pre-transform).
 */
export function loadAemEmbedWebComponent(): Promise<void> {
  if (typeof customElements !== 'undefined' && customElements.get('aem-embed')) {
    return Promise.resolve();
  }

  const src = new URL('scripts/aem-embed.js', document.baseURI).href;

  return new Promise((resolve, reject) => {
    for (const el of document.querySelectorAll('script[data-aem-embed]')) {
      if (el.getAttribute('src') === src) {
        el.addEventListener('load', () => resolve(), { once: true });
        el.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), {
          once: true,
        });
        return;
      }
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = src;
    script.dataset['aemEmbed'] = '';
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), {
      once: true,
    });
    document.head.appendChild(script);
  });
}
