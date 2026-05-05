import os
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langgraph.graph import StateGraph, END
from langchain.agents import create_agent
# from langchain.core import tool
from typing import TypedDict, Annotated
import operator
from dotenv import load_dotenv
import base64
import requests

load_dotenv()


llm = ChatNVIDIA(
  model="qwen/qwen3.5-397b-a17b",
  model_type="nv-vlm",
  api_key=os.getenv("NVIDIA_API_KEY"),
  temperature=0.6,
  top_p=0.95,
  max_completion_tokens=16384,
)


system_prompt = """
  Analyze the main clothing item in this image.
    Do not use <think> tags. Respond ONLY with a valid JSON object.
    Format: {\"color\": \"...\", \"fabric\": \"...\", \"category\": \"...\", \"style\": \"...\"}
"""

# message = input("Has tu pregunta para el llm ").lower()

try:
  base64_image = requests.get("https://m.media-amazon.com/images/I/31W54GTkMML._AC_SY1000_.jpg").content
  base64_image = base64.b64encode(base64_image).decode('utf-8')
except Exception as e:
  print(e)

agent = create_agent(model=llm, system_prompt=system_prompt)

results = agent.invoke({"messages": [{"role": "user", "content": {"type": "image", "base64": base64_image,"mime_type": "image/jpg"}}]})

print(results)
#class GraphState(TypedDict):
#    input: str
#    output: str

#def agent(state: GraphState):
#    response = llm.invoke(state["input"])
#    return {"output": response.content}

#workflow = StateGraph(GraphState)
#workflow.add_node("agent", agent)
#workflow.set_entry_point("agent")
#workflow.add_edge("agent", END)

#app = workflow.compile()

#result = app.invoke({"input": "What is the capital of France?"})
#print(result["output"])

# lc_messages = [{"role":"user","content":"What is the capital of France?"}]


# for chunk in client.stream(lc_messages, chat_template_kwargs={"enable_thinking":True}):
#   if chunk.additional_kwargs and "reasoning_content" in chunk.additional_kwargs:
#     print(chunk.additional_kwargs["reasoning_content"], end="")
#   print(chunk.content, end="")

