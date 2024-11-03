from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import pymysql
import jwt
import datetime
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

db = pymysql.connect(
    host="localhost",
    user="root",
    password="root",
    db="bicitech",
    charset="utf8mb4",
    cursorclass=pymysql.cursors.DictCursor
)

app = FastAPI(
    title="Authentication API",
    description="API for user authentication and favorite lanes management.",
    version="1.0.0",
    docs_url="/docs",  # Path for Swagger documentation
    redoc_url="/redoc",  # Path for ReDoc documentation
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Modelo Pydantic para el registro y login de usuarios
class User(BaseModel):
    name: str
    username: str
    password: str


# Load environment variables
load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
 
# Función para crear un token JWT
def create_jwt_token(data: dict):
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    data.update({"exp": expiration})
    token = jwt.encode(data, os.getenv("SECRET_KEY"), algorithm="HS256")
    return token

# Ruta para generar el token JWT
@app.post("/auth/token")
async def generate_token(form_data: OAuth2PasswordRequestForm = Depends()):
    cursor = db.cursor()
    query = "SELECT * FROM user WHERE username=%s AND password=%s"
    cursor.execute(query, (form_data.username, form_data.password))
    user = cursor.fetchone()
    cursor.close()

    if user:
        token = create_jwt_token({"sub": user["username"]})
        return {"access_token": token, "token_type": "bearer"}
    else:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

# Route to register a new user
@app.post("/auth/register")
async def register(user_data: User):
    cursor = db.cursor()
    
    # Check if the user already exists in the database
    query = "SELECT * FROM user WHERE username=%s"
    cursor.execute(query, (user_data.username,))
    existing_user = cursor.fetchone()

    if existing_user:
        cursor.close()
        raise HTTPException(status_code=400, detail="User already exists")

    # Insert the new user into the database
    insert_query = "INSERT INTO user (name, username, password) VALUES (%s, %s, %s)"
    cursor.execute(insert_query, (user_data.name, user_data.username, user_data.password))
    
    db.commit()
    cursor.close()
    
    return {"message": "User registered successfully"}

# Function to get the current user
async def getCurrentUser(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Credencial inválida")
        return username
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Credencial inválida")
    
# Route to get the current user
@app.get("/auth/users/me")
async def read_users_me(current_user: str = Depends(getCurrentUser)):
    return {"username": current_user}

class AddFavoriteRoad(BaseModel):
    road: str # The name of the road to add to the user's favorites

class DeleteFavoriteRoad(BaseModel):
    road: str # The name of the road to delete from the user's favorites

# Route to add a favorite road to the user
@app.post("/auth/favorite-roads/add")
async def add_favorite_road(
        favorite_road: AddFavoriteRoad,
        current_user: str = Depends(getCurrentUser)
    ):
        cursor = db.cursor()
        
        # Check if the road is already a favorite
        query = "SELECT * FROM favoriteRoads WHERE username=%s AND roadID=%s"
        cursor.execute(query, (current_user, favorite_road.road))
        existing_favorite = cursor.fetchone()

        if existing_favorite:
            cursor.close()
            raise HTTPException(status_code=400, detail="The road is already a favorite")

        # Add the road to the user's favorites
        insert_query = "INSERT INTO favoriteRoads (username, roadID) VALUES (%s, %s)"
        cursor.execute(insert_query, (current_user, favorite_road.road))
        
        db.commit()
        cursor.close()
        
        return {"message": "Road added to favorites successfully"}

# Route to delete a favorite road from the user
@app.delete("/auth/favorite-roads/delete")
async def delete_favorite_road(
        favorite_road: DeleteFavoriteRoad,
        current_user: str = Depends(getCurrentUser)
    ):
        cursor = db.cursor()
        
        # Delete the road from the user's favorites
        delete_query = "DELETE FROM favoriteRoads WHERE username=%s AND roadID=%s"
        cursor.execute(delete_query, (current_user, favorite_road.road))
        
        db.commit()
        cursor.close()
        
        return {"message": "Road deleted from favorites successfully"}

# Route to get all the favorite roads of the user
@app.get("/auth/favorite-roads/all", response_model=list)
async def get_all_favorite_roads(current_user: str = Depends(getCurrentUser)):
    cursor = db.cursor()
    
    # Get all the favorite roads of the user
    query = "SELECT roadID, username FROM favoriteRoads WHERE username=%s"
    cursor.execute(query, (current_user,))
    favorite_roads = cursor.fetchall()
    
    cursor.close()
    
    return favorite_roads

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)