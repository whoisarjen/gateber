import { type Post } from "@prisma/client";
import slugify from "slugify";

export const getHrefToPost = ({ id, title }: Post): string => {
    return `/posts/${slugify(`${id}-${title}`)}`
}

export const getDateLocaleString = (date = new Date()) => {
    return new Date(date).toLocaleString('en-GB')
}

export const transformDate = (date: Date) => {
    return getDateLocaleString(date).replaceAll('/', '.')
}
