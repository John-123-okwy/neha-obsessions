import { useState, useRef, useEffect } from "react";
import styles from "./CustomSelect.module.css";

export default function CustomSelect({ options, value, onChange, placeholder = "Select…" }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  function handleSelect(optionValue) {
    onChange(optionValue);
    setOpen(false);
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={selectedOption ? styles.valueText : styles.placeholderText}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`${styles.arrow} ${open ? styles.arrowOpen : ""}`}>▾</span>
      </button>

      {open && (
        <div className={styles.panel}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.option} ${opt.value === value ? styles.optionSelected : ""}`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}