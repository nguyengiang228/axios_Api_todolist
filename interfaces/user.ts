export interface IUser {
  id: number;
  name: string;
  email: string;
}
export interface IUserParam {
  id?: number;
}
export interface IUserData {
  name: string;
  email: string;
}

export interface IUserEditForm {
  isEdit: boolean;
  id: number;
}
