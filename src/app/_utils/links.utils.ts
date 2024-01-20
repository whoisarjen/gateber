import { type Post } from "@prisma/client";
import slugify from "slugify";

export const getHrefToPost = ({ id, title }: Post): string => {
    return `/wpisy/${slugify(`${id}-${title}`)}`
}
