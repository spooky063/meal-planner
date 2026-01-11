import { useState, useEffect, useRef } from 'preact/hooks';

interface MealInputProps {
  roomName: string;
  day: string;
  mealType: 'midi' | 'soir';
  initialValue: string;
  label: string;
  icon: string;
}

export default function MealInput({
  roomName,
  day,
  mealType,
  initialValue,
  label,
  icon
}: MealInputProps) {
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [lastSavedValue, setLastSavedValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mettre à jour la valeur si initialValue change
  useEffect(() => {
    setValue(initialValue);
    setLastSavedValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Réinitialiser la hauteur pour calculer la bonne taille
      textarea.style.height = 'auto';
      // Définir la hauteur en fonction du contenu
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [value]);

  const handleBlur = async () => {
    // Ne sauvegarder que si la valeur a changé
    if (value === lastSavedValue) return;

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const response = await fetch('/api/meals/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName,
          day,
          mealType,
          value
        })
      });

      if (response.ok) {
        setSaveStatus('saved');
        setLastSavedValue(value); // Mettre à jour la dernière valeur sauvegardée
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div class="flex flex-col mb-2 gap-1 p-2 bg-bg-muted rounded-lg">
      <label for={`${day}-${mealType}`} class="font-medium border-b border-fg-muted/15">
        {icon} {label}
        {isSaving && <span class="status-indicator saving"> Sauvegarde...</span>}
        {saveStatus === 'saved' && <span class="status-indicator text-fg-accent text-[10px]"> ✓ Sauvegardé</span>}
        {saveStatus === 'error' && <span class="status-indicator text-fg-danger text-[10px]"> ✗ Erreur</span>}
      </label>
      <textarea
        id={`${day}-${mealType}`}
        ref={textareaRef}
        value={value}
        onInput={(e) => setValue((e.target as HTMLTextAreaElement).value)}
        onBlur={handleBlur}
        placeholder={`Menu du ${mealType}...`}
      />
    </div>
  );
}