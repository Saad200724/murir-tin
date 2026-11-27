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
