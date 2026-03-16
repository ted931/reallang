from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import lessons, progress, chat

app = FastAPI(title="RealLang API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router_v1 = FastAPI()
api_router_v1.include_router(lessons.router)
api_router_v1.include_router(progress.router)
api_router_v1.include_router(chat.router)

app.mount("/api/v1", api_router_v1)


@app.get("/")
async def root():
    return {"message": "RealLang API is running"}
