import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { merge } from "lodash-es";
import { ThemeOptions } from "@mui/material";

import themes from "@src/theme";
import { publicSettingsAtom } from "./project";
import { TableFilter } from "./table";
import { UpdateDocFunction } from "./types";

/** User info and settings */
export type UserSettings = Partial<{
  _rowy_id: string;
  /** Synced from user auth info */
  user: {
    email: string;
    displayName?: string;
    photoURL?: string;
    phoneNumber?: string;
  };
  roles: string[];

  theme: Record<"base" | "light" | "dark", ThemeOptions>;

  favoriteTables: string[];
  /** Stores user overrides */
  tables: Record<
    string,
    Partial<{
      filters: TableFilter[];
      hiddenFields: string[];
    }>
  >;
}>;
/** User info and settings */
export const userSettingsAtom = atom<UserSettings>({});
/** Stores a function that updates user settings */
export const updateUserSettingsAtom =
  atom<UpdateDocFunction<UserSettings> | null>(null);

/**
 * Stores which theme is currently active, based on user or OS setting.
 * Saved in localStorage.
 */
export const themeAtom = atomWithStorage<"light" | "dark">(
  "__ROWY__THEME",
  "light"
);
/**
 * User can override OS theme. Saved in localStorage.
 */
export const themeOverriddenAtom = atomWithStorage(
  "__ROWY__THEME_OVERRIDDEN",
  false
);

/** Customized base theme based on project and user settings */
export const customizedThemesAtom = atom((get) => {
  const publicSettings = get(publicSettingsAtom);
  const userSettings = get(userSettingsAtom);

  const lightCustomizations = merge(
    {},
    publicSettings.theme?.base,
    publicSettings.theme?.light,
    userSettings.theme?.base,
    userSettings.theme?.light
  );
  const darkCustomizations = merge(
    {},
    publicSettings.theme?.base,
    publicSettings.theme?.dark,
    userSettings.theme?.base,
    userSettings.theme?.dark
  );

  return {
    light: themes.light(lightCustomizations),
    dark: themes.dark(darkCustomizations),
  };
});
