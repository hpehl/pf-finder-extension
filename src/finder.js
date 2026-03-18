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

    this.root = document.createElement('div');
    this.root.classList.add('pf-v6-c-finder');
    this.root.setAttribute('role', 'region');
    this.root.setAttribute('aria-label', 'Finder');
    this.container.appendChild(this.root);

    this.columnsEl = document.createElement('div');
    this.columnsEl.classList.add('pf-v6-c-finder__columns');
    this.root.appendChild(this.columnsEl);

    this.columns = [];
    this.previewEl = null;
    this.pinnedItems = new Map(); // column element -> Set of pinned data item ids

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

    const headerText = document.createElement('h4');
    headerText.classList.add('pf-v6-c-finder__column-title-text');
    headerText.textContent = title;
    header.appendChild(headerText);

    const headerActions = document.createElement('div');
    headerActions.classList.add('pf-v6-c-finder__column-actions');

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
      // language=html
      const html = '<div class="pf-v6-c-text-input-group"><div class="pf-v6-c-text-input-group__main pf-m-icon"><span class="pf-v6-c-text-input-group__text"><span class="pf-v6-c-text-input-group__icon"><svg class="pf-v6-svg" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true" role="img" width="1em" height="1em"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg></span><input type="text" class="pf-v6-c-text-input-group__text-input" aria-label="Filter by name" placeholder="Filter by name" value=""></span></div></div>';
      const search = document.createElement('div');
      search.classList.add('pf-v6-c-finder__column-search');
      search.innerHTML = html;
      const input = search.querySelector('.pf-v6-c-text-input-group__text-input');
      input.addEventListener('input', () => this.filterColumn(col, input.value));
      col.appendChild(search);
    }

    // Items list
    const list = document.createElement('ul');
    list.classList.add('pf-v6-c-finder__column-items');
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', title);

    items.forEach((dataItem) => {
      const li = document.createElement('li');
      li.classList.add('pf-v6-c-finder__item');
      li.setAttribute('role', 'option');
      li.setAttribute('tabindex', '0');
      li.setAttribute('aria-selected', 'false');

      const isFolder = dataItem.children && dataItem.children.length > 0;
      if (isFolder) {
        li.classList.add('pf-m-folder');
      }

      const row = document.createElement('div');
      row.classList.add('pf-v6-c-finder__item-row');

      // Icon
      if (dataItem.icon) {
        const icon = document.createElement('span');
        icon.classList.add('pf-v6-c-finder__item-icon');
        icon.innerHTML = `<i class="${dataItem.icon}"></i>`;
        row.appendChild(icon);
      }

      // Content (text + optional description)
      const content = document.createElement('span');
      content.classList.add('pf-v6-c-finder__item-content');

      const text = document.createElement('span');
      text.classList.add('pf-v6-c-finder__item-text');
      text.textContent = dataItem.name;
      content.appendChild(text);

      if (dataItem.description) {
        const desc = document.createElement('span');
        desc.classList.add('pf-v6-c-finder__item-description');
        desc.textContent = dataItem.description;
        content.appendChild(desc);
      }

      row.appendChild(content);

      // Item actions (show on folders and select files)
      if (dataItem.actions) {
        const actions = document.createElement('span');
        actions.classList.add('pf-v6-c-finder__item-actions');

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

      // Pin button (icon swap controlled by CSS via .pf-m-pinned)
      const pinBtn = document.createElement('button');
      pinBtn.classList.add('pf-v6-c-finder__item-pin');
      pinBtn.setAttribute('aria-label', 'Pin');
      pinBtn.setAttribute('aria-pressed', 'false');
      pinBtn.innerHTML = '<i class="fas fa-thumbtack pf-v6-c-finder__item-pin-icon--default"></i><i class="fas fa-times pf-v6-c-finder__item-pin-icon--pinned"></i>';
      pinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePin(li, col, dataItem);
      });
      row.appendChild(pinBtn);

      // Folder chevron (visibility controlled by CSS via .pf-m-folder)
      const folderIcon = document.createElement('span');
      folderIcon.classList.add('pf-v6-c-finder__item-folder-icon');
      folderIcon.innerHTML = '<i class="fas fa-angle-right"></i>';
      row.appendChild(folderIcon);

      li.appendChild(row);
      li._finderData = dataItem;
      li._finderOriginalIndex = items.indexOf(dataItem);

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
    return [...col.querySelectorAll('.pf-v6-c-finder__item')].filter((item) => !item.hidden);
  }

  /**
   * Handle keyboard navigation.
   */
  handleKeydown(e) {
    const li = e.target.closest('.pf-v6-c-finder__item');
    if (!li) return;

    const col = li.closest('.pf-v6-c-finder__column');
    if (!col) return;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const items = this.getVisibleItems(col);
        const idx = items.indexOf(li);
        if (idx < items.length - 1) {
          const target = items[idx + 1];
          this.handleItemClick(target, col, target._finderData);
          target.focus();
        }
        break;
      }

      case 'ArrowUp': {
        e.preventDefault();
        const items = this.getVisibleItems(col);
        const idx = items.indexOf(li);
        if (idx > 0) {
          const target = items[idx - 1];
          this.handleItemClick(target, col, target._finderData);
          target.focus();
        }
        break;
      }

      case 'ArrowRight': {
        e.preventDefault();
        const colIndex = this.columns.indexOf(col);
        const nextCol = this.columns[colIndex + 1];
        if (nextCol) {
          const selected = nextCol.querySelector('.pf-v6-c-finder__item.pf-m-selected');
          const target = selected || this.getVisibleItems(nextCol)[0];
          if (target) {
            this.handleItemClick(target, nextCol, target._finderData);
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
          const selected = prevCol.querySelector('.pf-v6-c-finder__item.pf-m-selected');
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
    col.querySelectorAll('.pf-v6-c-finder__item').forEach((item) => {
      item.classList.remove('pf-m-selected');
      item.setAttribute('aria-selected', 'false');
    });

    // Select current item
    li.classList.add('pf-m-selected');
    li.setAttribute('aria-selected', 'true');

    // Remove all columns after this one
    const colIndex = this.columns.indexOf(col);
    const toRemove = this.columns.splice(colIndex + 1);
    toRemove.forEach((c) => {
      this.pinnedItems.delete(c);
      c.remove();
    });

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
    lines.push(`  <i class="${icon}" style="font-size: 3rem; color: var(--pf-t--global--text--color--subtle);"></i>`);
    lines.push(`</div>`);

    if (dataItem.meta) {
      lines.push(`<dl style="margin: 0;">`);
      for (const [key, value] of Object.entries(dataItem.meta)) {
        lines.push(`  <dt style="font-weight: var(--pf-t--global--font--weight--200); margin-top: var(--pf-t--global--spacer--200);">${key}</dt>`);
        lines.push(`  <dd style="margin: 0; color: var(--pf-t--global--text--color--subtle);">${value}</dd>`);
      }
      lines.push(`</dl>`);
    }

    if (isFolder) {
      lines.push(`<p style="color: var(--pf-t--global--text--color--subtle); margin-top: var(--pf-t--global--spacer--300);">${dataItem.children.length} item${dataItem.children.length !== 1 ? 's' : ''}</p>`);
    }

    return lines.join('\n');
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

  /**
   * Filter items in a column by name.
   */
  filterColumn(col, query) {
    const filter = query.toLowerCase();
    const items = col.querySelectorAll('.pf-v6-c-finder__item');
    items.forEach((item) => {
      const name = item._finderData?.name?.toLowerCase() || '';
      item.hidden = filter !== '' && !name.includes(filter);
    });
  }

  togglePin(li, col, dataItem) {
    if (!this.pinnedItems.has(col)) {
      this.pinnedItems.set(col, []);
    }

    const pinned = this.pinnedItems.get(col);
    const list = col.querySelector('.pf-v6-c-finder__column-items');
    const isPinned = li.classList.contains('pf-m-pinned');

    if (isPinned) {
      // Unpin
      li.classList.remove('pf-m-pinned');
      const pinBtn = li.querySelector('.pf-v6-c-finder__item-pin');
      pinBtn.setAttribute('aria-label', 'Pin');
      pinBtn.setAttribute('aria-pressed', 'false');

      // Remove from pinned list
      const idx = pinned.indexOf(dataItem.id);
      if (idx !== -1) pinned.splice(idx, 1);

      // Remove li from current position
      li.remove();

      // Find unpinned items
      const unpinnedItems = [...list.querySelectorAll('.pf-v6-c-finder__item:not(.pf-m-pinned)')]
        .filter((item) => item !== li);

      // Find the right insertion point based on original index
      let inserted = false;
      for (const item of unpinnedItems) {
        if (item._finderOriginalIndex > li._finderOriginalIndex) {
          item.before(li);
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        list.appendChild(li);
      }

      // Remove divider if no more pinned items
      if (pinned.length === 0) {
        const divider = list.querySelector('.pf-v6-c-divider');
        if (divider) divider.remove();
      }
    } else {
      // Pin
      li.classList.add('pf-m-pinned');
      const pinBtn = li.querySelector('.pf-v6-c-finder__item-pin');
      pinBtn.setAttribute('aria-label', 'Unpin');
      pinBtn.setAttribute('aria-pressed', 'true');

      // Add to pinned list
      pinned.push(dataItem.id);

      // Remove li from current position
      li.remove();

      // Ensure divider exists
      let divider = list.querySelector('.pf-v6-c-divider');
      if (!divider) {
        divider = document.createElement('li');
        divider.classList.add('pf-v6-c-divider');
        divider.setAttribute('role', 'presentation');
      }

      // Insert pinned item before the divider
      // First remove divider, then re-add after all pinned items
      divider.remove();

      // Get all currently pinned items in the list
      const pinnedInDom = list.querySelectorAll('.pf-v6-c-finder__item.pf-m-pinned');
      if (pinnedInDom.length > 0) {
        // Insert after last pinned item
        const lastPinned = pinnedInDom[pinnedInDom.length - 1];
        lastPinned.after(li);
        li.after(divider);
      } else {
        // First pinned item - insert at top
        list.prepend(li);
        li.after(divider);
      }
    }
  }

}
