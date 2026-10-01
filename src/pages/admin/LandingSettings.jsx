import { useEffect, useState } from "react";
import { getLandingSettings, updateLandingSettings } from "../../services/landingSettings";
import { generateId } from "../../utils/generateId";
import ImageUploader from "../../components/Admin/ImageUploader";
import Skeleton from "../../components/Skeleton/Skeleton";
import styles from "./LandingSettings.module.css";

export default function LandingSettings() {
  const [heroSlides, setHeroSlides] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getLandingSettings();
      setHeroSlides(data.heroSlides);
      setStats(data.stats);
      setLoading(false);
    }
    load();
  }, []);

  function addSlide() {
    setHeroSlides((prev) => [...prev, { id: generateId(), image: "", caption: "" }]);
  }

  function updateSlide(id, updates) {
    setHeroSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }

  function removeSlide(id) {
    setHeroSlides((prev) => prev.filter((s) => s.id !== id));
  }

  function addStat() {
    setStats((prev) => [...prev, { id: generateId(), label: "", value: "", suffix: "" }]);
  }

  function updateStat(id, updates) {
    setStats((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }

  function removeStat(id) {
    setStats((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleSave() {
    setSaving(true);
    setNotice("");
    try {
      const cleanSlides = heroSlides.filter((s) => s.image);
      const cleanStats = stats.filter((s) => s.label && s.value !== "");
      await updateLandingSettings({ heroSlides: cleanSlides, stats: cleanStats });
      setNotice("Saved!");
      setTimeout(() => setNotice(""), 2500);
    } catch (err) {
      console.error("Failed to save landing settings:", err);
      setNotice("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div>
        <Skeleton height="200px" radius="16px" style={{ marginBottom: "16px" }} />
        <Skeleton height="200px" radius="16px" />
      </div>
    );
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Landing Page</h1>
        <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
      {notice && <p className={styles.notice}>{notice}</p>}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Hero Slides</h2>
        <p className={styles.sectionHint}>Photos shown in rotation on the landing page hero.</p>

        {heroSlides.map((slide) => (
          <div key={slide.id} className={styles.slideCard}>
            <ImageUploader
              imageUrl={slide.image}
              onUploaded={(url) => updateSlide(slide.id, { image: url })}
            />
            <input
              className={styles.input}
              placeholder="Caption (optional)"
              value={slide.caption}
              onChange={(e) => updateSlide(slide.id, { caption: e.target.value })}
            />
            <button className={styles.removeBtn} onClick={() => removeSlide(slide.id)}>
              Remove Slide
            </button>
          </div>
        ))}

        <button className={styles.addBtn} onClick={addSlide}>+ Add Slide</button>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Stats Strip</h2>
        <p className={styles.sectionHint}>Numbers shown with a count-up animation on the landing page.</p>

        {stats.map((stat) => (
          <div key={stat.id} className={styles.statRow}>
            <input
              className={styles.statInput}
              placeholder="Value, e.g. 500"
              type="number"
              value={stat.value}
              onChange={(e) => updateStat(stat.id, { value: e.target.value })}
            />
            <input
              className={styles.statSuffixInput}
              placeholder="Suffix, e.g. +"
              value={stat.suffix}
              onChange={(e) => updateStat(stat.id, { suffix: e.target.value })}
            />
            <input
              className={styles.statLabelInput}
              placeholder="Label, e.g. Happy Customers"
              value={stat.label}
              onChange={(e) => updateStat(stat.id, { label: e.target.value })}
            />
            <button className={styles.removeIconBtn} onClick={() => removeStat(stat.id)}>✕</button>
          </div>
        ))}

        <button className={styles.addBtn} onClick={addStat}>+ Add Stat</button>
      </section>
    </div>
  );
}