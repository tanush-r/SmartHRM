import os
import httpx
import uvicorn
from fastapi import FastAPI, Request, HTTPException
from typing import List, Dict
import logging
import json
# Define base backend URLs
BASE_BACKEND_URLS = {
    "clients": "http://client-master:8009/api/client-master",  # Client service
    "requirements": "http://requirement-master:8008/api/requirement-master",  # Requirement service
    "candidates": "http://candidate-master:8007/api/candidate-master",  # Candidate service
}
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
# Create FastAPI app
intermediate_app = FastAPI(root_path="/api/intermediate-master")
async def forward_request(request: Request, method: str, category: str, backend_path: str):
    # Fetch the correct backend URL based on the category
    backend_url = BASE_BACKEND_URLS.get(category)
    if backend_url is None:
        raise HTTPException(status_code=404, detail="Backend service not found")
    # Combine the backend URL with the backend path
    url = f"{backend_url}{backend_path}"
    # Set headers from the incoming request
    headers = {**dict(request.headers), "Content-Type": "application/json"}
    try:
        # Send the request to the backend
        async with httpx.AsyncClient() as client:
            body = None
            # If method is POST or PUT, add the request body
            if method in ["POST", "PUT"]:
                body = await request.json()
                if not body:
                    raise HTTPException(status_code=400, detail="Empty request body")
                # Log the original body content
                logger.info(f"Original request body: {body}")
                response = await client.request(method, url, json=body)
            else:
                response = await client.request(method, url)
        # Check if the response was successful
        response.raise_for_status()
        # Log the response from the backend
        logger.info(f"Response from backend: {response.status_code} - {response.text}")
        # Return the JSON response
        return response.json()
    except httpx.RequestError as exc:
        # Log and raise an exception in case of request error
        logger.error(f"Request error: {exc}")
        raise HTTPException(status_code=500, detail=f"Request error: {exc}")
    except httpx.HTTPStatusError as exc:
        # Log and raise an exception in case of HTTP error
        logger.error(f"HTTP error: {exc.response.status_code} - {exc.response.text}")
        raise HTTPException(status_code=exc.response.status_code, detail=f"HTTP error: {exc.response.status_code}")
    except Exception as exc:
        # Log and raise a generic error
        logger.error(f"Unexpected error: {exc}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")
@intermediate_app.get("/")
async def read_root():
    return {"message": "Intermediate API is running."}
# Clients CRUD Operations
@intermediate_app.get("/clients", response_model=List[Dict])
async def get_clients(request: Request):
    # Get all clients by forwarding the GET request to the backend
    response = await forward_request(request, "GET", "clients", "/clients")
    return response
@intermediate_app.get("/clients/{client_id}", response_model=Dict)
async def get_client(request: Request, client_id: str):
    # Get a particular client by its ID
    response = await forward_request(request, "GET", "clients", f"/clients/{client_id}")
    return response
@intermediate_app.post("/clients")
async def create_client(request: Request):
    # Create a new client by forwarding the POST request to the backend
    response = await forward_request(request, "POST", "clients", "/clients")
    return response
@intermediate_app.put("/clients/{client_id}")
async def update_client(request: Request, client_id: str):
    # Update an existing client by forwarding the PUT request to the backend
    response = await forward_request(request, "PUT", "clients", f"/clients/{client_id}")
    return response
@intermediate_app.delete("/clients/{client_id}")
async def delete_client(request: Request, client_id: str):
    # Delete a client by forwarding the DELETE request to the backend
    response = await forward_request(request, "DELETE", "clients", f"/clients/{client_id}")
    return response
# Requirements CRUD Operations
@intermediate_app.get("/requirements", response_model=List[Dict])
async def get_requirements(request: Request):
    # Get all requirements by forwarding the GET request to the backend
    response = await forward_request(request, "GET", "requirements", "/requirements")
    return response
@intermediate_app.get("/requirements/client/{cl_id}", response_model=List[Dict])
async def get_requirements_by_client(request: Request, cl_id: str):
    # Get requirements for a specific client by forwarding the GET request to the backend
    response = await forward_request(request, "GET", "requirements", f"/requirements/{cl_id}")
    return response
@intermediate_app.get("/requirements/rq_id/{rq_id}", response_model=Dict)
async def get_requirement(request: Request, rq_id: str):
    # Get a specific requirement by its ID
    response = await forward_request(request, "GET", "requirements", f"/requirements/rq_id/{rq_id}")
    return response
@intermediate_app.post("/requirements/{cl_id}")
async def create_requirement_for_client(request: Request, cl_id: str):
    # Create a new requirement for a specific client by forwarding the POST request to the backend
    response = await forward_request(request, "POST", "requirements", f"/requirements/{cl_id}")
    return response
@intermediate_app.put("/requirements/{rq_id}")
async def update_requirement(request: Request, rq_id: str):
    # Update a specific requirement by its ID
    response = await forward_request(request, "PUT", "requirements", f"/requirements/{rq_id}")
    return response
@intermediate_app.delete("/requirements/{rq_id}")
async def delete_requirement(request: Request, rq_id: str):
    # Delete a specific requirement by its ID
    response = await forward_request(request, "DELETE", "requirements", f"/requirements/{rq_id}")
    return response
# Candidates CRUD Operations
@intermediate_app.post("/candidates/{rq_id}")
async def create_candidate(request: Request, rq_id: str):
    # Create a new candidate for a specific requirement by forwarding the POST request to the backend
    response = await forward_request(request, "POST", "candidates", f"/candidates/{rq_id}")
    return response
@intermediate_app.get("/candidates", response_model=List[Dict])
async def get_candidates(request: Request):
    # Get all candidates by forwarding the GET request to the backend
    response = await forward_request(request, "GET", "candidates", "/candidates")
    return response
@intermediate_app.get("/candidates/{cd_id}", response_model=Dict)
async def get_candidate(request: Request, cd_id: str):
    # Get a specific candidate by its ID
    response = await forward_request(request, "GET", "candidates", f"/candidates/{cd_id}")
    return response
@intermediate_app.put("/candidates/{cd_id}")
async def update_candidate(request: Request, cd_id: str):
    # Update a specific candidate by its ID
    response = await forward_request(request, "PUT", "candidates", f"/candidates/{cd_id}")
    return response
@intermediate_app.delete("/candidates/{cd_id}")
async def delete_candidate(request: Request, cd_id: str):
    # Delete a specific candidate by its ID
    response = await forward_request(request, "DELETE", "candidates", f"/candidates/{cd_id}")
    return response
# New endpoint to fetch candidates by rq_id
@intermediate_app.get("/candidates/requirement/{rq_id}", response_model=List[Dict])
async def get_candidates_by_requirement(request: Request, rq_id: str):
    """
    Fetch all candidates for a specific requirement ID (rq_id).
    """
    response = await forward_request(request, "GET", "candidates", f"/candidates/requirement/{rq_id}")
    return response
if __name__ == "__main__":
    port = int(os.getenv("main", 8000))
    uvicorn.run(intermediate_app, host="0.0.0.0", port=port)