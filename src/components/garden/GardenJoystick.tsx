import { useRef, useState } from "react";
import { useLanguage } from "../../context/useLanguage";

interface GardenJoystickProps {
  onChange: (movement: { x: number; z: number }) => void;
}

const maxDistance = 34;

/** Touch-only analog movement control. It supplies data; it does not move the camera itself. */
export function GardenJoystick({ onChange }: GardenJoystickProps) {
  const { t } = useLanguage();
  const controlRef = useRef<HTMLDivElement>(null);
  const pointerIdRef = useRef<number | null>(null);
  const [handle, setHandle] = useState({ x: 0, y: 0 });

  const updateMovement = (clientX: number, clientY: number) => {
    const bounds = controlRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const rawX = clientX - centerX;
    const rawY = clientY - centerY;
    const distance = Math.hypot(rawX, rawY);
    const scale = distance > maxDistance ? maxDistance / distance : 1;
    const x = rawX * scale;
    const y = rawY * scale;

    setHandle({ x, y });
    onChange({ x: x / maxDistance, z: -y / maxDistance });
  };

  const release = (pointerId?: number) => {
    if (pointerId !== undefined && pointerIdRef.current !== pointerId) return;
    pointerIdRef.current = null;
    setHandle({ x: 0, y: 0 });
    onChange({ x: 0, z: 0 });
  };

  return (
    <div
      ref={controlRef}
      className="garden-joystick"
      role="group"
      aria-label={t("Move through the garden")}
      onPointerDown={(event) => {
        pointerIdRef.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        updateMovement(event.clientX, event.clientY);
      }}
      onPointerMove={(event) => {
        if (pointerIdRef.current === event.pointerId) updateMovement(event.clientX, event.clientY);
      }}
      onPointerUp={(event) => release(event.pointerId)}
      onPointerCancel={(event) => release(event.pointerId)}
    >
      <span className="garden-joystick__direction" aria-hidden="true">{t("Move")}</span>
      <span
        className="garden-joystick__handle"
        aria-hidden="true"
        style={{ transform: `translate(calc(-50% + ${handle.x}px), calc(-50% + ${handle.y}px))` }}
      />
    </div>
  );
}
