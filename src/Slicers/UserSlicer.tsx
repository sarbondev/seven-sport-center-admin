import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserTypes } from "../Types/indexTypes";

interface UserState {
  data: UserTypes;
  isPending: boolean;
  error: string;
  isAuth: boolean;
}

const initialState: UserState = {
  data: {
    fullName: "",
    password: "",
    phoneNumber: "",
    _id: "",
  },
  isPending: false,
  error: "",
  isAuth: false,
};

const UserSlicer = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<UserTypes>) {
      state.data = payload;
      state.isPending = false;
      state.isAuth = true;
      state.error = "";
    },
    setPending(state) {
      state.isPending = true;
    },
    setError(state, { payload }: PayloadAction<string>) {
      state.error = payload;
      state.isPending = false;
      state.isAuth = false;
    },
  },
});

export const { setUser, setPending, setError } = UserSlicer.actions;
export default UserSlicer.reducer;
