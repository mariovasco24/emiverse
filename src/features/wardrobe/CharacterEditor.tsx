import { ArrowRight } from 'lucide-react'
import Avatar from '../../Character'
import { shirtColors, skinColors, type Character } from '../../domain/world'
type Props = {
  draft: Character
  crownUnlocked: boolean
  onChange: (draft: Character) => void
  onSave: () => void
}
export default function CharacterEditor({ draft, crownUnlocked, onChange, onSave }: Props) {
  return (
    <>
      <div className="editor-layout">
        <div className="editor-avatar">
          <Avatar character={draft} />
          <span>¡Hola, soy {draft.name || 'tu personaje'}!</span>
        </div>
        <div className="editor-form">
          <label className="field-title" htmlFor="character-name">
            ¿Cómo te llamas?
          </label>
          <input
            id="character-name"
            maxLength={16}
            value={draft.name}
            onChange={(e) => onChange({ ...draft, name: e.target.value })}
          />
          <fieldset>
            <legend>Tono de piel</legend>
            <div className="swatches">
              {skinColors.map((color, i) => (
                <button
                  key={color}
                  style={{ background: color }}
                  aria-label={`Piel ${i + 1}`}
                  aria-pressed={draft.skin === color}
                  onClick={() => onChange({ ...draft, skin: color })}
                >
                  {draft.skin === color ? '✓' : ''}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Tu color favorito</legend>
            <div className="swatches">
              {shirtColors.map((color, i) => (
                <button
                  key={color}
                  style={{ background: color }}
                  aria-label={`Ropa ${i + 1}`}
                  aria-pressed={draft.shirt === color}
                  onClick={() => onChange({ ...draft, shirt: color })}
                >
                  {draft.shirt === color ? '✓' : ''}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Un peinado con personalidad</legend>
            <div className="option-row">
              {(['short', 'long', 'buns'] as const).map((hair, i) => (
                <button
                  key={hair}
                  aria-pressed={draft.hair === hair}
                  onClick={() => onChange({ ...draft, hair })}
                >
                  {['Cortito', 'Melena', 'Moñitos'][i]}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>El toque final</legend>
            <div className="option-row">
              {(['none', 'bow', 'crown'] as const).map((accessory, i) => (
                <button
                  key={accessory}
                  disabled={accessory === 'crown' && !crownUnlocked}
                  aria-pressed={draft.accessory === accessory}
                  onClick={() => onChange({ ...draft, accessory })}
                >
                  {['Natural', 'Lacito', crownUnlocked ? 'Corona' : 'Corona 🔒'][i]}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
      <button className="world-primary wide" disabled={!draft.name.trim()} onClick={onSave}>
        ¡A vivir aventuras! <ArrowRight size={17} />
      </button>
    </>
  )
}
