export type InputField<T> = {
  type: string;
  title: string;
  placeholder: string;
  name: keyof T;
};

export type InputList<T> = InputField<T>[];

export type RegisterData = {
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
};
