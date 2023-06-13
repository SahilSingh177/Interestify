import { atom } from 'recoil';
import firebase from 'firebase/app';

interface AuthState {
  isLoggedIn: boolean;
  currentUser : any | null;
}

export const authState = atom<AuthState>({
  key: 'authState',
  default: {
    isLoggedIn: false,
    currentUser : null,
  },
});
