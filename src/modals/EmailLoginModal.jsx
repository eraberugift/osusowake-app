import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { CenterModal } from '../components/ModalShell.jsx';
import EmailBlock from '../components/EmailBlock.jsx';

export default function EmailLoginModal() {
  const { setShowEmailLogin, emailInput, setEmailInput, savingEmail, handleEmailSubmit } = useApp();
  return (
    <CenterModal onClose={() => setShowEmailLogin(false)} closable>
      <h3 className="font-bold text-sm mb-3">メールアドレスでログイン</h3>
      <EmailBlock
        notifyEmail={null}
        editingEmail={false}
        emailInput={emailInput}
        setEmailInput={setEmailInput}
        savingEmail={savingEmail}
        onSubmit={handleEmailSubmit}
        helperText="以前作ったリストがあれば、そのメールアドレスを入力すると復元できます"
      />
    </CenterModal>
  );
}
