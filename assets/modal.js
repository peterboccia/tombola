// Modern modal utility
(function () {
  // Show a modal with title, message, and confirm/cancel buttons
  // Returns a Promise<boolean> (true=confirm, false=cancel)
  window.showModal = function ({
    title = '',
    message = '',
    confirmText = 'Yes',
    cancelText = 'No',
  }) {
    return new Promise((resolve) => {
      // Create backdrop
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      // Modal
      const modal = document.createElement('div');
      modal.className = 'modal';
      // Title
      if (title) {
        const t = document.createElement('div');
        t.className = 'modal-title';
        t.textContent = title;
        modal.appendChild(t);
      }
      // Message
      if (message) {
        const m = document.createElement('div');
        m.className = 'modal-message';
        m.textContent = message;
        modal.appendChild(m);
      }
      // Actions
      const actions = document.createElement('div');
      actions.className = 'modal-actions';
      // Confirm
      const btnConfirm = document.createElement('button');
      btnConfirm.className = 'modal-btn confirm';
      btnConfirm.textContent = confirmText;
      btnConfirm.onclick = () => close(true);
      // Cancel
      const btnCancel = document.createElement('button');
      btnCancel.className = 'modal-btn cancel';
      btnCancel.textContent = cancelText;
      btnCancel.onclick = () => close(false);
      actions.appendChild(btnCancel);
      actions.appendChild(btnConfirm);
      modal.appendChild(actions);
      backdrop.appendChild(modal);
      document.body.appendChild(backdrop);
      // Focus
      setTimeout(() => btnConfirm.focus(), 50);
      // Close logic
      function close(result) {
        backdrop.remove();
        resolve(result);
      }
      // ESC closes (cancel)
      backdrop.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close(false);
      });
      backdrop.tabIndex = -1;
      backdrop.focus();
    });
  };
})();
