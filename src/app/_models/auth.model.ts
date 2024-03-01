export interface LogInData {
  username: String;
  password: String;
}

export interface User {
  id: string;
  username: string;
  role: string;
  accessToken: string;
}