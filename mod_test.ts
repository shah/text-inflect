import {
  assertEquals,
  assert,
} from "https://deno.land/std@v0.61.0/testing/asserts.ts";
import * as inflect from "./mod.ts";

Deno.test("Snake Case InflectableValue", () => {
  const scs = inflect.snakeCaseValue("Snake_Case_Text");
  assertEquals("Snake_Case_Text", scs.inflect());
  assertEquals("snakeCaseText", inflect.toCamelCase(scs));
  assertEquals("Snake Case Text", inflect.toHumanCase(scs));
  assertEquals("SnakeCaseText", inflect.toPascalCase(scs));
  assertEquals("snake-case-text", inflect.toKebabCase(scs));
});

Deno.test("Snake Case PluraziableValue Auto Plural", () => {
  const scs = inflect.snakeCaseValueAutoPlural("Party_Id");
  assert(scs.pluralizer, "Pluralizer should have a default");
  const plural = scs.pluralizer.pluralOf(scs);
  assertEquals("Party_Ids", plural.inflect());
  assertEquals("partyIds", inflect.toCamelCase(plural));
  assertEquals("Party Ids", inflect.toHumanCase(plural));
  assertEquals("PartyIds", inflect.toPascalCase(plural));
  assertEquals("party-ids", inflect.toKebabCase(plural));
});

Deno.test("Snake Case PluraziableValue Custom Plural", () => {
  const scs = inflect.snakeCaseValueCustomPlural("All_Party", "All_Parties");
  assert(scs.pluralizer, "Pluralizer should be set to static");
  const plural = scs.pluralizer.pluralOf(scs);
  assertEquals("All_Parties", plural.inflect());
  assertEquals("allParties", inflect.toCamelCase(plural));
  assertEquals("All Parties", inflect.toHumanCase(plural));
  assertEquals("AllParties", inflect.toPascalCase(plural));
  assertEquals("all-parties", inflect.toKebabCase(plural));
});

Deno.test("Human Case InflectableValue", () => {
  const scs = inflect.humanCaseValue("Human Case Text");
  assertEquals("Human Case Text", scs.inflect());
  assertEquals("humanCaseText", inflect.toCamelCase(scs));
  assertEquals("HumanCaseText", inflect.toPascalCase(scs));
  assertEquals("human_case_text", inflect.toSnakeCase(scs));
  assertEquals("Human_Case_Text", inflect.toSnakeCase(scs, true));
  assertEquals("human-case-text", inflect.toKebabCase(scs));
});

Deno.test("Guess Case InflectableValue (split on any non-alpha-numeric delim)", () => {
  const scs = inflect.guessCaseValue("Generic Text_With(Some-extras)!");
  assertEquals("Generic Text_With(Some-extras)!", scs.inflect());
  assertEquals("genericTextWithSomeExtras", inflect.toCamelCase(scs));
  assertEquals("GenericTextWithSomeExtras", inflect.toPascalCase(scs));
  assertEquals("generic_text_with_some_extras", inflect.toSnakeCase(scs));
  assertEquals("Generic_Text_With_Some_Extras", inflect.toSnakeCase(scs, true));
  assertEquals("generic-text-with-some-extras", inflect.toKebabCase(scs));
});

Deno.test("Inflection utilities", () => {
  assertEquals("party", inflect.camelToSnakeLowerCase("party"));
  assertEquals(
    "party_identifier",
    inflect.camelToSnakeLowerCase("partyIdentifier"),
  );
  assertEquals("Party_Type", inflect.pascalToSnakeCase("PartyType"));
});
