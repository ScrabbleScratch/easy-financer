import { atom } from "jotai";

interface AuthenticatedUserState {
  isAuthenticated: true;
  id: string;
  email: string;
}

interface UnauthenticatedUserState {
  isAuthenticated: false;
  id?: never;
  email?: never;
}

export type UserStateAtom = AuthenticatedUserState | UnauthenticatedUserState;

export const userState = atom<UserStateAtom>({
    isAuthenticated: false,
});