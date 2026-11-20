import { llmsFullTxt, llmsResponse } from "@/lib/llms";

export function GET() {
  return llmsResponse(llmsFullTxt());
}
