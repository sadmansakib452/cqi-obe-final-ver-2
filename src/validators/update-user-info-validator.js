import * as v from "valibot";

// Regular expression to match MongoDB ObjectID
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const UpdateUserInfoSchema = v.object({
  id: v.pipe(
    v.string("Your id must be a string."),
    v.regex(objectIdRegex, "Your id must be valid")
  ),
  name: v.pipe(
    v.string("Your name must be a string"),
    v.nonEmpty("Please enter your name."),
    v.minLength(6, "Your name must have 6 characters or more."),
  ),
});
