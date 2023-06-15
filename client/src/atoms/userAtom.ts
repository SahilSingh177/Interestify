import { atom } from 'recoil';
import firebase from 'firebase/app';
import {UserCredential} from '@firebase/auth-types';

interface AuthState {
  isLoggedIn: boolean;
}

export const authState = atom<AuthState>({
  key: 'authState',
  default: {
    isLoggedIn: false
  },
});
