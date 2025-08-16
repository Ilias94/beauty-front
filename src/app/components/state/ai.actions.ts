import { AiDtoRequest } from "../../../api/models";

export class GetAiPromptAction {
  static readonly type = '[Ai] GetAiPromptAction';
  constructor(public prompt: AiDtoRequest) { }
}
