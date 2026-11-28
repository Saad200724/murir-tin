export function wireNativeDialogs(): void {
  const dialogs = document.querySelectorAll<HTMLDialogElement>('dialog');

  for (const dialog of dialogs) {
    dialog.addEventListener('close', () => {
      dialog.returnValue = '';
    });
  }

  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const outside = (e: PointerEvent, dlg: HTMLDialogElement): boolean => {
      const r = dlg.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    for (const dialog of document.querySelectorAll<HTMLDialogElement>('dialog[closedby="any"]')) {
      let pressedOutside = false;
      dialog.addEventListener('pointerdown', (e) => {
        pressedOutside = outside(e, dialog);
      });
      dialog.addEventListener('pointerup', (e) => {
        if (pressedOutside && outside(e, dialog)) {
          dialog.close();
        }
      });
    }
  }
}

function legacyCopy(text: string): boolean {
  const previousFocus = document.activeElement as HTMLElement | null;
  const field = Object.assign(document.createElement('textarea'), { value: text });
  field.setAttribute('readonly', '');
  field.style.cssText = 'position:fixed;inset-block-start:0;opacity:0';
  document.body.append(field);
  field.select();
  try {
    return document.execCommand('copy');
  } finally {
    field.remove();
    previousFocus?.focus({ preventScroll: true });
  }
}

export function wireCopyButtons(): void {
  const timers = new WeakMap<HTMLElement, number>();
  let lastMessage = '';

  const report = (button: HTMLElement, ok: boolean) => {
    const tip = button.nextElementSibling;
    if (!(tip instanceof HTMLElement)) return;
    window.clearTimeout(timers.get(button));
    button.removeAttribute('data-copied');
    button.removeAttribute('data-failed');
    let message = ok ? 'কপি হয়েছে!' : 'কপি ব্যর্থ';
    if (message === lastMessage) message += '\u00A0';
    lastMessage = message;
    tip.textContent = '';
    void button.offsetWidth;
    button.setAttribute(ok ? 'data-copied' : 'data-failed', '');
    requestAnimationFrame(() => {
      tip.textContent = message;
    });
    timers.set(
      button,
      window.setTimeout(() => {
        button.removeAttribute('data-copied');
        button.removeAttribute('data-failed');
        tip.textContent = '';
      }, 2000)
    );
  };

  const copyTarget = async (button: HTMLElement, target: HTMLElement) => {
    const text =
      target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
        ? target.value.trim()
        : target.innerText.trim();
    if (!text) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else if (!legacyCopy(text)) {
        throw new Error('Copy failed');
      }
      report(button, true);
    } catch {
      if (legacyCopy(text)) {
        report(button, true);
      } else {
        report(button, false);
      }
    }
  };

  // Register only Invoker Commands OR click fallback so a click never copies twice
  if ('CommandEvent' in window) {
    document.addEventListener(
      'command',
      (e) => {
        const ce = e as Event & { command?: string; source?: Element | null };
        if (ce.command === '--copy' && ce.source instanceof HTMLElement && e.target instanceof HTMLElement) {
          void copyTarget(ce.source, e.target);
        }
      },
      true
    );
  } else {
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented) return;
      const btn = (e.target as Element | null)?.closest?.('button[command="--copy"]');
      if (!(btn instanceof HTMLElement)) return;
      const targetId = btn.getAttribute('commandfor');
      const target = targetId ? document.getElementById(targetId) : null;
      if (target) void copyTarget(btn, target);
    });
  }
}
