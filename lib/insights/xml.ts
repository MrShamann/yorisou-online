type ParsedNode = {
  tag: string;
  attrs: Record<string, string>;
  inner: string;
};

function decodeAttributes(value: string) {
  const attrs: Record<string, string> = {};
  const matches = value.matchAll(/([a-zA-Z0-9:_-]+)\s*=\s*"([^"]*)"/g);

  for (const match of matches) {
    attrs[match[1]] = match[2];
  }

  return attrs;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class XMLParser {
  constructor(private readonly xml: string) {}

  getRepeated(tag: string) {
    const pattern = new RegExp(`<${escapeRegExp(tag)}([^>]*)>([\\s\\S]*?)</${escapeRegExp(tag)}>`, "g");
    const items: XMLNode[] = [];

    for (const match of this.xml.matchAll(pattern)) {
      items.push(
        new XMLNode({
          tag,
          attrs: decodeAttributes(match[1] || ""),
          inner: match[2] || "",
        })
      );
    }

    return items;
  }
}

class XMLNode {
  constructor(private readonly node: ParsedNode) {}

  getFirst(tag: string) {
    const pattern = new RegExp(`<${escapeRegExp(tag)}(?:[^>]*)>([\\s\\S]*?)</${escapeRegExp(tag)}>`);
    const match = this.node.inner.match(pattern);
    return match ? match[1].trim() : "";
  }

  getRepeated(tag: string) {
    const pattern = new RegExp(`<${escapeRegExp(tag)}([^>]*)\\/?>(?:([\\s\\S]*?)</${escapeRegExp(tag)}>)?`, "g");
    const items: XMLNode[] = [];

    for (const match of this.node.inner.matchAll(pattern)) {
      items.push(
        new XMLNode({
          tag,
          attrs: decodeAttributes(match[1] || ""),
          inner: match[2] || "",
        })
      );
    }

    return items;
  }

  getAttribute(name: string) {
    return this.node.attrs[name] || "";
  }
}
