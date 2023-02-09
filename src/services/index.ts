import { AuthService } from "./auth.service";
import { StorageProvider } from "@/src/providers/storage.provider";

/**
 * @dev Initilize storage provider.
 */
export const storageProvider = new StorageProvider();

/**
 * @dev Initilize authService.
 */
export const authService = new AuthService(storageProvider);

/**
 * @dev Export services.
 */
export * from "./program.service";
export * from "./pool.service";
