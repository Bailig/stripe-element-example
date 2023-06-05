import { type EffectCallback, useEffect } from "react";
import { useRef } from "react";

function useEffectOnce(effect: EffectCallback) {
  const hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) {
      return;
    }
    hasRun.current = true;
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useEffectOnce;
