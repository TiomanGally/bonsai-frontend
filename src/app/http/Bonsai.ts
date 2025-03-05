export interface Bonsai {
  uuid: string;
  latinName: string;
  simpleName?: string;
  birthDate: string;
  lastRepoted: string;
  price: number;
}

export interface User {
  name: string,
  email: string
}

export interface CreateBonsaiRequestBody {
  latinName: string;
  simpleName?: string;
  birthDate: string;
  price: number;
  lastRepoted: string;
}

export interface Note {
  uuid: string,
  content: string,
  createdAt: string
}

export interface Picture {
  uuid: string,
  fileName: string,
  imageUrl: string
  createdAt: string
}
