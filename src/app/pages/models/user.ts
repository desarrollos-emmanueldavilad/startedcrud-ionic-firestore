export interface Roles {
    inquilinos?: boolean;
    admin?: boolean;
  }

  export interface UserInterface {
    uid?: string;
    id?: string;
    name?: string;
    edad?: number;
    email?: string;
    password?: string;
    photoUrl?: string;
    emailVerified: boolean;
    roles: Roles;
}

export interface Inquilino {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  roles: Roles;
  }