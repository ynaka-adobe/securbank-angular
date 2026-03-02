/*
 * AEM Embed WebComponent
 * Include content from one Helix page in any other web surface.
 * https://www.hlx.live/developer/block-collection/TBD
 */

// eslint-disable-next-line import/prefer-default-export
export class AEMEmbed extends HTMLElement {
  constructor() {
    super();

    // Attaches a shadow DOM tree to the element
    // With mode open the shadow root elements are accessible from JavaScript outside the root
    this.attachShadow({ mode: 'open' });

    // Keep track if we have rendered the fragment yet.
    this.initialized = false;
  
    window.hlx = window.hlx || {};
    window.hlx.suppressLoadPage = true;
    [window.hlx.codeBasePath] = new URL(import.meta.url).pathname.split('/scripts/');
  }

  async loadBlock(body, block, blockName, origin) {
    const blockCss = `${origin}/blocks/${blockName}/${blockName}.css`;
    if (!body.querySelector(`link[href="${blockCss}"]`)) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', blockCss);
  
      const cssLoaded = new Promise((resolve) => {
        link.onload = resolve;
        link.onerror = resolve;
      });
  
      body.appendChild(link);
      // eslint-disable-next-line no-await-in-loop
      await cssLoaded;
    }

    try {
      const blockScriptUrl = `${origin}/blocks/${blockName}/${blockName}.js`;
      // eslint-disable-next-line no-await-in-loop
      const decorateBlock = await import(blockScriptUrl);
      if (decorateBlock.default) {
        // eslint-disable-next-line no-await-in-loop
        await decorateBlock.default(block);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('An error occured while loading the content');
    }
  }

  async handleHeader(htmlText, body, origin) {
    await this.pseudoDecorateMain(htmlText, body, origin);
    
    const main = body.querySelector('main');
    const header = document.createElement('header');
    body.append(header);
    const { buildBlock } = await import(`${origin}/scripts/aem.js`);
    const block = buildBlock('header', '');
    header.append(block);

    const cell = block.firstElementChild.firstElementChild;
    const nav = document.createElement('nav');
    cell.append(nav);
    while (main.firstElementChild) nav.append(main.firstElementChild);
    main.remove();

    await this.loadBlock(body, block, 'header', origin);

    block.dataset.blockStatus = 'loaded';

    body.style.height = 'var(--nav-height)';
    body.classList.add('appear');
  }

  async handleFooter(htmlText, body, origin) {
    await this.pseudoDecorateMain(htmlText, body, origin);
    
    const main = body.querySelector('main');
    const footer = document.createElement('footer');
    body.append(footer);
    const { buildBlock } = await import(`${origin}/scripts/aem.js`);
    const block = buildBlock('footer', '');
    footer.append(block);

    const cell = block.firstElementChild.firstElementChild;
    const nav = document.createElement('nav');
    cell.append(nav);
    while (main.firstElementChild) nav.append(main.firstElementChild);
    main.remove();

    await this.loadBlock(body, block, 'footer', origin);

    block.dataset.blockStatus = 'loaded';
    body.classList.add('appear');
  }

  async pseudoDecorateMain(htmlText, body, origin) {
    const main = document.createElement('main');
    body.append(main);
    main.innerHTML = htmlText;

    try {
      const mod = await import(`${origin}/scripts/scripts.js`);
      window.hlx.codeBasePath = origin;
      if (mod.decorateMain) {
        await mod.decorateMain(main, true);
      }
    } catch {
      window.hlx.codeBasePath = origin;
    }

    // Query all the blocks (Franklin adds .block; Author Kit etc. use block-name as first class)
    let blockElements = main.querySelectorAll('.block');
    if (blockElements.length === 0) {
      blockElements = main.querySelectorAll('main > div > div[class], main > div > div > div[class]');
    }

    if (blockElements.length > 0) {
      for (let i = 0; i < blockElements.length; i += 1) {
        const block = blockElements[i];
        const blockName = block.classList.contains('block')
          ? block.dataset.blockName || block.classList.item(1)
          : block.classList.item(0);
        if (blockName && blockName !== 'block') {
          await this.loadBlock(body, block, blockName, origin);
        }
      }
    }
  
    const sections = main.querySelectorAll('.section, main > div');
    sections.forEach((s) => {
      s.dataset.sectionStatus = 'loaded';
      s.style.display = 'block';
      s.style.visibility = 'visible';
    });
    main.style.display = 'block';
    
  }

  async handleMain(htmlText, body, origin) {
    await this.pseudoDecorateMain(htmlText, body, origin);
    body.classList.add('appear');
    body.style.display = 'block';
    body.style.visibility = 'visible';
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   * This will happen each time the node is moved, and may happen before the element's contents
   * have been fully parsed.
   */
  async connectedCallback() {
    if (!this.initialized) {
      let savedCodeBasePath;
      try {
        const urlAttribute = this.attributes.getNamedItem('url');
        if (!urlAttribute) {
          throw new Error('aem-embed missing url attribute');
        }

        const type = this.getAttribute('type') || 'main';

        const body = document.createElement('body');
        body.style = 'display: none';
        this.shadowRoot.append(body);

        const url = urlAttribute.value;
        const plainUrl = url.endsWith('/') ? `${url}index.plain.html` : `${url}.plain.html`;
        const { href, origin } = new URL(plainUrl);

        savedCodeBasePath = window.hlx.codeBasePath;
        window.hlx.codeBasePath = origin;

        // Load fragment
        const resp = await fetch(href);
        if (!resp.ok) {
          throw new Error(`Unable to fetch ${href}`);
        }

        const styles = document.createElement('link');
        styles.setAttribute('rel', 'stylesheet');
        styles.setAttribute('href', `${origin}/styles/styles.css`);
        const stylesLoaded = new Promise((resolve) => {
          styles.onload = () => { body.style = ''; resolve(); };
          styles.onerror = resolve;
        });
        this.shadowRoot.appendChild(styles);
        await stylesLoaded;

        let htmlText = await resp.text();
        // Fix relative/same-origin image and media urls
        htmlText = htmlText.replace(/\.\/media/g, `${origin}/media`);
        htmlText = htmlText.replace(/(["'])\/media\//g, `$1${origin}/media/`);

        // Set initialized to true so we don't run through this again
        this.initialized = true;
 
        if (type === 'main') await this.handleMain(htmlText, body, origin);
        if (type === 'header') await this.handleHeader(htmlText, body, origin);
        if (type === 'footer') await this.handleFooter(htmlText, body, origin);

        const fonts = document.createElement('link');
        fonts.setAttribute('rel', 'stylesheet');
        fonts.setAttribute('href', `${origin}/styles/fonts.css`);
        this.shadowRoot.appendChild(fonts);

        window.hlx.codeBasePath = savedCodeBasePath;
      } catch (err) {
        window.hlx.codeBasePath = savedCodeBasePath;
        // eslint-disable-next-line no-console
        console.log(err || 'An error occured while loading the content');
      }
    }
  }

  /**
   * Imports a script and appends to document body
   * @param {*} url
   * @returns
   */

  // eslint-disable-next-line class-methods-use-this
  async importScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.type = 'module';
      script.onload = resolve;
      script.onerror = reject;

      document.body.appendChild(script);
    });
  }
}

customElements.define('aem-embed', AEMEmbed);
