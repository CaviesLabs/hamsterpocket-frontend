import { SET_H_PROFILE } from "@/src/redux/actions";
import { Action } from "@/src/redux/entities/interfaces/action";
import { ProfileDto } from "@/src/dto/profile.dto";

export default (state: ProfileDto = null, action: Action) => {
  if (action.type === SET_H_PROFILE) {
    return action.payload;
  }
  return state;
};
