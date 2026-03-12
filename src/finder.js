/**
 * Finder - A macOS Finder-style column browser component.
 * Demo-only JavaScript; the primary deliverable is the CSS.
 */
export class Finder {
  /**
   * @param {HTMLElement} container - Mount point element
   * @param {object} options
   * @param {Array} options.data - Tree data (each node: { id, name, icon, children?, meta? })
   * @param {function} [options.onSelect] - Callback when an item is selected
   * @param {function} [options.renderPreview] - Custom preview renderer (receives data item, returns HTML string)
   * @param {boolean} [options.showSearch] - Show search in root column
   */
  constructor(container, options = {}) {
    this.container = container;
    this.data = options.data || [];
    this.onSelect = options.onSelect || null;
    this.customRenderPreview = options.renderPreview || null;
    this.showSearch = options.showSearch ?? true;
    this.keyboardMode = options.keyboardMode || 'outline'; // 'outline' or 'navigate'

    this.root = document.createElement('div');
    this.root.classList.add('pf-v6-c-finder');
    this.root.setAttribute('aria-label', 'Finder');
    this.container.appendChild(this.root);

    this.columnsEl = document.createElement('div');
    this.columnsEl.classList.add('pf-v6-c-finder__columns');
    this.root.appendChild(this.columnsEl);

    this.columns = [];
    this.previewEl = null;

    this.root.addEventListener('keydown', (e) => this.handleKeydown(e));

    this.renderColumn(this.data, 'Root');
  }

  /**
   * Render a column with the given items.
   * @param {Array} items - Array of data items for this column
   * @param {string} title - Column header title
   * @param {boolean} [withSearch=false] - Whether to include search input
   */
  renderColumn(items, title, withSearch = this.showSearch && this.columns.length === 0) {
    const col = document.createElement('div');
    col.classList.add('pf-v6-c-finder__column');

    // Header
    const header = document.createElement('div');
    header.classList.add('pf-v6-c-finder__column-header');

    const headerText = document.createElement('span');
    headerText.classList.add('pf-v6-c-finder__column-header-text');
    headerText.textContent = title;
    header.appendChild(headerText);

    const headerActions = document.createElement('div');
    headerActions.classList.add('pf-v6-c-finder__column-header-actions');

    const addBtn = document.createElement('button');
    addBtn.classList.add('pf-v6-c-button', 'pf-m-plain');
    addBtn.setAttribute('aria-label', 'Add');
    addBtn.innerHTML = '<i class="fas fa-plus"></i>';
    headerActions.appendChild(addBtn);

    const moreBtn = document.createElement('button');
    moreBtn.classList.add('pf-v6-c-button', 'pf-m-plain');
    moreBtn.setAttribute('aria-label', 'More actions');
    moreBtn.innerHTML = '<i class="fas fa-ellipsis-vertical"></i>';
    headerActions.appendChild(moreBtn);

    header.appendChild(headerActions);
    col.appendChild(header);

    // Search
    if (withSearch) {
      const search = document.createElement('div');
      search.classList.add('pf-v6-c-finder__column-search');

      const searchInput = document.createElement('div');
      searchInput.classList.add('pf-v6-c-search-input');

      const inputGroup = document.createElement('div');
      inputGroup.classList.add('pf-v6-c-input-group');

      const inputGroupItem = document.createElement('div');
      inputGroupItem.classList.add('pf-v6-c-input-group__item', 'pf-m-fill');

      const textInputGroup = document.createElement('div');
      textInputGroup.classList.add('pf-v6-c-text-input-group');

      const textInputGroupMain = document.createElement('div');
      textInputGroupMain.classList.add('pf-v6-c-text-input-group__main');

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('pf-v6-c-text-input-group__icon');
      iconSpan.innerHTML = '<i class="fas fa-search"></i>';
      textInputGroupMain.appendChild(iconSpan);

      const input = document.createElement('input');
      input.classList.add('pf-v6-c-text-input-group__text-input');
      input.type = 'search';
      input.placeholder = 'Filter';
      input.setAttribute('aria-label', 'Filter items');
      input.addEventListener('input', () => this.filterItems(col, input.value));
      textInputGroupMain.appendChild(input);

      textInputGroup.appendChild(textInputGroupMain);
      inputGroupItem.appendChild(textInputGroup);
      inputGroup.appendChild(inputGroupItem);
      searchInput.appendChild(inputGroup);
      search.appendChild(searchInput);
      col.appendChild(search);
    }

    // Items list
    const list = document.createElement('ul');
    list.classList.add('pf-v6-c-finder__column-items');

    items.forEach((dataItem) => {
      const li = document.createElement('li');
      li.classList.add('pf-v6-c-finder__column-item');
      li.setAttribute('tabindex', '0');
      li.setAttribute('aria-selected', 'false');

      const isFolder = dataItem.children && dataItem.children.length > 0;
      if (isFolder) {
        li.classList.add('pf-m-folder');
      }

      const row = document.createElement('div');
      row.classList.add('pf-v6-c-finder__column-item-row');

      // Icon
      if (dataItem.icon) {
        const icon = document.createElement('span');
        icon.classList.add('pf-v6-c-finder__column-item-icon');
        icon.innerHTML = `<i class="${dataItem.icon}"></i>`;
        row.appendChild(icon);
      }

      // Content (text + optional description)
      const content = document.createElement('span');
      content.classList.add('pf-v6-c-finder__column-item-content');

      const text = document.createElement('span');
      text.classList.add('pf-v6-c-finder__column-item-text');
      text.textContent = dataItem.name;
      content.appendChild(text);

      if (dataItem.description) {
        const desc = document.createElement('span');
        desc.classList.add('pf-v6-c-finder__column-item-description');
        desc.textContent = dataItem.description;
        content.appendChild(desc);
      }

      row.appendChild(content);

      // Item actions (show on folders and select files)
      if (dataItem.actions) {
        const actions = document.createElement('span');
        actions.classList.add('pf-v6-c-finder__column-item-actions');

        const actionBtn = document.createElement('button');
        actionBtn.classList.add('pf-v6-c-button', 'pf-m-plain');
        actionBtn.setAttribute('aria-label', 'Item actions');
        actionBtn.innerHTML = '<i class="fas fa-ellipsis-vertical"></i>';
        actionBtn.addEventListener('click', (e) => {
          e.stopPropagation();
        });
        actions.appendChild(actionBtn);
        row.appendChild(actions);
      }

      // Folder chevron
      if (isFolder) {
        const folderIcon = document.createElement('span');
        folderIcon.classList.add('pf-v6-c-finder__column-item-folder-icon');
        folderIcon.innerHTML = '<i class="fas fa-angle-right"></i>';
        row.appendChild(folderIcon);
      }

      li.appendChild(row);
      li._finderData = dataItem;

      // Click handler
      li.addEventListener('click', () => this.handleItemClick(li, col, dataItem));

      list.appendChild(li);
    });

    col.appendChild(list);

    // Track column
    this.columns.push(col);

    this.columnsEl.appendChild(col);

    this.scrollToEnd();
  }

  /**
   * Get visible (not hidden) items in a column.
   */
  getVisibleItems(col) {
    return [...col.querySelectorAll('.pf-v6-c-finder__column-item')].filter((item) => !item.hidden);
  }

  /**
   * Handle keyboard navigation.
   */
  handleKeydown(e) {
    const li = e.target.closest('.pf-v6-c-finder__column-item');
    if (!li) return;

    const col = li.closest('.pf-v6-c-finder__column');
    if (!col) return;

    switch (e.key) {
      case 'Enter':
      case ' ': {
        e.preventDefault();
        this.handleItemClick(li, col, li._finderData);
        break;
      }

      case 'ArrowDown': {
        e.preventDefault();
        const items = this.getVisibleItems(col);
        const idx = items.indexOf(li);
        if (idx < items.length - 1) {
          const target = items[idx + 1];
          if (this.keyboardMode === 'navigate') {
            this.handleItemClick(target, col, target._finderData);
            target.focus();
          } else {
            target.focus();
          }
        }
        break;
      }

      case 'ArrowUp': {
        e.preventDefault();
        const items = this.getVisibleItems(col);
        const idx = items.indexOf(li);
        if (idx > 0) {
          const target = items[idx - 1];
          if (this.keyboardMode === 'navigate') {
            this.handleItemClick(target, col, target._finderData);
            target.focus();
          } else {
            target.focus();
          }
        }
        break;
      }

      case 'ArrowRight': {
        e.preventDefault();
        const colIndex = this.columns.indexOf(col);
        const nextCol = this.columns[colIndex + 1];
        if (nextCol) {
          const selected = nextCol.querySelector('.pf-v6-c-finder__column-item.pf-m-selected');
          const target = selected || this.getVisibleItems(nextCol)[0];
          if (target) {
            if (this.keyboardMode === 'navigate') {
              this.handleItemClick(target, nextCol, target._finderData);
            } else {
              this.setActiveColumn(nextCol);
            }
            target.focus();
            this.scrollColumnIntoView(nextCol);
          }
        }
        break;
      }

      case 'ArrowLeft': {
        e.preventDefault();
        const colIndex = this.columns.indexOf(col);
        if (colIndex > 0) {
          const prevCol = this.columns[colIndex - 1];
          const selected = prevCol.querySelector('.pf-v6-c-finder__column-item.pf-m-selected');
          if (selected) {
            this.setActiveColumn(prevCol);
            selected.focus();
            this.scrollColumnIntoView(prevCol);
          }
        }
        break;
      }
    }
  }

  /**
   * Handle clicking an item.
   */
  handleItemClick(li, col, dataItem) {
    // Mark active column
    this.setActiveColumn(col);

    // Deselect all items in this column
    col.querySelectorAll('.pf-v6-c-finder__column-item').forEach((item) => {
      item.classList.remove('pf-m-selected');
      item.setAttribute('aria-selected', 'false');
    });

    // Select current item
    li.classList.add('pf-m-selected');
    li.setAttribute('aria-selected', 'true');

    // Remove all columns after this one
    const colIndex = this.columns.indexOf(col);
    const toRemove = this.columns.splice(colIndex + 1);
    toRemove.forEach((c) => c.remove());

    // If folder, add child column
    const isFolder = dataItem.children && dataItem.children.length > 0;
    if (isFolder) {
      this.renderColumn(dataItem.children, dataItem.name);
    }

    // Update preview
    this.renderPreview(dataItem);

    // Notify callback
    if (this.onSelect) {
      this.onSelect(dataItem);
    }
  }

  /**
   * Render or update the preview pane.
   */
  renderPreview(dataItem) {
    if (this.previewEl) {
      this.previewEl.remove();
    }

    this.previewEl = document.createElement('div');
    this.previewEl.classList.add('pf-v6-c-finder__preview');

    const header = document.createElement('div');
    header.classList.add('pf-v6-c-finder__preview-header');
    header.textContent = dataItem.name;
    this.previewEl.appendChild(header);

    const body = document.createElement('div');
    body.classList.add('pf-v6-c-finder__preview-body');

    if (this.customRenderPreview) {
      body.innerHTML = this.customRenderPreview(dataItem);
    } else {
      body.innerHTML = this.defaultPreviewContent(dataItem);
    }

    this.previewEl.appendChild(body);
    this.root.appendChild(this.previewEl);
  }

  /**
   * Default preview content generator.
   */
  defaultPreviewContent(dataItem) {
    const isFolder = dataItem.children && dataItem.children.length > 0;
    const icon = dataItem.icon || (isFolder ? 'fas fa-folder' : 'fas fa-file');
    const lines = [];

    lines.push(`<div style="text-align: center; padding: var(--pf-t--global--spacer--400) 0;">`);
    lines.push(`  <i class="${icon}" style="font-size: 3rem; color: var(--pf-t--global--text--color--200);"></i>`);
    lines.push(`</div>`);

    if (dataItem.meta) {
      lines.push(`<dl style="margin: 0;">`);
      for (const [key, value] of Object.entries(dataItem.meta)) {
        lines.push(`  <dt style="font-weight: var(--pf-t--global--font--weight--200); margin-top: var(--pf-t--global--spacer--200);">${key}</dt>`);
        lines.push(`  <dd style="margin: 0; color: var(--pf-t--global--text--color--200);">${value}</dd>`);
      }
      lines.push(`</dl>`);
    }

    if (isFolder) {
      lines.push(`<p style="color: var(--pf-t--global--text--color--200); margin-top: var(--pf-t--global--spacer--300);">${dataItem.children.length} item${dataItem.children.length !== 1 ? 's' : ''}</p>`);
    }

    return lines.join('\n');
  }

  /**
   * Filter items in a column based on search query.
   */
  filterItems(col, query) {
    const normalizedQuery = query.toLowerCase().trim();
    const items = col.querySelectorAll('.pf-v6-c-finder__column-item');

    items.forEach((item) => {
      const text = item.querySelector('.pf-v6-c-finder__column-item-text');
      if (!text) return;

      const matches = !normalizedQuery || text.textContent.toLowerCase().includes(normalizedQuery);
      item.hidden = !matches;
    });
  }

  /**
   * Scroll a specific column into view within the columns container.
   */
  scrollColumnIntoView(col) {
    requestAnimationFrame(() => {
      const container = this.columnsEl;
      const colLeft = col.offsetLeft;
      const colRight = colLeft + col.offsetWidth;
      const scrollLeft = container.scrollLeft;
      const viewWidth = container.clientWidth;

      if (colLeft < scrollLeft) {
        container.scrollLeft = colLeft;
      } else if (colRight > scrollLeft + viewWidth) {
        container.scrollLeft = colRight - viewWidth;
      }
    });
  }

  /**
   * Auto-scroll the root container to show the newest column.
   */
  scrollToEnd() {
    requestAnimationFrame(() => {
      this.columnsEl.scrollLeft = this.columnsEl.scrollWidth;
    });
  }

  setActiveColumn(col) {
    this.columns.forEach((c) => c.classList.remove('pf-m-active'));
    col.classList.add('pf-m-active');
  }

  setKeyboardMode(mode) {
    this.keyboardMode = mode;
  }
}
