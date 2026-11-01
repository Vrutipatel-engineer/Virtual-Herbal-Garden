import { PerformanceMonitor, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { garden3dPlacements, plantById } from "../../data";
import type {
  GardenLookInput,
  GardenMovementInput,
  GardenQualityLevel,
  GardenVector3,
} from "../../types/garden";
import { FavoriteButton } from "../plants/FavoriteButton";
import { useTheme } from "../../hooks/useTheme";
import { useLanguage } from "../../context/useLanguage";
import { GardenJoystick } from "./GardenJoystick";
import { GardenScene } from "./GardenScene";

const initialMovement: GardenMovementInput = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  axisX: 0,
  axisZ: 0,
};

type GardenMovementDirection = Exclude<keyof GardenMovementInput, "axisX" | "axisZ">;

const keyToMovement: Record<string, GardenMovementDirection> = {
  KeyW: "forward",
  ArrowUp: "forward",
  KeyS: "backward",
  ArrowDown: "backward",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
};

const supportsPointerLock = () =>
  typeof document !== "undefined" && "pointerLockElement" in document;

const gardenPositionKey = "verdant-garden-last-position";
const gardenQualityKey = "verdant-garden-quality";
const defaultGardenPosition: GardenVector3 = [0, 1.1, 14.8];
const gardenSpawnLimit = 18.5;
const qualityRank: Record<GardenQualityLevel, number> = { low: 0, medium: 1, high: 2 };
const qualityLabel: Record<GardenQualityLevel, string> = {
  low: "Performance",
  medium: "Balanced",
  high: "High",
};
const accessibleGardenPlants = Array.from(
  new Set(garden3dPlacements.map((placement) => placement.plantId)),
  (plantId) => plantById.get(plantId),
).filter((plant) => plant !== undefined);

function readLastGardenPosition(): GardenVector3 {
  if (typeof window === "undefined") return defaultGardenPosition;
  try {
    const value = JSON.parse(window.sessionStorage.getItem(gardenPositionKey) ?? "null");
    if (!Array.isArray(value) || value.length !== 3 || !value.every((part) => typeof part === "number")) {
      return defaultGardenPosition;
    }
    const [x, y, z] = value as GardenVector3;
    return [
      Math.max(-gardenSpawnLimit, Math.min(gardenSpawnLimit, x)),
      Math.max(0.8, Math.min(1.5, y)),
      Math.max(-gardenSpawnLimit, Math.min(gardenSpawnLimit, z)),
    ];
  } catch {
    return defaultGardenPosition;
  }
}

function readSavedQuality(fallback: GardenQualityLevel): GardenQualityLevel {
  if (typeof window === "undefined") return fallback;
  const saved = window.localStorage.getItem(gardenQualityKey);
  if (fallback === "low") return "low";
  return saved === "low" || saved === "medium" || saved === "high" ? saved : fallback;
}

function GardenPerformanceMonitor({ onDecline }: { onDecline: () => void }) {
  return (
    <PerformanceMonitor
      iterations={6}
      ms={500}
      threshold={0.75}
      bounds={() => [50, 60]}
      flipflops={3}
      onDecline={onDecline}
    />
  );
}

export function GardenExperience() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const movementRef = useRef<GardenMovementInput>({ ...initialMovement });
  const lookRef = useRef<GardenLookInput>({ yaw: 0, pitch: -0.08 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const touchLookRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const focusedPlantRef = useRef<string | null>(null);
  const focusedGateRef = useRef(false);
  const gateCloseTimerRef = useRef<number | null>(null);
  const previewTitleRef = useRef<HTMLHeadingElement>(null);
  const resumeButtonRef = useRef<HTMLButtonElement>(null);
  const inspectButtonRef = useRef<HTMLButtonElement>(null);
  const previewWasOpenRef = useRef(false);
  const lastGardenPositionRef = useRef<GardenVector3>(readLastGardenPosition());
  const [entered, setEntered] = useState(false);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [focusedPlantId, setFocusedPlantId] = useState<string | null>(null);
  const [focusedGate, setFocusedGate] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [entryResetCounter, setEntryResetCounter] = useState(0);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [adaptiveQuality, setAdaptiveQuality] = useState<GardenQualityLevel | null>(null);
  const [pageVisible, setPageVisible] = useState(() =>
    typeof document === "undefined" ? true : !document.hidden,
  );

  const coarsePointer = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
    [],
  );
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const detectedQuality = useMemo<GardenQualityLevel>(() => {
    if (typeof navigator === "undefined") return "medium";
    const deviceNavigator = navigator as Navigator & { deviceMemory?: number };
    const memory = deviceNavigator.deviceMemory ?? 4;
    const cores = deviceNavigator.hardwareConcurrency ?? 4;
    if (memory <= 8 || cores <= 8) return "low";
    return "medium";
  }, []);
  const [quality, setQuality] = useState<GardenQualityLevel>(() => readSavedQuality(detectedQuality));
  const effectiveQuality = adaptiveQuality && qualityRank[adaptiveQuality] < qualityRank[quality]
    ? adaptiveQuality
    : quality;
  const { active: assetsLoading, progress: assetProgress, errors: assetErrors } = useProgress();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", syncPreference);
    return () => preference.removeEventListener("change", syncPreference);
  }, []);

  const selectedPlant = selectedPlantId ? plantById.get(selectedPlantId) : undefined;
  const focusedPlant = focusedPlantId ? plantById.get(focusedPlantId) : undefined;
  const controlsActive = entered && !selectedPlant && (coarsePointer || isPointerLocked);

  const setMovement = useCallback(
    (direction: GardenMovementDirection, pressed: boolean) => {
      movementRef.current[direction] = pressed;
    },
    [],
  );

  const clearMovement = useCallback(() => {
    movementRef.current = { ...initialMovement };
  }, []);

  const setJoystickMovement = useCallback((movement: { x: number; z: number }) => {
    movementRef.current.axisX = movement.x;
    movementRef.current.axisZ = movement.z;
  }, []);

  const persistGardenPosition = useCallback(() => {
    try {
      window.sessionStorage.setItem(gardenPositionKey, JSON.stringify(lastGardenPositionRef.current));
    } catch {
      // Storage can be unavailable in private or restricted browser contexts.
    }
  }, []);

  const handleTargetChange = useCallback((plantId: string | null) => {
    focusedPlantRef.current = plantId;
    setFocusedPlantId(plantId);
  }, []);

  const handleGateTargetChange = useCallback((focused: boolean) => {
    focusedGateRef.current = focused;
    setFocusedGate(focused);
  }, []);

  const openGate = useCallback(() => {
    setGateOpen(true);
    if (gateCloseTimerRef.current !== null) window.clearTimeout(gateCloseTimerRef.current);
    gateCloseTimerRef.current = window.setTimeout(() => {
      setGateOpen(false);
      gateCloseTimerRef.current = null;
    }, 5500);
  }, []);

  const inspectFocusedPlant = useCallback(() => {
    const plantId = focusedPlantRef.current;
    if (!plantId) return;
    clearMovement();
    setSelectedPlantId(plantId);
    if (document.pointerLockElement) document.exitPointerLock();
  }, [clearMovement]);

  const activateFocusedTarget = useCallback(() => {
    if (focusedGateRef.current) {
      openGate();
      return;
    }
    inspectFocusedPlant();
  }, [inspectFocusedPlant, openGate]);

  const requestGardenControl = useCallback((resetToEntry = false) => {
    if (resetToEntry) {
      lookRef.current = { yaw: 0, pitch: -0.3 };
      setEntryResetCounter((counter) => counter + 1);
    }
    setEntered(true);
    if (!coarsePointer && supportsPointerLock()) {
      canvasRef.current?.requestPointerLock();
    }
  }, [coarsePointer]);

  useEffect(() => () => {
    if (gateCloseTimerRef.current !== null) window.clearTimeout(gateCloseTimerRef.current);
  }, []);

  const endGardenControl = useCallback(() => {
    clearMovement();
    setEntered(false);
    if (document.pointerLockElement) document.exitPointerLock();
  }, [clearMovement]);

  const updateQuality = useCallback((nextQuality: GardenQualityLevel) => {
    setQuality(nextQuality);
    setAdaptiveQuality(null);
    try {
      window.localStorage.setItem(gardenQualityKey, nextQuality);
    } catch {
      // The garden remains usable when browser storage is unavailable.
    }
  }, []);

  const lowerQualityForPerformance = useCallback(() => {
    setAdaptiveQuality((current) => {
      const level = current ?? quality;
      if (level === "high") return "medium";
      if (level === "medium") return "low";
      return "low";
    });
  }, [quality]);

  useEffect(() => {
    const handlePointerLock = () => {
      const locked = document.pointerLockElement === canvasRef.current;
      setIsPointerLocked(locked);
      if (!locked) clearMovement();
    };
    document.addEventListener("pointerlockchange", handlePointerLock);
    return () => document.removeEventListener("pointerlockchange", handlePointerLock);
  }, [clearMovement]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = keyToMovement[event.code];
      if (direction && controlsActive) {
        event.preventDefault();
        setMovement(direction, true);
      }
      if (event.code === "KeyE" && controlsActive) activateFocusedTarget();
      if (event.code === "Escape" && selectedPlant) setSelectedPlantId(null);
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      const direction = keyToMovement[event.code];
      if (direction) setMovement(direction, false);
    };
    const handleMouseMove = (event: MouseEvent) => {
      if (!isPointerLocked || selectedPlant) return;
      lookRef.current.yaw -= event.movementX * 0.0021;
      lookRef.current.pitch = Math.max(
        -1.25,
        Math.min(1.15, lookRef.current.pitch - event.movementY * 0.0018),
      );
    };
    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0 && isPointerLocked && (focusedGateRef.current || focusedPlantRef.current)) {
        activateFocusedTarget();
      }
    };
    const handleBlur = () => clearMovement();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("blur", handleBlur);
    };
  }, [activateFocusedTarget, clearMovement, controlsActive, isPointerLocked, selectedPlant, setMovement]);

  useEffect(() => {
    if (selectedPlant) {
      previewWasOpenRef.current = true;
      previewTitleRef.current?.focus();
    } else if (previewWasOpenRef.current) {
      previewWasOpenRef.current = false;
      (coarsePointer ? inspectButtonRef.current : resumeButtonRef.current)?.focus();
    }
  }, [coarsePointer, selectedPlant]);

  useEffect(() => {
    const timer = window.setTimeout(() => setSceneReady(true), assetsLoading ? 900 : 700);
    return () => window.clearTimeout(timer);
  }, [assetsLoading]);

  useEffect(() => {
    if (assetErrors.length > 0) setLoadFailed(true);
  }, [assetErrors]);

  useEffect(() => {
    const handleVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const handleTouchLookStart = (event: React.PointerEvent<HTMLDivElement>) => {
    touchLookRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleTouchLookMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const previous = touchLookRef.current;
    if (!previous || previous.pointerId !== event.pointerId || !controlsActive) return;
    lookRef.current.yaw -= (event.clientX - previous.x) * 0.006;
    lookRef.current.pitch = Math.max(
      -1.15,
      Math.min(1.05, lookRef.current.pitch - (event.clientY - previous.y) * 0.005),
    );
    previous.x = event.clientX;
    previous.y = event.clientY;
  };

  const handleTouchLookEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (touchLookRef.current?.pointerId === event.pointerId) touchLookRef.current = null;
  };

  if (loadFailed) {
    return (
      <section className="garden-fallback" aria-labelledby="garden-error-title">
        <p className="eyebrow">{t("Virtual Garden")}</p>
        <h1 id="garden-error-title">{t("The garden could not open.")}</h1>
        <p>{t("The interactive scene is unavailable right now. You can still explore every plant through the accessible directory.")}</p>
        <div className="garden-fallback__actions">
          <button className="button button--primary" type="button" onClick={() => window.location.reload()}>
            {t("Try again")}
          </button>
          <Link className="button button--secondary" to="/plants">
            {t("Explore plants")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="garden-experience" aria-label={t("Interactive three-dimensional herbal garden")}>
      <div className="garden-experience__canvas" aria-hidden="true">
        <Canvas
          shadows={effectiveQuality === "high"}
          dpr={effectiveQuality === "low" ? [0.7, 0.85] : effectiveQuality === "medium" ? [0.85, 1] : [1, 1.25]}
          frameloop={pageVisible ? "always" : "demand"}
          camera={{ fov: 64, near: 0.1, far: 70, position: [0, 1.8, 10] }}
          gl={{ antialias: effectiveQuality === "high", powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            canvasRef.current = gl.domElement;
            gl.domElement.addEventListener("webglcontextlost", () => setLoadFailed(true), { once: true });
          }}
        >
          <GardenPerformanceMonitor onDecline={lowerQualityForPerformance} />
          <Suspense fallback={null}>
            <GardenScene
              active={controlsActive && pageVisible}
              movementRef={movementRef}
              lookRef={lookRef}
              reducedMotion={reducedMotion}
              quality={effectiveQuality}
              focusedPlantId={focusedPlantId}
              onTargetChange={handleTargetChange}
              onPlayerPositionChange={(position) => {
                lastGardenPositionRef.current = position;
              }}
              initialPosition={lastGardenPositionRef.current}
              gateOpen={gateOpen}
              onGateTargetChange={handleGateTargetChange}
              entryResetCounter={entryResetCounter}
              night={theme === "dark"}
            />
          </Suspense>
        </Canvas>
      </div>

      {!sceneReady && (
        <div className="garden-loading" role="status" aria-live="polite">
          <span className="garden-loading__mark" aria-hidden="true" />
          <p className="eyebrow">{t("Preparing the path")}</p>
          <h1>{t("Growing the garden around you…")}</h1>
          <p className="garden-loading__progress">
            {assetsLoading ? `${t("Loading garden assets")} · ${Math.round(assetProgress)}%` : t("Preparing your walk")}
          </p>
        </div>
      )}

      {sceneReady && !entered && (
        <div className="garden-entry">
          <div className="garden-entry__content">
            <p className="eyebrow">{t("A living botanical garden")}</p>
            <h1>{t("Step inside the garden.")}</h1>
            <p>{t("Explore medicinal plants and useful trees. Approach any garden plant to inspect its profile and benefits.")}</p>
            <div className="garden-entry__controls" role="group" aria-label={t("Garden controls")}>
              <span>{coarsePointer ? t("Joystick · Move") : t("W A S D · Move")}</span>
              <span>{coarsePointer ? t("Drag · Look") : t("Mouse · Look")}</span>
              <span>{coarsePointer ? t("Tap · Open gate / inspect") : t("Click or E · Open gate / inspect")}</span>
            </div>
            <label className="garden-quality-select">
              <span>{t("Garden quality")}</span>
              <select value={quality} onChange={(event) => updateQuality(event.target.value as GardenQualityLevel)}>
                <option value="low">{t("Performance")}</option>
                <option value="medium">{t("Balanced")}</option>
                <option value="high">{t("High")}</option>
              </select>
            </label>
            {adaptiveQuality && effectiveQuality !== quality && (
              <p className="garden-performance-note" role="status">
                {t("Rendering adjusted to keep exploring smooth.")} ({t(qualityLabel[effectiveQuality])})
              </p>
            )}
            <button className="button button--primary" type="button" onClick={() => requestGardenControl(true)}>
              {t("Enter garden")}
            </button>
            <Link className="garden-entry__alternative" to="/plants">
              {t("Prefer the accessible plant directory?")}
            </Link>
          </div>
        </div>
      )}

      {entered && !coarsePointer && !isPointerLocked && !selectedPlant && (
        <div className="garden-pause">
          <p>{t("Garden paused")}</p>
          <button ref={resumeButtonRef} className="button button--primary" type="button" onClick={() => requestGardenControl()}>
            {t("Resume exploring")}
          </button>
          <button className="garden-pause__end" type="button" onClick={endGardenControl}>
            {t("Return to garden entry")}
          </button>
          <Link to="/plants">{t("Exit to plant directory")}</Link>
        </div>
      )}

      {controlsActive && (
        <>
          <span className={`garden-reticle${focusedPlant || focusedGate ? " garden-reticle--active" : ""}`} aria-hidden="true" />
          <div className="garden-status" aria-live="polite">
            {focusedGate ? (
              <>
                <span>{t(gateOpen ? "Gate opening" : "Garden entrance")}</span>
                <strong>{t("Garden gate")}</strong>
                <small>{t(gateOpen ? "Walk through before it closes" : coarsePointer ? "Tap to open for 5 seconds" : "Click or press E to open for 5 seconds")}</small>
              </>
            ) : focusedPlant ? (
              <>
                <span>{t("Ready to explore")}</span>
                <strong>{t(focusedPlant.commonName)}</strong>
                <small>{t(coarsePointer ? "Tap Inspect" : "Click or press E")}</small>
              </>
            ) : (
              <span>{t("Explore anywhere inside the garden. Plants and the garden edge will stop you.")}</span>
            )}
          </div>
        </>
      )}

      {coarsePointer && entered && !selectedPlant && (
        <>
          <div
            className="garden-touch-look"
            aria-hidden="true"
            onPointerDown={handleTouchLookStart}
            onPointerMove={handleTouchLookMove}
            onPointerUp={handleTouchLookEnd}
            onPointerCancel={handleTouchLookEnd}
          />
          <GardenJoystick onChange={setJoystickMovement} />
          {(focusedGate || focusedPlant) && (
            <button ref={inspectButtonRef} className="garden-inspect-button" type="button" onClick={activateFocusedTarget}>
              {focusedGate ? t("Open garden gate") : `${t("Inspect")} ${t(focusedPlant?.commonName ?? "")}`}
            </button>
          )}
        </>
      )}

      {selectedPlant && (
        <div className="garden-preview-backdrop">
          <article
            className="garden-preview"
            role="dialog"
            aria-modal="true"
            aria-labelledby="garden-preview-title"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                setSelectedPlantId(null);
              }
              if (event.key === "Tab") {
                const focusable = Array.from(
                  event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
                );
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (
                  event.shiftKey &&
                  (document.activeElement === first || document.activeElement === previewTitleRef.current)
                ) {
                  event.preventDefault();
                  last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first?.focus();
                }
              }
            }}
          >
            <div className="garden-preview__meta">
              <span>{t(selectedPlant.category)}</span>
              <FavoriteButton plantId={selectedPlant.id} plantName={selectedPlant.commonName} />
            </div>
            <p className="eyebrow">{t("Discovered in the garden")}</p>
            <h2 ref={previewTitleRef} id="garden-preview-title" tabIndex={-1}>{t(selectedPlant.commonName)}</h2>
            <p className="garden-preview__scientific">{selectedPlant.scientificName}</p>
            <p>{t(selectedPlant.description)}</p>
            <div className="garden-preview__actions">
              <Link
                className="button button--primary"
                to={`/plants/${selectedPlant.slug}`}
                onClick={persistGardenPosition}
              >
                {t("Explore full profile")}
              </Link>
              <button
                className="button button--secondary"
                type="button"
                onClick={() => {
                  setSelectedPlantId(null);
                }}
              >
                {t("Return to garden")}
              </button>
            </div>
          </article>
        </div>
      )}

      <details className="garden-accessible-list">
        <summary>{t("Explore plants without the 3D garden")}</summary>
        <div className="garden-accessible-list__panel">
          <p>{t("Open a plant profile:")}</p>
          <ul>
            {accessibleGardenPlants.map((plant) => (
              <li key={plant.id}>
                <Link to={`/plants/${plant.slug}`}>{t(plant.commonName)}</Link>
              </li>
            ))}
          </ul>
          <Link to="/plants">{t("Browse all plants")}</Link>
        </div>
      </details>
    </section>
  );
}
