/**
 * Simulated session for UI-only demo.
 * Replace with real Google Auth later — swap CURRENT_USER for the
 * decoded JWT / session cookie from next-auth or similar.
 *
 * u1 = Amara (admin)  — comment out and swap to u2/u3 to test member view
 */
import { users } from "@/lib/mock-data";

export const CURRENT_USER = users[0]; // Amara Nwosu (admin)
// export const CURRENT_USER = users[1]; // Kelvin (member) — uncomment to test member view
