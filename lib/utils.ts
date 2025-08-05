import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import { StaffType, UserType } from "@/types/user.type";
import "moment/locale/ru";
import "moment/locale/uz-latn";
import { getCookie } from "./cookie";

const lan = getCookie("NEXT_LOCALE");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatedPhoneNumber(phoneNumber: string) {
  return `+${phoneNumber.slice(0, 3)} (${phoneNumber.slice(
    3,
    5,
  )}) ${phoneNumber.slice(5, 8)} ${phoneNumber.slice(
    8,
    10,
  )} ${phoneNumber.slice(10)}`;
}

export function formatedDate(date: string) {
  return moment(date)
    .locale(String(lan?.toLowerCase()))
    .utcOffset(5)
    .format("D MMMM HH:mm, YYYY");
}

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const checkRole = (role: StaffType) => {
  const roleMap = {
    admin: "admin",
    manager: "manager",
    seller: "seller",
    deliverer: "deliverer",
    cashier: "cashier",
    stockman: "stockman",
    viewer: "viewer",
  };

  return roleMap[role] || "viewer";
};

export const normalizeNumber = (value: string) =>
  String(value.replace(/\s/g, "").replace(",", "."));
