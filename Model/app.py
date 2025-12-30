import gradio as gr
from fastapi import FastAPI

# import your existing FastAPI app
from server import app as fastapi_app

# Create Gradio wrapper
app = gr.mount_gradio_app(
    fastapi_app,
    gr.Interface(
        fn=lambda x: "FastAPI backend is running",
        inputs="text",
        outputs="text",
        title="Internship Allocation Service",
        description="None"
    ),
    path="/"
)