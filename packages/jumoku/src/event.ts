export const generateEventOptions = (
  set: Set<string>
): AddEventListenerOptions => {
  return {
    capture: set.has('capture'),
    once: set.has('once'),
    passive: set.has('passive')
  }
}