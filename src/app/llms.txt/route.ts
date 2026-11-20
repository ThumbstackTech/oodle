import { llmsResponse, llmsTxt } from "@/lib/llms";

export function GET() {
  return llmsResponse(llmsTxt());
}
