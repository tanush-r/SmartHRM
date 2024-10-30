import requests
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

# Use the provided Minikube IP
MINIKUBE_IP = "172.22.79.79"

# Define the services and their endpoints using Minikube IP
services = {
    "resume_upload": f"http://{MINIKUBE_IP}/api/resume_upload/clients",
    "resume_s3": f"http://{MINIKUBE_IP}/api/resume_s3/clients",
    "jd_s3": f"http://{MINIKUBE_IP}/api/jd_s3/clients",
    "jd_upload": f"http://{MINIKUBE_IP}/api/jd_upload/clients",
    "viewer": f"http://{MINIKUBE_IP}/api/viewer/positions",
    "viewer": f"http://{MINIKUBE_IP}/api/viewer/clients",
    "dashboard": f"http://{MINIKUBE_IP}/api/dashboard/summary/counts"
}

# Function to send requests
def send_request(service_name):
    url = services[service_name]
    try:
        response = requests.get(url)
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
    load_test(num_requests_per_service=50)  # Change the number of requests as needed
