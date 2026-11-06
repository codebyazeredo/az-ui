import { ACTION_ICONS } from "./icons/actions";
import { ARROW_ICONS } from "./icons/arrows";
import { BUSINESS_ICONS } from "./icons/business";
import { COMMUNICATION_ICONS } from "./icons/communication";
import { EDITOR_ICONS } from "./icons/editor";
import { FILE_ICONS } from "./icons/files";
import { GENERAL_ICONS } from "./icons/general";
import { INTERFACE_ICONS } from "./icons/interface";
import { LOGISTICS_ICONS } from "./icons/logistics";
import { MEDIA_ICONS } from "./icons/media";
import { STATUS_ICONS } from "./icons/status";
import { TECH_ICONS } from "./icons/tech";
import { USER_ICONS } from "./icons/users";

export const ICON_CATEGORIES = {
  actions: ACTION_ICONS,
  arrows: ARROW_ICONS,
  business: BUSINESS_ICONS,
  communication: COMMUNICATION_ICONS,
  editor: EDITOR_ICONS,
  files: FILE_ICONS,
  general: GENERAL_ICONS,
  interface: INTERFACE_ICONS,
  logistics: LOGISTICS_ICONS,
  media: MEDIA_ICONS,
  status: STATUS_ICONS,
  tech: TECH_ICONS,
  users: USER_ICONS,
} as const;

export const ICONS = {
  ...ACTION_ICONS,
  ...ARROW_ICONS,
  ...BUSINESS_ICONS,
  ...COMMUNICATION_ICONS,
  ...EDITOR_ICONS,
  ...FILE_ICONS,
  ...GENERAL_ICONS,
  ...INTERFACE_ICONS,
  ...LOGISTICS_ICONS,
  ...MEDIA_ICONS,
  ...STATUS_ICONS,
  ...TECH_ICONS,
  ...USER_ICONS,
} as const;

export type IconName = keyof typeof ICONS;
export type IconCategory = keyof typeof ICON_CATEGORIES;

export const ICON_NAMES = Object.keys(ICONS) as IconName[];
