import { useState, useMemo } from "react";
import { useCart } from "../../context/CartContext";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import {
  calculateCustomizationTotal,
  buildCustomizationSummary,
  generateCartItemKey,
} from "../../utils/customization";
import { getOptimizedUrl } from "../../services/cloudinary";
import ReferenceImageUploader from "./ReferenceImageUploader";
import styles from "./CustomizeWizard.module.css";

export default function CustomizeWizard({ product, onClose }) {
  const { addToCart } = useCart();
  useBodyScrollLock();

  const enabledGroups = useMemo(
    () =>
      (product.customizationGroups || [])
        .filter((g) => g.enabled)
        .map((g) => ({ ...g, options: g.options.filter((o) => o.enabled) }))
        .filter((g) => g.options.length > 0),
    [product.customizationGroups]
  );

  const steps = useMemo(() => {
    const s = enabledGroups.map((g) => ({ type: "group", group: g }));
    if (product.allowMessage) s.push({ type: "message" });
    if (product.allowReferenceImage) s.push({ type: "image" });
    s.push({ type: "review" });
    return s;
  }, [enabledGroups, product.allowMessage, product.allowReferenceImage]);

  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState({});
  const [message, setMessage] = useState("");
  const [referenceImage, setReferenceImage] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  const currentStep = steps[stepIndex];
  const total = calculateCustomizationTotal(product.price, enabledGroups, selections);

  function selectOption(groupId, optionId) {
    setSelections((prev) => ({ ...prev, [groupId]: optionId }));
  }

  function canGoNext() {
    if (currentStep.type === "group" && currentStep.group.required) {
      return Boolean(selections[currentStep.group.id]);
    }
    return true;
  }

  function goNext() {
    if (!canGoNext()) return;
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function goBack() {
    if (stepIndex === 0) {
      onClose();
    } else {
      setStepIndex((i) => i - 1);
    }
  }

  function handleAddToCart() {
    const summary = buildCustomizationSummary(enabledGroups, selections);
    const cartKey = generateCartItemKey(product.id, summary, message);
    const requiresConfirmation = summary.some((s) => s.requiresConfirmation);

    addToCart(product, 1, {
      cartKey,
      total,
      summary,
      message,
      referenceImage,
      requiresConfirmation,
    });

    setJustAdded(true);
    setTimeout(onClose, 900);
  }

  const progressPercent = ((stepIndex + 1) / steps.length) * 100;

  return (
    <div className={styles.overlay}>
      <div className={styles.sheet}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
        </div>

        <div className={styles.header}>
          <button type="button" className={styles.iconBtn} onClick={goBack} aria-label="Back">
            ←
          </button>
          <div className={styles.headerText}>
            <p className={styles.headerProduct}>{product.name}</p>
            <p className={styles.headerStep}>Step {stepIndex + 1} of {steps.length}</p>
          </div>
          <button type="button" className={styles.iconBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.body}>
          {currentStep.type === "group" && (
            <div>
              <h2 className={styles.stepTitle}>
                Choose {currentStep.group.name}
                {currentStep.group.required && <span className={styles.requiredMark}> *</span>}
              </h2>
              <div className={styles.optionGrid}>
                {currentStep.group.options.map((option) => {
                  const isSelected = selections[currentStep.group.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`${styles.optionCard} ${isSelected ? styles.optionCardSelected : ""}`}
                      onClick={() => selectOption(currentStep.group.id, option.id)}
                    >
                      <span className={styles.optionLabel}>{option.label}</span>
                      <span className={styles.optionPrice}>
                        {option.priceDelta > 0 ? `+₦${option.priceDelta.toLocaleString()}` : "Included"}
                      </span>
                      {option.requiresConfirmation && (
                        <span className={styles.confirmTag}>Requires confirmation</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep.type === "message" && (
            <div>
              <h2 className={styles.stepTitle}>Add a message</h2>
              <p className={styles.stepSubtext}>Optional — e.g. what should we write on the cake?</p>
              <textarea
                className={styles.messageInput}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Happy Birthday Ada!"
                maxLength={120}
              />
              <p className={styles.charCount}>{message.length}/120</p>
            </div>
          )}

          {currentStep.type === "image" && (
            <div>
              <h2 className={styles.stepTitle}>Reference image</h2>
              <p className={styles.stepSubtext}>Optional — upload a photo of the design you'd like.</p>
              <ReferenceImageUploader
                imageUrl={referenceImage}
                onUploaded={setReferenceImage}
                onRemove={() => setReferenceImage("")}
              />
            </div>
          )}

          {currentStep.type === "review" && (
            <div>
              <h2 className={styles.stepTitle}>Review Your Order</h2>

              <div className={styles.reviewImageWrap}>
                <img
                  src={getOptimizedUrl(product.images?.[0], { width: 500, height: 350 })}
                  alt={product.name}
                  className={styles.reviewImage}
                />
              </div>

              <div className={styles.reviewList}>
                {enabledGroups.map((group, i) => {
                  const option = group.options.find((o) => o.id === selections[group.id]);
                  if (!option) return null;
                  return (
                    <div key={group.id} className={styles.reviewRow}>
                      <div>
                        <p className={styles.reviewGroupName}>{group.name}</p>
                        <p className={styles.reviewOptionName}>
                          {option.label}
                          {option.requiresConfirmation && (
                            <span className={styles.confirmTagSmall}>Needs confirmation</span>
                          )}
                        </p>
                      </div>
                      <div className={styles.reviewRowRight}>
                        <span className={styles.reviewPrice}>
                          {option.priceDelta > 0 ? `+₦${option.priceDelta.toLocaleString()}` : "—"}
                        </span>
                        <button type="button" className={styles.changeBtn} onClick={() => setStepIndex(i)}>
                          Change
                        </button>
                      </div>
                    </div>
                  );
                })}

                {message && (
                  <div className={styles.reviewRow}>
                    <div>
                      <p className={styles.reviewGroupName}>Message</p>
                      <p className={styles.reviewOptionName}>"{message}"</p>
                    </div>
                  </div>
                )}

                {referenceImage && (
                  <div className={styles.reviewRow}>
                    <p className={styles.reviewGroupName}>Reference image attached</p>
                  </div>
                )}
              </div>

              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalValue}>₦{total.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          {currentStep.type !== "review" ? (
            <>
              <span className={styles.footerTotal}>₦{total.toLocaleString()}</span>
              <button
                type="button"
                className={styles.nextBtn}
                onClick={goNext}
                disabled={!canGoNext()}
              >
                {currentStep.type === "group" && !currentStep.group.required && !selections[currentStep.group.id]
                  ? "Skip →"
                  : "Continue →"}
              </button>
            </>
          ) : (
            <button
              type="button"
              className={styles.addToCartBtn}
              onClick={handleAddToCart}
              disabled={justAdded}
            >
              {justAdded ? "Added ✓" : `Add to Cart — ₦${total.toLocaleString()}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}