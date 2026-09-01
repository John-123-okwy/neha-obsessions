import ChefHatLogo from "../Layout/ChefHatLogo";
import styles from "./AuthLayout.module.css";

export default function AuthLayout({ title, subtitle, children, benefits }) {
  return (
    <div className={styles.page}>
      <div className={styles.imageSide}>
        <div className={styles.imageOverlay} />
      </div>

      <div className={styles.formSide}>
        <div className={styles.formInner}>
          <div className={styles.brand}>
            <span className={styles.mark}><ChefHatLogo size={22} /></span>
            <span className={styles.brandName}>Neha Obsessions</span>
            <span className={styles.brandTag}>Every bite tells you why we're called Obsessions</span>
          </div>

          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>

          {children}

          {benefits && (
            <div className={styles.benefitsBox}>
              <p className={styles.benefitsTitle}>Why create an account?</p>
              <ul className={styles.benefitsList}>
                {benefits.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}