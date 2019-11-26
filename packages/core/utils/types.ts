export type MakeReadOnly<Type> = {readonly [key in keyof Type ]: Type[key]};
