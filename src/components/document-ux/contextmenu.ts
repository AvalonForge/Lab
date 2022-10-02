export class ContextMenu {
  top: number;
  left: number;
  width = 240;
  height = 400;

  items: Array<MenuItem>;
  search = "";
  run = (handler: () => void) => {
    handler();
  };

  constructor(
    top: number,
    left: number,
    items: Array<MenuItem>,
    width?: number,
    height?: number,
    search?: string
  ) {
    this.top = top;
    this.left = left;
    this.items = items;

    if (width) this.width = width;
    if (height) this.height = height;
    if (search) this.search = search;
  }

  update({
    top,
    left,
    search,
  }: {
    top?: number;
    left?: number;
    search: string;
  }): ContextMenu {
    return new ContextMenu(
      top ? top : this.top,
      left ? left : this.left,
      this.items,
      this.width,
      this.height,
      search ? search : this.search
    );
  }

  get location() {
    const loc: any = {
      position: "fixed",
      "z-index": 10,
      "min-width": `${this.width}px`,
      "max-height": `${this.height}px`,
    };
    if (this.top + this.height < window.innerHeight) {
      loc.top = this.top;
      loc.height = this.height;
    } else {
      loc.bottom = window.innerHeight - this.top;
      loc.height = this.height;
    }
    if (this.left + this.width < window.innerWidth) {
      loc.left = this.left;
      loc.width = this.width;
    } else {
      loc.right = window.innerWidth - this.left;
      loc.width = this.width;
    }
    return loc;
  }
}

export class MenuItem {
  key: string;
  title: string;
  description?: string;
  icon?: string;

  handler?: (props: any) => void;

  constructor({
    key,
    title,
    icon,
    description,
    handler,
  }: {
    key: string;
    title: string;
    icon?: string;
    description?: string;
    handler?: (props: any) => void;
  }) {
    this.key = key;
    this.title = title;
    if (handler) this.handler = handler;
    if (icon) this.icon = icon;
    if (description) this.description = description;
  }
}
