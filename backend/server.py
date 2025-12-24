from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta
import random


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Models
class LoginRequest(BaseModel):
    passport_number: str
    policy_number: str

class UserProfile(BaseModel):
    name: str
    passport_number: str
    policy_number: str
    policy_type: str
    policy_status: str

class FlightSegment(BaseModel):
    flight_number: str
    route: str
    date: str
    airline: str
    journey_type: str

class ItineraryResponse(BaseModel):
    passenger_name: str
    segments: List[FlightSegment]

class BaggageClaimRequest(BaseModel):
    flight_number: str
    delay_hours: Optional[int] = 6
    description: Optional[str] = ""

class ClaimResponse(BaseModel):
    claim_id: str
    status: str
    message: str
    compensation_amount: Optional[float] = None
    currency: str = "$"


# Test users database
TEST_USERS = {
    "CSGHY654JK": {
        "name": "Rachel Ng",
        "passport_number": "CSGHY654JK",
        "policy_number": "TRV-2026-001487",
        "policy_type": "Income Travel Insurance - Premier Plan",
        "policy_status": "ACTIVE"
    },
    "CSGHY456JK": {
        "name": "Broker Account",
        "passport_number": "CSGHY456JK",
        "policy_number": "TRV-2026-001687",
        "policy_type": "Income Travel Insurance - Business Plan",
        "policy_status": "ACTIVE"
    },
    "CSGHY623JK": {
        "name": "Mei Ling Chen",
        "passport_number": "CSGHY623JK",
        "policy_number": "INC-TRV-2024-79045",
        "policy_type": "Income Travel Insurance - Premier Plan",
        "policy_status": "ACTIVE"
    },
    "CSGHY622JK": {
        "name": "Cheryl Chan",
        "passport_number": "CSGHY622JK",
        "policy_number": "INC-TRV-2024-79145",
        "policy_type": "Income Travel Insurance - Premier Plan",
        "policy_status": "ACTIVE"
    },
    "CSGHY664JK": {
        "name": "Elizabeth Choy",
        "passport_number": "CSGHY664JK",
        "policy_number": "INC-TRV-2024-79245",
        "policy_type": "Income Travel Insurance - Premier Plan",
        "policy_status": "ACTIVE"
    },
    "CSGHY224JK": {
        "name": "Kelly Pan",
        "passport_number": "CSGHY224JK",
        "policy_number": "INC-TRV-2024-78946",
        "policy_type": "Income Travel Insurance - Premier Plan",
        "policy_status": "ACTIVE"
    },
    "CSGHY304JK": {
        "name": "Sophia Poh",
        "passport_number": "CSGHY304JK",
        "policy_number": "INC-TRV-2024-79747",
        "policy_type": "Income Travel Insurance - Premier Plan",
        "policy_status": "ACTIVE"
    },
    "CSBNY384JK": {
        "name": "Emily Wong",
        "passport_number": "CSBNY384JK",
        "policy_number": "INC-TRV-2024-79048",
        "policy_type": "Income Travel Insurance - Premier Plan",
        "policy_status": "ACTIVE"
    }
}

# Function to generate dynamic itinerary dates
def get_dynamic_itinerary():
    from datetime import datetime, timedelta
    today = datetime.now()
    today_str = today.strftime("%d %b %Y")
    future_str = (today + timedelta(days=3)).strftime("%d %b %Y")
    
    return {
        "CSGHY654JK": [
            {
                "flight_number": "SQ882",
                "route": "SIN → HAK",
                "date": today_str,
                "airline": "Singapore Airlines",
                "journey_type": "Outward"
            },
            {
                "flight_number": "NH886",
                "route": "HAK → NRT",
                "date": today_str,
                "airline": "All Nippon Airways",
                "journey_type": "Outward"
            },
            {
                "flight_number": "NH885",
                "route": "NRT → HAK",
                "date": future_str,
                "airline": "All Nippon Airways",
                "journey_type": "Return"
            },
            {
                "flight_number": "SQ883",
                "route": "HAK → SIN",
                "date": future_str,
                "airline": "Singapore Airlines",
                "journey_type": "Return"
            }
        ],
        "CSGHY456JK": [
            {
                "flight_number": "SQ318",
                "route": "SIN → LHR",
                "date": "18 Dec 2025",
                "airline": "Singapore Airlines",
                "journey_type": "Outward"
            },
            {
                "flight_number": "BA15",
                "route": "LHR → SIN",
                "date": "22 Dec 2025",
                "airline": "British Airways",
                "journey_type": "Return"
            }
        ],
        "CSGHY623JK": [
            {
                "flight_number": "SQ636",
                "route": "SIN → BKK",
                "date": today_str,
                "airline": "Singapore Airlines",
                "journey_type": "Outward"
            },
            {
                "flight_number": "SQ637",
                "route": "BKK → SIN",
                "date": future_str,
                "airline": "Singapore Airlines",
                "journey_type": "Return"
            }
        ],
        "CSGHY622JK": [
            {
                "flight_number": "SQ178",
                "route": "SIN → SYD",
                "date": today_str,
                "airline": "Singapore Airlines",
                "journey_type": "Outward"
            },
            {
                "flight_number": "SQ179",
                "route": "SYD → SIN",
                "date": future_str,
                "airline": "Singapore Airlines",
                "journey_type": "Return"
            }
        ],
        "CSGHY664JK": [
            {
                "flight_number": "SQ254",
                "route": "SIN → HKG",
                "date": today_str,
                "airline": "Singapore Airlines",
                "journey_type": "Outward"
            },
            {
                "flight_number": "SQ255",
                "route": "HKG → SIN",
                "date": future_str,
                "airline": "Singapore Airlines",
                "journey_type": "Return"
            }
        ],
        "CSGHY224JK": [
            {
                "flight_number": "SQ231",
                "route": "SIN → CDG",
                "date": today_str,
                "airline": "Singapore Airlines",
                "journey_type": "Outward"
            },
            {
                "flight_number": "SQ232",
                "route": "CDG → SIN",
                "date": future_str,
                "airline": "Singapore Airlines",
                "journey_type": "Return"
            }
        ],
        "CSGHY304JK": [
            {
                "flight_number": "SQ828",
                "route": "SIN → NRT",
                "date": today_str,
                "airline": "Singapore Airlines",
                "journey_type": "Outward"
            },
            {
                "flight_number": "SQ829",
                "route": "NRT → SIN",
                "date": future_str,
                "airline": "Singapore Airlines",
                "journey_type": "Return"
            }
        ],
        "CSBNY384JK": [
            {
                "flight_number": "SQ322",
                "route": "SIN → LHR",
                "date": today_str,
                "airline": "Singapore Airlines",
                "journey_type": "Outward"
            },
            {
                "flight_number": "SQ321",
                "route": "LHR → SIN",
                "date": future_str,
                "airline": "Singapore Airlines",
                "journey_type": "Return"
            }
        ]
    }

# Static reference for backward compatibility
TEST_ITINERARIES = get_dynamic_itinerary()


# API Endpoints
@api_router.get("/")
async def root():
    return {"message": "Income Insurance Claims API v1.0"}


@api_router.post("/login")
async def login(request: LoginRequest):
    """Login with passport and policy number"""
    user = TEST_USERS.get(request.passport_number)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if user["policy_number"] != request.policy_number:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "success": True,
        "user": user
    }


@api_router.get("/itinerary/{passport_number}")
async def get_itinerary(passport_number: str):
    """Get travel itinerary for a passenger"""
    user = TEST_USERS.get(passport_number)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get fresh dynamic itinerary with current dates
    dynamic_itineraries = get_dynamic_itinerary()
    segments = dynamic_itineraries.get(passport_number, [])
    
    return {
        "passenger_name": user["name"],
        "segments": segments
    }


@api_router.post("/claim/baggage")
async def file_baggage_claim(request: BaggageClaimRequest, passport_number: str):
    """File a baggage delay claim"""
    user = TEST_USERS.get(passport_number)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    claim_id = f"CLM-TRV-2026-{random.randint(100000, 999999)}"
    compensation = 150.00 if request.delay_hours and request.delay_hours >= 6 else 0
    
    return {
        "claim_id": claim_id,
        "status": "APPROVED" if compensation > 0 else "PENDING_REVIEW",
        "message": f"Your baggage delay claim for flight {request.flight_number} has been processed.",
        "compensation_amount": compensation,
        "currency": "$"
    }


@api_router.get("/policy/{policy_number}")
async def get_policy_details(policy_number: str):
    """Get policy details"""
    for user in TEST_USERS.values():
        if user["policy_number"] == policy_number:
            return {
                "policy_number": user["policy_number"],
                "policy_holder": user["name"],
                "policy_type": user["policy_type"],
                "status": user["policy_status"],
                "coverage": {
                    "baggage_delay": {"limit": 500, "currency": "$"},
                    "lost_documents": {"limit": 1000, "currency": "$"},
                    "medical_expense": {"limit": 500000, "currency": "$"}
                }
            }
    
    raise HTTPException(status_code=404, detail="Policy not found")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
