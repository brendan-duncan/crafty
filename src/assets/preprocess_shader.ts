function _evaluateIf(condition: string, defines: Record<string, string>): boolean {
  let expr = condition;
  expr = expr.replace(/defined\s*\(\s*(\w+)\s*\)/g, (_, name) =>
    name in defines ? '1' : '0',
  );
  expr = expr.replace(/\b([a-zA-Z_]\w*)\b/g, (_, name) =>
    name in defines ? (defines[name] || '1') : '0',
  );
  return !!new Function('return (' + expr + ')')();
}

export function preprocessShader(code: string, defines?: Record<string, string>): string {
  defines = defines ?? {};
  const lines = code.split('\n');
  const out: string[] = [];
  const stack: { active: boolean; taken: boolean; elseSeen: boolean }[] = [];

  const isActive = (): boolean => {
    for (let i = 0; i < stack.length; i++) {
      if (!stack[i].active) {
        return false;
      }
    }
    return true;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed.startsWith('#')) {
      if (isActive()) {
        out.push(line);
      }
      continue;
    }

    const rest = trimmed.slice(1).trimStart();
    const dMatch = rest.match(/^(\w+)/);
    if (!dMatch) {
      if (isActive()) {
        out.push(line);
      }
      continue;
    }

    const directive = dMatch[1];

    switch (directive) {
    case 'define': {
      if (isActive()) {
        const sub = rest.slice('define'.length).trimStart();
        const nMatch = sub.match(/^(\w+)/);
        if (nMatch) {
          const name = nMatch[1];
          const value = sub.slice(name.length).trim();
          defines[name] = value || '1';
        }
      }
      break;
    }
    case 'undef': {
      if (isActive()) {
        const name = rest.slice('undef'.length).trim();
        if (name) {
          delete defines[name];
        }
      }
      break;
    }
    case 'if': {
      const condition = rest.slice('if'.length).trim();
      const active = isActive();
      const result = active ? _evaluateIf(condition, defines) : false;
      stack.push({ active: result, taken: result, elseSeen: false });
      break;
    }
    case 'ifdef': {
      const name = rest.slice('ifdef'.length).trim();
      const active = isActive();
      const defined = active && defines.hasOwnProperty(name);
      stack.push({ active: defined, taken: defined, elseSeen: false });
      break;
    }
    case 'elif': {
      if (stack.length === 0) {
        break;
      }
      const frame = stack[stack.length - 1];
      if (frame.elseSeen) {
        break;
      }
      const condition = rest.slice('elif'.length).trim();
      const outerActive = stack.length === 1 || stack.slice(0, -1).every(s => s.active);
      const result = outerActive ? _evaluateIf(condition, defines) : false;
      frame.active = !frame.taken && result;
      frame.taken = frame.taken || result;
      break;
    }
    case 'else': {
      if (stack.length === 0) {
        break;
      }
      const frame = stack[stack.length - 1];
      if (frame.elseSeen) {
        break;
      }
      frame.active = !frame.taken;
      frame.elseSeen = true;
      break;
    }
    case 'endif': {
      if (stack.length > 0) {
        stack.pop();
      }
      break;
    }
    default:
      if (isActive()) {
        out.push(line);
      }
      break;
    }
  }

  return out.join('\n');
}
