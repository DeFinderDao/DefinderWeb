export type LocaleItem = {
    [key: string]: string;
}

export type LocaleData = {
    [key: string]: LocaleItem;
}

export type Locales = {
    [key: string]: LocaleData;
}