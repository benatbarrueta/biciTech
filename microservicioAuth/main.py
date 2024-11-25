from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import pymysql
import jwt
import datetime
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from requests_oauthlib import OAuth2Session
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import time
import os
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

while True:
    try:
        db = pymysql.connect(
            host="mysql_db",  # Nombre del servicio MySQL en Docker Compose
            user="my_user",
            password="my_password",
            database="my_database",
            port=3306
        )
        print("Database connection successful!")
        break
    except pymysql.err.OperationalError as e:
        print(f"Database not ready, retrying in 5 seconds... Error: {e}")
        time.sleep(5)

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

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
SECRET_KEY = os.getenv("SECRET_KEY")
GOOGLE_REDIRECT_URI = "http://localhost:3000/auth/google/callback"
AUTHORIZATION_BASE_URL = "https://accounts.google.com/o/oauth2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Función para hashear la contraseña
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Función para verificar la contraseña
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
 
# Función para crear un token JWT
def create_jwt_token(data: dict):
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    data.update({"exp": expiration})
    token = jwt.encode(data, SECRET_KEY, algorithm="HS256")
    return token

# Ruta para iniciar el flujo de autenticación con Google
@app.get("/auth/google")
async def google_login():
    google = OAuth2Session(GOOGLE_CLIENT_ID, redirect_uri=GOOGLE_REDIRECT_URI, scope=["openid", "email", "profile"])
    authorization_url, _ = google.authorization_url(AUTHORIZATION_BASE_URL, access_type="offline", prompt="select_account")
    return {"authorization_url": authorization_url}

# Ruta de callback para manejar la respuesta de Google
@app.get("/auth/google/callback")
async def google_callback(code: str):
    google = OAuth2Session(GOOGLE_CLIENT_ID, redirect_uri=GOOGLE_REDIRECT_URI)
    token = google.fetch_token(TOKEN_URL, client_secret=GOOGLE_CLIENT_SECRET, code=code)

    # Obtener información del usuario
    user_info = google.get("https://www.googleapis.com/oauth2/v1/userinfo").json()
    
    # Manejar la lógica de registro/inicio de sesión en la base de datos
    cursor = db.cursor()
    
    # Verificar si el usuario ya existe
    query = "SELECT * FROM user WHERE username=%s"
    cursor.execute(query, (user_info["email"],))
    user = cursor.fetchone()

    if not user:
        # Si el usuario no existe, registrar uno nuevo
        insert_query = "INSERT INTO user (name, username, password) VALUES (%s, %s, %s)"
        cursor.execute(insert_query, (user_info["name"], user_info["email"], ""))
        db.commit()

    cursor.close()

    # Generar un token JWT para el usuario
    jwt_token = create_jwt_token({"sub": user_info["email"]})
    return {"access_token": jwt_token, "token_type": "bearer"}

# Ruta para generar el token JWT
@app.post("/auth/token")
async def generate_token(form_data: OAuth2PasswordRequestForm = Depends()):
    cursor = db.cursor()
    
    # Buscar el usuario en la base de datos
    query = "SELECT * FROM user WHERE username=%s"
    cursor.execute(query, (form_data.username,))
    user = cursor.fetchone()
    cursor.close()

    # Verificar si el usuario existe y si la contraseña es correcta
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    # Generar el token JWT
    token = create_jwt_token({"sub": user["username"]})
    return {"access_token": token, "token_type": "bearer"}

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
    
    # Hash the password
    hashedPassword = hash_password(user_data.password)

    # Insert the new user into the database
    insert_query = "INSERT INTO user (name, username, password) VALUES (%s, %s, %s)"
    cursor.execute(insert_query, (user_data.name, user_data.username, hashedPassword))
    
    db.commit()
    cursor.close()
    
    return {"message": "User registered successfully"}

# Route to logout the user
@app.post("/auth/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    return {"message": "User logged out successfully"}

# Function to get the current user
async def getCurrentUser(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
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

class FavoriteRoad(BaseModel):
    roadID: str 

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

@app.post("/auth/favorite-roads/check")
async def check_favorite_road(
    road: FavoriteRoad,
    current_user: str = Depends(getCurrentUser)
):
    cursor = db.cursor()
    
    # Check if the road is a favorite
    query = "SELECT * FROM favoriteRoads WHERE username=%s AND roadID=%s"
    cursor.execute(query, (current_user, road.roadID))
    favorite_road = cursor.fetchone()
    
    cursor.close()
    
    # Return true if an element is found, false otherwise
    return {"isFavorite": favorite_road is not None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)