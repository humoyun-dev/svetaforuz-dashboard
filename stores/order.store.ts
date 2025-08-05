import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { OrderFormType, OrderItemsFormType } from "@/types/orders.type";

interface OrderState {
  addMode: boolean;
  submitMode: boolean;
  orderItem: OrderItemsFormType | null;
  orderItems: OrderItemsFormType[];
  order: OrderFormType;
  index: number | null;
  _hasHydrated: boolean;

  setAddMode: (value: boolean) => void;
  setOrderItem: (item: OrderItemsFormType | null) => void;
  addOrderItem: (item: OrderItemsFormType) => void;
  updateOrderItem: (index: number, item: OrderItemsFormType) => void;
  clearOrderItems: () => void;
  removeOrderItem: (index: number) => void;
  setOrder: (order: OrderFormType) => void;
  setIndex: (index: number) => void;
  setSubmitMode: (value: boolean) => void;

  resetOrder: () => void;

  setHydrated: (value: boolean) => void;
}

export const useOrder = create<OrderState>()(
  devtools(
    persist(
      (set, get) => ({
        addMode: false,
        submitMode: false,
        orderItem: null,
        orderItems: [],
        order: {
          phone_number: "",
          first_name: "",
          last_name: "",
          currency: "USD",
          payment_type: "cash",
          paid_amount: "",
          change_given: false,
          change_amount: "",
          currency_change: "USD",
        },
        _hasHydrated: false,
        index: null,

        setAddMode: (value) => set({ addMode: value }),
        setOrderItem: (item) => set({ orderItem: item }),
        addOrderItem: (item) =>
          set((state) => ({
            orderItems: [...state.orderItems, item],
          })),
        updateOrderItem: (index, updatedItem) =>
          set((state) => ({
            orderItems: state.orderItems.map((item, i) =>
              i === index ? updatedItem : item,
            ),
          })),
        removeOrderItem: (index) =>
          set((state) => ({
            orderItems: state.orderItems.filter((_, i) => i !== index),
          })),
        clearOrderItems: () => set({ orderItems: [] }),
        setOrder: (order) => set({ order }),
        setIndex: (index) => set({ index }),
        setSubmitMode: (value: boolean) => set({ submitMode: value }),
        resetOrder: () =>
          set({
            orderItems: [],
            order: {
              phone_number: "",
              first_name: "",
              last_name: "",
              currency: "USD",
              payment_type: "cash",
              paid_amount: "",
              change_given: false,
              change_amount: "",
              currency_change: "USD",
            },
            addMode: false,
            submitMode: false,
            orderItem: null,
            index: null,
          }),

        setHydrated: (value) => set({ _hasHydrated: value }),
      }),
      {
        name: "order-storage",
        partialize: (state) => ({
          addMode: state.addMode,
          orderItem: state.orderItem,
          orderItems: state.orderItems,
          order: state.order,
          submitMode: state.submitMode,
          index: state.index,
        }),
        onRehydrateStorage: () => (state, error) => {
          if (state && !error) {
            state._hasHydrated = true;
          }
        },
      },
    ),
    {
      name: "OrderStore",
    },
  ),
);
