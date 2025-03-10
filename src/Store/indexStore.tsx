import { configureStore } from "@reduxjs/toolkit";
import UserSlicer from "../Slicers/UserSlicer";

export const store = configureStore({
  reducer: {
    user: UserSlicer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
