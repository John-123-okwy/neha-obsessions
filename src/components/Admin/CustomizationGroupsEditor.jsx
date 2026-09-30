import { generateId } from "../../utils/generateId";
import styles from "./CustomizationGroupsEditor.module.css";

const EMPTY_OPTION = () => ({
  id: generateId(),
  label: "",
  priceDelta: 0,
  enabled: true,
  requiresConfirmation: false,
});

const EMPTY_GROUP = () => ({
  id: generateId(),
  name: "",
  required: true,
  enabled: true,
  options: [EMPTY_OPTION()],
});

export default function CustomizationGroupsEditor({
  groups,
  onChangeGroups,
  allowMessage,
  onChangeAllowMessage,
  allowReferenceImage,
  onChangeAllowReferenceImage,
}) {
  function addGroup() {
    onChangeGroups([...groups, EMPTY_GROUP()]);
  }

  function removeGroup(groupId) {
    onChangeGroups(groups.filter((g) => g.id !== groupId));
  }

  function updateGroup(groupId, updates) {
    onChangeGroups(groups.map((g) => (g.id === groupId ? { ...g, ...updates } : g)));
  }

  function addOption(groupId) {
    updateGroup(groupId, {
      options: [...groups.find((g) => g.id === groupId).options, EMPTY_OPTION()],
    });
  }

  function removeOption(groupId, optionId) {
    const group = groups.find((g) => g.id === groupId);
    updateGroup(groupId, { options: group.options.filter((o) => o.id !== optionId) });
  }

  function updateOption(groupId, optionId, updates) {
    const group = groups.find((g) => g.id === groupId);
    updateGroup(groupId, {
      options: group.options.map((o) => (o.id === optionId ? { ...o, ...updates } : o)),
    });
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.sectionLabel}>Customization Groups</p>

      {groups.length === 0 && (
        <p className={styles.emptyHint}>No groups yet — add one below, e.g. "Size" or "Design".</p>
      )}

      {groups.map((group) => (
        <div key={group.id} className={styles.groupCard}>
          <div className={styles.groupHeader}>
            <input
              className={styles.groupNameInput}
              placeholder="Group name, e.g. Size"
              value={group.name}
              onChange={(e) => updateGroup(group.id, { name: e.target.value })}
            />
            <button
              type="button"
              className={styles.removeGroupBtn}
              onClick={() => removeGroup(group.id)}
            >
              Remove Group
            </button>
          </div>

          <div className={styles.groupToggles}>
            <label className={styles.toggleRow}>
              <input
                type="checkbox"
                checked={group.enabled}
                onChange={(e) => updateGroup(group.id, { enabled: e.target.checked })}
              />
              Enabled
            </label>
            <label className={styles.toggleRow}>
              <input
                type="checkbox"
                checked={group.required}
                onChange={(e) => updateGroup(group.id, { required: e.target.checked })}
              />
              Required
            </label>
          </div>

          <div className={styles.optionsList}>
            {group.options.map((option) => (
              <div key={option.id} className={styles.optionRow}>
                <input
                  className={styles.optionLabelInput}
                  placeholder="Option, e.g. 8 inch"
                  value={option.label}
                  onChange={(e) => updateOption(group.id, option.id, { label: e.target.value })}
                />
                <div className={styles.optionPriceWrap}>
                  <span className={styles.pricePrefix}>+₦</span>
                  <input
                    className={styles.optionPriceInput}
                    type="number"
                    min="0"
                    value={option.priceDelta}
                    onChange={(e) =>
                      updateOption(group.id, option.id, { priceDelta: Number(e.target.value) || 0 })
                    }
                  />
                </div>
                <label className={styles.optionToggle} title="Enabled">
                  <input
                    type="checkbox"
                    checked={option.enabled}
                    onChange={(e) => updateOption(group.id, option.id, { enabled: e.target.checked })}
                  />
                  <span>On</span>
                </label>
                <label className={styles.optionToggle} title="Requires confirmation">
                  <input
                    type="checkbox"
                    checked={option.requiresConfirmation}
                    onChange={(e) =>
                      updateOption(group.id, option.id, { requiresConfirmation: e.target.checked })
                    }
                  />
                  <span>Confirm</span>
                </label>
                <button
                  type="button"
                  className={styles.removeOptionBtn}
                  onClick={() => removeOption(group.id, option.id)}
                  aria-label="Remove option"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button type="button" className={styles.addOptionBtn} onClick={() => addOption(group.id)}>
            + Add Option
          </button>
        </div>
      ))}

      <button type="button" className={styles.addGroupBtn} onClick={addGroup}>
        + Add Customization Group
      </button>

      <div className={styles.extrasSection}>
        <label className={styles.toggleRow}>
          <input
            type="checkbox"
            checked={allowMessage}
            onChange={(e) => onChangeAllowMessage(e.target.checked)}
          />
          Allow customers to add a message (e.g. cake inscription)
        </label>
        <label className={styles.toggleRow}>
          <input
            type="checkbox"
            checked={allowReferenceImage}
            onChange={(e) => onChangeAllowReferenceImage(e.target.checked)}
          />
          Allow customers to upload a reference/inspiration image
        </label>
      </div>
    </div>
  );
}