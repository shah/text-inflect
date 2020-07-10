export interface inflect {
  (value: string, index: number, array: string[]): void;
}

export interface InflectorComponentsCreator {
  (canonical: InflectableValue, handler: inflect): void;
}

export function snakeCaseInflectorComponentsCreator(
  canonical: InflectableValue,
  handler: inflect,
): void {
  canonical.inflect().split("_").forEach(handler);
}

export function humanCaseInflectorComponentsCreator(
  canonical: InflectableValue,
  handler: inflect,
): void {
  canonical.inflect().split(" ").forEach(handler);
}

export interface InflectableValue {
  inflect(): string;
  inflectorComponentsCreator: InflectorComponentsCreator;
}

export interface PluralizableValue extends InflectableValue {
  readonly singular: InflectableValue;
  readonly plural: PluralValue;
  readonly pluralizer: Pluralizer;
}

export interface PluralValue extends InflectableValue {
  readonly isPluralOfIdentifier: InflectableValue;
}

export interface Pluralizer {
  pluralOf(singular: InflectableValue): PluralValue;
}

export function snakeCaseValue(canonical: string): InflectableValue {
  return {
    inflect(): string {
      return canonical;
    },
    inflectorComponentsCreator: snakeCaseInflectorComponentsCreator,
  };
}

export function humanCaseValue(canonical: string): InflectableValue {
  return {
    inflect(): string {
      return canonical;
    },
    inflectorComponentsCreator: humanCaseInflectorComponentsCreator,
  };
}

export function snakeCaseValueAutoPlural(
  canonical: string,
  pluralizer: Pluralizer = SimpleAutoPluralizer,
): PluralizableValue {
  return new (class implements PluralizableValue {
    readonly inflectorComponentsCreator: InflectorComponentsCreator =
      snakeCaseInflectorComponentsCreator;
    readonly pluralizer: Pluralizer = pluralizer;
    inflect(): string {
      return canonical;
    }
    get singular(): InflectableValue {
      return this;
    }
    get plural(): PluralValue {
      return this.pluralizer.pluralOf(this);
    }
  })();
}

export function snakeCaseValueCustomPlural(
  canonical: string,
  plural: string,
): PluralizableValue {
  return new (class implements PluralizableValue {
    readonly inflectorComponentsCreator: InflectorComponentsCreator =
      snakeCaseInflectorComponentsCreator;
    readonly pluralizer: Pluralizer = createStaticSnakeCasePlural(plural);
    inflect(): string {
      return canonical;
    }
    get singular(): InflectableValue {
      return this;
    }
    get plural(): PluralValue {
      return this.pluralizer.pluralOf(this);
    }
  })();
}

export const PluralIsSameAsSingular: Pluralizer = {
  pluralOf(singular: InflectableValue): PluralValue {
    return {
      inflect(): string {
        return singular.inflect();
      },
      inflectorComponentsCreator: singular.inflectorComponentsCreator,
      isPluralOfIdentifier: singular,
    };
  },
};

export const SimpleAutoPluralizer: Pluralizer = {
  pluralOf(singular: InflectableValue): PluralValue {
    return {
      inflect(): string {
        return singular.inflect() + "s";
      },
      inflectorComponentsCreator: singular.inflectorComponentsCreator,
      isPluralOfIdentifier: singular,
    };
  },
};

export function createStaticSnakeCasePlural(plural: string): Pluralizer {
  return {
    pluralOf(singular: InflectableValue): PluralValue {
      return {
        inflect(): string {
          return plural;
        },
        inflectorComponentsCreator: snakeCaseInflectorComponentsCreator,
        isPluralOfIdentifier: singular,
      };
    },
  };
}

export function toHumanCase(identifier: InflectableValue): string {
  let result = "";
  identifier.inflectorComponentsCreator(identifier, function (el, idx) {
    if (idx > 0) result += " ";
    var add = el.toLowerCase();
    result += add[0].toUpperCase() + add.slice(1);
  });
  return result;
}

export function toSnakeCase(
  identifier: InflectableValue,
  upperCaseInitial?: boolean,
): string {
  let result = "";
  identifier.inflectorComponentsCreator(identifier, function (el, idx) {
    if (idx > 0) result += "_";
    var add = el.toLowerCase();
    result += (upperCaseInitial ? add[0].toUpperCase() : add[0]) + add.slice(1);
  });
  return result;
}

export function toEnvVarCase(identifier: InflectableValue): string {
  return toSnakeCase(identifier).toUpperCase();
}

export function toCamelCase(identifier: InflectableValue): string {
  let result = "";
  identifier.inflectorComponentsCreator(identifier, function (el, idx) {
    var add = el.toLowerCase();
    result += idx === 0 ? add : add[0].toUpperCase() + add.slice(1);
  });
  return result;
}

export function toPascalCase(identifier: InflectableValue): string {
  let result = "";
  identifier.inflectorComponentsCreator(identifier, function (el, idx) {
    var add = el.toLowerCase();
    result += add[0].toUpperCase() + add.slice(1);
  });
  return result;
}

export function toKebabCase(identifier: InflectableValue): string {
  let result = "";
  identifier.inflectorComponentsCreator(identifier, function (el, idx) {
    if (idx > 0) result += "-";
    result += el.toLowerCase();
  });
  return result;
}

export function camelToSnakeLowerCase(str: string): string {
  return str[0].toLowerCase() +
    str.slice(1, str.length).replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`,
    );
}

export function pascalToSnakeCase(str: string): string {
  return str[0].toUpperCase() +
    str.slice(1, str.length).replace(
      /[A-Z]/g,
      (letter) => `_${letter.toUpperCase()}`,
    );
}
