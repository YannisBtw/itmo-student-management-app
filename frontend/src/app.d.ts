declare global {
  namespace App {
    interface Locals {
      user: { username: string; role: string | null } | null;
      token: string | null;
    }
  }
}

export {};