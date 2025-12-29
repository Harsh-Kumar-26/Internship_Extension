from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
import pandas as pd

from schemas import (
    Inputtomodel,
    Outputfrommodel
)
from main import run_hungarian_allocation

load_dotenv()

app = FastAPI(title="Internship Allocation Service")

@app.post("/allocate", response_model=list[Outputfrommodel])
def allocate(req: Inputtomodel):
    try:
        users_df = pd.DataFrame([u.dict() for u in req.users])
        internships_df = pd.DataFrame([i.dict() for i in req.internships])

        allocation_df = run_hungarian_allocation(
            users_df,
            internships_df
        )

        return allocation_df.to_dict(orient="records")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
