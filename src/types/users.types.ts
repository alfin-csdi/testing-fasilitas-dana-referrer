export enum UserGender {
    Male = "male",
    Female = "female"
  }
  
  export enum UserStatus {
    Active = "active",
    Inactive = "inactive"
  }
  
  export type UserType = {
    id: number;
    name: string;
    email: string;
    gender: UserGender;
    status: UserStatus;
  };

  export interface UserFormData {
    name: string;
    email: string;
    gender: UserGender;
    status: UserStatus;
  }

  export interface UserContextType {
    selectedUser: UserType | null;
    setSelectedUser: (user: UserType | null) => void;
  }

  export type MenuItemType = {
    key: string;
    label: React.ReactNode;
    children?: MenuItemType[];
  };
  