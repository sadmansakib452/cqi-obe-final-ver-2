import { AuthError } from "next-auth";

export class OAuthAccountAlreadyLinkederror extends AuthError {

    static type = "OAuthAccountAlreadyLinked"

}