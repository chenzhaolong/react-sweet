interface Demo {
  a: number;
  a1?: string;
  f: () => string;
}

function Demo1(): Demo {
  return {
    a: 1,
    f: function(): string {
      return 'as';
    }
  };
}
