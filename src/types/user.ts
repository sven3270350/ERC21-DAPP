import { Session } from "next-auth"

export type ExtendedUser = Session["user"] & {
    id: number;
    email: string;
}