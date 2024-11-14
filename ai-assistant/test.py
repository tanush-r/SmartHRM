import requests
import time
from concurrent.futures import ThreadPoolExecutor, as_completed



# Define the services and their endpoints using Minikube IP
services = {
    "resume_upload": f"http://localhost:8000/query",
    
}

# Function to send requests
def send_request(service_name):
    url = services[service_name]
    try:
        response = requests.get(url, params={"question": "How many clients are there"})
        return service_name, response.status_code, response.json()
    except requests.exceptions.RequestException as e:
        return service_name, None, str(e)

# Main function to run load tests
def load_test(num_requests_per_service=100):
    start_time = time.time()
    
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = []
        
        for service_name in services.keys():
            for _ in range(num_requests_per_service):
                futures.append(executor.submit(send_request, service_name))

        for future in as_completed(futures):
            service_name, status_code, response = future.result()
            if status_code:
                print(f"{service_name}: Status {status_code}, Response: {response}")
            else:
                print(f"{service_name}: Error - {response}")
    
    print(f"Load test completed in {time.time() - start_time:.2f} seconds")

if __name__ == "__main__":
    load_test(num_requests_per_service=3)  # Change the number of requests as needed