import { useEffect, useRef, useState } from 'react';
import type { ChairVariantDef, PartsState } from '../types';
import { answerQuestion, interpretCommand } from '../utils/assistant';

interface Props {
  variant?: ChairVariantDef;
  partsState: PartsState;
  onChange: (partId: string, updates: Partial<PartsState[string]>) => void;
  onResetPart: (partId: string) => void;
  onResetAll: () => void;
  onAccessoryToggle: (id: string, enabled: boolean) => void;
  accessoriesSupported: boolean;
}

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
}

let msgCounter = 0;
const nextId = () => (msgCounter += 1);

export default function AssistantBar({
  variant,
  partsState,
  onChange,
  onResetPart,
  onResetAll,
  onAccessoryToggle,
  accessoriesSupported,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: nextId(),
      role: 'assistant',
      text: variant
        ? "Bonjour ! Je peux personnaliser ton fauteuil (« mets le dossier en rouge », « enlève les accoudoirs ») ou répondre à tes questions (choix, entretien, aides, export...). Que veux-tu faire ?"
        : "Bonjour ! Pour modifier les pièces, choisis d'abord un modèle du catalogue plutôt qu'un fichier importé. En attendant, pose-moi une question (choix du fauteuil, entretien, aides financières, export...).",
    },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');

    let replyText: string;
    if (variant) {
      const result = interpretCommand(text, variant, partsState, accessoriesSupported);
      if (result) {
        if (result.resetAll) onResetAll();
        result.resetPartIds?.forEach((id) => onResetPart(id));
        result.updates?.forEach(({ partId, changes }) => onChange(partId, changes));
        result.accessoryToggles?.forEach(({ id, enabled }) => onAccessoryToggle(id, enabled));
        replyText = result.reply;
      } else {
        replyText = answerQuestion(text);
      }
    } else {
      replyText = answerQuestion(text);
    }

    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: 'user', text },
      { id: nextId(), role: 'assistant', text: replyText },
    ]);
  };

  return (
    <section className="assistant-bar">
      <div className="assistant-header">
        <h2>Assistant fauteuil</h2>
        <p className="hint">Assistant local intégré au site (sans connexion Internet) — pose une question ou donne une instruction.</p>
      </div>
      <div className="assistant-messages" ref={listRef}>
        {messages.map((m) => (
          <div key={m.id} className={`assistant-msg ${m.role}`}>
            {m.text}
          </div>
        ))}
      </div>
      <form className="assistant-input-row" onSubmit={handleSubmit}>
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={variant ? 'Ex : « mets le dossier en bleu », « enlève les accoudoirs »…' : 'Pose une question…'}
          aria-label="Écrire à l'assistant"
        />
        <button type="submit" className="cta small">
          Envoyer
        </button>
      </form>
    </section>
  );
}
