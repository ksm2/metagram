interface ObjectConstructor {
  values<T>(o: { [key: string]: T }): T[];
}
