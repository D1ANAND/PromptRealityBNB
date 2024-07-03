from fastapi import FastAPI, HTTPException,Query,Path
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import requests
import time
import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError


load_dotenv()
app = FastAPI()


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

AWS_ACCESS_KEY = os.getenv('MY_AWS_ACCESS_KEY')
AWS_SECRET_KEY = os.getenv('MY_AWS_SECRET_KEY')
S3_BUCKET_NAME = os.getenv('MY_S3_BUCKET_NAME')

s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)


users_db = {}

@app.get('/')
def home():
    return {'This is Home Page'}

class User(BaseModel):
    user: EmailStr
    assets: List[str] = []
    main: Optional[str] = None
    level: int = 0


class EmailInput(BaseModel):
    email: EmailStr

@app.post("/create")
def create_user(email_input: EmailInput):
    email = email_input.email
    if email in users_db:
        return JSONResponse(content={"message": "User already exists"})
    users_db[email] = User(user=email)
    return JSONResponse(content={"message": "User created successfully"})



class AssetInput(BaseModel):
    email: EmailStr
    asset_url: str

@app.post("/update")
def update_assets(asset_input: AssetInput):
    email = asset_input.email
    asset_url = asset_input.asset_url
    if email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    users_db[email].assets.append(asset_url)
    return JSONResponse(content={"message": "Asset added successfully"})



class MainInput(BaseModel):
    email: EmailStr
    main_url: str

@app.post("/set")
def set_main(main_input: MainInput):
    email = main_input.email
    main_url = main_input.main_url
    if email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    users_db[email].main = main_url
    return JSONResponse(content={"message": "Main URL set successfully"})

class FetchMainInput(BaseModel):
    email: EmailStr


@app.post("/fetchMain")
def fetch_main(fetch_main_input: FetchMainInput):
    email = fetch_main_input.email
    if email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return {"main_url": users_db[email].main}

class XPInput(BaseModel):
    email: EmailStr
    asset_url:str

@app.post("/increaseXP")
def increase_xp(xp_input: XPInput):
    email=xp_input.email
    asset_url= xp_input.asset_url
    if email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    if asset_url not in users_db[email].assets:
        raise HTTPException(status_code=404, detail="Asset not found")
    users_db[email].level +=1
    return JSONResponse(content={"new_level": users_db[email].level})

class ViewAssetsInput(BaseModel):
    email: EmailStr

@app.post("/view")
def view_assets(view_assets_input: ViewAssetsInput):
    email = view_assets_input.email
    if email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return {"assets": users_db[email].assets}


@app.get("/fetchMainget")
def fetch_main_get(email: str = Query(..., description="Email of the user")):
    if email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return {"main_url": users_db[email].main}


YOUR_API_KEY = os.environ.get("YOUR_API_KEY")

class PromptInput(BaseModel):
    prompt: str


@app.get("/generateassets/{prompt}")
async def generate_3d_model_get(prompt: str = Path(..., description="The prompt for generating the 3D model")):

    headers = {
        "Authorization": f"Bearer {YOUR_API_KEY}",
    }
    payload = {
        "mode": "preview",
        "prompt": prompt,
        "art_style": "realistic",
        "negative_prompt": "low quality, low resolution, low poly, ugly"
    }
    response = requests.post(
        "https://api.meshy.ai/v2/text-to-3d", 
        headers=headers, 
        json=payload
    )
    response.raise_for_status()
    print(response.json())
    task_id = response.json().get('result')

    if not task_id:
        raise HTTPException(status_code=500, detail="Failed to generate task ID")
    
    time.sleep(60)

    response = requests.get(
        f"https://api.meshy.ai/v2/text-to-3d/{task_id}",
        headers=headers,
    )
    data = response.json()

    glb_url = data.get('model_urls', {}).get('glb')

    if glb_url:
        print({"glb": glb_url})
    else:
        raise HTTPException(status_code=569, detail="GLB URL not found")

    glb_response = requests.get(glb_url)
    glb_response.raise_for_status()

    s3_key = f"generated-models/{task_id}.glb"
    try:
        s3_client.put_object(Bucket=S3_BUCKET_NAME, Key=s3_key, Body=glb_response.content)
        s3_url = f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/{s3_key}"
    except (NoCredentialsError, PartialCredentialsError) as e:
        raise HTTPException(status_code=501, detail="S3 credentials error")
    except Exception as e:
        raise HTTPException(status_code=503, detail="Failed to upload to S3")

    return {"s3_url": s3_url}
    


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app,port=int(os.environ.get('PORT', 8080)), host="0.0.0.0")
