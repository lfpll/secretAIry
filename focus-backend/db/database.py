import os
from typing import Annotated
from fastapi import Depends
from sqlmodel import Field, Session, SQLModel, create_engine, select
from fastapi import Depends, FastAPI, HTTPException, Query

# SQLite connection string - defaults to SQLite if not specified
CONN_STRING = os.getenv("CONN_STRING", "sqlite:///./tasks.db")

# For SQLite, we need check_same_thread=False to allow multiple threads
connect_args = {"check_same_thread": False} if "sqlite" in CONN_STRING else {}
engine = create_engine(CONN_STRING, connect_args=connect_args)

def get_session():
    """Get database session."""
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

def create_db_and_tables():
    """Create the database tables if they don't exist."""
    SQLModel.metadata.create_all(engine)

# Code below omitted 👇