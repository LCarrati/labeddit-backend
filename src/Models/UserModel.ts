
export enum USER_ROLES {
    USER = "user",
    ADMIN = "admin"
}

export interface UserDB {
    user_id: string,
    nickname: string,
    email: string,
    password: string,
    role: USER_ROLES
  }

  export class User {
    constructor(
      private user_id: string,
      private nickname: string,
      private email: string,
      private password: string,
      private role: USER_ROLES = USER_ROLES.USER,
    ) { }
  
    public getId(): string {
      return this.user_id;
    }
  
    public getNickname(): string {
      return this.nickname;
    }
    public setNickname(newNickname: string): void {
      this.nickname = newNickname;
    }
  
    public getEmail(): string {
      return this.email;
    }
    public setEmail(newEmail: string): void {
      this.email = newEmail;
    }
  
    public getPassword(): string {
      return this.password;
    }
    public setPassword(newPassword: string): void {
      this.password = newPassword;
    }
  
    public getRole(): USER_ROLES {
      return this.role;
    }
    public setRole(newRole: USER_ROLES): void {
      this.role = newRole;
    }    
  }