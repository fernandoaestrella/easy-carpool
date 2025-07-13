// Utility functions for registration
export function checkForExistingRegistration(
  carpoolId: string,
  setUserRegistration: (reg: any) => void
): boolean {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(`registration_${carpoolId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserRegistration(parsed);
        return true;
      } catch (error) {
        console.error("Failed to load registration:", error);
      }
    }
  }
  return false;
}

export function showToast(
  setToastMessage: (msg: string) => void,
  setToastVisible: (v: boolean) => void,
  message: string
) {
  setToastMessage(message);
  setToastVisible(true);
  setTimeout(() => setToastVisible(false), 3000);
}
